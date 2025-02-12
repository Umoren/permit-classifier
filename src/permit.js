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
        console.log(`📑 Resource Type: ${parsedRequest.resourceType}`);
        console.log(`🎯 Action: ${parsedRequest.action}`);

        let resource = {
            type: parsedRequest.resourceType,
            key: parsedRequest.resourceKey
        };

        // Add attributes only if they exist
        if (Object.keys(parsedRequest.attributes || {}).length > 0) {
            resource.attributes = parsedRequest.attributes;

            // Log attributes if present
            console.log('📋 Attributes:', parsedRequest.attributes);
        }

        const permitted = await permit.check(
            userId,
            parsedRequest.action,
            resource
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