import metascraper from 'metascraper';
import metascraperDescription from 'metascraper-description';
import metascraperLogoFavicon from 'metascraper-logo-favicon';
import metascraperTitle from 'metascraper-title';
import { getDomain } from './url';

const scraper = metascraper([
	metascraperTitle(),
	metascraperDescription(),
	metascraperLogoFavicon(),
]);

export interface LinkMetadata {
	title: string;
	description: string | null;
	faviconUrl: string;
}

function googleFavicon(domain: string) {
	return `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
}

// Intenta extraer título/descripción/favicon reales de la página. Si el sitio
// bloquea bots, tarda demasiado o la URL no responde, cae de vuelta a valores
// basados solo en el dominio para que crear el enlace nunca falle por esto.
export async function fetchLinkMetadata(url: string): Promise<LinkMetadata> {
	const domain = getDomain(url);

	try {
		const response = await fetch(url, {
			headers: { 'user-agent': 'Mozilla/5.0 (compatible; LinksStoreBot/1.0)' },
			signal: AbortSignal.timeout(8000),
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}`);
		}

		const html = await response.text();
		const metadata = await scraper({ html, url });

		return {
			title: metadata.title || domain,
			description: metadata.description || null,
			faviconUrl: metadata.logo || googleFavicon(domain),
		};
	} catch {
		return {
			title: domain,
			description: null,
			faviconUrl: googleFavicon(domain),
		};
	}
}
