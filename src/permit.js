const { Permit } = require('permitio');
require('dotenv').config();

const permit = new Permit({
    token: process.env.PERMIT_API_KEY,
    pdp: process.env.PDP_URL,
});

async function checkAccess(userId, parsedRequest) {
    try {
        console.log('\n🔒 Checking Permission:');
        console.log(`👤 User: ${userId}`);
        console.log(`🏨 Resource: ${parsedRequest.resourceKey}`);
        console.log(`💰 Rate Type: ${parsedRequest.rateType}`);
        console.log(`🎯 Action: ${parsedRequest.action}`);

        const permitted = await permit.check(
            userId,
            parsedRequest.action,
            {
                type: "HotelType",
                key: parsedRequest.resourceKey,
                attributes: {
                    rateType: parsedRequest.rateType
                }
            }
        );

        if (permitted) {
            console.log('✅ Access Granted');
        } else {
            console.log('❌ Access Denied');
        }

        return permitted;
    } catch (err) {
        console.error("❌ Permission check failed:", err);
        throw err;
    }
}

module.exports = {
    checkAccess
};