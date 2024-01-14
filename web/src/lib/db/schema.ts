import { relations } from 'drizzle-orm';
import { timestamp, jsonb, pgTable, text, integer, real } from 'drizzle-orm/pg-core';
import type { HabileChatData } from './HabileChatData';

export const users = pgTable('users', {
	id: text('id').primaryKey(),
	email: text('email').unique(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	habileChatData: jsonb('habile_chat_data').$type<HabileChatData>()
});

export const habileChatData = pgTable('habile_chat_data', {
	tokens: real('tokens').notNull(),
	used: real('used').notNull(),
	messages: integer('messages').notNull()
});

export const purchases = pgTable('purchases', {
	checkoutSessionId: text('checkout_session_id').primaryKey(),
	userId: text('user_id').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	amount: integer('amount'),
	currency: text('currency'),
	productId: text('product_id'),
	quantity: integer('quantity'),
	platform: text('platform', {
		enum: ['STRIPE', 'BOOSTY']
	}).default('STRIPE')
});

export const usersRelations = relations(users, ({ many, one }) => ({
	purchases: many(purchases)
}));

export const purchasesRelations = relations(purchases, ({ one }) => ({
	user: one(users, {
		fields: [purchases.userId],
		references: [users.id]
	})
}));
