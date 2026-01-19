// ========================================
// AUTHENTICATION
// ========================================

function t(key, fallback) {
    if (window.i18n && typeof window.i18n.translate === 'function') {
        return window.i18n.translate(key, fallback);
    }
    return fallback !== undefined ? fallback : key;
}

function tFormat(key, values, fallback) {
    if (window.i18n && typeof window.i18n.format === 'function') {
        return window.i18n.format(key, values, fallback);
    }
    return fallback !== undefined ? fallback : key;
}

function initAuth() {
    initLoginForm();
    initSignupForm();
    initSocialLogin();
    initAuthNavigation();
    initPasswordToggle();
    initPasswordStrength();
}

// Login Form
function initLoginForm() {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = emailInput.value;
        const password = passwordInput.value;

        // Validate
        if (!validateEmail(email)) {
            showInputError(emailInput, t('auth.toast.email_invalid', 'Please enter a valid email'));
            return;
        }

        if (password.length < 6) {
            showInputError(passwordInput, t('auth.toast.password_short', 'Password must be at least 6 characters'));
            return;
        }

        // Show loading
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = t('auth.toast.login_loading', 'Signing in...');
        submitBtn.disabled = true;

        // Simulate API call
        await simulateAPICall(1500);

        // For demo: accept any email/password
        console.log('Login:', { email, password });

        // Save user
        AppState.user.name = email.split('@')[0];
        AppState.user.email = email;
        saveToStorage('user', AppState.user);

        // Success
        submitBtn.textContent = t('auth.toast.login_success', '✓ Success!');
        submitBtn.style.background = 'var(--success)';

        setTimeout(() => {
            // Check if onboarded
            const hasOnboarded = localStorage.getItem('hasOnboarded');
            if (hasOnboarded) {
                showScreen('home');
            } else {
                showScreen('onboarding-goal');
            }
        }, 500);
    });
}

// Signup Form
function initSignupForm() {
    const signupForm = document.getElementById('signup-form');
    const nameInput = document.getElementById('signup-name');
    const emailInput = document.getElementById('signup-email');
    const passwordInput = document.getElementById('signup-password');
    const agreeTerms = document.getElementById('agree-terms');

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = nameInput.value;
        const email = emailInput.value;
        const password = passwordInput.value;

        // Validate
        if (name.trim().length < 2) {
            showInputError(nameInput, t('auth.toast.name_invalid', 'Please enter your full name'));
            return;
        }

        if (!validateEmail(email)) {
            showInputError(emailInput, t('auth.toast.email_invalid', 'Please enter a valid email'));
            return;
        }

        if (password.length < 8) {
            showInputError(passwordInput, t('auth.toast.password_short_signup', 'Password must be at least 8 characters'));
            return;
        }

        if (!agreeTerms.checked) {
            alert(t('auth.toast.terms_required', 'Please agree to the Terms and Privacy Policy'));
            return;
        }

        // Show loading
        const submitBtn = signupForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = t('auth.toast.signup_loading', 'Creating account...');
        submitBtn.disabled = true;

        // Simulate API call
        await simulateAPICall(2000);

        // For demo: create account
        console.log('Signup:', { name, email, password });

        // Save user
        AppState.user.name = name;
        AppState.user.email = email;
        saveToStorage('user', AppState.user);

        // Success
        submitBtn.textContent = t('auth.toast.signup_success', '✓ Account Created!');
        submitBtn.style.background = 'var(--success)';

        setTimeout(() => {
            showScreen('onboarding-goal');
        }, 500);
    });
}

// Social Login
function initSocialLogin() {
    // Google Login
    document.getElementById('google-login')?.addEventListener('click', async () => {
        console.log('Google login clicked');
        await handleSocialLogin('google');
    });

    document.getElementById('google-signup')?.addEventListener('click', async () => {
        console.log('Google signup clicked');
        await handleSocialLogin('google');
    });

    // Facebook Login
    document.getElementById('facebook-login')?.addEventListener('click', async () => {
        console.log('Facebook login clicked');
        await handleSocialLogin('facebook');
    });

    document.getElementById('facebook-signup')?.addEventListener('click', async () => {
        console.log('Facebook signup clicked');
        await handleSocialLogin('facebook');
    });

    // Guest Login
    document.getElementById('continue-guest')?.addEventListener('click', () => {
        console.log('Continue as guest');
        AppState.user.name = 'Guest';
        AppState.user.isGuest = true;

        const hasOnboarded = localStorage.getItem('hasOnboarded');
        if (hasOnboarded) {
            showScreen('home');
        } else {
            showScreen('onboarding-goal');
        }
    });
}

