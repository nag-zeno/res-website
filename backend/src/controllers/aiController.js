// ========================================
// AI CONTROLLER - GEMINI PROXY
// ========================================

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// ========================================
// CHAT
// ========================================

exports.chat = async (req, res, next) => {
    try {
        const { message, conversationHistory = [] } = req.body;

        if (!message) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Message is required'
            });
        }

        // Build conversation context
        const contents = conversationHistory.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        }));

        // Add current message
        contents.push({
            role: 'user',
            parts: [{ text: message }]
        });

        // Call Gemini API
        const response = await fetch(`${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents,
                generationConfig: {
                    temperature: 0.9,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 150,
                }
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Gemini API request failed');
        }

        const data = await response.json();
        const aiResponse = data.candidates[0]?.content?.parts[0]?.text ||
            "I'm sorry, I didn't catch that. Could you say that again?";

        res.json({
            response: aiResponse,
            conversationHistory: [
                ...conversationHistory,
                { role: 'user', text: message },
                { role: 'ai', text: aiResponse }
            ]
        });

    } catch (error) {
        console.error('❌ Gemini API error:', error);
        next(error);
    }
};

// ========================================
// INIT CONVERSATION
// ========================================

exports.initConversation = async (req, res, next) => {
    try {
        const { topic } = req.body;

        let systemPrompt;

        if (topic && topic.title) {
            systemPrompt = `You are an English conversation partner helping a student practice English. 
Topic: ${topic.title}
Description: ${topic.description || ''}
Level: ${topic.level || 'intermediate'}

Your role:
- Act as a conversation partner in this scenario
- Speak naturally and encourage the student to practice
- Correct mistakes gently and provide better alternatives
- Keep responses concise (2-3 sentences max)
- Be friendly and supportive
- Ask follow-up questions to keep the conversation going

Start the conversation with a greeting related to the topic.`;
        } else {
            systemPrompt = `You are a friendly English conversation partner. 
Your role:
- Have natural, engaging conversations on any topic
- Help the student practice speaking English
- Correct mistakes gently when needed
- Keep responses concise (2-3 sentences max)
- Be encouraging and supportive
- Ask questions to keep the conversation flowing

Start with a friendly greeting.`;
        }

        // Get initial greeting from Gemini
        const response = await fetch(`${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    role: 'user',
                    parts: [{ text: systemPrompt }]
                }],
                generationConfig: {
                    temperature: 0.9,
                    maxOutputTokens: 100,
                }
            })
        });

        if (!response.ok) {
            throw new Error('Failed to initialize conversation');
        }

        const data = await response.json();
        const greeting = data.candidates[0]?.content?.parts[0]?.text ||
            "Hi! I'm your English conversation partner. What would you like to talk about?";

        res.json({
            greeting,
            systemPrompt,
            conversationHistory: [
                { role: 'ai', text: greeting }
            ]
        });

    } catch (error) {
        console.error('❌ Init conversation error:', error);
        next(error);
    }
};
