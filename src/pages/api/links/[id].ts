import type { APIRoute } from 'astro';
import { and, eq } from 'drizzle-orm';
import { db } from '../../../db/client';
import { linkCategories, links } from '../../../db/schema';
import { json } from '../../../lib/apiResponse';
import { resolveOwnedCategoryIds } from '../../../lib/linkQueries';
import { mapLink } from '../../../lib/mappers';

export const PATCH: APIRoute = async ({ request, params, locals }) => {
	if (!locals.user) {
		return json({ error: 'No autenticado.' }, 401);
	}
	const userId = locals.user.id;
	const linkId = params.id;
	if (!linkId) {
		return json({ error: 'Falta el id del enlace.' }, 400);
	}

	const [existing] = await db
		.select()
		.from(links)
		.where(and(eq(links.id, linkId), eq(links.userId, userId)))
		.limit(1);

	if (!existing) {
		return json({ error: 'Enlace no encontrado.' }, 404);
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'JSON inválido.' }, 400);
	}

	const { personalNote, categoryIds } = (body ?? {}) as {
		personalNote?: unknown;
		categoryIds?: unknown;
	};

	try {
		const updatedNote =
			typeof personalNote === 'string'
				? personalNote.trim() || null
				: undefined;

		let resolvedCategoryIds: string[] | undefined;
		if (Array.isArray(categoryIds)) {
			const requested = categoryIds.filter(
				(id): id is string => typeof id === 'string' && id.length > 0,
			);
			resolvedCategoryIds = await resolveOwnedCategoryIds(userId, requested);
		}

		await db.transaction(async (tx) => {
			if (updatedNote !== undefined) {
				await tx
					.update(links)
					.set({ personalNote: updatedNote })
					.where(eq(links.id, linkId));
			}

			if (resolvedCategoryIds !== undefined) {
				await tx
					.delete(linkCategories)
					.where(eq(linkCategories.linkId, linkId));
				if (resolvedCategoryIds.length > 0) {
					await tx.insert(linkCategories).values(
						resolvedCategoryIds.map((categoryId) => ({
							linkId,
							categoryId,
						})),
					);
				}
			}
		});

		const [updated] = await db
			.select()
			.from(links)
			.where(eq(links.id, linkId))
			.limit(1);

		const finalCategoryIds =
			resolvedCategoryIds ??
			(
				await db
					.select({ categoryId: linkCategories.categoryId })
					.from(linkCategories)
					.where(eq(linkCategories.linkId, linkId))
			).map((row) => row.categoryId);

		return json(mapLink(updated, finalCategoryIds));
	} catch (error) {
		console.error('PATCH /api/links/[id] falló:', error);
		return json(
			{ error: 'No se pudo actualizar el enlace. Intenta de nuevo.' },
			500,
		);
	}
};

export const DELETE: APIRoute = async ({ params, locals }) => {
	if (!locals.user) {
		return json({ error: 'No autenticado.' }, 401);
	}
	const linkId = params.id;
	if (!linkId) {
		return json({ error: 'Falta el id del enlace.' }, 400);
	}

	const deleted = await db
		.delete(links)
		.where(and(eq(links.id, linkId), eq(links.userId, locals.user.id)))
		.returning({ id: links.id });

	if (deleted.length === 0) {
		return json({ error: 'Enlace no encontrado.' }, 404);
	}

	return json({ success: true });
};
