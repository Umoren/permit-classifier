require('dotenv').config();
const { classifyRequest } = require('./src/classifier');
const { checkAccess } = require('./src/permit');

async function testAccess() {
    try {
        // Test scenarios
        const scenarios = [
            {
                userId: 'iata_agent_1',
                prompt: "Give me the IATA rate for Hilton Budapest tonight",
                expected: "Should be allowed (IATA member requesting IATA rates)"
            },
            {
                userId: 'premium_user_1',
                prompt: "Can I see the premium rates for Marriott London?",
                expected: "Should be allowed (Premium user requesting premium rates)"
            },
            {
                userId: 'regular_user_1',
                prompt: "What's the regular rate for Hyatt New York?",
                expected: "Should be allowed (Public rates accessible to all)"
            },
            {
                userId: 'regular_user_1',
                prompt: "Show me the IATA rates for Hilton Budapest",
                expected: "Should be denied (Non-IATA member requesting IATA rates)"
            }
        ];

        for (const scenario of scenarios) {
            console.log('\n🔍 Testing Scenario:');
            console.log(`👤 User: ${scenario.userId}`);
            console.log(`💭 Request: ${scenario.prompt}`);
            console.log(`📝 Expected: ${scenario.expected}`);

            // 1. Classify the request using OpenAI
            const classification = await classifyRequest(scenario.prompt);
            console.log('🤖 Classification:', classification);

            // 2. Check access using Permit.io
            const isAllowed = await checkAccess(scenario.userId, classification);
            console.log(`🎯 Result: ${isAllowed ? 'ALLOWED ✅' : 'DENIED ❌'}`);
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

testAccess();