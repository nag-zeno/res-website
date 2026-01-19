// ========================================
// CONVERSATION ROOM
// ========================================

let conversationState = {
    messages: [],
    sessionStartTime: null,
    sessionTimer: null,
    isRecording: false,
    recordingStartTime: null,
    recordingTimer: null
};

function t(key, fallback) {
    if (window.i18n && typeof window.i18n.translate === 'function') {
        return window.i18n.translate(key, fallback);
    }
    return fallback !== undefined ? fallback : key;
}

function initConversationRoom() {
    initChatInput();
    initVoiceRecording();
    initHintChips();
    initHelpSheet();
    initEndSession();
    initAudioPlayback();
}

// Chat Input
function initChatInput() {
    const messageInput = document.getElementById('message-input');
    const btnMic = document.getElementById('btn-mic');

    if (!messageInput) return;

    // Auto-resize textarea
    messageInput.addEventListener('input', () => {
        messageInput.style.height = 'auto';
        messageInput.style.height = messageInput.scrollHeight + 'px';
    });

    // Send on Enter (Shift+Enter for new line)
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Change mic button to send button when typing
    messageInput.addEventListener('input', () => {
        if (messageInput.value.trim()) {
            btnMic.innerHTML = '<span>📤</span>';
            btnMic.onclick = sendMessage;
        } else {
            btnMic.innerHTML = '<span class="mic-icon">🎤</span>';
            btnMic.onclick = toggleVoiceRecording;
        }
    });
}

async function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const text = messageInput.value.trim();

    if (!text) return;

    // Add user message
    addMessage('user', text);

    // Clear input
    messageInput.value = '';
    messageInput.style.height = 'auto';

    // Reset mic button
    const btnMic = document.getElementById('btn-mic');
    btnMic.innerHTML = '<span class="mic-icon">🎤</span>';
    btnMic.onclick = toggleVoiceRecording;

    // Show typing indicator
    showTypingIndicator();

    // Get AI response
    try {
        await generateAIResponse(text);
    } finally {
        hideTypingIndicator();
    }
}

function addMessage(type, text, options = {}) {
    const chatMessages = document.getElementById('chat-messages');
    const messageWrapper = document.createElement('div');
    messageWrapper.className = `message-wrapper ${type}`;

    const message = document.createElement('div');
    message.className = `message ${type}-message`;

    if (type === 'system') {
        message.innerHTML = `<span>${text}</span>`;
    } else {
        const content = document.createElement('div');
        content.className = 'message-content';
        content.innerHTML = `<p>${text}</p>`;
        message.appendChild(content);

        const meta = document.createElement('div');
        meta.className = 'message-meta';
        meta.innerHTML = `<span class="timestamp">${t('common.just_now', 'Just now')}</span>`;
        message.appendChild(meta);

        if (type === 'ai' && options.hasAudio) {
            const audioBtn = document.createElement('button');
            audioBtn.className = 'audio-play-btn';
            audioBtn.innerHTML = `
                <span class="play-icon">▶️</span>
                <span class="duration">0:0${Math.floor(Math.random() * 9) + 3}</span>
            `;
            audioBtn.onclick = () => playAudio(audioBtn);
            message.appendChild(audioBtn);
        }
    }

    messageWrapper.appendChild(message);
    chatMessages.appendChild(messageWrapper);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Save to state
    conversationState.messages.push({ type, text, timestamp: new Date() });
}

