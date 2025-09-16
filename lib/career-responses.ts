// Advanced Career Counselor ML-based Response System
// This system provides instant responses for common career questions without using AI API
// Enhanced with better categorization, sentiment analysis, and personalized recommendations

interface CareerResponse {
  id: string;
  keywords: string[];
  response: string;
  category: 'resume' | 'interview' | 'job-search' | 'salary' | 'skills' | 'career-change' | 'workplace' | 'networking' | 'leadership' | 'general';
  confidence: number;
  tags: string[];
  followUpQuestions?: string[];
  relatedTopics?: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const COMMON_CAREER_RESPONSES: CareerResponse[] = [
  // Resume Related - Enhanced
  {
    id: 'resume-basics',
    keywords: ['resume', 'cv', 'write resume', 'resume help', 'resume tips', 'curriculum vitae'],
    response: `Here's your comprehensive resume guide:

**🎯 Structure & Flow**
• Contact info → Professional summary → Core competencies → Work experience → Education → Additional sections
• Use reverse chronological order for experience
• Keep it scannable with clear headings and bullet points

**✨ Content Excellence**
• Start bullets with strong action verbs (Led, Developed, Implemented, Achieved)
• Quantify everything: "Increased sales by 25%" vs "Responsible for sales"
• Tailor keywords to match job descriptions (use 70-80% keyword match)
• Focus on achievements, not just responsibilities

**📐 Professional Format**
• 1-2 pages maximum (1 page for <10 years experience)
• Consistent fonts (Arial, Calibri, or Times New Roman)
• 10-12pt font size, 1-inch margins
• Save as PDF to preserve formatting

**🔍 ATS Optimization**
• Use standard section headers
• Avoid graphics, tables, or complex formatting
• Include relevant industry keywords naturally

Ready to dive deeper into any specific section?`,
    category: 'resume',
    confidence: 0.95,
    tags: ['writing', 'formatting', 'ats', 'optimization'],
    followUpQuestions: [
      "What's your current experience level?",
      "Which industry are you targeting?",
      "Do you need help with a specific resume section?"
    ],
    relatedTopics: ['cover-letter', 'linkedin-profile', 'job-applications'],
    difficulty: 'beginner'
  },
  {
    id: 'resume-experience',
    keywords: ['work experience', 'job experience', 'resume experience', 'no experience', 'entry level', 'career gap'],
    response: `Let's optimize your work experience section:

**🏢 For Experienced Professionals**
• List positions in reverse chronological order
• Include: Job Title | Company | Location | Dates
• 3-5 bullet points per role focusing on impact and results
• Use the CAR method: Challenge → Action → Result

**🌱 For Entry-Level/New Graduates**
• Include internships, co-ops, and significant part-time work
• Highlight relevant coursework and academic projects
• Add volunteer work that demonstrates transferable skills
• Include leadership roles in organizations or clubs

**📊 Experience Formatting Best Practices**
• Start each bullet with a strong action verb
• Quantify achievements with numbers, percentages, or dollar amounts
• Show progression and increasing responsibility
• Tailor experience descriptions to target job requirements

**🔄 Handling Career Gaps**
• Be honest but strategic about gaps
• Include relevant activities during gaps (freelancing, education, caregiving)
• Focus on skills maintained or developed during the gap
• Consider a functional or hybrid resume format

**💡 Pro Tips**
• Use industry-specific terminology and keywords
• Show career progression and growth
• Include remote work experience if relevant
• Highlight cross-functional collaboration

What's your experience level? I can provide more targeted guidance.`,
    category: 'resume',
    confidence: 0.9,
    tags: ['experience', 'entry-level', 'career-gaps', 'formatting'],
    followUpQuestions: [
      "How many years of experience do you have?",
      "Are you dealing with employment gaps?",
      "What industry are you targeting?"
    ],
    relatedTopics: ['interview-prep', 'career-change', 'skills-development'],
    difficulty: 'intermediate'
  },

  // Interview Related - Enhanced
  {
    id: 'interview-prep',
    keywords: ['interview', 'interview tips', 'job interview', 'interview preparation', 'interview anxiety', 'virtual interview'],
    response: `Your complete interview preparation roadmap:

**🔍 Pre-Interview Research (48-72 hours before)**
• Company deep dive: Mission, values, recent news, competitors
• Role analysis: Job description keywords, required skills, team structure
• Interviewer research: LinkedIn profiles, background, shared connections
• Industry trends: Current challenges and opportunities

**🎯 Content Preparation**
• Master the STAR method: Situation → Task → Action → Result
• Prepare 5-7 compelling stories showcasing different skills
• Practice your 60-second elevator pitch
• Develop thoughtful questions that show genuine interest

**💪 Common Question Categories**
• Behavioral: "Tell me about a time when..."
• Situational: "How would you handle..."
• Technical: Role-specific skills and knowledge
• Cultural fit: Values alignment and team dynamics

**🎭 Practice & Mock Interviews**
• Record yourself answering questions
• Practice with friends or mentors
• Use online platforms for mock interviews
• Work on body language and vocal delivery

**📱 Virtual Interview Mastery**
• Test technology 30 minutes before
• Ensure good lighting and professional background
• Maintain eye contact with camera, not screen
• Have backup communication method ready

**🧘 Managing Interview Anxiety**
• Arrive 10-15 minutes early (or log in early for virtual)
• Practice deep breathing techniques
• Prepare for unexpected questions with bridging phrases
• Remember: They already like your resume!

**👔 Professional Presentation**
• Dress one level above company dress code
• Bring multiple copies of your resume
• Prepare a portfolio of your work if relevant
• Have references ready (but don't offer unless asked)

What type of interview are you preparing for? I can provide more specific strategies.`,
    category: 'interview',
    confidence: 0.95,
    tags: ['preparation', 'anxiety', 'virtual', 'behavioral', 'research'],
    followUpQuestions: [
      "What type of interview is it (phone, video, in-person, panel)?",
      "What's the role and industry?",
      "How much time do you have to prepare?"
    ],
    relatedTopics: ['salary-negotiation', 'follow-up', 'job-search'],
    difficulty: 'intermediate'
  },
  {
    id: 'interview-questions',
    keywords: ['interview questions', 'common questions', 'behavioral questions'],
    response: `Common interview questions and how to approach them:

**"Tell me about yourself"**: 2-minute professional summary focusing on relevant experience
**"Why this company?"**: Show research, align values, mention specific aspects that attract you
**"Strengths/Weaknesses"**: Real strengths with examples, weakness that you're actively improving
**Behavioral**: Use STAR method - specific examples showing problem-solving and results

Would you like help preparing answers for any specific questions?`,
    category: 'interview',
    confidence: 0.85,
    tags: ['questions', 'behavioral', 'preparation'],
    followUpQuestions: [
      "What type of interview questions are you most concerned about?",
      "Do you have specific examples you'd like help structuring?"
    ],
    relatedTopics: ['interview-prep', 'resume', 'confidence'],
    difficulty: 'beginner'
  },

  // Job Search
  {
    id: 'job-search-strategy',
    keywords: ['job search', 'find job', 'looking for job', 'job hunting'],
    response: `Effective job search strategy:

**Online Platforms**: LinkedIn, Indeed, company websites, industry-specific boards
**Networking**: Reach out to connections, attend industry events, join professional groups
**Applications**: Tailor resume/cover letter for each role, follow up after 1-2 weeks
**Organization**: Track applications, set daily/weekly goals, maintain consistent schedule

What industry or role type are you targeting? I can suggest specific resources.`,
    category: 'job-search',
    confidence: 0.9,
    tags: ['strategy', 'platforms', 'networking', 'applications'],
    followUpQuestions: [
      "What industry are you targeting?",
      "How long have you been job searching?",
      "What's your biggest challenge in the job search?"
    ],
    relatedTopics: ['resume', 'interview-prep', 'networking'],
    difficulty: 'beginner'
  },

  // Salary & Negotiation
  {
    id: 'salary-negotiation',
    keywords: ['salary', 'negotiate salary', 'pay negotiation', 'salary range'],
    response: `Salary negotiation tips:

**Research**: Use Glassdoor, PayScale, industry reports to know market rates
**Timing**: Wait for offer before discussing salary, never negotiate during first interview
**Approach**: Express enthusiasm first, then discuss compensation professionally
**Total Package**: Consider benefits, PTO, flexible work, professional development
**Practice**: Role-play the conversation, prepare your value proposition

Do you have a specific offer to negotiate, or are you preparing for future discussions?`,
    category: 'salary',
    confidence: 0.85,
    tags: ['negotiation', 'research', 'timing', 'benefits'],
    followUpQuestions: [
      "Do you have a current offer to negotiate?",
      "What's your target salary range?",
      "Have you researched market rates for your role?"
    ],
    relatedTopics: ['interview-prep', 'job-search', 'performance-review'],
    difficulty: 'intermediate'
  },

  // Skills Development
  {
    id: 'skill-development',
    keywords: ['skills', 'learn skills', 'skill development', 'upskill', 'reskill'],
    response: `Skill development strategies:

**Identify Gaps**: Review job postings in your field, note required skills you lack
**Learning Platforms**: Coursera, LinkedIn Learning, Udemy, free resources like Khan Academy
**Practice**: Build portfolio projects, contribute to open source, volunteer opportunities
**Certifications**: Industry-recognized credentials (Google, Microsoft, AWS, etc.)
**Networking**: Join professional communities, attend workshops, find mentors

What specific skills are you looking to develop? I can suggest targeted resources.`,
    category: 'skills',
    confidence: 0.8,
    tags: ['learning', 'development', 'certifications', 'upskilling'],
    followUpQuestions: [
      "What specific skills do you want to develop?",
      "What's your preferred learning style?",
      "How much time can you dedicate to learning?"
    ],
    relatedTopics: ['career-planning', 'job-search', 'career-change'],
    difficulty: 'beginner'
  },

  // Career Change
  {
    id: 'career-change',
    keywords: ['career change', 'switch careers', 'new career', 'career transition'],
    response: `Career transition guidance:

**Self-Assessment**: Identify transferable skills, values, interests, and motivations for change
**Research**: Explore new field requirements, growth prospects, salary expectations
**Bridge Building**: Find connections between current and target roles
**Gradual Transition**: Consider part-time, freelance, or volunteer work in new field first
**Network**: Connect with professionals in target industry, conduct informational interviews

What field are you considering transitioning to? I can help create a transition plan.`,
    category: 'career-change',
    confidence: 0.85,
    tags: ['transition', 'assessment', 'planning', 'skills-transfer'],
    followUpQuestions: [
      "What field are you considering transitioning to?",
      "What's motivating this career change?",
      "What transferable skills do you have?"
    ],
    relatedTopics: ['skills-development', 'networking', 'resume'],
    difficulty: 'intermediate'
  },

  // Workplace Issues
  {
    id: 'workplace-conflict',
    keywords: ['workplace conflict', 'difficult boss', 'work problems', 'office politics'],
    response: `Handling workplace challenges:

**Communication**: Address issues directly but professionally, document important conversations
**Boundaries**: Set clear expectations, learn to say no diplomatically
**Support**: Build relationships with colleagues, seek mentorship, use HR when appropriate
**Self-Care**: Maintain work-life balance, manage stress, consider if environment is right fit
**Solutions**: Focus on problem-solving rather than blame, suggest improvements

What specific workplace challenge are you facing? I can provide more targeted advice.`,
    category: 'workplace',
    confidence: 0.8,
    tags: ['conflict', 'communication', 'boundaries', 'solutions'],
    followUpQuestions: [
      "What specific workplace challenge are you facing?",
      "How long has this been an issue?",
      "Have you tried addressing it directly?"
    ],
    relatedTopics: ['leadership', 'communication', 'career-planning'],
    difficulty: 'intermediate'
  },

  // Advanced Career Planning & Leadership
  {
    id: 'career-planning',
    keywords: ['career goals', 'career planning', 'career path', 'professional development', 'career roadmap'],
    response: `Your strategic career planning framework:

**🎯 Vision & Goal Architecture**
• Define your North Star: What does success look like in 10 years?
• Set SMART goals: Specific, Measurable, Achievable, Relevant, Time-bound
• Create milestone markers: 6-month, 1-year, 3-year, 5-year checkpoints
• Align personal values with professional aspirations

**📊 Skills & Competency Mapping**
• Current state analysis: What are your core strengths?
• Future state requirements: What skills will you need?
• Gap analysis: Identify development priorities
• Create a learning roadmap with specific resources and timelines

**🌐 Strategic Network Development**
• Build relationships across industries and functions
• Seek mentors (guidance), sponsors (advocacy), and peers (support)
• Engage in professional associations and industry events
• Maintain relationships through regular, valuable touchpoints

**📈 Performance & Visibility Strategy**
• Excel in current role while building next-level capabilities
• Seek stretch assignments and cross-functional projects
• Document and communicate your achievements
• Build your personal brand and thought leadership

**🔄 Adaptability & Future-Proofing**
• Stay informed about industry trends and disruptions
• Develop transferable skills that transcend roles
• Build resilience and change management capabilities
• Maintain multiple career scenario plans

**💡 Advanced Career Strategies**
• Consider lateral moves for skill diversification
• Explore entrepreneurial opportunities within your field
• Build expertise in emerging technologies or methodologies
• Develop leadership and people management skills

Where are you in your career journey? I can help create a personalized development blueprint.`,
    category: 'general',
    confidence: 0.9,
    tags: ['planning', 'goals', 'strategy', 'leadership', 'development'],
    followUpQuestions: [
      "What's your current career level?",
      "What industry or function interests you most?",
      "What are your biggest career challenges right now?"
    ],
    relatedTopics: ['leadership', 'networking', 'skills-development'],
    difficulty: 'advanced'
  },

  // Networking & Relationship Building
  {
    id: 'networking-strategy',
    keywords: ['networking', 'professional network', 'linkedin', 'relationship building', 'connections'],
    response: `Master the art of strategic networking:

**🎯 Networking Mindset Shift**
• Focus on giving value, not just receiving
• Build genuine relationships, not transactional connections
• Quality over quantity: 50 strong connections > 500 weak ones
• Think long-term: Today's peer is tomorrow's decision-maker

**💼 LinkedIn Optimization**
• Professional headline that showcases your value proposition
• Summary that tells your career story and future aspirations
• Regular content sharing and thoughtful commenting
• Strategic connection requests with personalized messages

**🤝 Relationship Building Strategies**
• Attend industry events, conferences, and meetups
• Join professional associations and volunteer for committees
• Participate in online communities and forums
• Offer help and expertise to others in your network

**📞 Effective Outreach Techniques**
• Warm introductions through mutual connections
• Informational interviews to learn and build relationships
• Follow up consistently but not aggressively
• Share relevant opportunities and insights with your network

**🎪 Event Networking Mastery**
• Research attendees and speakers beforehand
• Prepare your elevator pitch and conversation starters
• Focus on meaningful conversations over collecting business cards
• Follow up within 48 hours with personalized messages

**🔄 Network Maintenance**
• Regular check-ins with key connections
• Share congratulations on achievements and milestones
• Provide introductions and referrals when appropriate
• Maintain visibility through social media and content sharing

Ready to build your networking strategy?`,
    category: 'networking',
    confidence: 0.85,
    tags: ['linkedin', 'relationships', 'events', 'outreach'],
    followUpQuestions: [
      "What's your current networking comfort level?",
      "Which platforms do you use for professional networking?",
      "What industry events are available in your area?"
    ],
    relatedTopics: ['job-search', 'career-change', 'leadership'],
    difficulty: 'intermediate'
  },

  // Leadership Development
  {
    id: 'leadership-development',
    keywords: ['leadership', 'management', 'team lead', 'leadership skills', 'executive presence'],
    response: `Develop your leadership capabilities:

**🎯 Leadership Foundations**
• Self-awareness: Understand your leadership style and impact
• Emotional intelligence: Manage emotions and read others effectively
• Communication: Master clear, inspiring, and inclusive communication
• Decision-making: Balance data, intuition, and stakeholder input

**👥 People Leadership**
• Build trust through consistency and transparency
• Develop others through coaching and mentoring
• Create psychological safety for innovation and risk-taking
• Manage performance with empathy and accountability

**🚀 Strategic Leadership**
• Think systems-level: Understand interconnections and dependencies
• Vision creation: Paint compelling pictures of the future
• Change management: Lead transformation with confidence
• Innovation mindset: Foster creativity and continuous improvement

**💼 Executive Presence**
• Confident communication in all settings
• Professional appearance and demeanor
• Gravitas: Command respect through competence and character
• Influence without authority: Persuade and inspire others

**📈 Leadership Development Path**
• Seek leadership opportunities in current role
• Find mentors and sponsors who can guide your growth
• Invest in leadership training and development programs
• Practice leadership skills in volunteer or community settings

**🔄 Continuous Growth**
• Regular 360-degree feedback collection
• Stay current with leadership trends and research
• Build diverse teams and inclusive environments
• Measure and improve your leadership effectiveness

What leadership challenges are you facing?`,
    category: 'leadership',
    confidence: 0.88,
    tags: ['management', 'influence', 'development', 'presence'],
    followUpQuestions: [
      "What's your current leadership experience?",
      "What leadership challenges are you facing?",
      "Are you managing people or leading projects?"
    ],
    relatedTopics: ['career-planning', 'networking', 'workplace'],
    difficulty: 'advanced'
  },

  // Salary Negotiation - Enhanced
  {
    id: 'salary-negotiation-advanced',
    keywords: ['salary negotiation', 'negotiate salary', 'pay raise', 'compensation', 'salary increase', 'underpaid'],
    response: `Master salary negotiation with this comprehensive strategy:

**🔍 Market Research & Preparation**
• Use multiple sources: Glassdoor, PayScale, Levels.fyi, industry reports
• Factor in location, company size, and industry variations
• Document your achievements and quantifiable contributions
• Research the company's financial health and compensation philosophy

**⏰ Timing Strategy**
• Best times: After successful project completion, during performance reviews, or job offer stage
• Avoid: During company layoffs, budget cuts, or your manager's stressful periods
• Give adequate notice: "I'd like to discuss my compensation in our next 1:1"

**💬 Negotiation Framework**
• Start with gratitude and enthusiasm for your role
• Present your case with data: market rates + your unique value
• Use ranges, not single numbers: "Based on my research, similar roles pay $X-Y"
• Focus on total compensation: salary, benefits, equity, PTO, development budget

**🎯 Advanced Negotiation Tactics**
• Anchor high but reasonably: Start 10-20% above your target
• Use the "flinch" technique: Pause after their initial offer
• Bundle requests: If salary is fixed, negotiate other benefits
• Create win-win scenarios: Tie increases to specific performance metrics

**📋 Beyond Base Salary**
• Signing bonus to bridge salary gaps
• Additional PTO or flexible work arrangements
• Professional development budget
• Stock options or equity participation
• Title changes that support future growth

**🚫 Common Mistakes to Avoid**
• Don't make it personal or emotional
• Avoid ultimatums unless you're prepared to leave
• Don't negotiate via email for complex discussions
• Never lie about competing offers
• Don't accept immediately - ask for time to consider

**📝 Documentation & Follow-up**
• Get agreements in writing
• Clarify implementation timeline
• Set up regular compensation review schedule
• Continue delivering exceptional performance

Ready to plan your negotiation strategy?`,
    category: 'salary',
    confidence: 0.92,
    tags: ['negotiation', 'compensation', 'research', 'strategy'],
    followUpQuestions: [
      "What's your current salary situation?",
      "Do you have a specific number in mind?",
      "When are you planning to have this conversation?"
    ],
    relatedTopics: ['interview-prep', 'performance-review', 'job-search'],
    difficulty: 'advanced'
  },

  // Remote Work & Future of Work
  {
    id: 'remote-work-strategy',
    keywords: ['remote work', 'work from home', 'virtual team', 'digital nomad', 'hybrid work', 'flexible work'],
    response: `Navigate the future of work with remote success strategies:

**🏠 Remote Work Excellence**
• Create a dedicated workspace with proper ergonomics
• Establish clear boundaries between work and personal time
• Invest in quality technology: reliable internet, good camera, noise-canceling headphones
• Develop strong written communication skills

**📅 Time Management & Productivity**
• Use time-blocking techniques for focused work
• Leverage productivity tools: Notion, Todoist, RescueTime
• Establish consistent daily routines and rituals
• Take regular breaks and maintain work-life balance

**🤝 Virtual Collaboration Mastery**
• Master video conferencing etiquette and tools
• Use collaborative platforms effectively: Slack, Microsoft Teams, Asana
• Schedule regular check-ins with team members
• Participate actively in virtual meetings and team building

**🌐 Building Remote Relationships**
• Overcommunicate to compensate for lack of face-to-face interaction
• Schedule virtual coffee chats and informal conversations
• Participate in online team events and company culture initiatives
• Be proactive in reaching out to colleagues

**📈 Career Advancement Remotely**
• Maintain high visibility through regular updates and achievements
• Seek out stretch assignments and cross-functional projects
• Build relationships with stakeholders across the organization
• Document your contributions and impact clearly

**🎯 Remote Job Search Strategy**
• Target companies with strong remote culture
• Highlight your remote work experience and self-management skills
• Prepare for virtual interviews with proper setup and practice
• Research company's remote work policies and culture

**🔮 Future-Proofing Your Career**
• Develop digital-first skills and comfort with technology
• Build a strong online professional presence
• Stay current with remote work trends and tools
• Consider location-independent career paths

What aspect of remote work would you like to explore further?`,
    category: 'workplace',
    confidence: 0.87,
    tags: ['remote', 'productivity', 'collaboration', 'future-work'],
    followUpQuestions: [
      "Are you currently working remotely or looking to transition?",
      "What remote work challenges are you facing?",
      "What tools are you currently using for remote work?"
    ],
    relatedTopics: ['productivity', 'technology', 'work-life-balance'],
    difficulty: 'intermediate'
  },

  // Personal Branding & Online Presence
  {
    id: 'personal-branding',
    keywords: ['personal brand', 'online presence', 'professional image', 'thought leadership', 'social media'],
    response: `Build a powerful personal brand that accelerates your career:

**🎯 Brand Foundation & Strategy**
• Define your unique value proposition: What makes you different?
• Identify your target audience: Who needs to know about you?
• Craft your brand message: What do you want to be known for?
• Align your brand with your career goals and values

**💼 LinkedIn Optimization**
• Professional headline that showcases your value (not just job title)
• Compelling summary that tells your career story
• Regular content sharing: Industry insights, lessons learned, achievements
• Engage meaningfully with others' content through thoughtful comments

**📝 Content Creation Strategy**
• Share your expertise through articles, posts, and videos
• Document your learning journey and professional insights
• Participate in industry conversations and trending topics
• Create valuable content that helps others in your field

**🌐 Multi-Platform Presence**
• Choose platforms where your audience is active
• Maintain consistency in messaging across all platforms
• Consider industry-specific platforms (GitHub for developers, Behance for designers)
• Build a professional website or portfolio if relevant

**🎤 Thought Leadership Development**
• Speak at industry events, webinars, and conferences
• Write guest articles for industry publications
• Participate in podcasts and panel discussions
• Share unique perspectives and insights from your experience

**📊 Brand Monitoring & Management**
• Google yourself regularly to monitor your online presence
• Set up Google Alerts for your name and key topics
• Respond professionally to any negative feedback
• Continuously refine and evolve your brand message

**🤝 Networking Through Brand Building**
• Use your brand to attract like-minded professionals
• Engage with industry leaders and influencers
• Build relationships through valuable content and interactions
• Leverage your brand for speaking and collaboration opportunities

**📈 Measuring Brand Impact**
• Track engagement metrics on your content
• Monitor profile views and connection requests
• Measure speaking opportunities and media mentions
• Assess career opportunities that come through your brand

Ready to build your professional brand strategy?`,
    category: 'networking',
    confidence: 0.89,
    tags: ['branding', 'linkedin', 'content', 'thought-leadership'],
    followUpQuestions: [
      "What do you want to be known for professionally?",
      "Which platforms are you currently active on?",
      "What expertise or insights do you have to share?"
    ],
    relatedTopics: ['networking', 'linkedin', 'career-planning'],
    difficulty: 'intermediate'
  }
];

// Non-career response for off-topic questions
const NON_CAREER_RESPONSE = `I'm a career counselor AI designed to help with professional development and job-related questions. I can assist with:

• Job searching and applications
• Resume and interview preparation  
• Career planning and transitions
• Skill development and training
• Workplace challenges and advice
• Salary negotiation and benefits

How can I help you with your career goals today?`;

// Simplified matching algorithm - prioritize AI responses over common responses
export function findBestCareerResponse(userMessage: string): {
  response: string;
  isCommonResponse: boolean;
  category?: string;
  confidence?: number;
  followUpQuestions?: string[];
  relatedTopics?: string[];
} {
  const message = userMessage.toLowerCase().trim();

  // Check for non-career topics first
  const careerKeywords = [
    'job', 'career', 'work', 'resume', 'cv', 'interview', 'salary', 'skill', 'professional',
    'employment', 'workplace', 'boss', 'company', 'application', 'promotion', 'manager',
    'leadership', 'networking', 'linkedin', 'portfolio', 'experience', 'qualification',
    'training', 'development', 'growth', 'opportunity', 'position', 'role', 'industry',
    // Tech and job titles
    'developer', 'engineer', 'programmer', 'analyst', 'consultant', 'designer', 'architect',
    'it', 'tech', 'software', 'full stack', 'frontend', 'backend', 'devops', 'data scientist',
    'project manager', 'product manager', 'marketing', 'sales', 'hr', 'finance', 'accounting',
    // Experience and skills
    'years', 'year', 'months', 'fresher', 'junior', 'senior', 'lead', 'principal', 'director',
    'skills', 'technologies', 'programming', 'coding', 'languages', 'frameworks',
    // Job search related
    'hiring', 'recruitment', 'apply', 'application', 'candidate', 'employer', 'recruiter'
  ];

  const hasCareerKeywords = careerKeywords.some(keyword => message.includes(keyword));

  if (!hasCareerKeywords) {
    return { response: NON_CAREER_RESPONSE, isCommonResponse: true };
  }

  // Only use common responses for very specific, exact phrase matches
  const exactMatches = [
    { phrases: ['resume tips', 'how to write resume', 'resume help'], responseId: 'resume-basics' },
    { phrases: ['interview tips', 'interview help', 'interview preparation'], responseId: 'interview-prep' },
    { phrases: ['job search tips', 'how to find job', 'job hunting'], responseId: 'job-search-strategy' },
    { phrases: ['salary negotiation', 'negotiate salary'], responseId: 'salary-negotiation' },
  ];

  // Check for exact phrase matches only
  for (const match of exactMatches) {
    for (const phrase of match.phrases) {
      if (message.includes(phrase)) {
        const response = COMMON_CAREER_RESPONSES.find(r => r.id === match.responseId);
        if (response) {
          return {
            response: response.response,
            isCommonResponse: true,
            category: response.category,
            confidence: response.confidence,
            followUpQuestions: response.followUpQuestions,
            relatedTopics: response.relatedTopics
          };
        }
      }
    }
  }

  // For all other career-related questions, use AI
  return { response: '', isCommonResponse: false };
}

// Advanced analytics and personalization
export function analyzeUserIntent(message: string): {
  intent: 'question' | 'request' | 'problem' | 'goal';
  urgency: 'low' | 'medium' | 'high';
  experience_level: 'beginner' | 'intermediate' | 'advanced' | 'unknown';
  emotional_state: 'positive' | 'neutral' | 'negative';
} {
  const msg = message.toLowerCase();

  // Intent analysis
  let intent: 'question' | 'request' | 'problem' | 'goal' = 'question';
  if (msg.includes('help me') || msg.includes('can you') || msg.includes('please')) {
    intent = 'request';
  } else if (msg.includes('problem') || msg.includes('issue') || msg.includes('stuck')) {
    intent = 'problem';
  } else if (msg.includes('want to') || msg.includes('goal') || msg.includes('achieve')) {
    intent = 'goal';
  }

  // Urgency analysis
  let urgency: 'low' | 'medium' | 'high' = 'low';
  if (msg.includes('urgent') || msg.includes('asap') || msg.includes('immediately')) {
    urgency = 'high';
  } else if (msg.includes('soon') || msg.includes('quickly') || msg.includes('help')) {
    urgency = 'medium';
  }

  // Experience level analysis
  let experience_level: 'beginner' | 'intermediate' | 'advanced' | 'unknown' = 'unknown';
  if (msg.includes('new') || msg.includes('beginner') || msg.includes('first time') || msg.includes('never')) {
    experience_level = 'beginner';
  } else if (msg.includes('senior') || msg.includes('advanced') || msg.includes('executive') || msg.includes('years of experience')) {
    experience_level = 'advanced';
  } else if (msg.includes('some experience') || msg.includes('intermediate')) {
    experience_level = 'intermediate';
  }

  // Emotional state analysis
  let emotional_state: 'positive' | 'neutral' | 'negative' = 'neutral';
  const positiveWords = ['excited', 'happy', 'love', 'great', 'awesome', 'perfect'];
  const negativeWords = ['frustrated', 'worried', 'anxious', 'difficult', 'struggling', 'hate', 'terrible'];

  if (positiveWords.some(word => msg.includes(word))) {
    emotional_state = 'positive';
  } else if (negativeWords.some(word => msg.includes(word))) {
    emotional_state = 'negative';
  }

  return { intent, urgency, experience_level, emotional_state };
}

// Get response statistics for analytics
export function getResponseStats() {
  const categories = COMMON_CAREER_RESPONSES.reduce((acc, response) => {
    acc[response.category] = (acc[response.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalResponses: COMMON_CAREER_RESPONSES.length,
    categories,
    averageConfidence: COMMON_CAREER_RESPONSES.reduce((sum, r) => sum + r.confidence, 0) / COMMON_CAREER_RESPONSES.length
  };
}