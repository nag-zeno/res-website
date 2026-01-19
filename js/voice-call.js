// ========================================
// VOICE CALL SCREEN
// ========================================

let voiceCallState = {
    isActive: false,
    isMuted: false,
    isSpeaking: false,
    sessionStartTime: null,
    sessionTimer: null,
    currentState: 'listening', // listening, speaking, thinking
    topic: null,
    currentTranscript: ''
};

function t(key, fallback) {
    if (window.i18n && typeof window.i18n.translate === 'function') {
        return window.i18n.translate(key, fallback);
    }
    return fallback !== undefined ? fallback : key;
}

function initVoiceCall() {
    initVoiceControls();
    initVoiceStates();
}

// Voice Controls
function initVoiceControls() {
    const btnMute = document.getElementById('btn-mute');
    const btnEndCall = document.getElementById('btn-end-call');
    const btnSwitchText = document.getElementById('btn-switch-text');
    const btnBack = document.getElementById('back-from-voice');

    if (!btnMute || !btnEndCall) return;

    // Mute toggle
    btnMute.addEventListener('click', toggleMute);

    // End call
    btnEndCall.addEventListener('click', () => {
        const modal = document.getElementById('end-session-modal');
        if (modal) {
            modal.style.display = 'flex';
        }
    });

    // Switch to text mode
    btnSwitchText.addEventListener('click', () => {
        stopVoiceCall();
        showScreen('text-chat');
        // Transfer session state
        if (typeof startConversation === 'function') {
            startConversation(voiceCallState.topic);
        }
    });

    // Back button
    if (btnBack) {
        btnBack.addEventListener('click', () => {
            const modal = document.getElementById('end-session-modal');
            if (modal) {
                modal.style.display = 'flex';
            }
        });
    }
}

function toggleMute() {
    const btnMute = document.getElementById('btn-mute');
    voiceCallState.isMuted = !voiceCallState.isMuted;

    if (voiceCallState.isMuted) {
        btnMute.classList.add('active');
        const label = btnMute.querySelector('.control-label');
        if (label) {
            label.textContent = t('voice.controls.unmute', 'Unmute');
            label.setAttribute('data-i18n', 'voice.controls.unmute');
        }
        btnMute.setAttribute('data-i18n-title', 'voice.controls.unmute');
        btnMute.setAttribute('title', t('voice.controls.unmute', 'Unmute'));

        // Stop listening when muted
        if (typeof speechRecognition !== 'undefined') {
            speechRecognition.stop();
        }

        showToast(t('voice.toast.muted', '🔇 Microphone muted'), 'info');
    } else {
        btnMute.classList.remove('active');
        const label = btnMute.querySelector('.control-label');
        if (label) {
            label.textContent = t('voice.controls.mute', 'Mute');
            label.setAttribute('data-i18n', 'voice.controls.mute');
        }
        btnMute.setAttribute('data-i18n-title', 'voice.controls.mute');
        btnMute.setAttribute('title', t('voice.controls.mute', 'Mute'));

        // Resume listening when unmuted
        if (typeof speechRecognition !== 'undefined' && voiceCallState.isActive) {
            startListening();
        }

        showToast(t('voice.toast.active', '🎤 Microphone active'), 'success');
    }
}

// Voice States Management
function initVoiceStates() {
    // Real-time voice conversation will be managed by speech recognition
}

function setVoiceState(state) {
    voiceCallState.currentState = state;
    const statusText = document.getElementById('voice-status-text');
    const statusHint = document.getElementById('voice-status-hint');
    const avatarContainer = document.querySelector('.voice-avatar-container');
    const transcript = document.getElementById('live-transcript');

    if (!statusText || !avatarContainer) return;

    // Remove all state classes
    avatarContainer.classList.remove('speaking', 'user-speaking');

    switch (state) {
        case 'listening':
            statusText.textContent = t('voice.status.listening', 'Listening...');
            statusHint.textContent = t('voice.status.hint', 'Speak naturally');
            avatarContainer.classList.add('user-speaking');
            if (transcript) transcript.classList.remove('show');
            break;

        case 'thinking':
            statusText.textContent = t('voice.state.thinking', 'Thinking...');
            statusHint.textContent = t('voice.state.processing', 'Processing your message');
            if (transcript) transcript.classList.add('show');
            break;

        case 'speaking':
            statusText.textContent = t('voice.state.ai_speaking', 'AI is speaking...');
            statusHint.textContent = t('voice.state.listen', 'Listen carefully');
            avatarContainer.classList.add('speaking');
            if (transcript) transcript.classList.remove('show');
            break;

        case 'waiting':
            statusText.textContent = t('voice.state.your_turn', 'Your turn');
            statusHint.textContent = t('voice.state.say_something', 'Say something');
            if (transcript) transcript.classList.remove('show');
            break;
    }
}

