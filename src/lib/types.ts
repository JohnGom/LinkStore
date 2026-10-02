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
	imageUrl: string;
	faviconUrl: string;
	categoryId: string;
}
