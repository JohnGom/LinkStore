import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: uuid('id').primaryKey().defaultRandom(),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export const sessions = pgTable('sessions', {
	id: text('id').primaryKey(),
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
});

export const categories = pgTable('categories', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	color: text('color').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export const links = pgTable('links', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	categoryId: uuid('category_id').references(() => categories.id, {
		onDelete: 'set null',
	}),
	url: text('url').notNull(),
	title: text('title').notNull(),
	description: text('description'),
	faviconUrl: text('favicon_url'),
	createdAt: timestamp('created_at', { withTimezone: true })
		.notNull()
		.defaultNow(),
});