function updateTranscript(text) {
    const transcriptText = document.getElementById('transcript-text');
    const transcript = document.getElementById('live-transcript');

    if (transcriptText && transcript) {
        transcriptText.removeAttribute('data-i18n');
        transcriptText.textContent = text;
        transcript.classList.add('show');
    }
}

// Start Voice Call with REAL AI
function startVoiceCall(topicData = null) {
    voiceCallState = {
        isActive: true,
        isMuted: false,
        isSpeaking: false,
        sessionStartTime: Date.now(),
        sessionTimer: null,
        currentState: 'listening',
        topic: topicData,
        currentTranscript: ''
    };

    // Update UI with topic info
    const callTitle = document.querySelector('.call-title');
    const callSubtitle = document.querySelector('.call-subtitle');

    if (topicData && topicData.title) {
        if (callTitle) callTitle.textContent = topicData.title;
        if (callSubtitle) {
            callSubtitle.textContent = topicData.description || t('voice.call.subtitle', 'AI Conversation Partner');
        }
    } else {
        if (callTitle) callTitle.textContent = t('voice.call.free_title', 'Free Conversation');
        if (callSubtitle) callSubtitle.textContent = t('voice.call.free_subtitle', 'Practice speaking naturally');
    }

    const transcriptText = document.getElementById('transcript-text');
    if (transcriptText) {
        transcriptText.setAttribute('data-i18n', 'voice.transcript.sample');
        transcriptText.textContent = t('voice.transcript.sample', 'I\'d like a large cappuccino, please.');
    }

    // Initialize Gemini AI with topic context
    if (typeof geminiService !== 'undefined') {
        geminiService.initConversation(topicData);
    }

    // Start timer
    startVoiceTimer();

    // Set initial state
    setVoiceState('listening');

    // Start speech recognition
    startListening();

    // Initial AI greeting
    setTimeout(() => {
        sendAIGreeting(topicData);
    }, 1000);

    console.log('🎤 Voice call started', topicData ? `with topic: ${topicData.title}` : '(free conversation)');
}

// Start listening with speech recognition
function startListening() {
    if (typeof speechRecognition === 'undefined' || !speechRecognition.isSupported()) {
        showToast(t('voice.toast.unsupported', '⚠️ Speech recognition not supported in this browser'), 'error');
        return;
    }

    speechRecognition.start(
        // On result callback
        (result) => {
            if (result.interim) {
                // Show interim transcript
                updateTranscript(`${t('voice.transcript.you', 'You')}: ${result.interim}...`);
            }

            if (result.isFinal && result.final) {
                // Final transcript - send to AI
                voiceCallState.currentTranscript = result.final;
                updateTranscript(`${t('voice.transcript.you_said', 'You said')}: "${result.final}"`);

                // Process with AI
                processUserSpeech(result.final);
            }
        },
        // On end callback
        () => {
            // Restart listening if call is still active and not muted
            if (voiceCallState.isActive && !voiceCallState.isMuted && voiceCallState.currentState === 'listening') {
                setTimeout(() => startListening(), 500);
            }
        }
    );
}

// Process user speech with AI
async function processUserSpeech(text) {
    if (!text || text.trim().length === 0) return;

    // Set thinking state
    setVoiceState('thinking');

    try {
        // Send to Gemini AI
        const aiResponse = await geminiService.sendMessage(text);

        // Set speaking state
        setVoiceState('speaking');

        // Speak AI response
        await textToSpeech.speak(aiResponse, {
            rate: 0.9, // Slightly slower for learners
            lang: 'en-US'
        });

        // Back to listening
        setVoiceState('listening');

    } catch (error) {
        console.error('❌ Error processing speech:', error);
        setVoiceState('listening');
        showToast(t('voice.toast.error', '⚠️ Error processing your message'), 'error');
    }
}

// Send AI greeting
async function sendAIGreeting(topicData) {
    setVoiceState('speaking');

    let greeting;
    if (topicData && topicData.title) {
        greeting = `Hi! I'm ready to practice ${topicData.title} with you. Let's start!`;
    } else {
        greeting = "Hi! I'm your English conversation partner. What would you like to talk about today?";
    }

    await textToSpeech.speak(greeting, { rate: 0.9 });
    setVoiceState('listening');
}

function startVoiceTimer() {
    voiceCallState.sessionTimer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - voiceCallState.sessionStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        const timerEl = document.getElementById('voice-timer');
        if (timerEl) {
            timerEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }, 1000);
}

function stopVoiceCall() {
    if (voiceCallState.sessionTimer) {
        clearInterval(voiceCallState.sessionTimer);
    }

    // Stop speech recognition
    if (typeof speechRecognition !== 'undefined') {
        speechRecognition.stop();
    }

    // Stop any ongoing speech
    if (typeof textToSpeech !== 'undefined') {
        textToSpeech.stop();
    }

    voiceCallState.isActive = false;
    console.log('🎤 Voice call ended');
}

