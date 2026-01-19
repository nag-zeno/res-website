// ========================================
// HISTORY SCREEN
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

function isAuthenticated() {
    return typeof authManager !== 'undefined' && authManager.isLoggedIn();
}

function getGuestSessions() {
    const stored = localStorage.getItem('guestSessions');
    return stored ? JSON.parse(stored) : [];
}

function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) {
        return `${minutes}m ${remainingSeconds.toString().padStart(2, '0')}s`;
    }
    return `${remainingSeconds}s`;
}

function normalizeDuration(value) {
    if (!value && value !== 0) return 0;
    if (value > 10000) {
        return Math.round(value / 1000);
    }
    return Math.round(value);
}

function clearHistoryList() {
    const list = document.getElementById('history-list');
    if (list) {
        list.innerHTML = '';
    }
}

function setHistoryLoading(isLoading) {
    const loading = document.getElementById('history-loading');
    const list = document.getElementById('history-list');
    const empty = document.getElementById('history-empty');

    if (loading) {
        loading.style.display = isLoading ? 'flex' : 'none';
    }

    if (isLoading) {
        if (list) list.style.display = 'none';
        if (empty) empty.style.display = 'none';
    } else if (list) {
        list.style.display = 'flex';
    }
}

function renderHistoryList(sessions) {
    const list = document.getElementById('history-list');
    const empty = document.getElementById('history-empty');

    if (!list || !empty) return;

    clearHistoryList();
    list.style.display = 'flex';

    if (!sessions.length) {
        empty.style.display = 'flex';
        return;
    }

    empty.style.display = 'none';

    sessions.forEach((session) => {
        const item = document.createElement('div');
        item.className = 'history-item';

        const top = document.createElement('div');
        top.className = 'history-item-top';

        const title = document.createElement('div');
        title.className = 'history-topic';
        title.textContent = session.topic || t('voice.call.free_title', 'Free Conversation');

        const time = document.createElement('div');
        time.className = 'history-time';
        if (window.SpeakEasyApp && typeof window.SpeakEasyApp.timeAgo === 'function') {
            time.textContent = window.SpeakEasyApp.timeAgo(new Date(session.createdAt));
        } else {
            time.textContent = new Date(session.createdAt).toLocaleDateString();
        }

        top.appendChild(title);
        top.appendChild(time);

        const meta = document.createElement('div');
        meta.className = 'history-meta';

        const duration = document.createElement('span');
        duration.textContent = `${t('history.item.duration', 'Duration')}: ${formatDuration(session.duration)}`;

        const messages = document.createElement('span');
        messages.textContent = `${t('history.item.messages', 'Messages')}: ${session.messageCount || 0}`;

        meta.appendChild(duration);
        meta.appendChild(messages);

        item.appendChild(top);
        item.appendChild(meta);

        list.appendChild(item);
    });
}

function updateHistorySummary(totalSessions, totalMinutes) {
    const totalEl = document.getElementById('history-total');
    const minutesEl = document.getElementById('history-minutes');

    if (totalEl) totalEl.textContent = totalSessions ?? 0;
    if (minutesEl) minutesEl.textContent = totalMinutes ?? 0;
}

async function refreshHistory() {
    let sessions = [];
    let totalSessions = 0;
    let totalMinutes = 0;

    setHistoryLoading(true);

    if (isAuthenticated() && typeof apiService !== 'undefined') {
        try {
            const stats = await apiService.getStats();
            totalSessions = stats?.stats?.totalSessions ?? 0;
            totalMinutes = stats?.stats?.totalMinutes ?? 0;

            const data = await apiService.getSessions(50, 0);
            sessions = (data?.sessions || []).map((session) => ({
                topic: session.topic,
                duration: normalizeDuration(session.duration),
                messageCount: session.messageCount,
                createdAt: session.createdAt
            }));
        } catch (error) {
            console.warn('Failed to load history from backend:', error);
        }
    } else {
        sessions = getGuestSessions().map((session) => ({
            topic: session.topic,
            duration: normalizeDuration(session.duration),
            messageCount: session.messages?.length || 0,
            createdAt: session.timestamp || new Date().toISOString()
        }));
        totalSessions = sessions.length;
        totalMinutes = Math.floor(
            sessions.reduce((sum, session) => sum + (session.duration || 0), 0) / 60
        );
    }

    updateHistorySummary(totalSessions, totalMinutes);
    renderHistoryList(sessions);
    setHistoryLoading(false);
}

function initHistory() {
    const backBtn = document.getElementById('back-from-history');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            showScreen('home');
        });
    }

    refreshHistory();
}

function openHistory() {
    showScreen('history');
    refreshHistory();
}
