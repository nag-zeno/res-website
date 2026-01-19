// ========================================
// TOPIC PACKS - PART 2 (Topics 4-9)
// ========================================

// Add to TOPIC_PACKS object:

const TOPIC_PACKS_PART2 = {
    // ========================================
    // 4. MAKING FRIENDS
    // ========================================
    "making-friends": {
        id: "making-friends",
        title: "Making Friends",
        category: "daily",
        level: "beginner",
        icon: "👋",
        description: "Start conversations and make new friends",
        duration: "5-10 min",
        tags: ["social", "casual", "friendship", "daily-life"],

        systemPrompt: `You are a friendly person at a social event (party, meetup, etc.).
The student is practicing making friends and starting conversations in English.

Your role:
- Be warm and approachable
- Ask about their interests, hobbies, background
- Share about yourself too
- Keep the conversation natural and flowing
- Encourage them to ask questions
- React positively to what they say

Scenario: You meet someone new at a social gathering.`,

        hints: [
            "Hi, I'm...",
            "Nice to meet you!",
            "What do you do?",
            "Where are you from?",
            "Do you like...?",
            "I enjoy...",
            "That's interesting!",
            "We should hang out sometime"
        ],

        goals: [
            "Introduce yourself",
            "Ask about the other person's interests",
            "Suggest staying in touch"
        ],

        vocabulary: [
            {
                word: "hobby",
                definition: "Activity you enjoy in free time",
                example: "My hobby is photography.",
                pronunciation: "HOB-ee"
            },
            {
                word: "hang out",
                definition: "Spend time together casually",
                example: "Want to hang out this weekend?",
                pronunciation: "HANG out"
            },
            {
                word: "interests",
                definition: "Things you like or care about",
                example: "What are your interests?",
                pronunciation: "IN-ter-ests"
            },
            {
                word: "background",
                definition: "Your history, where you're from",
                example: "Tell me about your background.",
                pronunciation: "BACK-ground"
            }
        ],

        examples: [
            {
                user: "Hi! I'm Sarah. Nice to meet you!",
                ai: "Hey Sarah! I'm Alex. Nice to meet you too! Is this your first time at this event?"
            },
            {
                user: "Yes, it is. How about you?",
                ai: "I've been here a few times. It's always fun! So, what do you do?"
            }
        ],

        objectives: [
            "Introduce yourself confidently",
            "Ask open-ended questions",
            "Show interest in others",
            "Share about yourself",
            "Keep conversation flowing",
            "Exchange contact information"
        ],

        commonMistakes: [
            {
                wrong: "What is your job?",
                correct: "What do you do?",
                explanation: "'What do you do?' is more natural and casual."
            }
        ],

        scenarios: [
            {
                name: "At a Party",
                description: "Meeting someone at a social party",
                aiGreeting: "Hey! I don't think we've met before. I'm Alex!"
            },
            {
                name: "At a Meetup",
                description: "Meeting people with similar interests",
                aiGreeting: "Hi! First time at this meetup?"
            }
        ]
    },

    // ========================================
    // 5. BUSINESS PRESENTATION
    // ========================================
    "business-presentation": {
        id: "business-presentation",
        title: "Business Presentation",
        category: "business",
        level: "advanced",
        icon: "📊",
        description: "Deliver professional presentations with confidence",
        duration: "15-20 min",
        tags: ["business", "professional", "public-speaking", "formal"],

        systemPrompt: `You are a colleague attending a business presentation.
The student is practicing delivering a professional presentation.

Your role:
- Listen to their presentation
- Ask clarifying questions
- Provide constructive feedback
- Simulate Q&A session
- Help them improve delivery
- Be professional but supportive

Scenario: The student is presenting a project update to the team.`,

        hints: [
            "Good morning everyone",
            "Today I'll be presenting...",
            "Let me show you...",
            "As you can see...",
            "The key point is...",
            "In conclusion...",
            "Are there any questions?",
            "Thank you for your attention"
        ],

        goals: [
            "Explain the presentation topic and agenda",
            "Answer at least one clarification question",
            "Summarize next steps"
        ],

        vocabulary: [
            {
                word: "agenda",
                definition: "List of topics to cover",
                example: "Here's today's agenda.",
                pronunciation: "uh-JEN-duh"
            },
            {
                word: "overview",
                definition: "General summary",
                example: "Let me give you an overview.",
                pronunciation: "OH-ver-view"
            },
            {
                word: "metrics",
                definition: "Measurements/statistics",
                example: "These metrics show our progress.",
                pronunciation: "MET-rics"
            },
            {
                word: "stakeholder",
                definition: "Person with interest in the project",
                example: "Our stakeholders are pleased.",
                pronunciation: "STAKE-hold-er"
            }
        ],

        examples: [
            {
                user: "Good morning. Today I'll present our Q4 results.",
                ai: "Good morning! We're looking forward to hearing about the results."
            }
        ],

        objectives: [
            "Open presentation professionally",
            "Structure content clearly",
            "Use visual aids effectively",
            "Handle questions confidently",
            "Conclude with clear takeaways",
            "Maintain professional tone"
        ],

        commonMistakes: [
            {
                wrong: "I will say about...",
                correct: "I will talk about...",
                explanation: "Use 'talk about' or 'discuss', not 'say about'."
            }
        ],

        scenarios: [
            {
                name: "Project Update",
                description: "Presenting project progress",
                aiGreeting: "Good morning! Ready to hear your update."
            }
        ]
    },

    // ========================================
    // 6. HOTEL BOOKING
    // ========================================
    "hotel-booking": {
        id: "hotel-booking",
        title: "Hotel Booking",
        category: "travel",
        level: "intermediate",
        icon: "🏨",
        description: "Reserve rooms and ask about hotel amenities",
        duration: "10-15 min",
        tags: ["travel", "accommodation", "vacation", "business-trip"],

        systemPrompt: `You are a hotel receptionist at a nice hotel.
The student is practicing making a hotel reservation.

Your role:
- Greet guests professionally
- Ask about check-in/check-out dates
- Discuss room types and rates
- Explain hotel amenities
- Confirm booking details
- Answer questions about the hotel

Scenario: A guest calls to make a reservation.`,

        hints: [
            "I'd like to book a room",
            "For how many nights?",
            "What's the rate?",
            "Does it include breakfast?",
            "Is there WiFi?",
            "What time is check-in?",
            "Can I have a room with...",
            "I'd like to confirm..."
        ],

        goals: [
            "Request a room with dates and guests",
            "Ask about price and amenities",
            "Confirm the booking details"
        ],

        vocabulary: [
            {
                word: "reservation",
                definition: "Booking/advance arrangement",
                example: "I have a reservation under Smith.",
                pronunciation: "rez-er-VAY-shun"
            },
            {
                word: "amenities",
                definition: "Hotel facilities/services",
                example: "What amenities do you offer?",
                pronunciation: "uh-MEN-ih-tees"
            },
            {
                word: "check-in",
                definition: "Arrive and register at hotel",
                example: "Check-in is at 3 PM.",
                pronunciation: "CHECK-in"
            },
            {
                word: "check-out",
                definition: "Leave the hotel",
                example: "Check-out is at 11 AM.",
                pronunciation: "CHECK-out"
            }
        ],

        examples: [
            {
                user: "Hi, I'd like to book a room for next week.",
                ai: "Of course! What dates are you looking at?"
            }
        ],

        objectives: [
            "Make a reservation",
            "Ask about room types",
            "Inquire about amenities",
            "Confirm booking details",
            "Ask about hotel policies"
        ],

        commonMistakes: [
            {
                wrong: "I want to reserve",
                correct: "I'd like to make a reservation",
                explanation: "More polite and professional."
            }
        ],

        scenarios: [
            {
                name: "Business Trip",
                description: "Booking for work travel",
                aiGreeting: "Good afternoon! How can I help you today?"
            }
        ]
    },

    // ========================================
    // 7. SMALL TALK
    // ========================================
    "small-talk": {
        id: "small-talk",
        title: "Small Talk",
        category: "daily",
        level: "beginner",
        icon: "💬",
        description: "Master casual conversations about weather, hobbies, and more",
        duration: "5-10 min",
        tags: ["social", "casual", "daily-life", "conversation"],

        systemPrompt: `You are a friendly acquaintance or colleague.
The student is practicing small talk in English.

Your role:
- Make casual conversation
- Talk about weather, weekend plans, hobbies
- Keep it light and friendly
- Ask follow-up questions
- Share your own experiences
- Be natural and relaxed

Scenario: You run into each other and chat casually.`,

        hints: [
            "How's it going?",
            "Nice weather today!",
            "Any plans for the weekend?",
            "How was your day?",
            "Did you see...?",
            "I heard that...",
            "That's cool!",
            "Same here!"
        ],

        goals: [
            "Start with a friendly greeting",
            "Discuss one casual topic",
            "End the chat politely"
        ],

        vocabulary: [
            {
                word: "How's it going?",
                definition: "Casual greeting",
                example: "Hey! How's it going?",
                pronunciation: "howz it GO-ing"
            },
            {
                word: "catch up",
                definition: "Talk about recent events",
                example: "Let's catch up soon!",
                pronunciation: "CATCH up"
            }
        ],

        examples: [
            {
                user: "Hey! How's it going?",
                ai: "Pretty good! How about you?"
            }
        ],

        objectives: [
            "Start casual conversations",
            "Talk about common topics",
            "Keep conversation flowing",
            "Show interest",
            "End conversations naturally"
        ],

        commonMistakes: [
            {
                wrong: "How do you do?",
                correct: "How's it going?",
                explanation: "'How do you do?' is very formal. Use casual greetings."
            }
        ],

        scenarios: [
            {
                name: "At the Office",
                description: "Chatting with a colleague",
                aiGreeting: "Hey! How's your day going?"
            }
        ]
    },

    // ========================================
    // 8. PHONE CALLS
    // ========================================
    "phone-calls": {
        id: "phone-calls",
        title: "Phone Calls",
        category: "business",
        level: "intermediate",
        icon: "📞",
        description: "Handle professional phone conversations effectively",
        duration: "10-15 min",
        tags: ["business", "professional", "communication"],

        systemPrompt: `You are a business professional on the phone.
The student is practicing professional phone conversations.

Your role:
- Answer calls professionally
- Take/leave messages
- Transfer calls
- Schedule meetings
- Handle inquiries
- Be clear and professional

Scenario: A business phone call.`,

        hints: [
            "This is [name] calling",
            "May I speak to...?",
            "Could you hold, please?",
            "I'll transfer you",
            "Can I take a message?",
            "When would be convenient?",
            "Let me check...",
            "Thank you for calling"
        ],

        goals: [
            "Introduce yourself and reason for the call",
            "Ask for the right person or leave a message",
            "Confirm next steps or timing"
        ],

        vocabulary: [
            {
                word: "hold",
                definition: "Wait on the phone",
                example: "Can you hold for a moment?",
                pronunciation: "HOLD"
            },
            {
                word: "transfer",
                definition: "Connect to another person",
                example: "I'll transfer you to sales.",
                pronunciation: "TRANS-fer"
            }
        ],

        examples: [
            {
                user: "Hello, this is John calling from ABC Company.",
                ai: "Hi John! How can I help you today?"
            }
        ],

        objectives: [
            "Answer calls professionally",
            "State purpose clearly",
            "Take messages",
            "Schedule appointments",
            "End calls politely"
        ],

        commonMistakes: [
            {
                wrong: "Who is this?",
                correct: "May I ask who's calling?",
                explanation: "Be polite when asking for caller's name."
            }
        ],

        scenarios: [
            {
                name: "Customer Service",
                description: "Handling a customer call",
                aiGreeting: "Thank you for calling. How may I help you?"
            }
        ]
    },

    // ========================================
    // 9. AT THE RESTAURANT
    // ========================================
    "restaurant": {
        id: "restaurant",
        title: "At the Restaurant",
        category: "daily",
        level: "beginner",
        icon: "🍽️",
        description: "Order food, ask questions, and pay the bill",
        duration: "5-10 min",
        tags: ["food", "dining", "service", "daily-life"],

        systemPrompt: `You are a friendly waiter/waitress at a restaurant.
The student is practicing ordering food and dining out.

Your role:
- Greet customers warmly
- Take orders
- Suggest menu items
- Answer questions about dishes
- Check on customers
- Handle the bill

Scenario: A customer at your restaurant.`,

        hints: [
            "Table for two, please",
            "Can I see the menu?",
            "I'll have the...",
            "What do you recommend?",
            "Is this spicy?",
            "Can I get...",
            "The check, please",
            "Keep the change"
        ],

        goals: [
            "Ask for a table or the menu",
            "Order food and a drink",
            "Request the bill to finish"
        ],

        vocabulary: [
            {
                word: "appetizer",
                definition: "Small dish before main course",
                example: "I'll start with an appetizer.",
                pronunciation: "AP-uh-tie-zer"
            },
            {
                word: "entrée",
                definition: "Main course",
                example: "For my entrée, I'll have the steak.",
                pronunciation: "ON-tray"
            },
            {
                word: "check/bill",
                definition: "Payment request",
                example: "Can I have the check, please?",
                pronunciation: "CHECK/BILL"
            }
        ],

        examples: [
            {
                user: "Hi, table for two, please.",
                ai: "Of course! Right this way. Here's your menu."
            }
        ],

        objectives: [
            "Make a reservation",
            "Order food and drinks",
            "Ask about menu items",
            "Make special requests",
            "Request the bill",
            "Handle payment"
        ],

        commonMistakes: [
            {
                wrong: "Give me steak",
                correct: "I'll have the steak, please",
                explanation: "Use polite requests when ordering."
            }
        ],

        scenarios: [
            {
                name: "Casual Dinner",
                description: "Dining at a casual restaurant",
                aiGreeting: "Welcome! Table for how many?"
            }
        ]
    }
};

// Merge with main TOPIC_PACKS
if (typeof TOPIC_PACKS !== 'undefined') {
    Object.assign(TOPIC_PACKS, TOPIC_PACKS_PART2);
}

console.log('✅ All topic packs loaded:', Object.keys(TOPIC_PACKS || TOPIC_PACKS_PART2).length, 'topics');
