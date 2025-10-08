import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Complaint, Feedback, ChatMessage } from '../types';
import { analyzeComplaint, analyzeSentiment } from '../lib/aiAnalysis';

interface DataContextType {
  complaints: Complaint[];
  feedback: Feedback[];
  chatMessages: ChatMessage[];
  createComplaint: (data: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'category' | 'urgencyLevel' | 'urgencyScore' | 'departmentId' | 'aiAnalysis'>) => Promise<Complaint>;
  updateComplaint: (id: string, updates: Partial<Complaint>) => void;
  createFeedback: (data: Omit<Feedback, 'id' | 'createdAt' | 'sentiment' | 'sentimentScore'>) => void;
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'createdAt'>) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const savedComplaints = localStorage.getItem('complaints');
    const savedFeedback = localStorage.getItem('feedback');
    const savedMessages = localStorage.getItem('chatMessages');

    if (savedComplaints) setComplaints(JSON.parse(savedComplaints));
    if (savedFeedback) setFeedback(JSON.parse(savedFeedback));
    if (savedMessages) setChatMessages(JSON.parse(savedMessages));
  }, []);

  useEffect(() => {
    localStorage.setItem('complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('feedback', JSON.stringify(feedback));
  }, [feedback]);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  const createComplaint = async (data: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'category' | 'urgencyLevel' | 'urgencyScore' | 'departmentId' | 'aiAnalysis'>): Promise<Complaint> => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const analysis = analyzeComplaint(data.title, data.description, data.mediaUrls.length);

    const newComplaint: Complaint = {
      ...data,
      id: `complaint-${Date.now()}`,
      ...analysis,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setComplaints(prev => [newComplaint, ...prev]);
    return newComplaint;
  };

  const updateComplaint = (id: string, updates: Partial<Complaint>) => {
    setComplaints(prev => prev.map(c =>
      c.id === id
        ? { ...c, ...updates, updatedAt: new Date() }
        : c
    ));
  };

  const createFeedback = (data: Omit<Feedback, 'id' | 'createdAt' | 'sentiment' | 'sentimentScore'>) => {
    const sentimentAnalysis = data.comment ? analyzeSentiment(data.comment) : null;

    const newFeedback: Feedback = {
      ...data,
      id: `feedback-${Date.now()}`,
      sentiment: sentimentAnalysis?.sentiment,
      sentimentScore: sentimentAnalysis?.score,
      createdAt: new Date()
    };

    setFeedback(prev => [...prev, newFeedback]);
  };

  const addChatMessage = (message: Omit<ChatMessage, 'id' | 'createdAt'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg-${Date.now()}`,
      createdAt: new Date()
    };

    setChatMessages(prev => [...prev, newMessage]);
  };

  return (
    <DataContext.Provider value={{
      complaints,
      feedback,
      chatMessages,
      createComplaint,
      updateComplaint,
      createFeedback,
      addChatMessage
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
