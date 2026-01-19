// ========================================
// TOPIC-SPECIFIC CONTENT
// ========================================

const TOPIC_HINTS = {
    'ordering-coffee': [
        "I'd like to order...",
        "Can I have...",
        "Could you recommend...",
        "What sizes do you have?",
        "I'll take...",
        "Do you have..."
    ],
    'job-interview': [
        "Tell me about yourself",
        "What are your strengths?",
        "Why should we hire you?",
        "Where do you see yourself?",
        "What's your experience?",
        "Do you have questions?"
    ],
    'making-friends': [
        "Hi, I'm...",
        "Nice to meet you!",
        "What do you do?",
        "Where are you from?",
        "What are your hobbies?",
        "Do you like...?"
    ],
    'at-restaurant': [
        "I'd like to make a reservation",
        "Can I see the menu?",
        "What do you recommend?",
        "I'll have...",
        "Could I get the bill?",
        "Is this dish spicy?"
    ],
    'shopping': [
        "How much is this?",
        "Do you have this in...?",
        "Can I try this on?",
        "I'm looking for...",
        "Do you have a discount?",
        "I'll take it"
    ],
    'asking-directions': [
        "How do I get to...?",
        "Where is the...?",
        "Is it far from here?",
        "Can you show me?",
        "Which way should I go?",
        "How long does it take?"
    ],
    'free-topic': [
        "I'd like to...",
        "Can I have...",
        "Could you...",
        "What do you recommend?",
        "Tell me about...",
        "I'm interested in..."
    ]
};

// Get hints for a topic
function getTopicHints(topicId) {
    return TOPIC_HINTS[topicId] || TOPIC_HINTS['free-topic'];
}

// Get all available topics
function getAllTopics() {
    return Object.keys(TOPIC_HINTS);
}
