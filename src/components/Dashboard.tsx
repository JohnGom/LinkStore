import { useMemo, useState } from 'preact/hooks';
import AddLinkModal from './AddLinkModal';
import CategorySidebar from './CategorySidebar';
import LinkCard from './LinkCard';
import type { Category, LinkItem } from '../lib/types';

interface Props {
	initialCategories: Category[];
	initialLinks: LinkItem[];
}

export default function Dashboard({ initialCategories, initialLinks }: Props) {
	const [categories, setCategories] = useState(initialCategories);
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
			if (!link.categoryId) continue;
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

	async function handleAddLink({
		url,
		categoryId,
	}: {
		url: string;
		categoryId: string;
	}) {
		const response = await fetch('/api/links', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ url, categoryId: categoryId || undefined }),
		});

		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.error ?? 'No se pudo guardar el enlace.');
		}

		setLinks((current) => [data as LinkItem, ...current]);
		setModalOpen(false);
	}

	async function handleCreateCategory(name: string): Promise<Category> {
		const response = await fetch('/api/categories', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ name }),
		});

		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.error ?? 'No se pudo crear la categoría.');
		}

		const created = data as Category;
		setCategories((current) => [...current, created]);
		return created;
	}

	return (
		<div class="mx-auto flex max-w-6xl gap-6 px-4 py-6 lg:px-8">
			<aside
				class={`border-steel-border bg-indigo-surface fixed inset-y-0 left-0 z-40 w-64 transform border-r p-4 transition-transform lg:static lg:z-auto lg:w-56 lg:shrink-0 lg:translate-x-0 lg:border-none lg:bg-transparent lg:p-0 ${
					isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
				}`}
			>
				<div class="mb-4 flex items-center justify-between lg:hidden">
					<span class="font-display text-paper-white font-semibold">
						Categorías
					</span>
					<button
						type="button"
						onClick={() => setSidebarOpen(false)}
						class="text-mist hover:bg-indigo-surface rounded-full p-1"
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
					onCreateCategory={handleCreateCategory}
				/>
			</aside>

			{isSidebarOpen && (
				<button
					type="button"
					aria-label="Cerrar menú de categorías"
					class="bg-midnight-canvas/60 fixed inset-0 z-30 lg:hidden"
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			<div class="flex-1">
				<div class="mb-4 flex items-center justify-between gap-3">
					<button
						type="button"
						onClick={() => setSidebarOpen(true)}
						class="rounded-buttons border-steel-border text-fog border px-3 py-2 text-sm font-thin lg:hidden"
					>
						Categorías
					</button>
					<h2 class="font-display text-mist hidden text-sm font-medium lg:block">
						{selectedCategoryId
							? categoryById.get(selectedCategoryId)?.name
							: 'Todos los enlaces'}{' '}
						· {visibleLinks.length}
					</h2>
					<button
						type="button"
						onClick={() => setModalOpen(true)}
						class="rounded-buttons bg-signal-blue text-paper-white hover:bg-signal-blue/90 ml-auto px-4 py-2 text-sm font-thin"
					>
						+ Agregar enlace
					</button>
				</div>

				{visibleLinks.length === 0 ? (
					<div class="rounded-cards border-steel-border text-mist flex flex-col items-center gap-2 border border-dashed py-16 text-center">
						<p class="text-fog font-thin">
							No hay enlaces en esta categoría todavía.
						</p>
						<p class="text-sm font-thin">Agrega uno con el botón de arriba.</p>
					</div>
				) : (
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
						{visibleLinks.map((link) => (
							<LinkCard
								key={link.id}
								link={link}
								category={
									link.categoryId
										? categoryById.get(link.categoryId)
										: undefined
								}
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
					onCreateCategory={handleCreateCategory}
				/>
			)}
		</div>
	);
}
