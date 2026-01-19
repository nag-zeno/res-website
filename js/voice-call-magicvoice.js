// ========================================
// VOICE CALL - MAGICVOICE INTEGRATION
// ========================================

// Add these functions to voice-call.js to use MagicVoice ASR

// Start listening with MagicVoice ASR (record → transcribe)
async function startListeningWithMagicVoice() {
    if (voiceCallState.isMuted || !voiceCallState.isActive) return;

    try {
        // Start recording
        const started = await voiceRecorder.startRecording();

        if (!started) {
            showToast('⚠️ Microphone access denied', 'error');
            return;
        }

        console.log('🎤 Listening... (speak now)');
        setVoiceState('listening');

        // Auto-stop after 5 seconds
        // TODO: Add VAD (Voice Activity Detection) for smarter stopping
        setTimeout(async () => {
            if (voiceCallState.isActive && !voiceCallState.isMuted) {
                await processRecordedAudio();
            }
        }, 5000); // Record for 5 seconds

    } catch (error) {
        console.error('❌ Error starting recording:', error);
        showToast('⚠️ Error accessing microphone', 'error');
    }
}

// Process recorded audio with MagicVoice ASR
async function processRecordedAudio() {
    try {
        // Stop recording
        const audioBlob = await voiceRecorder.stopRecording();

        if (!audioBlob) {
            console.warn('⚠️ No audio recorded');
            // Restart listening
            setTimeout(() => startListeningWithMagicVoice(), 500);
            return;
        }

        console.log('🎤 Audio recorded, transcribing with MagicVoice ASR...');
        setVoiceState('thinking');
        updateTranscript('Processing your speech...');

        // Transcribe with MagicVoice ASR
        const result = await magicVoiceASR.transcribe(audioBlob);

        if (result && result.text) {
            console.log('✅ Transcription:', result.text);
            voiceCallState.currentTranscript = result.text;
            updateTranscript(`You said: "${result.text}"`);

            // Process with AI
            await processUserSpeech(result.text);

            // After AI responds, restart listening
            if (voiceCallState.isActive && !voiceCallState.isMuted) {
                setTimeout(() => startListeningWithMagicVoice(), 1000);
            }
        } else {
            console.warn('⚠️ No speech detected');
            updateTranscript('No speech detected, please try again');
            setVoiceState('listening');

            // Restart listening
            setTimeout(() => startListeningWithMagicVoice(), 1000);
        }

    } catch (error) {
        console.error('❌ Error processing audio:', error);
        showToast('⚠️ Error processing your speech', 'error');
        setVoiceState('listening');

        // Restart listening
        setTimeout(() => startListeningWithMagicVoice(), 1000);
    }
}

// USAGE:
// In startVoiceCall(), replace:
//   startListening();
// With:
//   startListeningWithMagicVoice();

// TTS is already using MagicVoice via textToSpeech alias
// No changes needed for TTS!
