// ========================================
// GEMINI AI SERVICE
// ========================================

const GEMINI_API_KEY = 'AIzaSyCa-0jgT1BQP782yVwAi8OtJ3IjgdLOaR8';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

class GeminiService {
    constructor() {
        this.conversationHistory = [];
        this.systemPrompt = null;
    }

    // Initialize with topic context
    initConversation(topicData = null) {
        // IMPORTANT: Always reset conversation history
        this.conversationHistory = [];
        this.systemPrompt = null;

        if (topicData && topicData.id) {
            // Try to get full topic pack data
            const topicPack = typeof TOPIC_PACKS !== 'undefined' ? TOPIC_PACKS[topicData.id] : null;

            if (topicPack && topicPack.systemPrompt) {
                // Use detailed system prompt from topic pack
                console.log('🎯 Initializing TOPIC conversation:', topicData.title, '(with topic pack)');
                const goals = Array.isArray(topicPack.goals) ? topicPack.goals : [];
                if (goals.length) {
                    const goalsText = goals.map(goal => `- ${goal}`).join('\n');
                    this.systemPrompt = `${topicPack.systemPrompt}\n\nRoleplay goals:\n${goalsText}\n\nGuide the student to complete these goals during the conversation. Once they are completed, summarize and wrap up naturally.`;
                } else {
                    this.systemPrompt = topicPack.systemPrompt;
                }
            } else {
                // Fallback to basic topic prompt
                console.log('🎯 Initializing TOPIC conversation:', topicData.title, '(basic prompt)');
                this.systemPrompt = `You are an English conversation partner helping a student practice English. 
Topic: ${topicData.title}
Description: ${topicData.description || 'Practice this topic'}
Level: ${topicData.level || 'intermediate'}

Your role:
- Act as a conversation partner in this scenario
- Speak naturally and encourage the student to practice
- Correct mistakes gently and provide better alternatives
- Keep responses concise (2-3 sentences max)
- Be friendly and supportive
- Ask follow-up questions to keep the conversation going

Remember: You are having a real conversation, not teaching a lesson.`;
            }
        } else {
            // Free conversation
            console.log('🆓 Initializing FREE conversation (no specific topic)');
            this.systemPrompt = `You are a friendly English conversation partner. 
Your role:
- Have natural, engaging conversations on any topic
- Help the student practice speaking English
- Correct mistakes gently when needed
- Keep responses concise (2-3 sentences max)
- Be encouraging and supportive
- Ask questions to keep the conversation flowing

Speak naturally as you would with a friend learning English.`;
        }

        console.log('🤖 Gemini conversation initialized:', topicData?.title || '✨ FREE CONVERSATION ✨');
    }

    // Send message to Gemini
    async sendMessage(userMessage) {
        try {
            console.log('📤 Sending to Gemini:', userMessage);

            // Add user message to history
            this.conversationHistory.push({
                role: 'user',
                parts: [{ text: userMessage }]
            });

            // Build conversation context
            const contents = [
                {
                    role: 'user',
                    parts: [{ text: this.systemPrompt }]
                },
                ...this.conversationHistory
            ];

            console.log('📦 Request contents:', contents.length, 'messages');

            // Call Gemini API
            const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: contents,
                    generationConfig: {
                        temperature: 0.9,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 150,
                    },
                    safetySettings: [
                        {
                            category: 'HARM_CATEGORY_HARASSMENT',
                            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                        },
                        {
                            category: 'HARM_CATEGORY_HATE_SPEECH',
                            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                        },
                        {
                            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                        },
                        {
                            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                        }
                    ]
                })
            });

            console.log('📥 Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('❌ Gemini API Error:', errorData);

                // Handle specific error codes
                if (errorData.error?.code === 429) {
                    return "I'm getting too many requests right now. Please wait 30 seconds and try again.";
                }
                if (errorData.error?.code === 403) {
                    return "There's an issue with the API key. Please contact support.";
                }
                if (errorData.error?.code === 400) {
                    return "I couldn't process that message. Could you try rephrasing it?";
                }
                if (errorData.error?.code === 503) {
                    return "The AI service is temporarily unavailable. Please try again in a moment.";
                }

                throw new Error(errorData.error?.message || `API error: ${response.status}`);
            }

            const data = await response.json();
            console.log('📦 Response data:', data);

            // Check if response was blocked by safety filters
            if (data.candidates && data.candidates[0]?.finishReason === 'SAFETY') {
                console.warn('⚠️ Response blocked by safety filters');
                return "I can't respond to that. Let's talk about something else!";
            }

            // Extract AI response
            const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text ||
                "I'm sorry, I didn't catch that. Could you say that again?";

            // Add AI response to history
            this.conversationHistory.push({
                role: 'model',
                parts: [{ text: aiResponse }]
            });

            console.log('✅ Gemini response:', aiResponse);
            return aiResponse;

        } catch (error) {
            console.error('❌ Gemini API error:', error);

            // Network error
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                return "I can't connect to the internet. Please check your connection and try again.";
            }

            // Timeout error
            if (error.name === 'AbortError') {
                return "The request took too long. Please try again.";
            }

            // Generic fallback
            return "I'm having trouble connecting right now. Let's try again in a moment.";
        }
    }

    // Get conversation summary for report
    getConversationSummary() {
        const messages = this.conversationHistory.filter(msg => msg.role === 'user');
        return {
            totalMessages: messages.length,
            history: this.conversationHistory
        };
    }

    // Reset conversation
    reset() {
        this.conversationHistory = [];
        this.systemPrompt = null;
    }
}

// Create singleton instance
const geminiService = new GeminiService();
