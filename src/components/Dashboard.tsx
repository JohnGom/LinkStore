import { useMemo, useState } from 'preact/hooks';
import AddLinkModal from './AddLinkModal';
import CategorySidebar from './CategorySidebar';
import LinkCard from './LinkCard';
import LinkDetailModal from './LinkDetailModal';
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
	const [searchQuery, setSearchQuery] = useState('');
	const [isModalOpen, setModalOpen] = useState(false);
	const [isSidebarOpen, setSidebarOpen] = useState(false);
	const [viewingLink, setViewingLink] = useState<LinkItem | null>(null);

	const categoryById = useMemo(
		() => new Map(categories.map((category) => [category.id, category])),
		[categories],
	);

	const counts = useMemo(() => {
		const result: Record<string, number> = {};
		for (const link of links) {
			for (const categoryId of link.categoryIds) {
				result[categoryId] = (result[categoryId] ?? 0) + 1;
			}
		}
		return result;
	}, [links]);

	const visibleLinks = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		return links.filter((link) => {
			if (
				selectedCategoryId &&
				!link.categoryIds.includes(selectedCategoryId)
			) {
				return false;
			}
			if (
				query &&
				!link.title.toLowerCase().includes(query) &&
				!link.domain.includes(query)
			) {
				return false;
			}
			return true;
		});
	}, [links, selectedCategoryId, searchQuery]);

	async function handleAddLink({
		url,
		categoryIds,
	}: {
		url: string;
		categoryIds: string[];
	}) {
		const response = await fetch('/api/links', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ url, categoryIds }),
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

	async function handleUpdateLink(
		linkId: string,
		updates: { personalNote: string; categoryIds: string[] },
	) {
		const response = await fetch(`/api/links/${linkId}`, {
			method: 'PATCH',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(updates),
		});

		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.error ?? 'No se pudo actualizar el enlace.');
		}

		const updated = data as LinkItem;
		setLinks((current) =>
			current.map((link) => (link.id === linkId ? updated : link)),
		);
	}

	async function handleDeleteLink(linkId: string) {
		const response = await fetch(`/api/links/${linkId}`, { method: 'DELETE' });

		if (!response.ok) {
			const data = await response.json();
			throw new Error(data.error ?? 'No se pudo eliminar el enlace.');
		}

		setLinks((current) => current.filter((link) => link.id !== linkId));
		setViewingLink(null);
	}

	return (
		<div class="mx-auto flex max-w-6xl gap-6 px-4 py-6 lg:px-8">
			<aside
				class={`border-line bg-surface fixed inset-y-0 left-0 z-40 w-64 transform border-r p-4 transition-transform lg:static lg:z-auto lg:w-56 lg:shrink-0 lg:translate-x-0 lg:border-none lg:bg-transparent lg:p-0 ${
					isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
				}`}
			>
				<div class="mb-4 flex items-center justify-between lg:hidden">
					<span class="text-ink font-semibold">Categorías</span>
					<button
						type="button"
						onClick={() => setSidebarOpen(false)}
						class="text-subtle hover:bg-surface-elevated rounded-full p-1"
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
					class="bg-scrim/60 fixed inset-0 z-30 lg:hidden"
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			<div class="flex-1">
				<div class="mb-4 flex flex-wrap items-center gap-3">
					<button
						type="button"
						onClick={() => setSidebarOpen(true)}
						class="rounded-buttons border-line text-muted border px-3 py-2 text-sm font-medium lg:hidden"
					>
						Categorías
					</button>

					<input
						type="search"
						value={searchQuery}
						onInput={(event) =>
							setSearchQuery((event.target as HTMLInputElement).value)
						}
						placeholder="Buscar por nombre…"
						class="rounded-buttons border-line bg-surface text-ink placeholder:text-subtle focus:border-primary min-w-0 flex-1 border px-3 py-2 text-sm outline-none"
					/>

					<button
						type="button"
						onClick={() => setModalOpen(true)}
						class="rounded-buttons bg-primary text-on-primary hover:bg-primary-active px-4 py-2 text-sm font-semibold whitespace-nowrap"
					>
						+ Agregar enlace
					</button>
				</div>

				<h2 class="text-subtle mb-4 hidden text-sm font-medium lg:block">
					{selectedCategoryId
						? categoryById.get(selectedCategoryId)?.name
						: 'Todos los enlaces'}{' '}
					· {visibleLinks.length}
				</h2>

				{visibleLinks.length === 0 ? (
					<div class="rounded-cards border-line text-subtle flex flex-col items-center gap-2 border border-dashed py-16 text-center">
						<p class="text-muted">
							{links.length === 0
								? 'No hay enlaces en esta categoría todavía.'
								: 'Ningún enlace coincide con tu búsqueda.'}
						</p>
						<p class="text-sm">Agrega uno con el botón de arriba.</p>
					</div>
				) : (
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
						{visibleLinks.map((link) => (
							<LinkCard
								key={link.id}
								link={link}
								categories={link.categoryIds
									.map((id) => categoryById.get(id))
									.filter((category): category is Category =>
										Boolean(category),
									)}
								onView={() => setViewingLink(link)}
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

			{viewingLink && (
				<LinkDetailModal
					link={viewingLink}
					categories={categories}
					onClose={() => setViewingLink(null)}
					onUpdate={(updates) => handleUpdateLink(viewingLink.id, updates)}
					onDelete={() => handleDeleteLink(viewingLink.id)}
				/>
			)}
		</div>
	);
}
