import { relations } from 'drizzle-orm';
import { pgTable, text, integer, real, boolean, jsonb, primaryKey } from 'drizzle-orm/pg-core';

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
  partyId: text('party_id'),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  party: one(parties, {
    fields: [users.partyId],
    references: [parties.id],
    relationName: 'members',
  }),
  bannedParties: many(partyBanned),
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
  banned: many(partyBanned),
  leader: one(users, {
    fields: [parties.leaderId],
    references: [users.id],
    relationName: 'leader',
  }),
}));

export const partyBanned = pgTable(
  'banned_members',
  {
    userId: text('user_id').references(() => users.id),
    partyId: text('party_id').references(() => parties.id),
  },
  ({ userId, partyId }) => ({
    id: primaryKey({
      columns: [userId, partyId],
    }),
  }),
);

export const partyBannedRelations = relations(partyBanned, ({ one }) => ({
  party: one(parties, {
    fields: [partyBanned.partyId],
    references: [parties.id],
  }),
  user: one(users, {
    fields: [partyBanned.userId],
    references: [users.id],
  }),
}));
