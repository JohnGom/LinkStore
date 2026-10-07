import type { APIRoute } from 'astro';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '../../db/client';
import { categories, links } from '../../db/schema';
import { json } from '../../lib/apiResponse';
import { getCurrentUserId } from '../../lib/currentUser';
import { fetchLinkMetadata } from '../../lib/metadata';
import { mapLink } from '../../lib/mappers';

export const GET: APIRoute = async () => {
	const userId = await getCurrentUserId();
	const rows = await db
		.select()
		.from(links)
		.where(eq(links.userId, userId))
		.orderBy(desc(links.createdAt));
	return json(rows.map(mapLink));
};

export const POST: APIRoute = async ({ request }) => {
	const userId = await getCurrentUserId();

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'JSON inválido.' }, 400);
	}

	const { url, categoryId } = (body ?? {}) as {
		url?: unknown;
		categoryId?: unknown;
	};

	if (typeof url !== 'string' || !url.trim()) {
		return json({ error: 'La URL es obligatoria.' }, 400);
	}

	let normalizedUrl: string;
	try {
		normalizedUrl = new URL(url).toString();
	} catch {
		return json({ error: 'La URL no es válida.' }, 400);
	}

	let resolvedCategoryId: string | null = null;
	if (typeof categoryId === 'string' && categoryId) {
		const [category] = await db
			.select({ id: categories.id })
			.from(categories)
			.where(and(eq(categories.id, categoryId), eq(categories.userId, userId)))
			.limit(1);
		if (!category) {
			return json({ error: 'La categoría no existe.' }, 400);
		}
		resolvedCategoryId = category.id;
	}

	const metadata = await fetchLinkMetadata(normalizedUrl);

	const [created] = await db
		.insert(links)
		.values({
			userId,
			categoryId: resolvedCategoryId,
			url: normalizedUrl,
			title: metadata.title,
			description: metadata.description,
			faviconUrl: metadata.faviconUrl,
		})
		.returning();

	return json(mapLink(created), 201);
};
