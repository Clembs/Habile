export type UserData = {
  spent: number;
  messages: { id: string; content: string; userId?: string }[];
  dismissedUsageBanner?: boolean;
  knowledge?: string;
};

export type GlobalUsage = {
  used: number;
  total: number;
};
