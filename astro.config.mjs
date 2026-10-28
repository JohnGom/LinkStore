// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import preact from '@astrojs/preact';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
	output: 'server',

	// El adaptador de Node determina http/https mirando si el socket crudo
	// está cifrado, no el header X-Forwarded-Proto. Detrás de un proxy que
	// termina TLS (Caddy, nginx, etc.) eso hace que Astro arme el origin
	// esperado como "http://..." mientras el navegador manda
	// "Origin: https://...", y el chequeo automático de Origin rechaza todo
	// POST con "Cross-site POST form submissions are forbidden". Se
	// desactiva aquí; la protección real contra CSRF la dan las cookies de
	// sesión con SameSite=Lax (src/lib/session.ts), que de por sí no viajan
	// en un POST/PATCH/DELETE entre sitios.
	security: {
		checkOrigin: false,
	},

	vite: {
		plugins: [tailwindcss()],
	},

	integrations: [preact()],

	adapter: node({
		mode: 'standalone',
	}),
});
