# OpenAI + Permit.io Natural Language Access Control

This demo showcases how to combine OpenAI's language understanding with Permit.io's ABAC (Attribute-Based Access Control) to create a system that understands natural language requests and enforces permissions based on user attributes.

## Overview

Users can make requests in natural language like "Show me the IATA rate for Hilton Budapest", and the system will:
1. Use OpenAI to understand what they're trying to access
2. Extract relevant permission attributes
3. Check if they have the right access using Permit.io

## Prerequisites

- Node.js installed
- OpenAI API key
- Permit.io account and API key
- Permit.io PDP URL

## Setup

1. Install dependencies:
```bash
npm install openai permitio dotenv
```

2. Create a `.env` file:
```env
OPENAI_API_KEY=your_openai_key
PERMIT_API_KEY=your_permit_key
PERMIT_PDP_URL=your_pdp_url
```

3. Configure Permit.io:
   - Create a resource type `HotelType` with attribute `rateType` (string)
   - Set up user attributes:
     - `iata_membership` (boolean)
     - `premium_member` (boolean)
   - Configure ABAC policies for:
     - IATA rates (requires iata_membership)
     - Premium rates (requires premium_membership)
     - Public rates (accessible via viewer role)

## Project Structure

```
├── README.md
├── package.json
├── server.js
└── src/
    ├── classifier.js    # OpenAI request parsing
    └── permit.js        # Permit.io access checks
```

## Code Components

### classifier.js
Handles natural language request parsing using OpenAI:
```javascript
const classifyRequest = async (userPrompt) => {
    // Returns: {
    //    resourceKey: "hotel_name",
    //    rateType: "IATA|premium|public",
    //    action: "read"
    // }
}
```

### permit.js
Handles permission checks using Permit.io:
```javascript
const checkAccess = async (userId, parsedRequest) => {
    // Returns: boolean (allowed/denied)
}
```

## Testing

The demo includes test scenarios for:
- IATA agent requesting IATA rates
- Premium user requesting premium rates
- Regular user requesting public rates
- Access denial for unauthorized rate types

Run tests:
```bash
node server.js
```

## Test Users

1. IATA Agent:
```javascript
{
    id: "iata_agent_1",
    attributes: {
        iata_membership: true,
        premium_member: false
    }
}
```

2. Premium User:
```javascript
{
    id: "premium_user_1",
    attributes: {
        iata_membership: false,
        premium_member: true
    }
}
```

3. Regular User:
```javascript
{
    id: "regular_user_1",
    attributes: {
        iata_membership: false,
        premium_member: false
    }
}
```

## Example Output

```
🔍 Testing Scenario:
👤 User: iata_agent_1
💭 Request: "Give me the IATA rate for Hilton Budapest tonight"
🤖 Classification: { 
    resourceKey: 'hilton_budapest', 
    rateType: 'IATA', 
    action: 'read' 
}
✅ Result: ALLOWED
```

## How It Works

1. **Natural Language Understanding**
   - User makes a request in plain English
   - OpenAI extracts resource, rate type, and action
   - Returns structured permission data

2. **Permission Check**
   - System checks user attributes
   - Matches against resource requirements
   - Returns access decision

3. **Access Rules**
   - IATA rates: Requires iata_membership=true
   - Premium rates: Requires premium_member=true
   - Public rates: Available to all users (via viewer role)

## License

MIT