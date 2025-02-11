const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function classifyRequest(userPrompt) {
    const prompt = `
You are a request parser. Extract these fields from the user's request:
- resourceKey: The specific resource being requested (e.g., hilton_budapest)
- rateType: Type of rate/access being requested (e.g., IATA, premium, public)
- action: The intended action (usually "read")

IMPORTANT: Return ONLY raw JSON with these exact keys, no markdown formatting or backticks:
{
    "resourceKey": "",
    "rateType": "",
    "action": ""
}

User request:
${userPrompt}`;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a request parser. Respond with raw JSON only, no markdown formatting or explanation."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0
        });

        const rawOutput = response.choices[0].message.content.trim();
        const cleanOutput = rawOutput.replace(/```json|```/g, '').trim();

        try {
            return JSON.parse(cleanOutput);
        } catch (parseError) {
            console.error("Failed to parse output:", cleanOutput);
            throw parseError;
        }
    } catch (err) {
        console.error("Classification failed:", err);
        throw err;
    }
}

module.exports = { classifyRequest };