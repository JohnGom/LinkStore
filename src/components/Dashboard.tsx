import { useMemo, useState } from 'preact/hooks';
import AddLinkModal from './AddLinkModal';
import CategorySidebar from './CategorySidebar';
import LinkCard from './LinkCard';
import { cover, favicon } from '../lib/mockData';
import type { Category, LinkItem } from '../lib/types';

interface Props {
	initialCategories: Category[];
	initialLinks: LinkItem[];
}

export default function Dashboard({ initialCategories, initialLinks }: Props) {
	const [categories] = useState(initialCategories);
	const [links, setLinks] = useState(initialLinks);
	const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
		null,
	);
	const [isModalOpen, setModalOpen] = useState(false);
	const [isSidebarOpen, setSidebarOpen] = useState(false);

	const categoryById = useMemo(
		() => new Map(categories.map((category) => [category.id, category])),
		[categories],
	);

	const counts = useMemo(() => {
		const result: Record<string, number> = {};
		for (const link of links) {
			result[link.categoryId] = (result[link.categoryId] ?? 0) + 1;
		}
		return result;
	}, [links]);

	const visibleLinks = useMemo(
		() =>
			selectedCategoryId
				? links.filter((link) => link.categoryId === selectedCategoryId)
				: links,
		[links, selectedCategoryId],
	);

	function handleAddLink({
		url,
		categoryId,
	}: {
		url: string;
		categoryId: string;
	}) {
		let domain = url;
		try {
			domain = new URL(url).hostname.replace(/^www\./, '');
		} catch {
			// URL sin protocolo explícito: se guarda el texto tal cual mientras no haya validación real.
		}
		const id = crypto.randomUUID();
		const newLink: LinkItem = {
			id,
			url,
			title: domain,
			description: 'Sin descripción todavía.',
			domain,
			imageUrl: cover(id),
			faviconUrl: favicon(domain),
			categoryId,
		};
		setLinks((current) => [newLink, ...current]);
		setModalOpen(false);
	}

	return (
		<div class="mx-auto flex max-w-6xl gap-6 px-4 py-6 lg:px-8">
			<aside
				class={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-slate-200 bg-white p-4 transition-transform lg:static lg:z-auto lg:w-56 lg:shrink-0 lg:translate-x-0 lg:border-none lg:bg-transparent lg:p-0 ${
					isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
				}`}
			>
				<div class="mb-4 flex items-center justify-between lg:hidden">
					<span class="font-semibold text-slate-900">Categorías</span>
					<button
						type="button"
						onClick={() => setSidebarOpen(false)}
						class="rounded-full p-1 text-slate-400 hover:bg-slate-100"
						aria-label="Cerrar categorías"
					>
						✕
					</button>
				</div>
				<CategorySidebar
					categories={categories}
					counts={counts}
					totalCount={links.length}
					selectedId={selectedCategoryId}
					onSelect={(id) => {
						setSelectedCategoryId(id);
						setSidebarOpen(false);
					}}
				/>
			</aside>

			{isSidebarOpen && (
				<button
					type="button"
					aria-label="Cerrar menú de categorías"
					class="fixed inset-0 z-30 bg-slate-900/30 lg:hidden"
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			<div class="flex-1">
				<div class="mb-4 flex items-center justify-between gap-3">
					<button
						type="button"
						onClick={() => setSidebarOpen(true)}
						class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 lg:hidden"
					>
						Categorías
					</button>
					<h2 class="hidden text-sm font-medium text-slate-500 lg:block">
						{selectedCategoryId
							? categoryById.get(selectedCategoryId)?.name
							: 'Todos los enlaces'}{' '}
						· {visibleLinks.length}
					</h2>
					<button
						type="button"
						onClick={() => setModalOpen(true)}
						class="ml-auto rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
					>
						+ Agregar enlace
					</button>
				</div>

				{visibleLinks.length === 0 ? (
					<div class="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-300 py-16 text-center text-slate-400">
						<p class="font-medium">No hay enlaces en esta categoría todavía.</p>
						<p class="text-sm">Agrega uno con el botón de arriba.</p>
					</div>
				) : (
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
						{visibleLinks.map((link) => (
							<LinkCard
								key={link.id}
								link={link}
								category={categoryById.get(link.categoryId)}
							/>
						))}
					</div>
				)}
			</div>

			{isModalOpen && (
				<AddLinkModal
					categories={categories}
					onClose={() => setModalOpen(false)}
					onSubmit={handleAddLink}
				/>
			)}
		</div>
	);
}