async function handleSocialLogin(provider) {
    const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);

    // Show loading toast
    showToast(tFormat('auth.toast.social_connecting', { provider: providerName }, `Connecting to ${providerName}...`), 'info');

    // Simulate OAuth flow
    await simulateAPICall(2000);

    // For demo: simulate successful login
    AppState.user.name = `${providerName} User`;
    AppState.user.email = `user@${provider}.com`;
    AppState.user.provider = provider;
    saveToStorage('user', AppState.user);

    showToast(tFormat('auth.toast.social_connected', { provider: providerName }, `✓ Connected with ${providerName}!`), 'success');

    setTimeout(() => {
        const hasOnboarded = localStorage.getItem('hasOnboarded');
        if (hasOnboarded) {
            showScreen('home');
        } else {
            showScreen('onboarding-goal');
        }
    }, 500);
}

// Auth Navigation
function initAuthNavigation() {
    // Show signup
    document.getElementById('show-signup')?.addEventListener('click', (e) => {
        e.preventDefault();
        showScreen('signup');
    });

    // Show login
    document.getElementById('show-login')?.addEventListener('click', (e) => {
        e.preventDefault();
        showScreen('login');
    });

    // Back to login
    document.getElementById('back-to-login')?.addEventListener('click', () => {
        showScreen('login');
    });
}

// Password Toggle
function initPasswordToggle() {
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.target;
            const input = document.getElementById(targetId);

            if (input.type === 'password') {
                input.type = 'text';
                btn.querySelector('.show-icon').textContent = '🙈';
            } else {
                input.type = 'password';
                btn.querySelector('.show-icon').textContent = '👁️';
            }
        });
    });
}

// Password Strength
function initPasswordStrength() {
    const passwordInput = document.getElementById('signup-password');
    const strengthBar = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');

    if (!passwordInput || !strengthBar || !strengthText) return;

    passwordInput.addEventListener('input', (e) => {
        updatePasswordStrengthDisplay(e.target.value, strengthBar, strengthText);
    });
}

function calculatePasswordStrength(password) {
    let strength = 0;

    // Length
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 15;

    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 15;

    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 15;

    // Contains numbers
    if (/\d/.test(password)) strength += 15;

    // Contains special characters
    if (/[^a-zA-Z\d]/.test(password)) strength += 15;

    return strength;
}

function updatePasswordStrengthDisplay(password, strengthBar, strengthText) {
    const strength = calculatePasswordStrength(password);

    // Remove all classes
    strengthBar.classList.remove('weak', 'medium', 'strong');
    strengthText.classList.remove('weak', 'medium', 'strong');

    if (password.length === 0) {
        strengthBar.style.width = '0%';
        strengthText.textContent = '';
        return;
    }

    if (strength < 40) {
        strengthBar.classList.add('weak');
        strengthText.classList.add('weak');
        strengthText.textContent = t('auth.signup.password.weak', 'Weak');
    } else if (strength < 70) {
        strengthBar.classList.add('medium');
        strengthText.classList.add('medium');
        strengthText.textContent = t('auth.signup.password.medium', 'Medium');
    } else {
        strengthBar.classList.add('strong');
        strengthText.classList.add('strong');
        strengthText.textContent = t('auth.signup.password.strong', 'Strong');
    }
}

// Validation Helpers
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showInputError(input, message) {
    const wrapper = input.closest('.input-wrapper');
    wrapper.classList.add('error');

    // Remove existing error message
    const existingError = wrapper.parentElement.querySelector('.error-message');
    if (existingError) existingError.remove();

    // Add error message
    const errorMsg = document.createElement('div');
    errorMsg.className = 'error-message';
    errorMsg.textContent = message;
    wrapper.parentElement.appendChild(errorMsg);

    // Remove error on input
    input.addEventListener('input', () => {
        wrapper.classList.remove('error');
        errorMsg.remove();
    }, { once: true });
}

function showInputSuccess(input) {
    const wrapper = input.closest('.input-wrapper');
    wrapper.classList.add('success');

    setTimeout(() => {
        wrapper.classList.remove('success');
    }, 2000);
}

