import type { APIRoute } from 'astro';
import { db } from '../../db/client';
import { linkCategories, links } from '../../db/schema';
import { json } from '../../lib/apiResponse';
import {
	getLinksForUser,
	resolveOwnedCategoryIds,
} from '../../lib/linkQueries';
import { fetchLinkMetadata } from '../../lib/metadata';
import { mapLink } from '../../lib/mappers';

export const GET: APIRoute = async ({ locals }) => {
	if (!locals.user) {
		return json({ error: 'No autenticado.' }, 401);
	}

	return json(await getLinksForUser(locals.user.id));
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

	const { url, categoryIds } = (body ?? {}) as {
		url?: unknown;
		categoryIds?: unknown;
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

	const requestedCategoryIds = Array.isArray(categoryIds)
		? categoryIds.filter(
				(id): id is string => typeof id === 'string' && id.length > 0,
			)
		: [];

	try {
		const resolvedCategoryIds = await resolveOwnedCategoryIds(
			userId,
			requestedCategoryIds,
		);
		const metadata = await fetchLinkMetadata(normalizedUrl);

		const created = await db.transaction(async (tx) => {
			const [link] = await tx
				.insert(links)
				.values({
					userId,
					url: normalizedUrl,
					title: metadata.title,
					description: metadata.description,
					faviconUrl: metadata.faviconUrl,
				})
				.returning();

			if (resolvedCategoryIds.length > 0) {
				await tx.insert(linkCategories).values(
					resolvedCategoryIds.map((categoryId) => ({
						linkId: link.id,
						categoryId,
					})),
				);
			}

			return link;
		});

		return json(mapLink(created, resolvedCategoryIds), 201);
	} catch (error) {
		console.error('POST /api/links falló:', error);
		return json(
			{ error: 'No se pudo guardar el enlace. Intenta de nuevo.' },
			500,
		);
	}
};
