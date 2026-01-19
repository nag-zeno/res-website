// ========================================
// TOPIC LIBRARY
// ========================================

const topicLibraryState = {
    searchQuery: '',
    activeCategory: 'all'
};

// Initialize Topic Library
function initTopicLibrary() {
    initSearch();
    initCategoryChips();
    initTopicCards();
    initBackButton();
}

// Search Functionality
function initSearch() {
    const searchToggle = document.getElementById('toggle-search');
    const searchBar = document.getElementById('search-bar');
    const searchInput = document.getElementById('topic-search');
    const clearBtn = document.getElementById('clear-search');

    if (searchToggle) {
        searchToggle.addEventListener('click', () => {
            if (searchBar.style.display === 'none' || !searchBar.style.display) {
                searchBar.style.display = 'flex';
                searchInput.focus();
            } else {
                searchBar.style.display = 'none';
                searchInput.value = '';
                topicLibraryState.searchQuery = '';
                clearBtn.style.display = 'none';
                filterTopics();
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            topicLibraryState.searchQuery = e.target.value.toLowerCase();

            if (e.target.value) {
                clearBtn.style.display = 'flex';
            } else {
                clearBtn.style.display = 'none';
            }

            filterTopics();
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            topicLibraryState.searchQuery = '';
            clearBtn.style.display = 'none';
            filterTopics();
        });
    }
}

// Category Chips
function initCategoryChips() {
    const categoryChips = document.querySelectorAll('.category-chip');

    categoryChips.forEach(chip => {
        chip.addEventListener('click', () => {
            // Remove active from all
            categoryChips.forEach(c => c.classList.remove('active'));

            // Add active to clicked
            chip.classList.add('active');

            // Update state
            topicLibraryState.activeCategory = chip.dataset.category;

            // Filter topics
            filterTopics();
        });
    });
}

// Filter Topics
function filterTopics() {
    const topicCards = document.querySelectorAll('.topic-card');
    const topicGrid = document.getElementById('topic-grid');
    const emptyState = document.querySelector('.empty-state');
    const searchQuery = topicLibraryState.searchQuery;
    const activeCategory = topicLibraryState.activeCategory;

    let visibleCount = 0;

    topicCards.forEach(card => {
        const title = card.querySelector('.topic-title').textContent.toLowerCase();
        const description = card.querySelector('.topic-description').textContent.toLowerCase();
        const category = card.dataset.category;

        // Check search match
        const matchesSearch = !searchQuery ||
            title.includes(searchQuery) ||
            description.includes(searchQuery);

        // Check category match
        const matchesCategory = activeCategory === 'all' || category === activeCategory;

        // Show/hide card
        if (matchesSearch && matchesCategory) {
            card.style.display = 'flex';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Show/hide empty state
    if (visibleCount === 0) {
        topicGrid.style.display = 'none';
        if (emptyState) emptyState.style.display = 'flex';
    } else {
        topicGrid.style.display = 'grid';
        if (emptyState) emptyState.style.display = 'none';
    }
}

// Topic Cards with Mode Buttons
function initTopicCards() {
    const topicCards = document.querySelectorAll('.topic-card');

    topicCards.forEach(card => {
        // Handle mode button clicks
        const modeButtons = card.querySelectorAll('.topic-mode-btn');

        if (modeButtons.length > 0) {
            // Has mode buttons - handle them
            modeButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent card click

                    const mode = btn.dataset.mode; // 'text' or 'voice'
                    handleTopicSelection(card, mode);
                });
            });
        } else {
            // No mode buttons - default to text mode on card click
            card.addEventListener('click', () => {
                handleTopicSelection(card, 'text');
            });
        }
    });
}

// Handle Topic Selection
function handleTopicSelection(card, mode) {
    const topicId = card.dataset.topic;
    const title = card.querySelector('.topic-title').textContent;
    const description = card.querySelector('.topic-description').textContent;
    const level = card.dataset.level;

    console.log('Selected topic:', topicId, 'Mode:', mode);

    // Create topic data object
    const topicData = {
        id: topicId,
        title: title,
        description: description,
        level: level
    };

    // Show success toast
    const modeText = mode === 'text' ? 'Text Chat' : 'Voice Call';
    showToast(`Selected: ${title} (${modeText})`, 'success');

    // Navigate based on mode
    setTimeout(() => {
        if (mode === 'text') {
            // Text Chat
            showScreen('text-chat');
            if (typeof startConversation === 'function') {
                startConversation(topicData);
            }
        } else {
            // Voice Call
            showScreen('voice-call');
            if (typeof startVoiceCall === 'function') {
                startVoiceCall(topicData);
            }
        }
    }, 500);
}

// Back Button
function initBackButton() {
    const backBtn = document.getElementById('back-from-library');

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            showScreen('home');
        });
    }
}

// Open Topic Library from Home
function openTopicLibrary() {
    showScreen('topic-library');

    // Reset filters
    topicLibraryState.searchQuery = '';
    topicLibraryState.activeCategory = 'all';

    // Reset UI
    const searchInput = document.getElementById('topic-search');
    const searchBar = document.getElementById('search-bar');
    const clearBtn = document.getElementById('clear-search');

    if (searchInput) searchInput.value = '';
    if (searchBar) searchBar.style.display = 'none';
    if (clearBtn) clearBtn.style.display = 'none';

    // Reset category chips
    document.querySelectorAll('.category-chip').forEach(chip => {
        chip.classList.remove('active');
        if (chip.dataset.category === 'all') {
            chip.classList.add('active');
        }
    });

    // Show all topics
    filterTopics();
}
