// AI Service for OptiSched
// Supports multiple AI providers - currently configured for OpenAI

class AIService {
  constructor() {
    // You can get API keys from respective providers
    this.apiKeys = {
      openai: process.env.EXPO_PUBLIC_OPENAI_API_KEY || 'your-openai-api-key',
      gemini: process.env.EXPO_PUBLIC_GEMINI_API_KEY || 'your-gemini-api-key',
    }
    this.currentProvider = process.env.EXPO_PUBLIC_AI_PROVIDER || 'gemini' // Default to Gemini
    this.currentModel = process.env.EXPO_PUBLIC_AI_MODEL || 'gemini-1.5-flash'
    this.retryCount = 0
    this.maxRetries = 3
    this.lastRequestTime = 0
    this.requestCooldown = 2000 // 2 seconds between requests
  }

  // Rate limiting helper
  async waitForCooldown() {
    const now = Date.now()
    const timeSinceLastRequest = now - this.lastRequestTime
    if (timeSinceLastRequest < this.requestCooldown) {
      const waitTime = this.requestCooldown - timeSinceLastRequest
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
    this.lastRequestTime = Date.now()
  }

  // OpenAI Chat Completions with retry logic
  async chatWithOpenAI(messages, options = {}) {
    await this.waitForCooldown()
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKeys.openai}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: options.model || 'gpt-3.5-turbo',
          messages: messages,
          max_tokens: options.maxTokens || 500,
          temperature: options.temperature || 0.7,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('INVALID_API_KEY');
        } else if (response.status === 429) {
          const errorData = await response.json().catch(() => ({}))
          const retryAfter = errorData?.error?.retry_after || 20
          throw new Error(`RATE_LIMIT:${retryAfter}`);
        } else {
          throw new Error(`OpenAI API error: ${response.status}`);
        }
      }

      const data = await response.json();
      this.retryCount = 0 // Reset retry count on success
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      
      // Handle rate limit with retry
      if (error.message.startsWith('RATE_LIMIT')) {
        const retryAfter = parseInt(error.message.split(':')[1]) || 20
        
        if (this.retryCount < this.maxRetries) {
          this.retryCount++
          console.log(`Rate limited. Retrying in ${retryAfter} seconds... (Attempt ${this.retryCount}/${this.maxRetries})`)
          
          // Wait for the specified time plus exponential backoff
          const backoffTime = retryAfter * 1000 * Math.pow(2, this.retryCount - 1)
          await new Promise(resolve => setTimeout(resolve, backoffTime))
          
          return this.chatWithOpenAI(messages, options)
        } else {
          throw new Error('RATE_LIMIT_EXCEEDED');
        }
      }
      
      throw error;
    }
  }

  // Google Gemini API with official SDK
  async chatWithGemini(prompt, options = {}) {
    try {
      // Dynamically import Google Generative AI
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      
      const genAI = new GoogleGenerativeAI(this.apiKeys.gemini);
      const model = genAI.getGenerativeModel({ 
        model: this.currentModel || "gemini-1.5-flash", // Use configured model
        generationConfig: {
          temperature: options.temperature || 0.7,
          maxOutputTokens: options.maxTokens || 500,
        }
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return text;
    } catch (error) {
      console.error('Gemini API Error:', error);
      
      if (error.status === 429) {
        throw new Error('RATE_LIMIT');
      } else if (error.status === 401 || error.message.includes('API_KEY')) {
        throw new Error('INVALID_API_KEY');
      } else {
        throw new Error(`Gemini API error: ${error.message}`);
      }
    }
  }

  // Main chat method - routes to appropriate provider
  async chat(messages, options = {}) {
    switch (this.currentProvider) {
      case 'openai':
        return this.chatWithOpenAI(messages, options);
      case 'gemini':
        const prompt = messages.map(m => m.content).join('\n');
        return this.chatWithGemini(prompt, options);
      default:
        throw new Error('Unsupported AI provider');
    }
  }

  // Schedule-specific AI functions
  async generateScheduleOptimization(userSchedule, preferences) {
    const prompt = `As an academic scheduling assistant, analyze this student's schedule and provide optimization suggestions:

Current Schedule:
${JSON.stringify(userSchedule, null, 2)}

User Preferences:
${JSON.stringify(preferences, null, 2)}

Please provide:
1. Study time recommendations
2. Break suggestions
3. Productivity tips
4. Schedule conflicts or issues
5. Suggestions for better time management

Respond in a helpful, encouraging tone with specific, actionable advice.`;

    const messages = [
      { role: 'system', content: 'You are an expert academic advisor and scheduling assistant.' },
      { role: 'user', content: prompt }
    ];

    return this.chat(messages, { maxTokens: 600 });
  }

  async getStudyAdvice(subject, difficulty, timeAvailable) {
    const prompt = `Provide study advice for ${subject} at ${difficulty} level with ${timeAvailable} available. Include:
1. Study techniques
2. Time management tips
3. Resource recommendations
4. Common pitfalls to avoid
5. Practice suggestions`;

    const messages = [
      { role: 'system', content: 'You are an expert educator and study coach.' },
      { role: 'user', content: prompt }
    ];

    return this.chat(messages, { maxTokens: 400 });
  }

  // Check if question is about assignment completion (restricted)
  isAssignmentCompletionQuestion(question) {
    const restrictedKeywords = [
      'do my assignment', 'write my essay', 'complete my homework',
      'solve my problem', 'give me answer', 'write code for me',
      'do project', 'write report', 'complete assignment', 'solve homework',
      'give me solution', 'write assignment', 'do homework for me',
      'write paper', 'complete project', 'solve assignment'
    ];
    
    const lowerQuestion = question.toLowerCase();
    return restrictedKeywords.some(keyword => lowerQuestion.includes(keyword));
  }

  async answerAcademicQuestion(question, context = '') {
    // Check for restricted assignment completion requests
    if (this.isAssignmentCompletionQuestion(question)) {
      return "I'm sorry, but I can't help complete assignments or provide direct answers to homework questions. This is to ensure academic integrity and help you learn effectively.\n\nHowever, I can help you with:\n• Study techniques and learning strategies\n• Understanding concepts and theories\n• Practice problems and examples\n• Time management for assignments\n• Research guidance and resource suggestions\n• Breaking down assignments into manageable steps\n\nWould you like help with any of these alternative approaches?";
    }

    const prompt = `Answer this academic question: ${question}
${context ? `Additional context: ${context}` : ''}

Please provide:
1. A clear, accurate answer
2. Explanation of key concepts
3. Examples if helpful
4. Related study tips

Keep the response educational and appropriate for students. Do not provide direct answers to assignment questions - instead guide the learning process.`;

    const messages = [
      { role: 'system', content: 'You are an knowledgeable academic tutor. Help students learn without giving direct assignment answers.' },
      { role: 'user', content: prompt }
    ];

    return this.chat(messages, { maxTokens: 500 });
  }

  async generateAssignmentPlan(assignmentDetails, deadline) {
    const prompt = `Create a study plan for this assignment:
${JSON.stringify(assignmentDetails, null, 2)}
Deadline: ${deadline}

Please provide:
1. Day-by-day breakdown
2. Milestones to track progress
3. Time estimates for each task
4. Study resources needed
5. Tips for staying on track`;

    const messages = [
      { role: 'system', content: 'You are an expert project manager and academic coach.' },
      { role: 'user', content: prompt }
    ];

    return this.chat(messages, { maxTokens: 600 });
  }

  // Fallback for when API is not available
  generateFallbackResponse(type, input) {
    const fallbacks = {
      schedule: "Based on your schedule, I recommend studying during your free periods and taking regular breaks. Try the Pomodoro technique: 25 minutes of focused study followed by a 5-minute break.",
      study: "For effective studying, create a dedicated study space, eliminate distractions, and use active learning techniques like summarizing information in your own words.",
      question: "That's a great question! I recommend checking your textbook first, then discussing with classmates. If you still need help, don't hesitate to ask your teacher.",
      assignment: "Break down your assignment into smaller tasks and create a timeline. Start with research, then outline, draft, and finally revise. Don't forget to proofread!",
    };

    return fallbacks[type] || "I'm here to help with your academic journey. Try asking about study tips, schedule optimization, or specific subjects!";
  }
}

export default new AIService();
