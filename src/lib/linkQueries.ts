import { and, desc, eq, inArray } from 'drizzle-orm';
import { db } from '../db/client';
import { categories, linkCategories, links } from '../db/schema';
import { mapLink } from './mappers';
import type { LinkItem } from './types';

export async function getLinksForUser(userId: string): Promise<LinkItem[]> {
	const rows = await db
		.select()
		.from(links)
		.where(eq(links.userId, userId))
		.orderBy(desc(links.createdAt));

	if (rows.length === 0) return [];

	const linkIds = rows.map((row) => row.id);
	const relations = await db
		.select({
			linkId: linkCategories.linkId,
			categoryId: linkCategories.categoryId,
		})
		.from(linkCategories)
		.where(inArray(linkCategories.linkId, linkIds));

	const categoryIdsByLink = new Map<string, string[]>();
	for (const relation of relations) {
		const list = categoryIdsByLink.get(relation.linkId) ?? [];
		list.push(relation.categoryId);
		categoryIdsByLink.set(relation.linkId, list);
	}

	return rows.map((row) => mapLink(row, categoryIdsByLink.get(row.id) ?? []));
}

// Filtra una lista de ids a solo las categorías que existen y pertenecen al usuario.
export async function resolveOwnedCategoryIds(
	userId: string,
	categoryIds: string[],
): Promise<string[]> {
	if (categoryIds.length === 0) return [];

	const owned = await db
		.select({ id: categories.id })
		.from(categories)
		.where(
			and(inArray(categories.id, categoryIds), eq(categories.userId, userId)),
		);

	const ownedIds = new Set(owned.map((category) => category.id));
	return categoryIds.filter((id) => ownedIds.has(id));
}
