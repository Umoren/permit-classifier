require('dotenv').config();
const AccessClassifier = require('./src/classifier');
const { checkAccess } = require('./src/permit');

const classifier = new AccessClassifier();

async function testScenario(scenario) {
    console.log('\n' + '='.repeat(50));
    console.log(`🔍 TEST CASE: ${scenario.description}`);
    console.log(`👤 User: ${scenario.userId}`);
    console.log(`💭 Request: "${scenario.prompt}"`);

    try {
        const classification = await classifier.classify(scenario.prompt);
        console.log('\n📋 Classification:', JSON.stringify(classification, null, 2));

        const isAllowed = await checkAccess(scenario.userId, classification);
        console.log(`\n🎯 Result: ${isAllowed ? 'ALLOWED ✅' : 'DENIED ❌'}`);
        console.log(`📝 Expected: ${scenario.expected}`);

        const matchesExpectation = (isAllowed === scenario.shouldBeAllowed);
        console.log(`✨ Test ${matchesExpectation ? 'PASSED ✅' : 'FAILED ❌'}`);
    } catch (error) {
        console.error('\n❌ Error:', error.message);
    }
}

async function runTests() {
    const scenarios = [
        // Basic cases
        {
            description: "IATA agent accessing IATA rates",
            userId: 'iata_agent_1',
            prompt: "Give me the IATA rate for Hilton Budapest tonight",
            shouldBeAllowed: true,
            expected: "Should be allowed (IATA member requesting IATA rates)"
        },
        {
            description: "Premium user accessing premium rates",
            userId: 'premium_user_1',
            prompt: "Can I see the premium rates for Marriott London?",
            shouldBeAllowed: true,
            expected: "Should be allowed (Premium user requesting premium rates)"
        },
        {
            description: "Regular user accessing public rates",
            userId: 'regular_user_1',
            prompt: "What's the price for Hyatt New York?",
            shouldBeAllowed: true,
            expected: "Should be allowed (Public rates accessible to all)"
        },

        // Edge cases
        {
            description: "Ambiguous rate request",
            userId: 'regular_user_1',
            prompt: "Show me the rates for Hilton",
            shouldBeAllowed: true,
            expected: "Should be allowed (Defaults to public rates)"
        },
        {
            description: "Missing hotel name",
            userId: 'regular_user_1',
            prompt: "What's the cheapest rate available?",
            shouldBeAllowed: true,
            expected: "Should be allowed (Defaults to public rates)"
        },

        // Financial advice cases
        {
            description: "Opted-in user requesting financial advice",
            userId: 'ai_opted_in_user',
            prompt: "I need help planning my retirement investments",
            shouldBeAllowed: true,
            expected: "Should be allowed (User opted in for AI advice)"
        },
        {
            description: "Implicit financial advice request",
            userId: 'ai_opted_in_user',
            prompt: "Help me balance my portfolio",
            shouldBeAllowed: true,
            expected: "Should be allowed (Recognizes as financial advice)"
        },
        {
            description: "Regular user requesting financial advice",
            userId: 'regular_user_1',
            prompt: "What stocks should I invest in?",
            shouldBeAllowed: false,
            expected: "Should be denied (User not opted in for AI advice)"
        },

        // Mixed/Complex cases
        {
            description: "Mixed IATA and financial request",
            userId: 'iata_agent_1',
            prompt: "Show me IATA rates and help with my investments",
            shouldBeAllowed: true,
            expected: "Should focus on primary intent and handle accordingly"
        }
    ];

    for (const scenario of scenarios) {
        await testScenario(scenario);
    }
}

runTests().catch(console.error);