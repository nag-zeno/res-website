// ========================================
// VOICE SERVICES - WEB SPEECH API
// ========================================

// ========================================
// VOICE RECORDING SERVICE
// ========================================

class VoiceRecordingService {
    constructor() {
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.stream = null;
        this.isRecording = false;
    }

    // Request microphone permission and start recording
    async startRecording() {
        try {
            // Request microphone access
            this.stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });

            // Create media recorder
            this.mediaRecorder = new MediaRecorder(this.stream);
            this.audioChunks = [];

            // Collect audio data
            this.mediaRecorder.addEventListener('dataavailable', (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            });

            // Start recording
            this.mediaRecorder.start();
            this.isRecording = true;

            console.log('🎤 Recording started');
            return true;

        } catch (error) {
            console.error('❌ Microphone access denied:', error);
            return false;
        }
    }

    // Stop recording and return audio blob
    async stopRecording() {
        return new Promise((resolve) => {
            if (!this.mediaRecorder || !this.isRecording) {
                resolve(null);
                return;
            }

            this.mediaRecorder.addEventListener('stop', () => {
                // Create audio blob
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });

                // Stop all tracks
                if (this.stream) {
                    this.stream.getTracks().forEach(track => track.stop());
                }

                this.isRecording = false;
                console.log('🎤 Recording stopped');

                resolve(audioBlob);
            });

            this.mediaRecorder.stop();
        });
    }

    // Get recording status
    getStatus() {
        return {
            isRecording: this.isRecording,
            hasPermission: this.stream !== null
        };
    }

    // Clean up
    cleanup() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.stream = null;
        this.isRecording = false;
    }
}

// ========================================
// SPEECH RECOGNITION SERVICE (Speech-to-Text)
// ========================================

class SpeechRecognitionService {
    constructor() {
        // Check browser support
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US'; // English for learning

            this.isListening = false;
            this.onResultCallback = null;
            this.onEndCallback = null;

            this.setupEventListeners();
        } else {
            console.warn('⚠️ Speech Recognition not supported in this browser');
            this.recognition = null;
        }
    }

    setupEventListeners() {
        if (!this.recognition) return;

        // Handle results
        this.recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;

                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';
                } else {
                    interimTranscript += transcript;
                }
            }

            if (this.onResultCallback) {
                this.onResultCallback({
                    final: finalTranscript.trim(),
                    interim: interimTranscript.trim(),
                    isFinal: finalTranscript.length > 0
                });
            }
        };

        // Handle end
        this.recognition.onend = () => {
            this.isListening = false;
            if (this.onEndCallback) {
                this.onEndCallback();
            }
        };

        // Handle errors
        this.recognition.onerror = (event) => {
            console.error('❌ Speech recognition error:', event.error);
            this.isListening = false;
        };
    }

    // Start listening
    start(onResult, onEnd) {
        if (!this.recognition) {
            console.error('❌ Speech Recognition not available');
            return false;
        }

        this.onResultCallback = onResult;
        this.onEndCallback = onEnd;

        try {
            this.recognition.start();
            this.isListening = true;
            console.log('👂 Speech recognition started (English)');
            return true;
        } catch (error) {
            console.error('❌ Failed to start recognition:', error);
            return false;
        }
    }

    // Stop listening
    stop() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this.isListening = false;
            console.log('👂 Speech recognition stopped');
        }
    }

    // Check if supported
    isSupported() {
        return this.recognition !== null;
    }
}

// ========================================
// TEXT-TO-SPEECH SERVICE
// ========================================

class TextToSpeechService {
    constructor() {
        this.synthesis = window.speechSynthesis;
        this.currentUtterance = null;
        this.isSpeaking = false;
        this.voices = [];

        // Load voices
        this.loadVoices();

        // Voices may load asynchronously
        if (this.synthesis) {
            this.synthesis.addEventListener('voiceschanged', () => {
                this.loadVoices();
            });
        }
    }

    loadVoices() {
        if (!this.synthesis) return;

        this.voices = this.synthesis.getVoices();
        console.log('🔊 Available voices:', this.voices.length);

        // Log English voices
        const englishVoices = this.voices.filter(v => v.lang.startsWith('en'));
        console.log('🔊 English voices:', englishVoices.map(v => v.name));
    }

    // Get best English voice
    getBestEnglishVoice() {
        if (!this.voices.length) {
            this.loadVoices();
        }

        // Prefer female voices for language learning
        const femaleVoices = this.voices.filter(v =>
            v.lang.startsWith('en') &&
            (v.name.includes('Female') || v.name.includes('Samantha') ||
                v.name.includes('Karen') || v.name.includes('Victoria'))
        );

        if (femaleVoices.length > 0) {
            return femaleVoices[0];
        }

        // Fallback to any English voice
        const englishVoices = this.voices.filter(v => v.lang.startsWith('en'));
        if (englishVoices.length > 0) {
            return englishVoices[0];
        }

        // Fallback to default
        return null;
    }

    // Speak text
    speak(text, options = {}) {
        return new Promise((resolve) => {
            if (!this.synthesis) {
                console.error('❌ Speech Synthesis not supported');
                resolve(false);
                return;
            }

            // Cancel any ongoing speech
            this.stop();

            // Create utterance
            this.currentUtterance = new SpeechSynthesisUtterance(text);

            // Set options
            this.currentUtterance.lang = options.lang || 'en-US';
            this.currentUtterance.rate = options.rate || 0.9; // Slightly slower for learners
            this.currentUtterance.pitch = options.pitch || 1.0;
            this.currentUtterance.volume = options.volume || 1.0;

            // Get best English voice
            const voice = this.getBestEnglishVoice();
            if (voice) {
                this.currentUtterance.voice = voice;
                console.log('🔊 Using voice:', voice.name);
            }

            // Event handlers
            this.currentUtterance.onstart = () => {
                this.isSpeaking = true;
                console.log('🔊 Speaking:', text);
            };

            this.currentUtterance.onend = () => {
                this.isSpeaking = false;
                console.log('🔊 Speech ended');
                resolve(true);
            };

            this.currentUtterance.onerror = (error) => {
                console.error('❌ Speech error:', error);
                this.isSpeaking = false;
                resolve(false);
            };

            // Speak
            this.synthesis.speak(this.currentUtterance);
        });
    }

    // Stop speaking
    stop() {
        if (this.synthesis && this.isSpeaking) {
            this.synthesis.cancel();
            this.isSpeaking = false;
            console.log('🔊 Speech stopped');
        }
    }

    // Check if speaking
    getSpeakingStatus() {
        return this.isSpeaking;
    }
}

// Create singleton instances
const voiceRecorder = new VoiceRecordingService();
const speechRecognition = new SpeechRecognitionService();
const textToSpeech = new TextToSpeechService();

console.log('✅ Voice services initialized (Web Speech API)');
console.log('   - TTS: Web Speech Synthesis (English)');
console.log('   - ASR: Web Speech Recognition (English)');
