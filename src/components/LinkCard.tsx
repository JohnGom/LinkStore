import type { Category, LinkItem } from '../lib/types';

interface Props {
	link: LinkItem;
	category?: Category;
}

export default function LinkCard({ link, category }: Props) {
	return (
		<a
			href={link.url}
			target="_blank"
			rel="noreferrer noopener"
			class="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
		>
			<div class="aspect-[5/3] w-full overflow-hidden bg-slate-100">
				<img
					src={link.imageUrl}
					alt=""
					loading="lazy"
					class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
				/>
			</div>
			<div class="flex flex-1 flex-col gap-2 p-4">
				<div class="flex items-center gap-2">
					<img
						src={link.faviconUrl}
						alt=""
						class="h-4 w-4 shrink-0 rounded-sm"
					/>
					<span class="truncate text-xs text-slate-400">{link.domain}</span>
				</div>
				<h3 class="line-clamp-1 font-semibold text-slate-900">{link.title}</h3>
				<p class="line-clamp-2 text-sm text-slate-500">{link.description}</p>
				{category && (
					<span
						class="mt-auto w-fit rounded-full px-2 py-0.5 text-xs font-medium"
						style={{
							backgroundColor: `${category.color}1a`,
							color: category.color,
						}}
					>
						{category.name}
					</span>
				)}
			</div>
		</a>
	);
}
