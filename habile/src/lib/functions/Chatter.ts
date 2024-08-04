export type ChatterMessage = {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  /**
   * Base 64 encoded strings
   */
  images?: string[];
  tool_calls?: string[];
};

export type CompletionResponse = {
  model: string;
  created_at: string;
  message: ChatterMessage;
  done: boolean;
  total_duration: number;
  load_duration: number;
  prompt_eval_count: number;
  prompt_eval_duration: number;
  eval_count: number;
  eval_duration: number;
};

export class Chatter {
  private baseUrl = 'http://localhost:11434/api';

  constructor(public model: 'Habile') {}

  async generateCompletion({ messages }: { messages: ChatterMessage[] }) {
    const req = await fetch(`${this.baseUrl}/chat`, {
      method: 'POST',
      body: JSON.stringify({
        model: 'Habile',
        messages,
        stream: false,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const res = await req.json();

    console.log(res);

    return res as Promise<CompletionResponse>;
  }
}
