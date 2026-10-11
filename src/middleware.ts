import { defineMiddleware } from 'astro:middleware';
import {
	clearSessionCookie,
	getSessionIdFromCookies,
	validateSession,
} from './lib/session';

export const onRequest = defineMiddleware(async (context, next) => {
	const sessionId = getSessionIdFromCookies(context.cookies);

	if (!sessionId) {
		context.locals.user = null;
		return next();
	}

	let result: Awaited<ReturnType<typeof validateSession>>;
	try {
		result = await validateSession(sessionId);
	} catch (error) {
		// La base de datos no responde: no hay forma de confirmar la sesión.
		// Se trata como "no autenticado" (sin borrar la cookie, por si la
		// sesión sigue siendo válida una vez la base de datos vuelva) en vez
		// de dejar que el error crudo de la consulta rompa cada página.
		console.error('No se pudo validar la sesión:', error);
		context.locals.user = null;
		return next();
	}

	if (!result) {
		clearSessionCookie(context.cookies);
		context.locals.user = null;
		return next();
	}

	context.locals.user = result.user;
	return next();
});
