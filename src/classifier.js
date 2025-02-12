const OpenAI = require('openai');
require('dotenv').config();

class AccessClassifier {
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        this.systemPrompt = `You are an access classifier that understands user requests and their intent.
Analyze requests and identify:
1. What type of resource they're trying to access
2. Any relevant attributes about the resource
3. The intended action (usually "read")

Key patterns to recognize:
- Requests about hotel rates/prices -> resourceType: "HotelType"
  - Default to "public" rate if no specific rate type mentioned
  - Use "unknown" as resourceKey if hotel not specified
- Requests for financial/investment guidance -> resourceType: "FinancialAdvice"
  - Extract specific topic (investments, retirement, etc.) as resourceKey
- For ambiguous requests that might reference multiple services, prioritize the main intent

Return JSON format:
{
    "resourceType": "HotelType | FinancialAdvice",
    "resourceKey": "identifier",
    "attributes": {
        "rateType": "IATA | premium | public"  // for HotelType only
    },
    "action": "read"
}`;
    }

    async classify(userPrompt) {
        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: this.systemPrompt
                    },
                    {
                        role: "user",
                        content: userPrompt
                    }
                ],
                temperature: 0
            });

            return JSON.parse(response.choices[0].message.content.trim());
        } catch (error) {
            console.error("Classification failed:", error);
            throw error;
        }
    }
}

module.exports = AccessClassifier;