// Toast Notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--surface);
        color: var(--text-primary);
        padding: 12px 24px;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-raised-lg);
        font-size: 14px;
        font-weight: 500;
        z-index: 10000;
        animation: slideUp 0.3s ease;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Simulate API Call
function simulateAPICall(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ========================================
// APP STATE MANAGEMENT
// ========================================

const AppState = {
    currentScreen: 'loading-screen',
    onboarding: {
        goal: null,
        level: 2, // Default: Intermediate
        mode: 'both',
        showHints: true,
        slowMode: false
    },
    user: {
        name: 'User',
        streak: 7,
        sessionsToday: 2,
        totalSessions: 15
    }
};

// ========================================
// SCREEN NAVIGATION
// ========================================

function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        AppState.currentScreen = screenId;

        // Update bottom nav active state
        updateBottomNav(screenId);
    }
}

function updateBottomNav(screenId) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    const activeNav = document.querySelector(`.nav-item[href="#${screenId}"]`);
    if (activeNav) {
        activeNav.classList.add('active');
    }
}

// ========================================
// LOADING SCREEN
// ========================================

function initApp() {
    // Simulate loading
    setTimeout(() => {
        // Check if user has completed onboarding
        const hasOnboarded = localStorage.getItem('hasOnboarded');

        if (hasOnboarded) {
            showScreen('home');
        } else {
            showScreen('onboarding-goal');
        }
    }, 2000);
}

// ========================================
// ONBOARDING - STEP 1: GOAL
// ========================================

function initGoalSelection() {
    const goalCards = document.querySelectorAll('.goal-card');
    const continueBtn = document.getElementById('goal-continue');

    goalCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove selected from all cards
            goalCards.forEach(c => c.classList.remove('selected'));

            // Add selected to clicked card
            card.classList.add('selected');

            // Store goal
            AppState.onboarding.goal = card.dataset.goal;

            // Enable continue button
            continueBtn.disabled = false;
        });
    });

    continueBtn.addEventListener('click', () => {
        if (AppState.onboarding.goal) {
            showScreen('onboarding-level');
        }
    });
}

// ========================================
// ONBOARDING - STEP 2: LEVEL
// ========================================

const levelData = [
    {
        titleKey: 'onboarding.level.labels.beginner',
        badge: '🌱',
        descriptionKey: 'onboarding.level.description.beginner'
    },
    {
        titleKey: 'onboarding.level.labels.elementary',
        badge: '📖',
        descriptionKey: 'onboarding.level.description.elementary'
    },
    {
        titleKey: 'onboarding.level.labels.intermediate',
        badge: '🎓',
        descriptionKey: 'onboarding.level.description.intermediate'
    },
    {
        titleKey: 'onboarding.level.labels.upperIntermediate',
        badge: '🚀',
        descriptionKey: 'onboarding.level.description.upperIntermediate'
    },
    {
        titleKey: 'onboarding.level.labels.advanced',
        badge: '⭐',
        descriptionKey: 'onboarding.level.description.advanced'
    }
];

function initLevelSelection() {
    const levelRange = document.getElementById('level-range');
    const continueBtn = document.getElementById('level-continue');

    levelRange.addEventListener('input', (e) => {
        updateLevelDisplay(e.target.value);
    });

    continueBtn.addEventListener('click', () => {
        showScreen('onboarding-preferences');
    });

    // Initialize with default value
    updateLevelDisplay(levelRange.value);
}

function updateLevelDisplay(value) {
    const levelBadge = document.querySelector('.level-badge');
    const levelTitle = document.getElementById('level-title');
    const levelDesc = document.getElementById('level-desc');
    const level = levelData[value];

    if (!levelBadge || !levelTitle || !levelDesc || !level) {
        return;
    }

    levelBadge.textContent = level.badge;
    levelTitle.textContent = t(level.titleKey, '');
    levelDesc.textContent = t(level.descriptionKey, '');
    AppState.onboarding.level = parseInt(value);
}

// ========================================
// ONBOARDING - STEP 3: PREFERENCES
// ========================================

