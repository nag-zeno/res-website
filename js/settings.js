// ========================================
// SETTINGS SCREEN
// ========================================

let settingsState = {
    preferredMode: 'both',
    showHints: true,
    slowMode: false,
    darkMode: false,
    dailyReminder: false,
    saveRecordings: true,
    analytics: true,
    language: 'en'
};

function t(key, fallback) {
    if (window.i18n && typeof window.i18n.translate === 'function') {
        return window.i18n.translate(key, fallback);
    }
    return fallback !== undefined ? fallback : key;
}

function initSettings() {
    initBackButton();
    initProfileEdit();
    initPreferenceToggles();
    initAccountActions();
    loadSettings();
}

// Back Button
function initBackButton() {
    const backBtn = document.getElementById('back-from-settings');
    console.log('🔧 Settings back button:', backBtn);

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            console.log('⬅️ Back button clicked in Settings');
            if (typeof showScreen === 'function') {
                showScreen('home');
            } else {
                console.error('❌ showScreen function not found');
            }
        });
        console.log('✅ Back button event listener attached');
    } else {
        console.error('❌ Back button not found: #back-from-settings');
    }
}

// Profile Edit
function initProfileEdit() {
    const avatarEditBtn = document.querySelector('.avatar-edit-btn');
    const profileNameInput = document.getElementById('profile-name');

    if (avatarEditBtn) {
        avatarEditBtn.addEventListener('click', () => {
            showToast(t('settings.toast.avatar_soon', 'Avatar upload coming soon!'), 'info');
        });
    }

    if (profileNameInput) {
        // Auto-save name on change
        let saveTimeout;
        profileNameInput.addEventListener('input', () => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                const newName = profileNameInput.value.trim();
                if (newName) {
                    if (typeof AppState !== 'undefined') {
                        AppState.user.name = newName;
                        saveToStorage('user', AppState.user);
                    }

                    // Update avatar initials
                    const initials = newName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                    const avatarInitials = document.getElementById('avatar-initials');
                    if (avatarInitials) {
                        avatarInitials.textContent = initials;
                    }

                    // Update greeting on home
                    if (typeof updateGreeting === 'function') {
                        updateGreeting();
                    }

                    showToast(t('settings.toast.name_updated', '✓ Name updated'), 'success');
                }
            }, 500);
        });
    }
}

// Preference Toggles
function initPreferenceToggles() {
    // Preferred Mode
    const modeInputs = document.querySelectorAll('input[name="pref-mode"]');
    modeInputs.forEach(input => {
        input.addEventListener('change', () => {
            settingsState.preferredMode = input.value;
            saveSettings();
            showToast(t('settings.toast.mode_updated', '✓ Preferred mode updated'), 'success');
        });
    });

    // Show Hints
    const hintsToggle = document.getElementById('setting-hints');
    if (hintsToggle) {
        hintsToggle.addEventListener('change', () => {
            settingsState.showHints = hintsToggle.checked;
            saveSettings();
            showToast(
                hintsToggle.checked
                    ? t('settings.toast.hints.enabled', 'Hints enabled')
                    : t('settings.toast.hints.disabled', 'Hints disabled'),
                'success'
            );
        });
    }

    // Slow Mode
    const slowModeToggle = document.getElementById('setting-slow-mode');
    if (slowModeToggle) {
        slowModeToggle.addEventListener('change', () => {
            settingsState.slowMode = slowModeToggle.checked;
            saveSettings();
            showToast(
                slowModeToggle.checked
                    ? t('settings.toast.slow.enabled', 'Slow mode enabled')
                    : t('settings.toast.slow.disabled', 'Slow mode disabled'),
                'success'
            );
        });
    }

    // Dark Mode
    const darkModeToggle = document.getElementById('setting-dark-mode');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', () => {
            settingsState.darkMode = darkModeToggle.checked;
            toggleDarkMode(darkModeToggle.checked);
            saveSettings();
            showToast(
                darkModeToggle.checked
                    ? t('settings.toast.theme.dark', '🌙 Dark mode enabled')
                    : t('settings.toast.theme.light', '☀️ Light mode enabled'),
                'success'
            );
        });
    }

    // Daily Reminder
    const reminderToggle = document.getElementById('setting-reminder');
    if (reminderToggle) {
        reminderToggle.addEventListener('change', () => {
            settingsState.dailyReminder = reminderToggle.checked;
            saveSettings();
            showToast(
                reminderToggle.checked
                    ? t('settings.toast.reminder.enabled', 'Daily reminder enabled')
                    : t('settings.toast.reminder.disabled', 'Daily reminder disabled'),
                'success'
            );
        });
    }

    // Save Recordings
    const recordingsToggle = document.getElementById('setting-save-recordings');
    if (recordingsToggle) {
        recordingsToggle.addEventListener('change', () => {
            settingsState.saveRecordings = recordingsToggle.checked;
            saveSettings();
            showToast(
                recordingsToggle.checked
                    ? t('settings.toast.recording.enabled', 'Recording enabled')
                    : t('settings.toast.recording.disabled', 'Recording disabled'),
                'success'
            );
        });
    }

    // Analytics
    const analyticsToggle = document.getElementById('setting-analytics');
    if (analyticsToggle) {
        analyticsToggle.addEventListener('change', () => {
            settingsState.analytics = analyticsToggle.checked;
            saveSettings();
            showToast(
                analyticsToggle.checked
                    ? t('settings.toast.analytics.enabled', 'Analytics enabled')
                    : t('settings.toast.analytics.disabled', 'Analytics disabled'),
                'success'
            );
        });
    }

    // Language Setting
    const languageSelect = document.getElementById('setting-language');
    if (languageSelect) {
        languageSelect.addEventListener('change', () => {
            settingsState.language = languageSelect.value;
            applyLanguagePreference(settingsState.language);
            saveSettings();
            showToast(getLanguageToast(settingsState.language), 'success');
        });
    }

    // Privacy Policy
    const privacyPolicy = document.getElementById('privacy-policy');
    if (privacyPolicy) {
        privacyPolicy.addEventListener('click', () => {
            showToast(t('settings.toast.open_privacy', 'Opening Privacy Policy...'), 'info');
            // In real app: window.open('/privacy-policy', '_blank');
        });
    }

    // Terms of Service
    const termsService = document.getElementById('terms-service');
    if (termsService) {
        termsService.addEventListener('click', () => {
            showToast(t('settings.toast.open_terms', 'Opening Terms of Service...'), 'info');
            // In real app: window.open('/terms', '_blank');
        });
    }
}

