// ========================================
// FLASHCARDS SCREEN
// ========================================

const FLASHCARDS_STORAGE_KEY_LOCAL = 'guestFlashcards';

const flashcardsState = {
    deck: [],
    index: 0,
    list: [],
    filter: '',
    pendingDelete: null
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

function isAuthenticated() {
    return typeof authManager !== 'undefined' && authManager.isLoggedIn();
}

function loadGuestFlashcards() {
    const stored = localStorage.getItem(FLASHCARDS_STORAGE_KEY_LOCAL);
    return stored ? JSON.parse(stored) : [];
}

function saveGuestFlashcards(cards) {
    localStorage.setItem(FLASHCARDS_STORAGE_KEY_LOCAL, JSON.stringify(cards));
}

function generateFlashcardId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return `card_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

function shuffleDeck(deck) {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function getCardElements() {
    return {
        card: document.getElementById('flashcard'),
        front: document.getElementById('flashcard-front'),
        back: document.getElementById('flashcard-back'),
        progress: document.getElementById('flashcards-progress'),
        progressRow: document.getElementById('flashcards-progress-row'),
        stage: document.getElementById('flashcards-stage'),
        actions: document.getElementById('flashcard-actions'),
        empty: document.getElementById('flashcards-empty'),
        list: document.getElementById('flashcard-list'),
        listEmpty: document.getElementById('flashcard-list-empty'),
        listNoResults: document.getElementById('flashcard-list-no-results'),
        listLoading: document.getElementById('flashcard-list-loading'),
        listCount: document.getElementById('flashcard-list-count'),
        search: document.getElementById('flashcard-search')
    };
}

function updateFlashcard() {
    const { card, front, back, progress, progressRow, stage, actions, empty } = getCardElements();
    const total = flashcardsState.deck.length;

    if (progressRow) {
        progressRow.style.display = total ? 'flex' : 'none';
    }

    if (stage) {
        stage.style.display = total ? 'flex' : 'none';
    }

    if (actions) {
        actions.style.display = total ? 'flex' : 'none';
    }

    if (empty) {
        empty.style.display = total ? 'none' : 'flex';
    }

    if (!total || !front || !back || !progress) {
        return;
    }

    const current = flashcardsState.deck[flashcardsState.index];
    if (!current) return;

    front.textContent = current.front;
    back.textContent = current.back;

    if (progress.hasAttribute('data-i18n')) {
        progress.removeAttribute('data-i18n');
    }
    progress.textContent = `${flashcardsState.index + 1}/${total}`;

    if (card) {
        card.classList.remove('flipped');
    }
}

function goToNextCard(appendToEnd = false) {
    if (!flashcardsState.deck.length) return;

    if (appendToEnd) {
        const current = flashcardsState.deck.splice(flashcardsState.index, 1)[0];
        flashcardsState.deck.push(current);
    } else if (flashcardsState.index < flashcardsState.deck.length - 1) {
        flashcardsState.index += 1;
    } else {
        flashcardsState.index = 0;
    }
    updateFlashcard();
}

function setFlashcardsLoading(isLoading) {
    const { list, listEmpty, listNoResults, listLoading } = getCardElements();

    if (listLoading) {
        listLoading.style.display = isLoading ? 'flex' : 'none';
    }

    if (isLoading) {
        if (list) list.style.display = 'none';
        if (listEmpty) listEmpty.style.display = 'none';
        if (listNoResults) listNoResults.style.display = 'none';
    }
}

function updateFlashcardListCount(shown, total) {
    const { listCount } = getCardElements();
    if (!listCount) return;

    listCount.removeAttribute('data-i18n');
    listCount.textContent = tFormat(
        'flashcards.list.count',
        { shown, total },
        `${shown}/${total}`
    );
}

function renderFlashcardList(cards) {
    const { list, listEmpty, listNoResults } = getCardElements();
    if (!list || !listEmpty || !listNoResults) return;

    list.innerHTML = '';
    list.style.display = 'flex';

    const filter = flashcardsState.filter.trim().toLowerCase();
    const filtered = filter
        ? cards.filter((card) => {
            const term = (card.term || '').toLowerCase();
            const translation = (card.translation || '').toLowerCase();
            return term.includes(filter) || translation.includes(filter);
        })
        : cards;

    updateFlashcardListCount(filtered.length, cards.length);

    if (!cards.length) {
        listEmpty.style.display = 'flex';
        listNoResults.style.display = 'none';
        return;
    }

    if (!filtered.length) {
        listEmpty.style.display = 'none';
        listNoResults.style.display = 'flex';
        return;
    }

    listEmpty.style.display = 'none';
    listNoResults.style.display = 'none';

    filtered.forEach((card) => {
        const item = document.createElement('div');
        item.className = 'flashcard-item';

        const text = document.createElement('div');
        text.className = 'flashcard-item-text';

        const term = document.createElement('div');
        term.className = 'flashcard-item-term';
        term.textContent = card.term;

        const translation = document.createElement('div');
        translation.className = 'flashcard-item-translation';
        translation.textContent = card.translation;

        text.appendChild(term);
        text.appendChild(translation);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'flashcard-delete-btn';
        deleteBtn.textContent = t('flashcards.list.delete', 'Delete');
        deleteBtn.setAttribute('aria-label', t('flashcards.list.delete_aria', 'Delete word'));
        deleteBtn.addEventListener('click', () => {
            openDeleteModal(card);
        });

        item.appendChild(text);
        item.appendChild(deleteBtn);
        list.appendChild(item);
    });
}

async function refreshFlashcards() {
    let flashcards = [];

    setFlashcardsLoading(true);

    if (isAuthenticated() && typeof apiService !== 'undefined') {
        try {
            const data = await apiService.getFlashcards();
            flashcards = data?.flashcards || [];
        } catch (error) {
            console.warn('Failed to load flashcards:', error);
        }
    } else {
        flashcards = loadGuestFlashcards().map((card) => ({
            ...card,
            id: card.id || card.term || generateFlashcardId()
        }));
        saveGuestFlashcards(flashcards);
    }

    flashcardsState.list = flashcards.map((card) => ({
        id: card.id,
        term: card.term,
        translation: card.translation,
        sourceText: card.sourceText || ''
    }));
    flashcardsState.deck = flashcards.map((card) => ({
        id: card.id,
        front: card.term,
        back: card.translation
    }));
    flashcardsState.index = 0;
    updateFlashcardsCount(flashcardsState.deck.length);
    updateFlashcard();
    renderFlashcardList(flashcardsState.list);
    setFlashcardsLoading(false);
}

function updateFlashcardsCount(count) {
    const countEl = document.getElementById('flashcards-count');
    if (!countEl) return;

    countEl.removeAttribute('data-i18n');
    countEl.textContent = tFormat(
        'home.actions.flashcards.count',
        { count },
        `${count} saved`
    );
}

async function addFlashcardManually() {
    const termInput = document.getElementById('flashcard-term');
    const translationInput = document.getElementById('flashcard-translation');

    if (!termInput || !translationInput) return;

    const term = termInput.value.trim();
    const translation = translationInput.value.trim();

    if (!term || !translation) {
        showToast(t('flashcards.form.error', '⚠️ Enter both word and meaning'), 'warning');
        return;
    }

    try {
        const existing = flashcardsState.list.find(
            (card) => card.term.toLowerCase() === term.toLowerCase()
        );

        if (isAuthenticated() && typeof apiService !== 'undefined') {
            await apiService.addFlashcard({ term, translation, sourceText: '' });
        } else {
            const cards = loadGuestFlashcards();
            const normalized = term.toLowerCase();
            const existingIndex = cards.findIndex(
                (card) => (card.term || '').toLowerCase() === normalized
            );
            const payload = {
                id: existingIndex >= 0 ? cards[existingIndex].id : generateFlashcardId(),
                term: normalized,
                translation,
                sourceText: '',
                createdAt: new Date().toISOString()
            };

            if (existingIndex >= 0) {
                cards[existingIndex] = { ...cards[existingIndex], ...payload };
            } else {
                cards.unshift(payload);
            }

            saveGuestFlashcards(cards);
        }

        termInput.value = '';
        translationInput.value = '';
        updateAddButtonState();
        showToast(
            existing
                ? t('flashcards.form.updated', 'Updated flashcard')
                : t('flashcards.form.saved', 'Saved to Flashcards'),
            'success'
        );
        refreshFlashcards();
    } catch (error) {
        console.error('Failed to add flashcard:', error);
        showToast(t('flashcards.form.failed', '⚠️ Could not add word'), 'error');
    }
}

async function deleteFlashcard(card) {
    if (!card) return;

    try {
        if (isAuthenticated() && typeof apiService !== 'undefined') {
            await apiService.deleteFlashcard(card.id);
        } else {
            const cards = loadGuestFlashcards();
            const updated = cards.filter((item) => {
                const matchesId = card.id && item.id === card.id;
                const matchesTerm = !card.id && item.term === card.term;
                return !(matchesId || matchesTerm);
            });
            saveGuestFlashcards(updated);
        }

        showToast(t('flashcards.list.deleted', 'Word removed'), 'success');
        refreshFlashcards();
    } catch (error) {
        console.error('Failed to delete flashcard:', error);
        showToast(t('flashcards.list.delete_failed', '⚠️ Could not delete word'), 'error');
    }
}

function openDeleteModal(card) {
    const modal = document.getElementById('flashcard-delete-modal');
    const title = modal?.querySelector('.modal-title');
    if (!modal) return;

    flashcardsState.pendingDelete = card;
    if (title && card?.term) {
        title.removeAttribute('data-i18n');
        title.textContent = tFormat(
            'flashcards.delete.title_dynamic',
            { term: card.term },
            `Delete "${card.term}"?`
        );
    }

    modal.style.display = 'flex';
}

function closeDeleteModal() {
    const modal = document.getElementById('flashcard-delete-modal');
    if (modal) {
        modal.style.display = 'none';
    }
    flashcardsState.pendingDelete = null;
}

function bindDeleteModal() {
    const modal = document.getElementById('flashcard-delete-modal');
    const cancelBtn = document.getElementById('flashcard-delete-cancel');
    const confirmBtn = document.getElementById('flashcard-delete-confirm');

    if (!modal || !cancelBtn || !confirmBtn) return;

    cancelBtn.addEventListener('click', closeDeleteModal);

    confirmBtn.addEventListener('click', () => {
        const pending = flashcardsState.pendingDelete;
        closeDeleteModal();
        if (pending) {
            deleteFlashcard(pending);
        }
    });

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeDeleteModal();
        }
    });
}

function updateAddButtonState() {
    const termInput = document.getElementById('flashcard-term');
    const translationInput = document.getElementById('flashcard-translation');
    const addBtn = document.getElementById('flashcard-add-btn');

    if (!termInput || !translationInput || !addBtn) return;

    const enabled = termInput.value.trim() && translationInput.value.trim();
    addBtn.disabled = !enabled;
}

function initFlashcards() {
    const { card } = getCardElements();
    const shuffleBtn = document.getElementById('shuffle-flashcards');
    const reviewBtn = document.getElementById('flashcard-review');
    const knowBtn = document.getElementById('flashcard-know');
    const backBtn = document.getElementById('back-from-flashcards');
    const addBtn = document.getElementById('flashcard-add-btn');
    const searchInput = document.getElementById('flashcard-search');
    const termInput = document.getElementById('flashcard-term');
    const translationInput = document.getElementById('flashcard-translation');

    if (card) {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    }

    if (shuffleBtn) {
        shuffleBtn.addEventListener('click', () => {
            flashcardsState.deck = shuffleDeck(flashcardsState.deck);
            flashcardsState.index = 0;
            updateFlashcard();
        });
    }

    if (reviewBtn) {
        reviewBtn.addEventListener('click', () => {
            goToNextCard(true);
        });
    }

    if (knowBtn) {
        knowBtn.addEventListener('click', () => {
            goToNextCard(false);
        });
    }

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            showScreen('home');
        });
    }

    if (addBtn) {
        addBtn.addEventListener('click', addFlashcardManually);
    }

    [termInput, translationInput].forEach((input) => {
        if (!input) return;
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                addFlashcardManually();
            }
        });
        input.addEventListener('input', updateAddButtonState);
    });

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            flashcardsState.filter = searchInput.value;
            renderFlashcardList(flashcardsState.list);
        });
    }

    bindDeleteModal();
    updateAddButtonState();
    refreshFlashcards();
}

function openFlashcards() {
    showScreen('flashcards');
    refreshFlashcards();
}
