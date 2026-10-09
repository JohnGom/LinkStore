import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { db } from '../../db/client';
import { categories } from '../../db/schema';
import { json } from '../../lib/apiResponse';
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
