import type { categories, links } from '../db/schema';
import type { Category, LinkItem } from './types';
import { getDomain } from './url';

export function mapCategory(row: typeof categories.$inferSelect): Category {
	return { id: row.id, name: row.name, color: row.color };
}

export function mapLink(row: typeof links.$inferSelect): LinkItem {
	return {
		id: row.id,
		url: row.url,
		title: row.title,
		description: row.description ?? '',
		domain: getDomain(row.url),
		faviconUrl: row.faviconUrl ?? '',
		categoryId: row.categoryId,
	};
}
