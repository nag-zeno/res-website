// ========================================
// TITLE FIX PATCH
// ========================================

// PROBLEM: document.querySelector('.topic-title') selects FIRST element
// which is in topic library, NOT in text-chat screen!

// SOLUTION: Use specific selector for text-chat screen

// ========================================
// APPLY THIS FIX TO conversation.js LINE 554:
// ========================================

// BEFORE (WRONG):
const topicTitle = document.querySelector('.topic-title');

// AFTER (CORRECT):
const topicTitle = document.querySelector('#text-chat .topic-title');

// ========================================
// FULL CONTEXT (lines 553-561):
// ========================================

// Update topic title in UI (specific to text-chat screen)
const topicTitle = document.querySelector('#text-chat .topic-title');
if (topicTitle) {
    if (topicData && topicData.title) {
        topicTitle.textContent = topicData.title;
    } else {
        topicTitle.textContent = t('voice.call.free_title', 'Free Conversation');
    }
}

// ========================================
// WHY THIS FIXES IT:
// ========================================

// There are MULTIPLE elements with class="topic-title":
// 1. Topic cards in library (lines 589, 614, 629, etc.)
// 2. Text chat screen title (line 1069)
// 3. Voice call screen title (line 994)

// querySelector('.topic-title') returns THE FIRST match
// which is a topic card in the library!

// querySelector('#text-chat .topic-title') specifically targets
// the title INSIDE the #text-chat screen element

// ========================================
// MANUAL FIX STEPS:
// ========================================

// 1. Open: c:\code\res-web\js\conversation.js
// 2. Go to line 554
// 3. Find: const topicTitle = document.querySelector('.topic-title');
// 4. Replace with: const topicTitle = document.querySelector('#text-chat .topic-title');
// 5. Save file
// 6. Refresh browser (Ctrl+Shift+R)
// 7. Test!

console.log('✅ Title fix patch loaded - Apply manually to conversation.js line 554');
