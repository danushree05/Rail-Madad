export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  contactEmail: string;
}

export interface Complaint {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  urgencyLevel: 'High' | 'Medium' | 'Low';
  urgencyScore: number;
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  mediaUrls: string[];
  extractedText?: string;
  metadata: {
    location?: string;
    trainNumber?: string;
    coachNumber?: string;
  };
  departmentId?: string;
  assignedTo?: string;
  aiAnalysis: {
    detectedObjects?: string[];
    confidence?: number;
    reasoning?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export interface Feedback {
  id: string;
  complaintId: string;
  userId: string;
  rating: number;
  comment?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  sentimentScore?: number;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  complaintId?: string;
  userId: string;
  message: string;
  senderType: 'user' | 'bot';
  createdAt: Date;
}

export interface AnalyticsMetrics {
  totalComplaints: number;
  byCategory: Record<string, number>;
  byUrgency: Record<string, number>;
  byStatus: Record<string, number>;
  avgResolutionTime: number;
  avgSatisfactionRating: number;
  sentimentDistribution: Record<string, number>;
}
