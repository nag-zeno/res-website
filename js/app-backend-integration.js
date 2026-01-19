// ========================================
// APP.JS - BACKEND INTEGRATION UPDATES
// ========================================

// Add these functions to app.js to replace localStorage with API calls

// ========================================
// UPDATED: LOGIN HANDLER
// ========================================

async function handleLogin() {
    const email = document.getElementById('login-email')?.value;
    const password = document.getElementById('login-password')?.value;

    if (!email || !password) {
        showToast('⚠️ Please enter email and password', 'warning');
        return;
    }

    // Show loading
    const loginBtn = document.querySelector('#login button[type="submit"]');
    const originalText = loginBtn?.textContent;
    if (loginBtn) loginBtn.textContent = 'Logging in...';

    try {
        const result = await authManager.login(email, password);

        if (result.success) {
            // Check if user has completed onboarding
            const hasOnboarded = localStorage.getItem('hasOnboarded');

            if (hasOnboarded) {
                showScreen('home');
                await loadUserData();
            } else {
                showScreen('onboarding-goal');
            }
        }
    } finally {
        if (loginBtn) loginBtn.textContent = originalText;
    }
}

// ========================================
// UPDATED: SIGNUP HANDLER
// ========================================

async function handleSignup() {
    const name = document.getElementById('signup-name')?.value;
    const email = document.getElementById('signup-email')?.value;
    const password = document.getElementById('signup-password')?.value;

    if (!name || !email || !password) {
        showToast('⚠️ Please fill all fields', 'warning');
        return;
    }

    if (password.length < 6) {
        showToast('⚠️ Password must be at least 6 characters', 'warning');
        return;
    }

    // Show loading
    const signupBtn = document.querySelector('#signup button[type="submit"]');
    const originalText = signupBtn?.textContent;
    if (signupBtn) signupBtn.textContent = 'Creating account...';

    try {
        const result = await authManager.register(email, password, name);

        if (result.success) {
            showScreen('onboarding-goal');
        }
    } finally {
        if (signupBtn) signupBtn.textContent = originalText;
    }
}

// ========================================
// NEW: LOAD USER DATA
// ========================================

async function loadUserData() {
    try {
        // Load user stats
        const statsData = await apiService.getStats();

        if (statsData.stats) {
            // Update AppState with backend data
            AppState.user.streak = statsData.stats.streak;
            AppState.user.totalSessions = statsData.stats.totalSessions;
            AppState.user.sessionsToday = 0; // Calculate from recent activity
        }

        // Load settings
        const settingsData = await apiService.getSettings();

        if (settingsData.settings) {
            // Apply settings
            if (settingsData.settings.darkMode) {
                document.body.classList.add('dark-mode');
            }
        }

        // Update UI
        updateGreeting();
        updateStats();

    } catch (error) {
        console.error('Failed to load user data:', error);
    }
}

// ========================================
// NEW: SAVE SESSION TO BACKEND
// ========================================

async function saveSessionToBackend(sessionData) {
    try {
        const result = await apiService.createSession({
            topic: sessionData.topic || 'Free Conversation',
            topicId: sessionData.topicId || null,
            duration: sessionData.duration || 0,
            messageCount: sessionData.messages?.length || 0,
            transcript: sessionData.messages || [],
            mistakes: sessionData.mistakes || [],
            vocabulary: sessionData.vocabulary || []
        });

        console.log('✅ Session saved to backend:', result.session.id);
        return result.session;

    } catch (error) {
        console.error('❌ Failed to save session:', error);
        showToast('⚠️ Failed to save session', 'error');
        return null;
    }
}

// ========================================
// NEW: LOAD SESSIONS FROM BACKEND
// ========================================

async function loadSessionsFromBackend(limit = 20) {
    try {
        const data = await apiService.getSessions(limit);
        return data.sessions || [];

    } catch (error) {
        console.error('❌ Failed to load sessions:', error);
        return [];
    }
}

// ========================================
// UPDATED: SETTINGS SAVE
// ========================================

async function saveSettingsToBackend(settings) {
    try {
        await apiService.updateSettings(settings);
        console.log('✅ Settings saved to backend');

    } catch (error) {
        console.error('❌ Failed to save settings:', error);
        showToast('⚠️ Failed to save settings', 'error');
    }
}

// ========================================
// UPDATED: PROFILE UPDATE
// ========================================

async function updateUserProfile(name, avatar = null) {
    try {
        const data = { name };
        if (avatar) data.avatar = avatar;

        await authManager.updateProfile(data);
        updateGreeting();

    } catch (error) {
        console.error('❌ Failed to update profile:', error);
    }
}

// ========================================
// INTEGRATION HELPER
// ========================================

// Call this to check if backend is available
async function checkBackendConnection() {
    try {
        const health = await apiService.healthCheck();

        if (health.status === 'ok') {
            console.log('✅ Backend connected');
            return true;
        } else {
            console.warn('⚠️ Backend unhealthy:', health);
            return false;
        }
    } catch (error) {
        console.warn('⚠️ Backend not available, using offline mode');
        return false;
    }
}

// ========================================
// USAGE EXAMPLES
// ========================================

/*
// In your existing code, replace:

// OLD:
saveToStorage('user', userData);

// NEW:
await authManager.updateProfile(userData);

// OLD:
const sessions = loadFromStorage('sessions') || [];

// NEW:
const sessions = await loadSessionsFromBackend();

// OLD:
saveToStorage('userSettings', settings);

// NEW:
await saveSettingsToBackend(settings);

// OLD:
localStorage.setItem('hasOnboarded', 'true');

// NEW:
localStorage.setItem('hasOnboarded', 'true'); // Keep this local
*/
