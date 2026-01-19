// ========================================
// TOPIC PACK HINT CHIPS INTEGRATION
// ========================================

// Update hint chips dynamically from topic pack
function updateHintChips(hints) {
    const hintContainer = document.querySelector('.hint-chips');
    if (!hintContainer) {
        console.warn('⚠️ Hint chips container not found');
        return;
    }

    // Clear existing hints
    hintContainer.innerHTML = '';

    // Add new hints from topic pack
    hints.forEach(hint => {
        const chip = document.createElement('button');
        chip.className = 'hint-chip';
        chip.textContent = hint;
        chip.addEventListener('click', () => {
            const input = document.getElementById('message-input');
            if (input) {
                input.value = hint;
                input.focus();
            }
        });
        hintContainer.appendChild(chip);
    });

    console.log('✅ Updated hint chips:', hints.length, 'hints loaded');
}

// Load hints when conversation starts
document.addEventListener('DOMContentLoaded', () => {
    // Override startConversation to load hints
    const originalStartConversation = window.startConversation;

    if (typeof originalStartConversation === 'function') {
        window.startConversation = function (topicData = null) {
            // Call original function
            originalStartConversation(topicData);

            // Load hints from topic pack
            if (topicData && topicData.id && typeof TOPIC_PACKS !== 'undefined') {
                const topicPack = TOPIC_PACKS[topicData.id];
                if (topicPack && topicPack.hints) {
                    // Small delay to ensure DOM is ready
                    setTimeout(() => {
                        updateHintChips(topicPack.hints);
                        console.log('✅ Loaded', topicPack.hints.length, 'hints from topic pack:', topicData.title);
                    }, 100);
                }
            }
        };

        console.log('✅ Topic pack hint integration active');
    }
});
