// Load templates on page load
document.addEventListener('DOMContentLoaded', () => {
    loadTemplates();
    checkBotStatus();
});

// Load and display templates
async function loadTemplates() {
    try {
        const response = await fetch('/api/templates');
        const templates = await response.json();
        
        const templatesContainer = document.getElementById('templates');
        templatesContainer.innerHTML = '';
        
        templates.forEach(template => {
            const btn = document.createElement('button');
            btn.className = 'template-btn';
            btn.innerHTML = `<strong>${template.name}</strong><small>${template.description}</small>`;
            btn.onclick = () => useTemplate(template);
            templatesContainer.appendChild(btn);
        });
    } catch (error) {
        console.error('Error loading templates:', error);
    }
}

// Use template
function useTemplate(template) {
    const messageInput = document.getElementById('messageInput');
    const prompts = {
        'Social Media Campaign': 'Create a comprehensive social media marketing campaign for Q1 2026, including strategy, content calendar, posting schedule, and KPIs.',
        'Email Marketing': 'Design an email marketing sequence for customer onboarding with 5 emails, including subject lines, content outline, and CTAs.',
        'SEO Strategy': 'Develop a complete SEO strategy including keyword research, on-page optimization, technical SEO, and link building plan.',
        'Content Calendar': 'Create a 30-day content marketing calendar with 15 post ideas, including topics, formats, and best posting times.',
        'Audience Analysis': 'Analyze our target audience and create detailed buyer personas for our digital marketing efforts.',
        'Paid Ad Strategy': 'Create a paid advertising strategy for Google Ads and Meta, including budget allocation, targeting, and creative direction.'
    };
    
    messageInput.value = prompts[template.name] || `Help me with: ${template.name}`;
    messageInput.focus();
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
}

// Check bot status
async function checkBotStatus() {
    try {
        await fetch('/api/health');
        console.log('✅ Bot is ready');
    } catch (error) {
        console.error('❌ Bot connection failed:', error);
    }
}

// Handle keypress for Ctrl+Enter
function handleKeypress(event) {
    if (event.ctrlKey && event.key === 'Enter') {
        sendMessage(event);
    }
}

// Send message
async function sendMessage(event) {
    event.preventDefault();
    
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message) return;
    
    // Disable send button
    const sendBtn = document.getElementById('sendBtn');
    sendBtn.disabled = true;
    
    // Display user message
    displayMessage(message, 'user');
    
    // Clear input
    messageInput.value = '';
    messageInput.style.height = 'auto';
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        const response = await fetch('/api/marketing-query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            removeTypingIndicator();
            displayMessage(data.message, 'assistant');
            updateStatus('Message sent successfully', 'success');
        } else {
            removeTypingIndicator();
            displayMessage('Sorry, I encountered an error processing your request. Please try again.', 'assistant');
            updateStatus('Error: ' + (data.error || 'Unknown error'), 'error');
        }
    } catch (error) {
        removeTypingIndicator();
        console.error('Error:', error);
        displayMessage('Connection error. Please check your internet and try again.', 'assistant');
        updateStatus('Error: ' + error.message, 'error');
    } finally {
        sendBtn.disabled = false;
        messageInput.focus();
    }
}

// Display message in chat
function displayMessage(text, sender) {
    const chatContainer = document.getElementById('chatContainer');
    
    // Remove welcome message if it exists
    const welcome = chatContainer.querySelector('.welcome-message');
    if (welcome) {
        welcome.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = text;
    
    // Format text content if it contains markdown-like formatting
    if (text.includes('\n')) {
        contentDiv.innerHTML = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/__(.*?)__/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');
    }
    
    messageDiv.appendChild(contentDiv);
    chatContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Show typing indicator
function showTypingIndicator() {
    const chatContainer = document.getElementById('chatContainer');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message assistant';
    messageDiv.id = 'typing-indicator';
    
    const indicatorDiv = document.createElement('div');
    indicatorDiv.className = 'typing-indicator';
    indicatorDiv.innerHTML = '<span></span><span></span><span></span>';
    
    messageDiv.appendChild(indicatorDiv);
    chatContainer.appendChild(messageDiv);
    
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Remove typing indicator
function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

// Update status message
function updateStatus(message, type = '') {
    const statusEl = document.getElementById('status');
    statusEl.textContent = message;
    statusEl.className = `status ${type}`;
    
    if (type === 'success') {
        setTimeout(() => {
            statusEl.textContent = '';
            statusEl.className = 'status';
        }, 3000);
    }
}

// Clear conversation
async function clearConversation() {
    if (confirm('Are you sure you want to clear the entire conversation? This cannot be undone.')) {
        try {
            const response = await fetch('/api/clear-conversation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const chatContainer = document.getElementById('chatContainer');
                chatContainer.innerHTML = `
                    <div class="welcome-message">
                        <h2>Welcome to Digital Marketing Bot! 🤖</h2>
                        <p>Ask me anything about:</p>
                        <ul>
                            <li>📱 Social Media Marketing Strategies</li>
                            <li>✍️ Content Creation & Copywriting</li>
                            <li>🔍 SEO Optimization</li>
                            <li>📧 Email Marketing Campaigns</li>
                            <li>💰 Paid Advertising (Google, Meta, LinkedIn)</li>
                            <li>📊 Marketing Analytics</li>
                            <li>🎨 Brand Strategy & Positioning</li>
                            <li>🎯 Customer Engagement</li>
                        </ul>
                        <p class="hint">👉 Try asking: "Create a social media marketing plan for Q1"</p>
                    </div>
                `;
                updateStatus('Conversation cleared', 'success');
            }
        } catch (error) {
            console.error('Error clearing conversation:', error);
            updateStatus('Error clearing conversation', 'error');
        }
    }
}

// Auto-resize textarea
document.getElementById('messageInput').addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
});