// Account Actions
function initAccountActions() {
    const logoutBtn = document.getElementById('btn-logout');
    const deleteBtn = document.getElementById('btn-delete-account');
    const logoutModal = document.getElementById('logout-modal');
    const deleteModal = document.getElementById('delete-account-modal');

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (logoutModal) {
                logoutModal.style.display = 'flex';
            }
        });
    }

    // Cancel logout
    const cancelLogout = document.getElementById('cancel-logout');
    if (cancelLogout) {
        cancelLogout.addEventListener('click', () => {
            if (logoutModal) {
                logoutModal.style.display = 'none';
            }
        });
    }

    // Confirm logout
    const confirmLogout = document.getElementById('confirm-logout');
    if (confirmLogout) {
        confirmLogout.addEventListener('click', () => {
            handleLogout();
        });
    }

    // Delete account
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            if (deleteModal) {
                deleteModal.style.display = 'flex';
            }
        });
    }

    // Cancel delete
    const cancelDelete = document.getElementById('cancel-delete');
    if (cancelDelete) {
        cancelDelete.addEventListener('click', () => {
            if (deleteModal) {
                deleteModal.style.display = 'none';
            }
        });
    }

    // Confirm delete
    const confirmDelete = document.getElementById('confirm-delete');
    if (confirmDelete) {
        confirmDelete.addEventListener('click', () => {
            handleDeleteAccount();
        });
    }

    // Close modals on overlay click
    if (logoutModal) {
        logoutModal.addEventListener('click', (e) => {
            if (e.target === logoutModal) {
                logoutModal.style.display = 'none';
            }
        });
    }

    if (deleteModal) {
        deleteModal.addEventListener('click', (e) => {
            if (e.target === deleteModal) {
                deleteModal.style.display = 'none';
            }
        });
    }
}

function handleLogout() {
    const logoutModal = document.getElementById('logout-modal');
    if (logoutModal) {
        logoutModal.style.display = 'none';
    }

    // Clear user data
    localStorage.removeItem('user');
    localStorage.removeItem('hasOnboarded');
    localStorage.removeItem('userPreferences');

    // Show success message
    showToast(t('settings.toast.logged_out', '✓ Logged out successfully'), 'success');

    // Navigate to login
    setTimeout(() => {
        showScreen('login');

        // Reset app state
        if (typeof AppState !== 'undefined') {
            AppState.user = {
                name: 'User',
                streak: 0,
                sessionsToday: 0,
                totalSessions: 0
            };
        }
    }, 500);
}