function showTypingIndicator() {
    // Remove existing indicator if any
    hideTypingIndicator();

    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;

    // Create typing indicator element
    const messageWrapper = document.createElement('div');
    messageWrapper.className = 'message-wrapper ai typing-indicator';

    const message = document.createElement('div');
    message.className = 'message ai-message';

    const typingDots = document.createElement('div');
    typingDots.className = 'typing-dots';
    typingDots.innerHTML = '<span></span><span></span><span></span>';

    message.appendChild(typingDots);
    messageWrapper.appendChild(message);
    chatMessages.appendChild(messageWrapper);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    const indicator = document.querySelector('.typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

async function generateAIResponse(userMessage) {
    try {
        // Check if Gemini service is available
        if (typeof geminiService === 'undefined') {
            console.warn('⚠️ Gemini service not available, using fallback');
            useFallbackResponse(userMessage);
            return;
        }

        // Send message to Gemini AI
        const aiResponse = await geminiService.sendMessage(userMessage);

        // Add AI response to chat
        addMessage('ai', aiResponse, { hasAudio: true });

        console.log('✅ AI Response:', aiResponse);

    } catch (error) {
        console.error('❌ Gemini AI error:', error);

        // Fallback to simple response
        useFallbackResponse(userMessage);
    }
}

// Fallback responses if Gemini fails
function useFallbackResponse(userMessage) {
    const responses = [
        "That's great! Could you tell me more about that?",
        "I see. How do you feel about it?",
        "Interesting! What made you think of that?",
        "Sure, I can help with that. What would you like to know?",
        "Good question! Let me explain...",
        "I understand. Would you like to practice that again?",
        "Perfect! You're doing really well. Let's continue.",
        "That's a good start. Try using more descriptive words.",
    ];

    const response = responses[Math.floor(Math.random() * responses.length)];
    addMessage('ai', response, { hasAudio: true });
}

// Voice Recording
function initVoiceRecording() {
    const btnMic = document.getElementById('btn-mic');
    if (btnMic) {
        btnMic.onclick = toggleVoiceRecording;
    }

    const btnStop = document.getElementById('btn-stop-recording');
    if (btnStop) {
        btnStop.onclick = stopVoiceRecording;
    }
}

function toggleVoiceRecording() {
    if (conversationState.isRecording) {
        stopVoiceRecording();
    } else {
        startVoiceRecording();
    }
}

function startVoiceRecording() {
    const overlay = document.getElementById('voice-recording');
    const btnMic = document.getElementById('btn-mic');

    // Show overlay
    overlay.style.display = 'flex';

    // Update button
    btnMic.classList.add('recording');

    // Start timer
    conversationState.isRecording = true;
    conversationState.recordingStartTime = Date.now();
    updateRecordingTime();
    conversationState.recordingTimer = setInterval(updateRecordingTime, 100);

    // Haptic feedback
    hapticFeedback('medium');

    console.log('🎤 Recording started');
}

function stopVoiceRecording() {
    const overlay = document.getElementById('voice-recording');
    const btnMic = document.getElementById('btn-mic');

    // Hide overlay
    overlay.style.display = 'none';

    // Update button
    btnMic.classList.remove('recording');

    // Stop timer
    conversationState.isRecording = false;
    clearInterval(conversationState.recordingTimer);

    // Simulate speech-to-text
    const duration = Math.floor((Date.now() - conversationState.recordingStartTime) / 1000);
    console.log(`🎤 Recording stopped (${duration}s)`);

    // Simulate transcription
    setTimeout(() => {
        const transcriptions = [
            "I'd like a large cappuccino, please.",
            "Can I have a latte with oat milk?",
            "What's your recommendation for today?",
            "I'll take a black coffee to go.",
            "Do you have any pastries?",
        ];
        const text = transcriptions[Math.floor(Math.random() * transcriptions.length)];

        // Add as user message
        addMessage('user', text);

        // Show typing indicator
        showTypingIndicator();

        // Generate AI response
        setTimeout(() => {
            hideTypingIndicator();
            generateAIResponse(text);
        }, 1500);
    }, 500);
}

function updateRecordingTime() {
    const elapsed = Math.floor((Date.now() - conversationState.recordingStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    const timeEl = document.getElementById('recording-time');
    if (timeEl) {
        timeEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

// Hint Chips
function initHintChips() {
    const hintChips = document.querySelectorAll('.hint-chip');
    const messageInput = document.getElementById('message-input');

    hintChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const hint = chip.textContent;
            messageInput.value = hint + ' ';
            messageInput.focus();
            messageInput.dispatchEvent(new Event('input'));

            // Haptic feedback
            hapticFeedback('light');
        });
    });
}

// Help Me Say This Sheet
function initHelpSheet() {
    const btnHelp = document.getElementById('btn-help');
    const overlay = document.getElementById('help-sheet-overlay');
    const closeBtn = document.getElementById('close-help-sheet');
    const generateBtn = document.getElementById('generate-suggestions');
    const vietnameseInput = document.getElementById('vietnamese-input');

    if (!btnHelp || !overlay) return;

    // Open sheet
    btnHelp.addEventListener('click', () => {
        overlay.style.display = 'flex';
        vietnameseInput.focus();
    });

    // Close sheet
    closeBtn.addEventListener('click', closeHelpSheet);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeHelpSheet();
        }
    });

    // Generate suggestions
    generateBtn.addEventListener('click', generateSuggestions);

    // Use suggestion buttons
    document.querySelectorAll('.btn-use-suggestion').forEach(btn => {
        btn.addEventListener('click', () => {
            const suggestion = btn.dataset.suggestion;
            const text = document.getElementById(`suggestion-${suggestion}`).textContent;

            // Insert into message input
            const messageInput = document.getElementById('message-input');
            messageInput.value = text;
            messageInput.dispatchEvent(new Event('input'));

            // Close sheet
            closeHelpSheet();

            // Focus input
            messageInput.focus();

            showToast(t('chat.help.toast.added', '✓ Suggestion added!'), 'success');
        });
    });
}

function closeHelpSheet() {
    const overlay = document.getElementById('help-sheet-overlay');
    const suggestionsContainer = document.getElementById('suggestions-container');
    const vietnameseInput = document.getElementById('vietnamese-input');

    overlay.style.display = 'none';
    suggestionsContainer.style.display = 'none';
    vietnameseInput.value = '';
}

