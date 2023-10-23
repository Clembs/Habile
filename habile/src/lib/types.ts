import { ChatCompletion } from '@paperdave/openai';

export type UserData = {
  tokens: number;
  used: number;
  messagesSent: number;
  knowledge: string;
  dismissedUsageBanner: boolean;
  paymentType: 'worldwide' | 'russia';
  lastMessages: {
    id: string;
    userId: string;
    content: string;
  }[];
  // spent: number;
  // messages: { id: string; content: string; userId?: string }[];
  // dismissedUsageBanner?: boolean;
  // knowledge?: string;
  // messagesUntilKnowledge?: number;
};

export type GlobalUsage = {
  used: number;
  total: number;
};

export type APIUseResponse = {
  completion: ChatCompletion;
  userData: UserData;
};
