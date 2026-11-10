require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Log all requests
app.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'GET') {
    console.log(`${req.method} ${req.path}`);
  }
  next();
});

// Azure OpenAI Configuration
const AZURE_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const AZURE_API_KEY = process.env.AZURE_OPENAI_API_KEY;
const DEPLOYMENT_NAME = process.env.AZURE_OPENAI_MODEL || 'gpt-4-turbo';
const API_VERSION = process.env.AZURE_OPENAI_MODEL_VERSION || '2024-05-01-preview';

console.log('Configuration:');
console.log('Endpoint:', AZURE_ENDPOINT);
console.log('Deployment:', DEPLOYMENT_NAME);
console.log('API Version:', API_VERSION);

// Marketing context for the bot
const SYSTEM_PROMPT = `You are an expert digital marketing strategist and content creator for Ma-Boyounon Inc. 
Your expertise includes:
- Social media marketing strategy
- Content marketing and copywriting
- SEO optimization
- Email marketing campaigns
- Market analysis and audience insights
- Branding and positioning
- Paid advertising strategies (Google Ads, Meta Ads, LinkedIn)
- Analytics and performance metrics
- Customer engagement strategies
- Marketing automation

Provide actionable, data-driven marketing recommendations. Be conversational, professional, and helpful.
When asked about strategies, provide specific, implementable steps. Ask clarifying questions to better understand the user's goals.`;

// Marketing conversation history
let conversationHistory = [];

