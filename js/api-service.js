// ========================================
// API SERVICE - BACKEND INTEGRATION
// ========================================

const DEFAULT_API_BASE_URL = 'http://localhost:3000/api';
const API_BASE_URL =
    (typeof window !== 'undefined' &&
        window.SPEAKEASY_CONFIG &&
        window.SPEAKEASY_CONFIG.API_BASE_URL) ||
    DEFAULT_API_BASE_URL;

class ApiService {
    constructor() {
        this.baseUrl = API_BASE_URL;
        this.token = localStorage.getItem('authToken');
    }

    // ========================================
    // HELPER METHODS
    // ========================================

    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('authToken', token);
        } else {
            localStorage.removeItem('authToken');
        }
    }

    getToken() {
        return this.token || localStorage.getItem('authToken');
    }

    getHeaders(includeAuth = true) {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (includeAuth && this.getToken()) {
            headers['Authorization'] = `Bearer ${this.getToken()}`;
        }

        return headers;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            ...options,
            headers: {
                ...this.getHeaders(options.auth !== false),
                ...options.headers
            }
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || 'Request failed');
            }

            return data;

        } catch (error) {
            console.error(`API Error (${endpoint}):`, error);
            throw error;
        }
    }

    // ========================================
    // AUTHENTICATION
    // ========================================

    async register(email, password, name) {
        const data = await this.request('/auth/register', {
            method: 'POST',
            auth: false,
            body: JSON.stringify({ email, password, name })
        });

        if (data.token) {
            this.setToken(data.token);
        }

        return data;
    }

    async login(email, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            auth: false,
            body: JSON.stringify({ email, password })
        });

        if (data.token) {
            this.setToken(data.token);
        }

        return data;
    }

    async logout() {
        try {
            await this.request('/auth/logout', {
                method: 'POST'
            });
        } finally {
            this.setToken(null);
        }
    }

    async getMe() {
        return await this.request('/auth/me');
    }

    // ========================================
    // USER
    // ========================================

    async getProfile() {
        return await this.request('/users/profile');
    }

    async updateProfile(data) {
        return await this.request('/users/profile', {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async getStats() {
        return await this.request('/users/stats');
    }

    // ========================================
    // SESSIONS
    // ========================================

    async getSessions(limit = 20, offset = 0) {
        return await this.request(`/sessions?limit=${limit}&offset=${offset}`);
    }

    async createSession(sessionData) {
        return await this.request('/sessions', {
            method: 'POST',
            body: JSON.stringify(sessionData)
        });
    }

    async getSession(id) {
        return await this.request(`/sessions/${id}`);
    }

    async deleteSession(id) {
        return await this.request(`/sessions/${id}`, {
            method: 'DELETE'
        });
    }

    async getSessionReport(id) {
        return await this.request(`/sessions/${id}/report`);
    }

    // ========================================
    // SETTINGS
    // ========================================

    async getSettings() {
        return await this.request('/settings');
    }

    async updateSettings(settings) {
        return await this.request('/settings', {
            method: 'PUT',
            body: JSON.stringify(settings)
        });
    }

    // ========================================
    // AI
    // ========================================

    async chatWithAI(message, conversationHistory = []) {
        return await this.request('/ai/chat', {
            method: 'POST',
            body: JSON.stringify({ message, conversationHistory })
        });
    }

    async initConversation(topic = null) {
        return await this.request('/ai/init-conversation', {
            method: 'POST',
            body: JSON.stringify({ topic })
        });
    }

    async translate(text, targetLanguage = 'vi') {
        return await this.request('/ai/translate', {
            method: 'POST',
            auth: false,
            body: JSON.stringify({ text, targetLanguage })
        });
    }

    // ========================================
    // FLASHCARDS
    // ========================================

    async getFlashcards() {
        return await this.request('/flashcards');
    }

    async addFlashcard({ term, translation, sourceText }) {
        return await this.request('/flashcards', {
            method: 'POST',
            body: JSON.stringify({ term, translation, sourceText })
        });
    }

    async deleteFlashcard(id) {
        return await this.request(`/flashcards/${id}`, {
            method: 'DELETE'
        });
    }

    // ========================================
    // HEALTH CHECK
    // ========================================

    async healthCheck() {
        try {
            const response = await fetch(`${this.baseUrl.replace('/api', '')}/health`);
            return await response.json();
        } catch (error) {
            return { status: 'error', error: error.message };
        }
    }
}

// Create singleton instance
const apiService = new ApiService();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = apiService;
}

console.log('✅ API Service initialized');
console.log('   Base URL:', API_BASE_URL);
console.log('   Token:', apiService.getToken() ? 'Present' : 'None');
