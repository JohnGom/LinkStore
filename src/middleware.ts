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

	const result = await validateSession(sessionId);

	if (!result) {
		clearSessionCookie(context.cookies);
		context.locals.user = null;
		return next();
	}

	context.locals.user = result.user;
	return next();
});