// Endpoint to send marketing queries
app.post('/api/marketing-query', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    console.log('User message:', message);

    // Add user message to history
    conversationHistory.push({
      role: 'user',
      content: message
    });

    // Prepare messages for Azure OpenAI
    const messages = [
      {
        role: 'system',
        content: SYSTEM_PROMPT
      },
      ...conversationHistory
    ];

    let assistantMessage = '';

    try {
      // Try to call Azure OpenAI API
      console.log('Calling Azure OpenAI...');
      const response = await axios.post(
        `${AZURE_ENDPOINT}/openai/deployments/${DEPLOYMENT_NAME}/chat/completions?api-version=${API_VERSION}`,
        {
          messages: messages,
          temperature: 0.7,
          max_tokens: 1000,
          top_p: 0.95,
          frequency_penalty: 0,
          presence_penalty: 0
        },
        {
          headers: {
            'api-key': AZURE_API_KEY,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      assistantMessage = response.data.choices[0].message.content;
      console.log('Azure response received');
    } catch (azureError) {
      console.error('Azure OpenAI Error:', azureError.response?.status, azureError.response?.data?.error?.message);
      
      // Fallback to mock response if Azure fails
      console.log('Using fallback mock response');
      assistantMessage = generateMockResponse(message);
    }

    // Add assistant response to history
    conversationHistory.push({
      role: 'assistant',
      content: assistantMessage
    });

    res.json({
      success: true,
      message: assistantMessage,
      conversationId: conversationHistory.length
    });
  } catch (error) {
    console.error('Error in marketing-query endpoint:');
    console.error('Message:', error.message);
    
    res.status(500).json({
      error: 'Failed to process marketing query',
      details: error.message
    });
  }
});

// Mock response generator for when Azure is unavailable
function generateMockResponse(userMessage) {
  const lowerMessage = userMessage.toLowerCase();
  
  const responses = {
    'social media': `# Social Media Marketing Strategy\n\n**Key Platforms to Focus On:**\n1. **LinkedIn** - B2B audience engagement\n2. **Instagram** - Visual storytelling\n3. **Twitter/X** - Real-time engagement\n4. **TikTok** - Younger demographics\n\n**Content Strategy:**\n- Post 3-5 times per week\n- Use mix of educational, promotional, and entertainment content\n- Engage with followers within 2 hours\n- Use relevant hashtags (5-10 per post)\n\n**Engagement Tactics:**\n- Respond to comments within 24 hours\n- Run polls and Q&A sessions\n- Collaborate with micro-influencers\n- Share user-generated content\n\n**Metrics to Track:**\n- Engagement rate\n- Reach and impressions\n- Click-through rate\n- Conversion rate`,
    
    'email marketing': `# Email Marketing Campaign Strategy\n\n**Campaign Structure:**\n1. Welcome Email - Introduce brand and value proposition\n2. Educational Email - Share valuable content\n3. Product/Service Email - Showcase offerings\n4. Social Proof Email - Share testimonials\n5. Call to Action Email - Drive conversions\n\n**Best Practices:**\n- Personalize subject lines\n- Keep emails mobile-responsive\n- A/B test subject lines\n- Segment your audience\n- Optimal send time: Tuesday-Thursday, 9-11 AM\n\n**Key Metrics:**\n- Open rate (target: 20-25%)\n- Click-through rate (target: 2-5%)\n- Conversion rate (target: 1-3%)\n- Unsubscribe rate (keep below 1%)`,
    
    'seo': `# SEO Optimization Strategy\n\n**On-Page SEO:**\n- Include target keywords in title, meta, and first 100 words\n- Create descriptive meta descriptions (150-160 characters)\n- Use header tags (H1, H2, H3) properly\n- Optimize images with alt text\n- Ensure fast page load (under 3 seconds)\n\n**Off-Page SEO:**\n- Build quality backlinks from authoritative sites\n- Ensure local citations for local businesses\n- Get listed in Google My Business\n- Encourage online reviews\n\n**Technical SEO:**\n- Create XML sitemap\n- Fix broken links\n- Implement schema markup\n- Ensure mobile-friendly design\n- Use HTTPS\n\n**Content Strategy:**\n- Target long-tail keywords\n- Create comprehensive content (2000+ words)\n- Update content regularly\n- Build internal linking structure`,
    
    'content calendar': `# 30-Day Content Marketing Calendar\n\n**Week 1:**\n- Day 1: Industry trend analysis post\n- Day 2: Educational blog article\n- Day 3: Customer success story\n- Day 4: Behind-the-scenes video\n- Day 5: Infographic\n- Day 6: Expert interview\n- Day 7: Week recap + engagement\n\n**Week 2:**\n- Day 8: How-to guide\n- Day 9: Case study\n- Day 10: Product update\n- Day 11: Tips & tricks carousel\n- Day 12: User testimonial\n- Day 13: Webinar announcement\n- Day 14: Community engagement\n\n**Week 3:**\n- Day 15: Deep-dive article\n- Day 16: Podcast episode\n- Day 17: Interactive quiz\n- Day 18: Team introduction\n- Day 19: Industry news commentary\n- Day 20: Free resource offer\n- Day 21: Q&A session\n\n**Week 4:**\n- Day 22: Monthly performance report\n- Day 23: Customer feedback post\n- Day 24: Product showcase\n- Day 25: Trending topic response\n- Day 26: Collaboration announcement\n- Day 27: Exclusive offer\n- Day 28-30: Engagement & community`,
    
    'audience': `# Buyer Persona Development\n\n**Persona 1: Decision Maker David**\n- Age: 35-50\n- Income: $100K+\n- Pain Points: Time management, ROI tracking\n- Goals: Grow business, reduce costs\n- Prefers: LinkedIn, professional content\n\n**Persona 2: Manager Mary**\n- Age: 28-40\n- Income: $60K-$100K\n- Pain Points: Team coordination, deadlines\n- Goals: Career advancement, team success\n- Prefers: Email, webinars, case studies\n\n**Persona 3: Gen-Z Grace**\n- Age: 18-28\n- Income: $30K-$60K\n- Pain Points: Student loans, job search\n- Goals: Skill development, side income\n- Prefers: TikTok, Instagram, YouTube\n\n**Research Methods:**\n- Customer interviews\n- Surveys and polls\n- Website analytics\n- Social listening\n- Support ticket analysis`,
    
    'paid advertising': `# Paid Advertising Strategy\n\n**Google Ads Approach:**\n- Focus on high-intent keywords\n- Create separate campaigns for product/service\n- Optimize landing pages for conversion\n- Target: $2-5 cost-per-click\n- Expected ROI: 300-500%\n\n**Meta Ads (Facebook/Instagram):**\n- Target audiences by interests and behaviors\n- Use carousel ads for product showcase\n- A/B test creative variations\n- Budget allocation: 40% awareness, 40% consideration, 20% conversion\n- Expected ROAS: 4:1 to 7:1\n\n**LinkedIn Ads:**\n- Target by job title and company\n- Use sponsored content for brand awareness\n- InMail for direct outreach\n- Expected CTR: 0.5-1%\n\n**Budget Allocation:**\n- Start with $500-$1000/month\n- Scale winners by 20-30% weekly\n- Cut underperformers immediately\n- Test new channels with 10% budget`,
    
    'default': `# Digital Marketing Assistant\n\nI can help you with:\n\n**📱 Social Media Marketing**\n- Strategy and planning\n- Content calendar creation\n- Engagement tactics\n\n**✍️ Content Marketing**\n- Blog post ideas\n- Email campaigns\n- Copywriting tips\n\n**🔍 SEO Optimization**\n- Keyword research\n- On-page optimization\n- Technical SEO\n\n**💰 Paid Advertising**\n- Google Ads strategy\n- Meta Ads campaigns\n- Budget optimization\n\n**📊 Analytics**\n- KPI tracking\n- Performance measurement\n- Reporting\n\n**🎯 Campaign Planning**\n- Strategy development\n- Audience targeting\n- Competitive analysis\n\nWhat would you like help with today?`
  };
  
  // Find the best matching response
  for (const [key, response] of Object.entries(responses)) {
    if (key !== 'default' && lowerMessage.includes(key)) {
      return response;
    }
  }
  
  return responses.default;
}

// Endpoint to get conversation history
app.get('/api/conversation', (req, res) => {
  res.json({
    history: conversationHistory
  });
});

// Endpoint to clear conversation
app.post('/api/clear-conversation', (req, res) => {
  conversationHistory = [];
  res.json({ success: true, message: 'Conversation cleared' });
});

// Endpoint to get marketing templates
app.get('/api/templates', (req, res) => {
  const templates = [
    {
      id: 1,
      name: 'Social Media Campaign',
      description: 'Create a compelling social media marketing campaign'
    },
    {
      id: 2,
      name: 'Email Marketing',
      description: 'Design an effective email marketing sequence'
    },
    {
      id: 3,
      name: 'SEO Strategy',
      description: 'Develop an SEO optimization strategy'
    },
    {
      id: 4,
      name: 'Content Calendar',
      description: 'Plan a content marketing calendar'
    },
    {
      id: 5,
      name: 'Audience Analysis',
      description: 'Analyze target audience and create personas'
    },
    {
      id: 6,
      name: 'Paid Ad Strategy',
      description: 'Create a paid advertising strategy'
    }
  ];
  res.json(templates);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Bot is running', timestamp: new Date().toISOString() });
});

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Digital Marketing Bot Server running on http://localhost:${PORT}`);
  console.log(`📱 Open http://localhost:${PORT} in your browser`);
  console.log(`✨ Bot is ready to help with marketing strategies!`);
});

