// ========================================
// AUTHENTICATION MANAGER
// ========================================

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.listeners = [];
    }

    // ========================================
    // AUTHENTICATION STATE
    // ========================================

    async init() {
        const token = apiService.getToken();

        if (token) {
            try {
                const data = await apiService.getMe();
                this.setUser(data.user);
                console.log('✅ User authenticated:', this.currentUser.name);
            } catch (error) {
                console.error('❌ Auth init failed:', error);
                this.clearUser();
            }
        }

        return this.isAuthenticated;
    }

    setUser(user) {
        this.currentUser = user;
        this.isAuthenticated = true;
        this.notifyListeners();
    }

    clearUser() {
        this.currentUser = null;
        this.isAuthenticated = false;
        apiService.setToken(null);
        this.notifyListeners();
    }

    getUser() {
        return this.currentUser;
    }

    isLoggedIn() {
        return this.isAuthenticated;
    }

    // ========================================
    // AUTHENTICATION ACTIONS
    // ========================================

    async register(email, password, name) {
        try {
            const data = await apiService.register(email, password, name);
            this.setUser(data.user);

            showToast('✓ Account created successfully!', 'success');
            return { success: true, user: data.user };

        } catch (error) {
            showToast(`❌ Registration failed: ${error.message}`, 'error');
            return { success: false, error: error.message };
        }
    }

    async login(email, password) {
        try {
            const data = await apiService.login(email, password);
            this.setUser(data.user);

            showToast('✓ Welcome back!', 'success');
            return { success: true, user: data.user };

        } catch (error) {
            showToast(`❌ Login failed: ${error.message}`, 'error');
            return { success: false, error: error.message };
        }
    }

    async logout() {
        try {
            await apiService.logout();
            this.clearUser();

            showToast('✓ Logged out successfully', 'success');
            showScreen('login');

        } catch (error) {
            console.error('Logout error:', error);
            this.clearUser();
            showScreen('login');
        }
    }

    async updateProfile(data) {
        try {
            const response = await apiService.updateProfile(data);
            this.setUser(response.user);

            showToast('✓ Profile updated', 'success');
            return { success: true };

        } catch (error) {
            showToast(`❌ Update failed: ${error.message}`, 'error');
            return { success: false, error: error.message };
        }
    }

    // ========================================
    // LISTENERS (for UI updates)
    // ========================================

    subscribe(callback) {
        this.listeners.push(callback);

        // Return unsubscribe function
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }

    notifyListeners() {
        this.listeners.forEach(callback => {
            callback({
                user: this.currentUser,
                isAuthenticated: this.isAuthenticated
            });
        });
    }

    // ========================================
    // HELPER METHODS
    // ========================================

    requireAuth() {
        if (!this.isAuthenticated) {
            showToast('⚠️ Please login to continue', 'warning');
            showScreen('login');
            return false;
        }
        return true;
    }

    async refreshUser() {
        if (!this.isAuthenticated) return;

        try {
            const data = await apiService.getMe();
            this.setUser(data.user);
        } catch (error) {
            console.error('Failed to refresh user:', error);
            this.clearUser();
        }
    }
}

// Create singleton instance
const authManager = new AuthManager();

// Subscribe to auth changes to update AppState
authManager.subscribe((state) => {
    if (state.isAuthenticated && state.user) {
        // Update legacy AppState for backward compatibility
        if (typeof AppState !== 'undefined') {
            AppState.user = {
                name: state.user.name,
                email: state.user.email,
                avatar: state.user.avatar,
                ...state.user.profile
            };
        }
    }
});

console.log('✅ Auth Manager initialized');
