import type { APIRoute } from 'astro';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '../../db/client';
import { categories, links } from '../../db/schema';
import { json } from '../../lib/apiResponse';
import { fetchLinkMetadata } from '../../lib/metadata';
import { mapLink } from '../../lib/mappers';

export const GET: APIRoute = async ({ locals }) => {
	if (!locals.user) {
		return json({ error: 'No autenticado.' }, 401);
	}

	const rows = await db
		.select()
		.from(links)
		.where(eq(links.userId, locals.user.id))
		.orderBy(desc(links.createdAt));
	return json(rows.map(mapLink));
};

export const POST: APIRoute = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'No autenticado.' }, 401);
	}
	const userId = locals.user.id;

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

	try {
		let resolvedCategoryId: string | null = null;
		if (typeof categoryId === 'string' && categoryId) {
			const [category] = await db
				.select({ id: categories.id })
				.from(categories)
				.where(
					and(eq(categories.id, categoryId), eq(categories.userId, userId)),
				)
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
	} catch (error) {
		console.error('POST /api/links falló:', error);
		return json(
			{ error: 'No se pudo guardar el enlace. Intenta de nuevo.' },
			500,
		);
	}
};