function initPreferences() {
    const modeInputs = document.querySelectorAll('input[name="mode"]');
    const showHintsToggle = document.getElementById('show-hints');
    const slowModeToggle = document.getElementById('slow-mode');
    const startBtn = document.getElementById('preferences-start');

    modeInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            AppState.onboarding.mode = e.target.value;
        });
    });

    showHintsToggle.addEventListener('change', (e) => {
        AppState.onboarding.showHints = e.target.checked;
    });

    slowModeToggle.addEventListener('change', (e) => {
        AppState.onboarding.slowMode = e.target.checked;
    });

    startBtn.addEventListener('click', () => {
        // Save onboarding completion
        localStorage.setItem('hasOnboarded', 'true');
        localStorage.setItem('userPreferences', JSON.stringify(AppState.onboarding));

        // Show success animation
        startBtn.textContent = t('onboarding.preferences.start_success', '✓ Let\'s Go!');
        startBtn.style.background = 'var(--success)';

        setTimeout(() => {
            showScreen('home');
        }, 500);
    });
}

// ========================================
// SKIP ONBOARDING
// ========================================

function initSkipButtons() {
    const skipButtons = document.querySelectorAll('.skip-btn');

    skipButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Save default preferences
            localStorage.setItem('hasOnboarded', 'true');
            localStorage.setItem('userPreferences', JSON.stringify(AppState.onboarding));

            showScreen('home');
        });
    });
}

// ========================================
// HOME SCREEN
// ========================================

function initHome() {
    const actionCards = document.querySelectorAll('.action-card');

    actionCards.forEach(card => {
        card.addEventListener('click', () => {
            const action = card.dataset.action;
            handleQuickAction(action);
        });
    });

    // Update greeting based on time
    updateGreeting();
}

function updateGreeting() {
    const greetingEl = document.querySelector('.greeting');
    const hour = new Date().getHours();
    let greeting = t('home.greeting.generic', 'Hi');

    if (hour >= 5 && hour < 12) greeting = t('home.greeting.morning', 'Good morning');
    else if (hour >= 12 && hour < 17) greeting = t('home.greeting.afternoon', 'Good afternoon');
    else if (hour >= 17 && hour < 24) greeting = t('home.greeting.evening', 'Good evening');
    else greeting = t('home.greeting.night', 'Good night');

    greetingEl.textContent = `${greeting}, ${AppState.user.name}! 👋`;
}

function handleQuickAction(action) {
    console.log('Action:', action);

    switch (action) {
        case 'start-conversation':
            // Free conversation - text chat with no specific topic
            showScreen('text-chat');
            if (typeof startConversation === 'function') {
                startConversation(null); // null = Free Conversation
            }
            break;

        case 'voice-practice':
            // Free voice conversation
            showScreen('voice-call');
            if (typeof startVoiceCall === 'function') {
                startVoiceCall(null); // null = Free Voice Practice
            }
            break;

        case 'daily-topic':
            // Topic-based conversation - show topic library first
            if (typeof openTopicLibrary === 'function') {
                openTopicLibrary();
            } else {
                showScreen('topic-library');
            }
            break;

        case 'flashcards':
            showToast(t('home.toast.flashcards_soon', 'Flashcards screen coming soon!'), 'info');
            break;
        case 'history':
            showToast(t('home.toast.history_soon', 'History screen coming soon!'), 'info');
            break;
        case 'settings':
            if (typeof openSettings === 'function') {
                openSettings();
            } else {
                showScreen('settings');
            }
            break;
    }
}

// ========================================
// BOTTOM NAVIGATION
// ========================================

function initBottomNav() {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetScreen = item.getAttribute('href').substring(1);

            if (targetScreen === 'home') {
                showScreen('home');
            } else if (targetScreen === 'settings') {
                if (typeof openSettings === 'function') {
                    openSettings();
                } else {
                    showScreen('settings');
                }
            } else {
                const screenLabel = item.querySelector('.nav-label')?.textContent || targetScreen;
                showToast(
                    tFormat('home.toast.screen_soon', { screen: screenLabel }, `${screenLabel} screen coming soon!`),
                    'info'
                );
            }
        });
    });
}

// ========================================
// ANIMATIONS & INTERACTIONS
// ========================================

// Add ripple effect to buttons
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
}

// Add haptic feedback (if supported)
function hapticFeedback(intensity = 'medium') {
    if ('vibrate' in navigator) {
        const patterns = {
            light: 10,
            medium: 20,
            heavy: 30
        };
        navigator.vibrate(patterns[intensity] || 20);
    }
}

