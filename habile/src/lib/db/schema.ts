import { relations } from 'drizzle-orm';
import { pgTable, text, integer, real, boolean, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  tokensUsed: real('tokens_used').notNull().default(0),
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
  partyId: text('party_id').references(() => parties.id),
});

export const usersRelations = relations(users, ({ one }) => ({
  party: one(parties, {
    fields: [users.partyId],
    references: [parties.id],
  }),
}));

export const parties = pgTable('parties', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  color: integer('color').notNull(),
  joinType: text('join_type', {
    enum: ['open', 'request', 'invite'],
  }).notNull(),
  leaderId: text('leader_id').notNull(),
});

export const partiesRelations = relations(parties, ({ one, many }) => ({
  members: many(users, {
    relationName: 'members',
  }),
  banned: many(users, {
    relationName: 'banned',
  }),
  leader: one(users, {
    fields: [parties.leaderId],
    references: [users.id],
    relationName: 'leader',
  }),
}));
