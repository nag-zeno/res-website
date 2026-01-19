// ========================================
// ROLEPLAY GOALS
// ========================================

const roleplayGoalsState = {
    text: {
        goals: [],
        completed: new Set(),
        notified: false
    },
    voice: {
        goals: [],
        completed: new Set(),
        notified: false
    }
};

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

function getTopicGoals(topicData) {
    if (!topicData || !topicData.id || typeof TOPIC_PACKS === 'undefined') {
        return [];
    }

    const pack = TOPIC_PACKS[topicData.id];
    if (!pack || !Array.isArray(pack.goals)) return [];
    return pack.goals;
}

function updateGoalsProgress(context, progressEl, finishBtn, container) {
    const total = roleplayGoalsState[context].goals.length;
    const completed = roleplayGoalsState[context].completed.size;

    if (progressEl) {
        progressEl.textContent = `${completed}/${total}`;
    }

    if (finishBtn) {
        finishBtn.disabled = total === 0 || completed !== total;
    }

    if (container) {
        container.classList.toggle('complete', total > 0 && completed === total);
    }

    if (total > 0 && completed === total && !roleplayGoalsState[context].notified) {
        roleplayGoalsState[context].notified = true;
        if (typeof showToast === 'function') {
            showToast(t('goals.complete_toast', '✓ Goals complete! You can finish the roleplay.'), 'success');
        }
    }
}

function buildGoalsList(context, listEl, progressEl, finishBtn, container) {
    listEl.innerHTML = '';

    roleplayGoalsState[context].completed = new Set();
    roleplayGoalsState[context].notified = false;

    roleplayGoalsState[context].goals.forEach((goal, index) => {
        const item = document.createElement('li');
        item.className = 'roleplay-goals-item';

        const label = document.createElement('label');
        label.className = 'roleplay-goals-label';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.dataset.index = index;

        const text = document.createElement('span');
        text.textContent = goal;

        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                roleplayGoalsState[context].completed.add(index);
            } else {
                roleplayGoalsState[context].completed.delete(index);
            }
            updateGoalsProgress(context, progressEl, finishBtn, container);
        });

        label.appendChild(checkbox);
        label.appendChild(text);
        item.appendChild(label);
        listEl.appendChild(item);
    });

    updateGoalsProgress(context, progressEl, finishBtn, container);
}

function openEndSessionModal() {
    const modal = document.getElementById('end-session-modal');
    if (modal) {
        modal.style.display = 'flex';
        return;
    }

    if (typeof endSession === 'function') {
        endSession();
        return;
    }

    if (typeof endVoiceSession === 'function') {
        endVoiceSession();
    }
}

function initGoals(context, topicData, ids) {
    const container = document.getElementById(ids.container);
    const listEl = document.getElementById(ids.list);
    const progressEl = document.getElementById(ids.progress);
    const finishBtn = document.getElementById(ids.finish);

    if (!container || !listEl || !progressEl || !finishBtn) {
        return;
    }

    const goals = getTopicGoals(topicData);
    roleplayGoalsState[context].goals = goals;

    if (!goals.length) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'flex';
    buildGoalsList(context, listEl, progressEl, finishBtn, container);

    finishBtn.onclick = () => {
        if (finishBtn.disabled) return;
        openEndSessionModal();
    };
}

function resetGoals(context, ids) {
    const container = document.getElementById(ids.container);
    const listEl = document.getElementById(ids.list);
    const progressEl = document.getElementById(ids.progress);
    const finishBtn = document.getElementById(ids.finish);

    if (container) container.style.display = 'none';
    if (listEl) listEl.innerHTML = '';
    if (progressEl) progressEl.textContent = '0/0';
    if (finishBtn) finishBtn.disabled = true;

    roleplayGoalsState[context].goals = [];
    roleplayGoalsState[context].completed = new Set();
    roleplayGoalsState[context].notified = false;
}

window.RoleplayGoals = {
    initTextGoals(topicData) {
        if (!topicData) {
            resetGoals('text', {
                container: 'roleplay-goals',
                list: 'roleplay-goals-list',
                progress: 'roleplay-goals-progress',
                finish: 'roleplay-finish'
            });
            return;
        }

        initGoals('text', topicData, {
            container: 'roleplay-goals',
            list: 'roleplay-goals-list',
            progress: 'roleplay-goals-progress',
            finish: 'roleplay-finish'
        });
    },
    initVoiceGoals(topicData) {
        if (!topicData) {
            resetGoals('voice', {
                container: 'voice-roleplay-goals',
                list: 'voice-roleplay-goals-list',
                progress: 'voice-roleplay-goals-progress',
                finish: 'voice-roleplay-finish'
            });
            return;
        }

        initGoals('voice', topicData, {
            container: 'voice-roleplay-goals',
            list: 'voice-roleplay-goals-list',
            progress: 'voice-roleplay-goals-progress',
            finish: 'voice-roleplay-finish'
        });
    }
};
