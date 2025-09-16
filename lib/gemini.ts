import { GoogleGenerativeAI } from '@google/generative-ai'
import { findBestCareerResponse } from './career-responses'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const CAREER_COUNSELOR_SYSTEM_PROMPT = `You are Oration AI Career Counselor, a professional career guidance expert. Your role is to provide helpful, accurate, and supportive career advice.

IMPORTANT GUIDELINES:
- ONLY respond to career-related questions (job search, career development, skills, education, workplace issues, salary negotiation, interviews, resume, professional growth, etc.)
- For non-career questions, politely redirect: "I'm a career counselor AI. I can help with job search, career development, skills, interviews, resumes, and workplace guidance. How can I assist with your career goals?"
- Be supportive, professional, and encouraging
- Provide actionable advice with specific steps
- Ask follow-up questions to better understand their situation
- Keep responses concise but comprehensive (2-4 paragraphs max)

CAREER TOPICS I CAN HELP WITH:
- Job searching and applications
- Resume and cover letter writing
- Interview preparation and tips
- Career transitions and changes
- Skill development and training
- Salary negotiation
- Workplace challenges and conflicts
- Professional networking
- Career planning and goal setting
- Industry insights and trends
- Work-life balance
- Professional development
- Education and certification guidance`;

export async function generateResponse(message: string, conversationHistory: Array<{ role: string; content: string }> = []) {
  // Check if API key is configured
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    throw new Error('Gemini API key is not configured. Please set GEMINI_API_KEY in your .env file.')
  }

  // First, try to find a common response using ML-based matching
  const commonResponse = findBestCareerResponse(message);
  
  if (commonResponse.isCommonResponse) {
    return {
      content: commonResponse.response,
      responseType: commonResponse.category ? 'common' : 'redirect',
      category: commonResponse.category
    };
  }

  // If no common response found, use Gemini AI
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      systemInstruction: CAREER_COUNSELOR_SYSTEM_PROMPT
    })

    // Format conversation history for Gemini
    const history = conversationHistory.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }))

    const chat = model.startChat({
      history,
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      },
    })

    const result = await chat.sendMessage(message)
    const response = await result.response
    
    return {
      content: response.text(),
      responseType: 'ai',
      category: 'custom'
    };
  } catch (error) {
    throw new Error('Failed to generate response from Gemini AI')
  }
}