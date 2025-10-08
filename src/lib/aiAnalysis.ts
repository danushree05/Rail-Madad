import { departments } from './mockData';

const categoryKeywords: Record<string, string[]> = {
  'Cleanliness': ['dirty', 'clean', 'toilet', 'washroom', 'garbage', 'trash', 'smell', 'hygiene', 'sanitation'],
  'Infrastructure': ['broken', 'damage', 'crack', 'repair', 'window', 'door', 'seat', 'berth', 'wall'],
  'Safety & Security': ['fire', 'smoke', 'theft', 'danger', 'emergency', 'accident', 'unsafe', 'security'],
  'Staff Behavior': ['rude', 'staff', 'conductor', 'employee', 'behavior', 'service', 'unprofessional'],
  'Food & Catering': ['food', 'meal', 'pantry', 'catering', 'water', 'quality', 'expired', 'taste'],
  'Electrical & AC': ['ac', 'air conditioning', 'fan', 'light', 'electrical', 'power', 'charging', 'socket'],
  'Other': []
};

const urgencyKeywords = {
  high: ['fire', 'emergency', 'danger', 'urgent', 'critical', 'immediate', 'serious', 'severe', 'accident', 'injury', 'theft', 'unsafe'],
  medium: ['broken', 'damage', 'repair', 'not working', 'problem', 'issue'],
  low: ['dirty', 'clean', 'minor', 'request', 'suggestion', 'improvement']
};

export function analyzeComplaint(title: string, description: string, mediaCount: number) {
  const text = `${title} ${description}`.toLowerCase();

  let detectedCategory = 'Other';
  let maxScore = 0;

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (category === 'Other') continue;

    const score = keywords.filter(keyword => text.includes(keyword)).length;
    if (score > maxScore) {
      maxScore = score;
      detectedCategory = category;
    }
  }

  let urgencyLevel: 'High' | 'Medium' | 'Low' = 'Medium';
  let urgencyScore = 0.5;

  const highCount = urgencyKeywords.high.filter(k => text.includes(k)).length;
  const lowCount = urgencyKeywords.low.filter(k => text.includes(k)).length;

  if (highCount > 0) {
    urgencyLevel = 'High';
    urgencyScore = 0.8 + (Math.min(highCount, 3) * 0.05);
  } else if (lowCount > 0) {
    urgencyLevel = 'Low';
    urgencyScore = 0.2 + (lowCount * 0.05);
  } else {
    urgencyLevel = 'Medium';
    urgencyScore = 0.5;
  }

  if (mediaCount > 0) {
    urgencyScore = Math.min(urgencyScore + 0.1, 1);
  }

  const department = departments.find(d => d.name === detectedCategory);

  return {
    category: detectedCategory,
    urgencyLevel,
    urgencyScore: Math.round(urgencyScore * 100) / 100,
    departmentId: department?.id,
    aiAnalysis: {
      detectedObjects: mediaCount > 0 ? ['image_uploaded'] : [],
      confidence: maxScore > 0 ? Math.min(0.6 + (maxScore * 0.1), 0.95) : 0.5,
      reasoning: `Categorized as ${detectedCategory} based on content analysis. Urgency set to ${urgencyLevel} based on severity indicators.`
    }
  };
}

export function analyzeSentiment(text: string) {
  const lowerText = text.toLowerCase();

  const positiveWords = ['good', 'great', 'excellent', 'satisfied', 'happy', 'thanks', 'appreciate', 'helpful'];
  const negativeWords = ['bad', 'poor', 'terrible', 'disappointed', 'unhappy', 'worse', 'awful', 'useless'];

  const positiveCount = positiveWords.filter(w => lowerText.includes(w)).length;
  const negativeCount = negativeWords.filter(w => lowerText.includes(w)).length;

  if (positiveCount > negativeCount) {
    return { sentiment: 'positive' as const, score: 0.7 + (positiveCount * 0.1) };
  } else if (negativeCount > positiveCount) {
    return { sentiment: 'negative' as const, score: 0.7 + (negativeCount * 0.1) };
  }

  return { sentiment: 'neutral' as const, score: 0.5 };
}

export function generateChatbotResponse(message: string, context: { hasComplaint?: boolean }): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return 'Hello! I\'m your Rail Madad AI assistant. I can help you file complaints, check status, or answer questions. How can I assist you today?';
  }

  if (lowerMessage.includes('status') || lowerMessage.includes('track')) {
    return 'You can track your complaint status in the "My Complaints" section. Each complaint has a unique ID and real-time status updates.';
  }

  if (lowerMessage.includes('urgent') || lowerMessage.includes('emergency')) {
    return 'For urgent or emergency situations, please contact railway security immediately. You can also file a high-priority complaint through our system for faster routing.';
  }

  if (lowerMessage.includes('complaint') || lowerMessage.includes('issue') || lowerMessage.includes('problem')) {
    return 'I can help you file a complaint. Please click on "New Complaint" and provide details including photos or videos if available. Our AI will automatically categorize and prioritize your complaint.';
  }

  if (context.hasComplaint) {
    return 'Your complaint has been received and analyzed by our AI system. It has been automatically categorized and assigned to the appropriate department. You will receive updates as it progresses.';
  }

  return 'I\'m here to help! You can ask me about filing complaints, checking status, or any railway service issues. What would you like to know?';
}
