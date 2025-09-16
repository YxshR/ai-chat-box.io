import { Message } from '@/lib/types';

export function generateSmartTitle(messages: Message[]): string {
  if (!messages || messages.length === 0) {
    return 'New Chat';
  }

  // Get the first user message
  const firstUserMessage = messages.find(msg => msg.role === 'user');
  
  if (!firstUserMessage) {
    return 'New Chat';
  }

  // Extract key words from the first message
  const content = firstUserMessage.content.toLowerCase();
  const words = content.split(/\s+/).filter(word => word.length > 3);
  
  // Common patterns for chat titles
  if (content.includes('help') || content.includes('how')) {
    return 'Help Request';
  }
  
  if (content.includes('code') || content.includes('programming')) {
    return 'Code Discussion';
  }
  
  if (content.includes('explain') || content.includes('what is')) {
    return 'Explanation';
  }
  
  if (content.includes('create') || content.includes('build')) {
    return 'Project Creation';
  }
  
  // Use first few meaningful words
  const meaningfulWords = words.slice(0, 3);
  if (meaningfulWords.length > 0) {
    return meaningfulWords
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  // Fallback to truncated first message
  return firstUserMessage.content.length > 30 
    ? firstUserMessage.content.substring(0, 30) + '...'
    : firstUserMessage.content;
}