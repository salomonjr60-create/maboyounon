# 🎯 Digital Marketing Bot - Ma-Boyounon Inc

A powerful AI-driven digital marketing bot powered by **Azure OpenAI** that provides expert marketing strategies, content creation, and campaign planning.

## ✨ Features

✅ **AI Marketing Expert** - Powered by Azure OpenAI GPT-5 Mini
✅ **Real-time Chat Interface** - Modern, responsive UI
✅ **Marketing Templates** - Quick-start templates for common marketing tasks
✅ **Conversation History** - Maintains context across multiple queries
✅ **Instant Deployment** - Ready to run on your local machine

## 🎨 Capabilities

The bot can help you with:

- 📱 **Social Media Marketing** - Strategy, content calendars, platform-specific tips
- ✍️ **Content Marketing** - Blog posts, copywriting, messaging frameworks
- 🔍 **SEO Optimization** - Keyword research, technical SEO, link building
- 📧 **Email Marketing** - Campaign sequences, subject lines, automation
- 💰 **Paid Advertising** - Google Ads, Meta Ads, LinkedIn strategies
- 📊 **Analytics & Metrics** - KPI tracking, performance measurement
- 🎨 **Brand Strategy** - Positioning, messaging, brand identity
- 🎯 **Audience Insights** - Persona development, market analysis

## 🚀 Quick Start

### Prerequisites

- Node.js 14+ installed
- Azure OpenAI credentials configured in `.env` file

### Installation

1. Navigate to the project directory:
```bash
cd /Users/mac/Desktop/Ma-Boyounon-Inc
```

2. Install dependencies (if not already installed):
```bash
npm install
```

3. Verify `.env` file has your Azure credentials:
```env
AZURE_OPENAI_ENDPOINT=https://maboyounon.services.ai.azure.com/openai/v1
AZURE_OPENAI_MODEL=gpt-5-mini
AZURE_OPENAI_MODEL_VERSION=2025-08-07
AZURE_OPENAI_API_KEY=your_api_key_here
PORT=3000
```

### Running the Bot

Start the bot server:

```bash
npm start
```

Or for development with auto-reload (install nodemon first):

```bash
npm run dev
```

### Access the Bot

Open your browser and navigate to:

```
🔗 http://localhost:3000
```

The bot interface will load and you can start chatting immediately!

## 📚 API Endpoints

### Send Marketing Query
**POST** `/api/marketing-query`
```json
{
  "message": "Create a social media marketing plan for Q1"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Here's a comprehensive social media marketing plan...",
  "conversationId": 1
}
```

### Get Conversation History
**GET** `/api/conversation`

**Response:**
```json
{
  "history": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

### Clear Conversation
**POST** `/api/clear-conversation`

**Response:**
```json
{
  "success": true,
  "message": "Conversation cleared"
}
```

### Get Templates
**GET** `/api/templates`

**Response:**
```json
[
  {
    "id": 1,
    "name": "Social Media Campaign",
    "description": "Create a compelling social media marketing campaign"
  },
  ...
]
```

### Health Check
**GET** `/api/health`

**Response:**
```json
{
  "status": "Bot is running"
}
```

## 🎯 Usage Examples

### Example 1: Create a Social Media Strategy
```
Message: "Create a comprehensive social media marketing strategy for a SaaS startup focusing on LinkedIn and Twitter"

Bot Response: [Detailed strategy with platforms, content types, posting schedule, KPIs, and engagement tactics]
```

### Example 2: Email Marketing Sequence
```
Message: "Design a 5-email onboarding sequence for new customers"

Bot Response: [Email sequence with subject lines, content outline, CTAs, and timing]
```

### Example 3: Content Calendar
```
Message: "Create a 30-day content marketing calendar with diverse content types"

Bot Response: [Calendar with post ideas, formats, best posting times, and engagement strategies]
```

## 📁 Project Structure

```
Ma-Boyounon-Inc/
├── server.js              # Express backend server
├── package.json           # Project dependencies
├── .env                   # Azure OpenAI credentials
├── public/
│   ├── index.html         # Main HTML interface
│   ├── style.css          # Beautiful dark theme styling
│   └── script.js          # Frontend JavaScript logic
└── README.md              # This file
```

## 🔧 Technology Stack

- **Backend:** Node.js, Express.js
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **AI Engine:** Azure OpenAI (GPT-5 Mini)
- **HTTP Client:** Axios
- **Middleware:** CORS, Body Parser

## 🎨 Features Showcase

### Modern UI
- Dark theme optimized for long reading sessions
- Smooth animations and transitions
- Responsive design works on desktop and tablets
- Real-time typing indicator for bot responses

### Smart Conversation
- Maintains full conversation context
- Supports multi-turn discussions
- Formatted output with markdown support
- Automatic scroll to latest messages

### Quick Templates
- 6 pre-built marketing templates
- One-click prompt insertion
- Easy customization before sending

## 🛡️ Security

- Environment variables for sensitive data
- CORS enabled for cross-origin requests
- Input validation on all endpoints
- API key securely stored in `.env`

## ⚙️ Configuration

Edit `.env` to customize:

```env
# Azure OpenAI Configuration
AZURE_OPENAI_ENDPOINT=your_endpoint
AZURE_OPENAI_MODEL=your_model
AZURE_OPENAI_MODEL_VERSION=your_version
AZURE_OPENAI_API_KEY=your_api_key

# Server Configuration
PORT=3000
```

## 🚨 Troubleshooting

### Bot not responding
- Check that Azure credentials are correct in `.env`
- Verify API key has sufficient quota
- Ensure internet connection is stable

### Port 3000 already in use
- Change PORT in `.env` file
- Or kill the existing process: `lsof -ti:3000 | xargs kill -9`

### Module not found errors
- Run `npm install` to install dependencies
- Verify Node.js version is 14+

## 📝 API Rate Limits

Azure OpenAI has rate limits based on your subscription. The bot handles this gracefully with:
- Error messages for rate limit hits
- Automatic retry prompts
- Clear status updates

## 🎓 Learning Resources

- [Azure OpenAI Documentation](https://learn.microsoft.com/azure/cognitive-services/openai/)
- [Express.js Guide](https://expressjs.com/)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)

## 📧 Support

For issues or questions about the bot:
1. Check the console logs for error messages
2. Verify all environment variables are set
3. Review the troubleshooting section above

## 📄 License

ISC License - Copyright © 2026 Ma-Boyounon Inc

---

**Created with ❤️ by AI Assistant using Copilot SDK**

**Last Updated:** November 10, 2026

### Next Steps:
1. ✅ Bot is running at http://localhost:3000
2. Open the link in your browser
3. Start chatting with your marketing expert AI!
