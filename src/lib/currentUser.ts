import { eq } from 'drizzle-orm';
import { db } from '../db/client';
import { users } from '../db/schema';

// Placeholder hasta la Iteración 4 (autenticación): todas las rutas de API
// operan como si estuvieran autenticadas como este usuario de demo, creado
// por `npm run db:seed`. Se reemplazará por la sesión real del usuario.
const DEMO_USER_EMAIL = 'demo@linksstore.dev';

let cachedUserId: string | null = null;

export async function getCurrentUserId(): Promise<string> {
	if (cachedUserId) return cachedUserId;

	const [user] = await db
		.select({ id: users.id })
		.from(users)
		.where(eq(users.email, DEMO_USER_EMAIL))
		.limit(1);

	if (!user) {
		throw new Error(
			`No existe el usuario de demo (${DEMO_USER_EMAIL}). Corre "npm run db:seed" primero.`,
		);
	}

	cachedUserId = user.id;
	return cachedUserId;
}
