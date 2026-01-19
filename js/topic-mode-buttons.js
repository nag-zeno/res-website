// ========================================
// TOPIC MODE BUTTONS - AUTO-ADD TO ALL CARDS
// ========================================

// This script adds Text/Voice mode buttons to all topic cards
// Run this once when page loads

document.addEventListener('DOMContentLoaded', () => {
    addModeButtonsToAllTopics();
});

function addModeButtonsToAllTopics() {
    const topicCards = document.querySelectorAll('.topic-card');

    topicCards.forEach(card => {
        // Check if buttons already exist
        if (card.querySelector('.topic-mode-buttons')) {
            return; // Skip if already has buttons
        }

        // Create mode buttons container
        const modeButtons = document.createElement('div');
        modeButtons.className = 'topic-mode-buttons';

        // Create Text button
        const textBtn = document.createElement('button');
        textBtn.className = 'topic-mode-btn text-mode';
        textBtn.setAttribute('data-mode', 'text');
        textBtn.innerHTML = `
            <span class="mode-icon">💬</span>
            <span class="mode-label">Text</span>
        `;

        // Create Voice button
        const voiceBtn = document.createElement('button');
        voiceBtn.className = 'topic-mode-btn voice-mode';
        voiceBtn.setAttribute('data-mode', 'voice');
        voiceBtn.innerHTML = `
            <span class="mode-icon">🎤</span>
            <span class="mode-label">Voice</span>
        `;

        // Add buttons to container
        modeButtons.appendChild(textBtn);
        modeButtons.appendChild(voiceBtn);

        // Add container to card
        card.appendChild(modeButtons);
    });

    console.log('✅ Mode buttons added to all topic cards');
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { addModeButtonsToAllTopics };
}
