// ========================================
// COMPLETE TOPIC PACKS DATABASE
// ========================================

const TOPIC_PACKS = {
    // ========================================
    // 1. ORDERING COFFEE
    // ========================================
    "ordering-coffee": {
        // Metadata
        id: "ordering-coffee",
        title: "Ordering Coffee",
        category: "daily",
        level: "beginner",
        icon: "☕",
        description: "Practice ordering drinks and food at a café",
        duration: "5-10 min",
        tags: ["food", "service", "casual", "daily-life"],

        // AI System Prompt
        systemPrompt: `You are a friendly barista at a popular café.
The student is practicing ordering coffee in English.

Your role:
- Greet customers warmly ("Hi! Welcome to our café!")
- Ask about their order (size, hot/iced, milk options, extras)
- Suggest menu items when asked ("Our caramel latte is very popular!")
- Confirm the order clearly
- Be patient and encouraging
- Gently correct mistakes ("We usually say 'large' instead of 'big'")
- Keep responses natural and conversational

Scenario: A customer walks into your café to order a drink.`,

        // Quick Hint Chips
        hints: [
            "I'd like to order...",
            "Can I have a...",
            "What do you recommend?",
            "I'll take a large...",
            "Do you have any specials?",
            "Could I get that to-go?",
            "What sizes do you have?",
            "Can I add...",
            "How much is that?"
        ],

        goals: [
            "Order a drink with size and temperature",
            "Ask about milk or add-ons",
            "Confirm the total and complete the order"
        ],

        // Vocabulary
        vocabulary: [
            {
                word: "espresso",
                definition: "Strong black coffee made by forcing hot water through ground coffee",
                example: "I'll have a double espresso, please.",
                pronunciation: "es-PRESS-oh"
            },
            {
                word: "latte",
                definition: "Coffee drink made with espresso and steamed milk",
                example: "Can I get a vanilla latte?",
                pronunciation: "LAH-tay"
            },
            {
                word: "cappuccino",
                definition: "Coffee with espresso, steamed milk, and milk foam",
                example: "One cappuccino with extra foam, please.",
                pronunciation: "cap-uh-CHEE-noh"
            },
            {
                word: "to-go",
                definition: "Takeaway (not eating/drinking at the café)",
                example: "I'll take it to-go, thanks.",
                pronunciation: "to-GO"
            },
            {
                word: "iced",
                definition: "Cold drink with ice",
                example: "I'd like an iced coffee, please.",
                pronunciation: "ICED"
            },
            {
                word: "size",
                definition: "Small, medium, or large",
                example: "What sizes do you have?",
                pronunciation: "SIZE"
            },
            {
                word: "foam",
                definition: "Frothy milk on top of coffee",
                example: "Extra foam, please.",
                pronunciation: "FOAM"
            },
            {
                word: "shot",
                definition: "Measure of espresso",
                example: "Can I get an extra shot?",
                pronunciation: "SHOT"
            }
        ],

        // Sample Conversations
        examples: [
            {
                user: "Hi, I'd like a coffee please.",
                ai: "Of course! What size would you like - small, medium, or large?"
            },
            {
                user: "Medium, please.",
                ai: "Great! Would you like that hot or iced?"
            },
            {
                user: "Hot, please. And can I get some milk?",
                ai: "Sure! We have whole milk, skim milk, oat milk, and almond milk. Which would you prefer?"
            },
            {
                user: "Oat milk, please.",
                ai: "Perfect! One medium hot coffee with oat milk. Anything else?"
            },
            {
                user: "No, that's all. How much is it?",
                ai: "That'll be $4.50. For here or to-go?"
            }
        ],

        // Learning Objectives
        objectives: [
            "Use polite requests: 'I'd like...', 'Can I have...', 'Could I get...'",
            "Ask about options: sizes, temperatures, milk types",
            "Understand coffee terminology",
            "Make special requests (extra shot, no sugar, etc.)",
            "Confirm your order",
            "Ask about price",
            "Specify for-here or to-go"
        ],

        // Common Mistakes
        commonMistakes: [
            {
                wrong: "Give me coffee",
                correct: "I'd like a coffee, please",
                explanation: "Use polite requests in service situations. 'Give me' sounds rude."
            },
            {
                wrong: "I want big coffee",
                correct: "I'd like a large coffee",
                explanation: "Use 'large' instead of 'big' for drink sizes."
            },
            {
                wrong: "Coffee for go",
                correct: "Coffee to-go, please",
                explanation: "The correct phrase is 'to-go' or 'for here'."
            },
            {
                wrong: "How many cost?",
                correct: "How much is it?",
                explanation: "Use 'How much' for price, not 'How many'."
            }
        ],

        // Scenario Variations
        scenarios: [
            {
                name: "First Time Customer",
                description: "You've never been to this café before",
                aiGreeting: "Welcome! First time here? Let me help you with our menu. What kind of coffee do you usually like?"
            },
            {
                name: "Quick Takeaway",
                description: "You're in a hurry and need coffee to-go",
                aiGreeting: "Hi! What can I get for you today?"
            },
            {
                name: "Asking for Recommendations",
                description: "You want the barista's suggestion",
                aiGreeting: "Good morning! Looking for something special today?"
            },
            {
                name: "Ordering for Friends",
                description: "You're ordering multiple drinks",
                aiGreeting: "Hi there! What can I make for you?"
            }
        ]
    },

    // ========================================
    // 2. JOB INTERVIEW
    // ========================================
    "job-interview": {
        id: "job-interview",
        title: "Job Interview",
        category: "business",
        level: "intermediate",
        icon: "💼",
        description: "Prepare for common interview questions and answers",
        duration: "10-15 min",
        tags: ["business", "career", "professional", "formal"],

        systemPrompt: `You are a professional HR interviewer at a tech company.
The student is practicing for a job interview in English.

Your role:
- Ask common interview questions
- Listen to their answers
- Provide gentle feedback on their responses
- Ask follow-up questions
- Be professional but friendly
- Help them improve their answers

Scenario: You're conducting a job interview for a software developer position.`,

        hints: [
            "I have experience in...",
            "My strength is...",
            "I'm passionate about...",
            "In my previous role...",
            "I can contribute by...",
            "My goal is to...",
            "I'm a team player...",
            "I'm looking for..."
        ],

        goals: [
            "Introduce yourself and your experience",
            "Share a key achievement or project",
            "Ask a question about the role or company"
        ],

        vocabulary: [
            {
                word: "strength",
                definition: "Something you're good at",
                example: "My strength is problem-solving.",
                pronunciation: "STRENGTH"
            },
            {
                word: "weakness",
                definition: "Area you need to improve",
                example: "I'm working on my public speaking skills.",
                pronunciation: "WEEK-ness"
            },
            {
                word: "experience",
                definition: "Past work or skills",
                example: "I have 3 years of experience in software development.",
                pronunciation: "ex-PEER-ee-ence"
            },
            {
                word: "qualification",
                definition: "Skills or education that make you suitable",
                example: "I have a degree in Computer Science.",
                pronunciation: "kwal-ih-fih-KAY-shun"
            },
            {
                word: "teamwork",
                definition: "Working well with others",
                example: "I enjoy teamwork and collaboration.",
                pronunciation: "TEAM-work"
            }
        ],

        examples: [
            {
                user: "I'm interested in this position because I love coding.",
                ai: "That's great! Can you tell me about a specific project you've worked on that you're proud of?"
            },
            {
                user: "I built a mobile app for tracking fitness goals.",
                ai: "Impressive! What challenges did you face during development?"
            }
        ],

        objectives: [
            "Answer 'Tell me about yourself' confidently",
            "Discuss strengths and weaknesses professionally",
            "Explain past experience clearly",
            "Ask intelligent questions about the role",
            "Show enthusiasm for the position",
            "Use professional language"
        ],

        commonMistakes: [
            {
                wrong: "I'm very perfect",
                correct: "I'm detail-oriented and thorough",
                explanation: "Avoid claiming perfection. Be specific about skills."
            },
            {
                wrong: "My weakness is I work too hard",
                correct: "I'm working on delegating tasks more effectively",
                explanation: "Give genuine weaknesses with improvement plans."
            }
        ],

        scenarios: [
            {
                name: "Entry Level Interview",
                description: "Interview for your first job",
                aiGreeting: "Welcome! Thanks for coming in today. Let's start - tell me a bit about yourself."
            },
            {
                name: "Senior Position",
                description: "Interview for a leadership role",
                aiGreeting: "Good morning! I'm excited to learn about your leadership experience. Shall we begin?"
            }
        ]
    },

    // ========================================
    // 3. AIRPORT CHECK-IN
    // ========================================
    "airport-checkin": {
        id: "airport-checkin",
        title: "Airport Check-in",
        category: "travel",
        level: "beginner",
        icon: "✈️",
        description: "Navigate airport procedures and check-in conversations",
        duration: "5-10 min",
        tags: ["travel", "airport", "vacation", "business-trip"],

        systemPrompt: `You are a friendly airline check-in agent at an international airport.
The student is practicing checking in for a flight.

Your role:
- Greet passengers professionally
- Ask for passport and booking reference
- Ask about baggage (checked bags, carry-on)
- Offer seat preferences (window, aisle, exit row)
- Provide boarding pass and gate information
- Answer questions about the flight

Scenario: A passenger approaches your check-in desk.`,

        hints: [
            "I'm checking in for...",
            "Here's my passport",
            "I have one checked bag",
            "Window seat, please",
            "What time is boarding?",
            "Which gate?",
            "Is the flight on time?",
            "Can I have an aisle seat?"
        ],

        goals: [
            "Provide booking details and ID",
            "Check baggage and ask about fees",
            "Confirm gate and boarding time"
        ],

        vocabulary: [
            {
                word: "check-in",
                definition: "Register for your flight",
                example: "I'd like to check in for flight BA123.",
                pronunciation: "CHECK-in"
            },
            {
                word: "boarding pass",
                definition: "Ticket to board the plane",
                example: "Here's your boarding pass.",
                pronunciation: "BOR-ding pass"
            },
            {
                word: "gate",
                definition: "Where you board the plane",
                example: "Your flight departs from gate 24.",
                pronunciation: "GATE"
            },
            {
                word: "baggage",
                definition: "Luggage/suitcases",
                example: "How many bags are you checking?",
                pronunciation: "BAG-ij"
            },
            {
                word: "aisle seat",
                definition: "Seat next to the walkway",
                example: "I prefer an aisle seat.",
                pronunciation: "AISLE seat"
            },
            {
                word: "window seat",
                definition: "Seat next to the window",
                example: "Can I have a window seat?",
                pronunciation: "WIN-dow seat"
            }
        ],

        examples: [
            {
                user: "Hi, I'm checking in for flight to London.",
                ai: "Good morning! May I see your passport and booking reference, please?"
            },
            {
                user: "Here you go.",
                ai: "Thank you. Are you checking any bags today?"
            },
            {
                user: "Yes, one suitcase.",
                ai: "Perfect. Would you prefer a window or aisle seat?"
            }
        ],

        objectives: [
            "Provide passport and booking information",
            "Discuss baggage (checked vs carry-on)",
            "Request seat preferences",
            "Ask about flight details (gate, boarding time)",
            "Understand check-in procedures"
        ],

        commonMistakes: [
            {
                wrong: "I want check-in",
                correct: "I'd like to check in, please",
                explanation: "Use polite requests at service counters."
            },
            {
                wrong: "Where is my plane?",
                correct: "Which gate is my flight at?",
                explanation: "Ask about the 'gate', not the plane location."
            }
        ],

        scenarios: [
            {
                name: "International Flight",
                description: "Checking in for a long-haul flight",
                aiGreeting: "Good morning! Welcome to British Airways. Where are you flying to today?"
            },
            {
                name: "Domestic Flight",
                description: "Quick domestic check-in",
                aiGreeting: "Hi! Checking in for your flight?"
            }
        ]
    },

    // Continue with remaining topics...
    // (I'll create the rest in the next file to keep it manageable)
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TOPIC_PACKS;
}

console.log('✅ Topic packs loaded:', Object.keys(TOPIC_PACKS).length, 'topics');
