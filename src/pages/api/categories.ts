import type { APIRoute } from 'astro';
import { and, eq, ilike } from 'drizzle-orm';
import { db } from '../../db/client';
import { categories } from '../../db/schema';
import { json } from '../../lib/apiResponse';
import { randomTagColor } from '../../lib/categoryColors';
import { mapCategory } from '../../lib/mappers';

export const GET: APIRoute = async ({ locals }) => {
	if (!locals.user) {
		return json({ error: 'No autenticado.' }, 401);
	}

	const rows = await db
		.select()
		.from(categories)
		.where(eq(categories.userId, locals.user.id));
	return json(rows.map(mapCategory));
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

	const { name } = (body ?? {}) as { name?: unknown };
	const trimmedName = typeof name === 'string' ? name.trim() : '';

	if (!trimmedName) {
		return json({ error: 'El nombre es obligatorio.' }, 400);
	}
	if (trimmedName.length > 40) {
		return json(
			{ error: 'El nombre es demasiado largo (máximo 40 caracteres).' },
			400,
		);
	}

	try {
		const [existing] = await db
			.select({ id: categories.id })
			.from(categories)
			.where(
				and(eq(categories.userId, userId), ilike(categories.name, trimmedName)),
			)
			.limit(1);

		if (existing) {
			return json({ error: 'Ya tienes una categoría con ese nombre.' }, 400);
		}

		const [created] = await db
			.insert(categories)
			.values({ userId, name: trimmedName, color: randomTagColor() })
			.returning();

		return json(mapCategory(created), 201);
	} catch (error) {
		console.error('POST /api/categories falló:', error);
		return json(
			{ error: 'No se pudo crear la categoría. Intenta de nuevo.' },
			500,
		);
	}
};
