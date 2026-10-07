import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { db } from '../../db/client';
import { categories } from '../../db/schema';
import { json } from '../../lib/apiResponse';
import { getCurrentUserId } from '../../lib/currentUser';
import { mapCategory } from '../../lib/mappers';

export const GET: APIRoute = async () => {
	const userId = await getCurrentUserId();
	const rows = await db
		.select()
		.from(categories)
		.where(eq(categories.userId, userId));
	return json(rows.map(mapCategory));
};