async function generateSuggestions() {
    const vietnameseInput = document.getElementById('vietnamese-input');
    const text = vietnameseInput.value.trim();

    if (!text) {
        showToast(t('chat.help.toast.empty', '⚠️ Please enter Vietnamese text'), 'warning');
        return;
    }

    const loadingEl = document.getElementById('suggestions-loading');
    const suggestionsContainer = document.getElementById('suggestions-container');
    const generateBtn = document.getElementById('generate-suggestions');

    // Show loading
    loadingEl.style.display = 'block';
    suggestionsContainer.style.display = 'none';
    generateBtn.disabled = true;

    // Simulate API call
    await simulateAPICall(2000);

    // Generate suggestions (in real app, this would be from AI)
    const casual = translateToCasual(text);
    const neutral = translateToNeutral(text);
    const polite = translateToPolite(text);

    const casualEl = document.getElementById('suggestion-casual');
    const neutralEl = document.getElementById('suggestion-neutral');
    const politeEl = document.getElementById('suggestion-polite');

    [casualEl, neutralEl, politeEl].forEach((el) => {
        if (el) {
            el.removeAttribute('data-i18n');
        }
    });

    if (casualEl) casualEl.textContent = casual;
    if (neutralEl) neutralEl.textContent = neutral;
    if (politeEl) politeEl.textContent = polite;

    // Show suggestions
    loadingEl.style.display = 'none';
    suggestionsContainer.style.display = 'block';
    generateBtn.disabled = false;
}

function translateToCasual(text) {
    // Simulate translation (in real app, use AI API)
    return `Hey, ${text.toLowerCase()}!`;
}

function translateToNeutral(text) {
    return `I'd like to ${text.toLowerCase()}, please.`;
}

function translateToPolite(text) {
    return `Could I please ${text.toLowerCase()}? Thank you very much.`;
}

// End Session
function initEndSession() {
    const endBtn = document.getElementById('end-conversation');
    const modal = document.getElementById('end-session-modal');
    const cancelBtn = document.getElementById('cancel-end-session');
    const confirmBtn = document.getElementById('confirm-end-session');

    if (!endBtn || !modal) return;

    endBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    confirmBtn.addEventListener('click', () => {
        endSession();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function endSession() {
    const modal = document.getElementById('end-session-modal');
    modal.style.display = 'none';

    // Stop timers
    clearInterval(conversationState.sessionTimer);

    // Save session data
    const sessionData = {
        messages: conversationState.messages,
        duration: Date.now() - conversationState.sessionStartTime,
        topic: conversationState.topic?.title || t('voice.call.free_title', 'Free Conversation'),
        timestamp: new Date()
    };

    console.log('Session ended:', sessionData);

    // Show success message
    showToast(t('chat.toast.saved', '✓ Session saved! Generating report...'), 'success');

    // Navigate to report (in real app)
    setTimeout(() => {
        showScreen('home');
        showToast(t('chat.toast.report_ready', 'Report ready! Check History to view.'), 'info');
    }, 2000);
}

// Audio Playback
function initAudioPlayback() {
    // Audio playback would be handled here
    // For demo, we'll just show a visual feedback
}

function playAudio(button) {
    const playIcon = button.querySelector('.play-icon');

    if (playIcon.textContent === '▶️') {
        playIcon.textContent = '⏸️';
        button.style.background = 'var(--accent-primary)';
        button.style.color = 'var(--text-inverse)';

        // Simulate audio playback
        setTimeout(() => {
            playIcon.textContent = '▶️';
            button.style.background = 'var(--surface-pressed)';
            button.style.color = 'var(--text-secondary)';
        }, 3000);
    } else {
        playIcon.textContent = '▶️';
        button.style.background = 'var(--surface-pressed)';
        button.style.color = 'var(--text-secondary)';
    }
}

// Session Timer
function startSessionTimer() {
    conversationState.sessionStartTime = Date.now();
    conversationState.sessionTimer = setInterval(updateSessionTime, 1000);
}

function updateSessionTime() {
    const elapsed = Math.floor((Date.now() - conversationState.sessionStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    const timeEl = document.querySelector('.session-time');
    if (timeEl) {
        timeEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

// Start conversation when screen is shown
function startConversation(topicData = null) {
    // Reset state
    conversationState = {
        messages: [],
        sessionStartTime: null,
        sessionTimer: null,
        isRecording: false,
        recordingStartTime: null,
        recordingTimer: null,
        topic: topicData
    };

    // Update topic title in UI
    const topicTitle = document.querySelector('.topic-title');
    if (topicTitle) {
        if (topicData && topicData.title) {
            topicTitle.textContent = topicData.title;
        } else {
            topicTitle.textContent = t('voice.call.free_title', 'Free Conversation');
        }
    }

    // Initialize Gemini AI with topic context
    if (typeof geminiService !== 'undefined') {
        geminiService.initConversation(topicData);
        console.log('✅ Gemini AI initialized for:', topicData?.title || 'Free Conversation');
    } else {
        console.warn('⚠️ Gemini service not available');
    }

    // Start timer
    startSessionTimer();

    console.log('💬 Conversation started:', topicData?.title || 'Free Conversation');
}
