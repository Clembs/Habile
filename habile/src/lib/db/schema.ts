import { jsonb, pgTable, text, integer, real, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  tokens: real('tokens').notNull().default(0),
  used: real('used').notNull().default(0),
  messagesSent: integer('messages_sent').notNull().default(0),
  knowledge: text('knowledge').notNull().default(''),
  dismissedUsageBanner: boolean('dismissed_usage_banner').notNull().default(false),
  lastMessages: jsonb('last_messages').$type<
    {
      id: string;
      userId: string;
      content: string;
    }[]
  >(),
});

export const habileChatData = pgTable('habile_chat_data', {
  tokens: real('tokens').notNull(),
  used: real('used').notNull(),
  messages: integer('messages').notNull(),
});
