import { useState } from 'preact/hooks';
import CategoryChipPicker from './CategoryChipPicker';
import CategoryCreateForm from './CategoryCreateForm';
import type { Category } from '../lib/types';

interface Props {
	categories: Category[];
	onClose: () => void;
	onSubmit: (data: { url: string; categoryIds: string[] }) => Promise<void>;
	onCreateCategory: (name: string) => Promise<Category>;
}

export default function AddLinkModal({
	categories,
	onClose,
	onSubmit,
	onCreateCategory,
}: Props) {
	const [url, setUrl] = useState('');
	const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
	const [isSubmitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isCreatingCategory, setCreatingCategory] = useState(
		categories.length === 0,
	);

	function toggleCategory(categoryId: string) {
		setSelectedCategoryIds((current) =>
			current.includes(categoryId)
				? current.filter((id) => id !== categoryId)
				: [...current, categoryId],
		);
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();
		if (!url.trim() || isSubmitting) return;

		setSubmitting(true);
		setError(null);
		try {
			await onSubmit({ url: url.trim(), categoryIds: selectedCategoryIds });
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'No se pudo guardar el enlace.',
			);
			setSubmitting(false);
		}
	}

	async function handleCreateCategory(name: string) {
		const created = await onCreateCategory(name);
		setSelectedCategoryIds((current) => [...current, created.id]);
		setCreatingCategory(false);
		return created;
	}

	return (
		<div class="bg-scrim/70 fixed inset-0 z-50 flex items-center justify-center p-4">
			<div class="rounded-cards border-line bg-surface w-full max-w-md border p-6">
				<div class="mb-4 flex items-center justify-between">
					<h2 class="text-ink text-lg font-semibold">Agregar enlace</h2>
					<button
						type="button"
						onClick={onClose}
						class="text-subtle hover:bg-surface-elevated hover:text-ink rounded-full p-1"
						aria-label="Cerrar"
					>
						✕
					</button>
				</div>
				<form class="flex flex-col gap-4" onSubmit={handleSubmit}>
					<label class="text-muted flex flex-col gap-1 text-sm">
						URL
						<input
							type="url"
							required
							disabled={isSubmitting}
							placeholder="https://ejemplo.com"
							value={url}
							onInput={(event) =>
								setUrl((event.target as HTMLInputElement).value)
							}
							class="rounded-buttons border-line bg-canvas text-ink placeholder:text-subtle focus:border-primary border px-3 py-2 text-sm outline-none disabled:opacity-60"
						/>
					</label>
					<p class="text-subtle -mt-2 text-xs">
						El título, la descripción y el favicon se completan automáticamente
						a partir de la URL.
					</p>

					<div class="flex flex-col gap-2">
						<span class="text-muted text-sm">
							Categorías (opcional, puedes elegir varias)
						</span>

						{!isCreatingCategory && (
							<CategoryChipPicker
								categories={categories}
								selectedIds={selectedCategoryIds}
								onToggle={toggleCategory}
								disabled={isSubmitting}
							/>
						)}

						{isCreatingCategory ? (
							<CategoryCreateForm
								onCreate={handleCreateCategory}
								onCancel={
									categories.length > 0
										? () => setCreatingCategory(false)
										: undefined
								}
							/>
						) : (
							<button
								type="button"
								onClick={() => setCreatingCategory(true)}
								class="text-ink decoration-primary self-start text-xs underline underline-offset-2 hover:decoration-2"
							>
								+ Nueva categoría
							</button>
						)}
					</div>

					{error && <p class="text-danger text-sm">{error}</p>}
					<div class="mt-2 flex justify-end gap-2">
						<button
							type="button"
							onClick={onClose}
							disabled={isSubmitting}
							class="rounded-buttons border-line text-ink hover:bg-surface-elevated border px-4 py-2 text-sm font-medium disabled:opacity-60"
						>
							Cancelar
						</button>
						<button
							type="submit"
							disabled={isSubmitting}
							class="rounded-buttons bg-primary text-on-primary hover:bg-primary-active px-4 py-2 text-sm font-semibold disabled:opacity-60"
						>
							{isSubmitting ? 'Guardando…' : 'Guardar'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