function handleDeleteAccount() {
    const deleteModal = document.getElementById('delete-account-modal');
    if (deleteModal) {
        deleteModal.style.display = 'none';
    }

    // Clear all data
    localStorage.clear();

    // Show success message
    showToast(t('settings.toast.account_deleted', '✓ Account deleted'), 'success');

    // Navigate to login
    setTimeout(() => {
        showScreen('login');

        // Reset app state
        if (typeof AppState !== 'undefined') {
            AppState.user = {
                name: 'User',
                streak: 0,
                sessionsToday: 0,
                totalSessions: 0
            };
        }
    }, 500);
}

// Toggle Dark Mode
function toggleDarkMode(enabled) {
    if (enabled) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }

    // Save preference
    localStorage.setItem('darkMode', enabled ? 'true' : 'false');
}

function applyLanguagePreference(language) {
    if (window.i18n && typeof window.i18n.apply === 'function') {
        const normalized = typeof window.i18n.normalize === 'function'
            ? window.i18n.normalize(language)
            : language;
        settingsState.language = normalized;
        window.i18n.apply(normalized);
    }

    if (window.SpeakEasyApp && typeof window.SpeakEasyApp.refreshLocalizedUI === 'function') {
        window.SpeakEasyApp.refreshLocalizedUI();
    }
}

function getLanguageToast(language) {
    if (window.i18n && typeof window.i18n.t === 'function') {
        const message = window.i18n.t(`settings.toast.language.${language}`);
        if (message) return message;
    }
    return language === 'vi' ? '✓ Đã chuyển sang Tiếng Việt' : '✓ Language set to English';
}

// Save Settings
function saveSettings() {
    if (typeof saveToStorage === 'function') {
        saveToStorage('userSettings', settingsState);
    } else {
        localStorage.setItem('userSettings', JSON.stringify(settingsState));
    }
}

// Load Settings
function loadSettings() {
    let saved;
    if (typeof loadFromStorage === 'function') {
        saved = loadFromStorage('userSettings');
    } else {
        const item = localStorage.getItem('userSettings');
        saved = item ? JSON.parse(item) : null;
    }

    if (saved) {
        settingsState = { ...settingsState, ...saved };

        // Apply to UI
        const modeInput = document.querySelector(`input[name="pref-mode"][value="${settingsState.preferredMode}"]`);
        if (modeInput) modeInput.checked = true;

        const hintsToggle = document.getElementById('setting-hints');
        if (hintsToggle) hintsToggle.checked = settingsState.showHints;

        const slowModeToggle = document.getElementById('setting-slow-mode');
        if (slowModeToggle) slowModeToggle.checked = settingsState.slowMode;

        const darkModeToggle = document.getElementById('setting-dark-mode');
        if (darkModeToggle) darkModeToggle.checked = settingsState.darkMode;
        // Apply dark mode
        toggleDarkMode(settingsState.darkMode);

        const reminderToggle = document.getElementById('setting-reminder');
        if (reminderToggle) reminderToggle.checked = settingsState.dailyReminder;

        const recordingsToggle = document.getElementById('setting-save-recordings');
        if (recordingsToggle) recordingsToggle.checked = settingsState.saveRecordings;

        const analyticsToggle = document.getElementById('setting-analytics');
        if (analyticsToggle) analyticsToggle.checked = settingsState.analytics;
    }

    applyLanguagePreference(settingsState.language);
    const languageSelect = document.getElementById('setting-language');
    if (languageSelect) languageSelect.value = settingsState.language;

    // Load profile data
    if (typeof AppState !== 'undefined' && AppState.user) {
        const profileName = document.getElementById('profile-name');
        const profileEmail = document.getElementById('profile-email');
        const avatarInitials = document.getElementById('avatar-initials');

        if (profileName) profileName.value = AppState.user.name || 'User';
        if (profileEmail) profileEmail.value = AppState.user.email || 'user@example.com';

        if (avatarInitials && AppState.user.name) {
            const initials = AppState.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
            avatarInitials.textContent = initials;
        }
    }
}

// Open Settings from Home
function openSettings() {
    showScreen('settings');
    loadSettings();

    // Re-attach back button event listener (ensure it works)
    setTimeout(() => {
        const backBtn = document.getElementById('back-from-settings');
        console.log('🔧 Re-attaching back button:', backBtn);

        if (backBtn) {
            // Remove old listeners by cloning
            const newBackBtn = backBtn.cloneNode(true);
            backBtn.parentNode.replaceChild(newBackBtn, backBtn);

            // Add fresh event listener
            newBackBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('⬅️ Back button clicked!');
                showScreen('home');
            });

            console.log('✅ Back button event attached');
        } else {
            console.error('❌ Back button not found');
        }
    }, 100); // Small delay to ensure DOM is ready
}
