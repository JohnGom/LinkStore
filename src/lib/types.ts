export interface Category {
	id: string;
	name: string;
	color: string;
}

export interface LinkItem {
	id: string;
	url: string;
	title: string;
	description: string;
	domain: string;
	faviconUrl: string;
	personalNote: string;
	categoryIds: string[];
}
