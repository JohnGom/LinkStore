import type { Category, LinkItem } from '../lib/types';

interface Props {
	link: LinkItem;
	categories: Category[];
	onView: () => void;
}

// Rotación determinística (-6° a 6°) a partir de un id, para el gesto de "tag flotante" sin que salte en cada render.
function rotationFor(id: string) {
	const code = id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
	return (code % 13) - 6;
}

export default function LinkCard({ link, categories, onView }: Props) {
	return (
		<div class="shadow-card hover:shadow-card-hover group rounded-cards border-steel-border hover:border-paper-white/20 bg-indigo-surface flex flex-col gap-4 border p-6 transition hover:-translate-y-0.5">
			<div class="flex items-start gap-3">
				<a
					href={link.url}
					target="_blank"
					rel="noreferrer noopener"
					class="flex min-w-0 flex-1 items-center gap-3"
				>
					<div class="rounded-images flex h-10 w-10 shrink-0 items-center justify-center bg-white">
						<img src={link.faviconUrl} alt="" class="h-5 w-5" />
					</div>
					<div class="min-w-0">
						<h3 class="font-display text-paper-white truncate text-base font-semibold">
							{link.title}
						</h3>
						<span class="text-mist truncate text-xs">{link.domain}</span>
					</div>
				</a>
				<button
					type="button"
					onClick={onView}
					aria-label="Ver detalles del enlace"
					title="Ver detalles"
					class="text-mist hover:bg-cobalt-surface hover:text-paper-white shrink-0 rounded-full p-1.5"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						class="h-4 w-4"
					>
						<path d="M1 10s3-6 9-6 9 6 9 6-3 6-9 6-9-6-9-6Z" />
						<circle cx="10" cy="10" r="2.5" />
					</svg>
				</button>
			</div>

			<p class="text-fog line-clamp-2 text-sm font-thin">{link.description}</p>

			{categories.length > 0 && (
				<div class="mt-auto flex flex-wrap gap-1.5">
					{categories.map((category) => (
						<span
							key={category.id}
							class="rounded-tags text-paper-white w-fit px-3 py-1 text-xs font-thin tracking-wide uppercase"
							style={{
								backgroundColor: category.color,
								transform: `rotate(${rotationFor(link.id + category.id)}deg)`,
							}}
						>
							{category.name}
						</span>
					))}
				</div>
			)}
		</div>
	);
}
