import type { Category, LinkItem } from '../lib/types';

interface Props {
	link: LinkItem;
	category?: Category;
}

// Rotación determinística (-6° a 6°) a partir del id, para el gesto de "tag flotante" sin que salte en cada render.
function rotationFor(id: string) {
	const code = id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
	return (code % 13) - 6;
}

export default function LinkCard({ link, category }: Props) {
	return (
		<a
			href={link.url}
			target="_blank"
			rel="noreferrer noopener"
			class="shadow-card hover:shadow-card-hover group rounded-cards border-steel-border/40 bg-deep-surface flex flex-col gap-4 border p-6 transition hover:-translate-y-0.5"
		>
			<div class="flex items-center gap-3">
				<div class="rounded-images bg-paper-white flex h-10 w-10 shrink-0 items-center justify-center">
					<img src={link.faviconUrl} alt="" class="h-5 w-5" />
				</div>
				<div class="min-w-0">
					<h3 class="font-display text-paper-white truncate text-base font-semibold">
						{link.title}
					</h3>
					<span class="text-mist truncate text-xs">{link.domain}</span>
				</div>
			</div>

			<p class="text-fog line-clamp-2 text-sm font-thin">{link.description}</p>

			{category && (
				<span
					class="rounded-tags text-paper-white mt-auto w-fit px-4 py-1 text-xs font-thin tracking-wide uppercase"
					style={{
						backgroundColor: category.color,
						transform: `rotate(${rotationFor(link.id)}deg)`,
					}}
				>
					{category.name}
				</span>
			)}
		</a>
	);
}
