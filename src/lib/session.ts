import type { AstroCookies } from 'astro';
import { randomBytes } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { db } from '../db/client';
import { sessions, users } from '../db/schema';

const SESSION_COOKIE_NAME = 'session';
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30; // 30 días

export interface SessionUser {
	id: string;
	email: string;
}

export async function createSession(userId: string) {
	const id = randomBytes(32).toString('base64url');
	const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
	await db.insert(sessions).values({ id, userId, expiresAt });
	return { id, expiresAt };
}

export async function validateSession(
	sessionId: string,
): Promise<{ user: SessionUser } | null> {
	const [row] = await db
		.select({
			expiresAt: sessions.expiresAt,
			userId: users.id,
			email: users.email,
		})
		.from(sessions)
		.innerJoin(users, eq(sessions.userId, users.id))
		.where(eq(sessions.id, sessionId))
		.limit(1);

	if (!row) return null;

	if (row.expiresAt.getTime() < Date.now()) {
		await db.delete(sessions).where(eq(sessions.id, sessionId));
		return null;
	}

	return { user: { id: row.userId, email: row.email } };
}

export async function invalidateSession(sessionId: string) {
	await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export function getSessionIdFromCookies(cookies: AstroCookies): string | null {
	return cookies.get(SESSION_COOKIE_NAME)?.value ?? null;
}

export function setSessionCookie(
	cookies: AstroCookies,
	session: { id: string; expiresAt: Date },
) {
	cookies.set(SESSION_COOKIE_NAME, session.id, {
		httpOnly: true,
		secure: import.meta.env.PROD,
		sameSite: 'lax',
		path: '/',
		expires: session.expiresAt,
	});
}

export function clearSessionCookie(cookies: AstroCookies) {
	cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
}