// ========================================
// KEYBOARD SHORTCUTS
// ========================================

document.addEventListener('keydown', (e) => {
    // ESC to go back
    if (e.key === 'Escape') {
        if (AppState.currentScreen !== 'home' && AppState.currentScreen !== 'loading-screen') {
            showScreen('home');
        }
    }

    // Numbers 1-5 for quick actions on home screen
    if (AppState.currentScreen === 'home' && e.key >= '1' && e.key <= '5') {
        const actions = ['start-conversation', 'daily-topic', 'flashcards', 'history', 'settings'];
        handleQuickAction(actions[parseInt(e.key) - 1]);
    }
});

// ========================================
// ACCESSIBILITY
// ========================================

// Focus management
function manageFocus() {
    const activeScreen = document.querySelector('.screen.active');
    if (activeScreen) {
        const firstFocusable = activeScreen.querySelector('button, a, input, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            firstFocusable.focus();
        }
    }
}

// Announce screen changes to screen readers
function announceScreenChange(screenName) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = tFormat('common.announce.screen', { screen: screenName }, `Now showing: ${screenName}`);
    document.body.appendChild(announcement);

    setTimeout(() => announcement.remove(), 1000);
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 SpeakEasy App Initialized');

    // Initialize authentication first
    initAuth();

    // Initialize all other components
    initGoalSelection();
    initLevelSelection();
    initPreferences();
    initSkipButtons();
    initHome();
    initBottomNav();
    initConversationRoom();
    initVoiceCall();
    initTopicLibrary();
    initSettings();

    // Load dark mode preference
    const darkModePreference = localStorage.getItem('darkMode');
    if (darkModePreference === 'true') {
        document.body.classList.add('dark-mode');
    }

    // Check if user is already logged in
    const savedUser = loadFromStorage('user');
    if (savedUser) {
        AppState.user = savedUser;
        console.log('✓ User session found:', savedUser.name);

        // Check if onboarded
        const hasOnboarded = localStorage.getItem('hasOnboarded');
        if (hasOnboarded) {
            showScreen('home');
        } else {
            showScreen('onboarding-goal');
        }
    } else {
        // No user session, show login
        showScreen('login');
    }

    // Add button ripple effects
    document.querySelectorAll('.btn-primary, .action-card, .goal-card').forEach(btn => {
        btn.addEventListener('click', (e) => {
            hapticFeedback('light');
        });
    });

    // Detect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        document.body.classList.add('reduce-motion');
    }

    console.log('✅ App ready!');
});

// ========================================
// SERVICE WORKER (PWA Support)
// ========================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker registration would go here
        console.log('PWA support detected');
    });
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Format time ago
function timeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) {
        const count = Math.floor(interval);
        return tFormat('time.years', { count }, `${count} years ago`);
    }

    interval = seconds / 2592000;
    if (interval > 1) {
        const count = Math.floor(interval);
        return tFormat('time.months', { count }, `${count} months ago`);
    }

    interval = seconds / 86400;
    if (interval > 1) {
        const count = Math.floor(interval);
        return tFormat('time.days', { count }, `${count} days ago`);
    }

    interval = seconds / 3600;
    if (interval > 1) {
        const count = Math.floor(interval);
        return tFormat('time.hours', { count }, `${count} hours ago`);
    }

    interval = seconds / 60;
    if (interval > 1) {
        const count = Math.floor(interval);
        return tFormat('time.minutes', { count }, `${count} minutes ago`);
    }

    return t('time.just_now', 'Just now');
}

function refreshLocalizedUI() {
    updateGreeting();

    const levelRange = document.getElementById('level-range');
    if (levelRange) {
        updateLevelDisplay(levelRange.value);
    }

    const passwordInput = document.getElementById('signup-password');
    const strengthBar = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');
    if (passwordInput && strengthBar && strengthText) {
        updatePasswordStrengthDisplay(passwordInput.value, strengthBar, strengthText);
    }
}

// Save to localStorage
function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e) {
        console.error('Storage error:', e);
        return false;
    }
}

// Load from localStorage
function loadFromStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
        console.error('Storage error:', e);
        return defaultValue;
    }
}

// Export for use in other modules
window.SpeakEasyApp = {
    showScreen,
    AppState,
    saveToStorage,
    loadFromStorage,
    timeAgo,
    refreshLocalizedUI
};
