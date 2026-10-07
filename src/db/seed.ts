import 'dotenv/config';
import { hash } from '@node-rs/argon2';
import { db } from './client';
import { categories, links, users } from './schema';
import { mockCategories, mockLinks } from '../lib/mockData';

async function seed() {
	const passwordHash = await hash('demo1234');
	const [user] = await db
		.insert(users)
		.values({ email: 'demo@linksstore.dev', passwordHash })
		.returning();

	const insertedCategories = await db
		.insert(categories)
		.values(
			mockCategories.map((category) => ({
				userId: user.id,
				name: category.name,
				color: category.color,
			})),
		)
		.returning();

	const categoryIdByMockId = new Map(
		mockCategories.map((category, index) => [
			category.id,
			insertedCategories[index].id,
		]),
	);

	await db.insert(links).values(
		mockLinks.map((link) => ({
			userId: user.id,
			categoryId:
				(link.categoryId && categoryIdByMockId.get(link.categoryId)) || null,
			url: link.url,
			title: link.title,
			description: link.description,
			faviconUrl: link.faviconUrl,
		})),
	);

	console.log(
		`Seed listo: usuario ${user.email} con ${mockLinks.length} enlaces.`,
	);
}

seed()
	.catch((error) => {
		console.error('Error al poblar la base de datos:', error);
		process.exitCode = 1;
	})
	.finally(() => process.exit());
