import type { Category, LinkItem } from './types';

export const mockCategories: Category[] = [
	{ id: 'dev', name: 'Desarrollo', color: '#00acfe' },
	{ id: 'design', name: 'Diseño', color: '#ff33aa' },
	{ id: 'productivity', name: 'Productividad', color: '#00cc4b' },
	{ id: 'ai', name: 'IA', color: '#9019e6' },
	{ id: 'resources', name: 'Recursos gratuitos', color: '#ff8833' },
];

export function favicon(domain: string) {
	return `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
}

export const mockLinks: LinkItem[] = [
	{
		id: '1',
		url: 'https://excalidraw.com',
		title: 'Excalidraw',
		description:
			'Pizarra virtual para hacer diagramas y wireframes a mano alzada.',
		domain: 'excalidraw.com',
		faviconUrl: favicon('excalidraw.com'),
		categoryId: 'design',
	},
	{
		id: '2',
		url: 'https://www.carbon.now.sh',
		title: 'Carbon',
		description:
			'Crea capturas de código con estilo para compartir en redes o docs.',
		domain: 'carbon.now.sh',
		faviconUrl: favicon('carbon.now.sh'),
		categoryId: 'dev',
	},
	{
		id: '3',
		url: 'https://www.notion.so',
		title: 'Notion',
		description: 'Notas, bases de datos y documentos todo en un solo lugar.',
		domain: 'notion.so',
		faviconUrl: favicon('notion.so'),
		categoryId: 'productivity',
	},
	{
		id: '4',
		url: 'https://huggingface.co/spaces',
		title: 'Hugging Face Spaces',
		description:
			'Demos interactivas de modelos de IA listas para probar en el navegador.',
		domain: 'huggingface.co',
		faviconUrl: favicon('huggingface.co'),
		categoryId: 'ai',
	},
	{
		id: '5',
		url: 'https://unsplash.com',
		title: 'Unsplash',
		description: 'Banco de imágenes gratuitas de alta calidad.',
		domain: 'unsplash.com',
		faviconUrl: favicon('unsplash.com'),
		categoryId: 'resources',
	},
	{
		id: '6',
		url: 'https://regex101.com',
		title: 'Regex101',
		description:
			'Probador de expresiones regulares con explicación en tiempo real.',
		domain: 'regex101.com',
		faviconUrl: favicon('regex101.com'),
		categoryId: 'dev',
	},
	{
		id: '7',
		url: 'https://coolors.co',
		title: 'Coolors',
		description:
			'Generador rápido de paletas de colores para proyectos de diseño.',
		domain: 'coolors.co',
		faviconUrl: favicon('coolors.co'),
		categoryId: 'design',
	},
	{
		id: '8',
		url: 'https://todoist.com',
		title: 'Todoist',
		description: 'Gestor de tareas simple para organizar el día a día.',
		domain: 'todoist.com',
		faviconUrl: favicon('todoist.com'),
		categoryId: 'productivity',
	},
	{
		id: '9',
		url: 'https://www.perplexity.ai',
		title: 'Perplexity',
		description: 'Buscador conversacional con respuestas y fuentes citadas.',
		domain: 'perplexity.ai',
		faviconUrl: favicon('perplexity.ai'),
		categoryId: 'ai',
	},
	{
		id: '10',
		url: 'https://undraw.co',
		title: 'unDraw',
		description:
			'Ilustraciones SVG gratuitas y personalizables para proyectos.',
		domain: 'undraw.co',
		faviconUrl: favicon('undraw.co'),
		categoryId: 'resources',
	},
];
