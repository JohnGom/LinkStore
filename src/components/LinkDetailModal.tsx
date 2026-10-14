import { useState } from 'preact/hooks';
import CategoryChipPicker from './CategoryChipPicker';
import HoldToDeleteButton from './HoldToDeleteButton';
import type { Category, LinkItem } from '../lib/types';

interface Props {
	link: LinkItem;
	categories: Category[];
	onClose: () => void;
	onUpdate: (updates: {
		personalNote: string;
		categoryIds: string[];
	}) => Promise<void>;
	onDelete: () => Promise<void>;
}

export default function LinkDetailModal({
	link,
	categories,
	onClose,
	onUpdate,
	onDelete,
}: Props) {
	const [personalNote, setPersonalNote] = useState(link.personalNote);
	const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
		link.categoryIds,
	);
	const [isSaving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	function toggleCategory(categoryId: string) {
		setSelectedCategoryIds((current) =>
			current.includes(categoryId)
				? current.filter((id) => id !== categoryId)
				: [...current, categoryId],
		);
	}

	async function handleSave() {
		setSaving(true);
		setError(null);
		try {
			await onUpdate({ personalNote, categoryIds: selectedCategoryIds });
			onClose();
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'No se pudo guardar el enlace.',
			);
			setSaving(false);
		}
	}

	async function handleDelete() {
		setError(null);
		try {
			await onDelete();
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'No se pudo eliminar el enlace.',
			);
		}
	}

	return (
		<div class="bg-scrim/70 fixed inset-0 z-50 flex items-center justify-center p-4">
			<div class="rounded-cards border-line bg-surface w-full max-w-lg border p-6">
				<div class="mb-4 flex items-start justify-between gap-3">
					<div class="flex min-w-0 items-center gap-3">
						<div class="rounded-images flex h-10 w-10 shrink-0 items-center justify-center bg-white">
							<img src={link.faviconUrl} alt="" class="h-5 w-5" />
						</div>
						<div class="min-w-0">
							<h2 class="text-ink truncate text-lg font-semibold">
								{link.title}
							</h2>
							<a
								href={link.url}
								target="_blank"
								rel="noreferrer noopener"
								class="text-ink decoration-primary block truncate text-xs underline underline-offset-2 hover:decoration-2"
							>
								{link.url}
							</a>
						</div>
					</div>
					<button
						type="button"
						onClick={onClose}
						class="text-subtle hover:bg-surface-elevated hover:text-ink shrink-0 rounded-full p-1"
						aria-label="Cerrar"
					>
						✕
					</button>
				</div>

				{link.description && (
					<p class="text-muted mb-4 text-sm">{link.description}</p>
				)}

				<div class="flex flex-col gap-4">
					<div class="flex flex-col gap-2">
						<span class="text-muted text-sm">Categorías</span>
						<CategoryChipPicker
							categories={categories}
							selectedIds={selectedCategoryIds}
							onToggle={toggleCategory}
							disabled={isSaving}
						/>
						{categories.length === 0 && (
							<p class="text-subtle text-xs">Todavía no tienes categorías.</p>
						)}
					</div>

					<label class="text-muted flex flex-col gap-1 text-sm">
						Nota personal
						<textarea
							rows={3}
							disabled={isSaving}
							placeholder="Agrega información adicional sobre este enlace…"
							value={personalNote}
							onInput={(event) =>
								setPersonalNote((event.target as HTMLTextAreaElement).value)
							}
							class="rounded-buttons border-line bg-canvas text-ink placeholder:text-subtle focus:border-primary resize-none border px-3 py-2 text-sm outline-none disabled:opacity-60"
						/>
					</label>

					{error && <p class="text-danger text-sm">{error}</p>}

					<div class="flex justify-end gap-2">
						<button
							type="button"
							onClick={onClose}
							disabled={isSaving}
							class="rounded-buttons border-line text-ink hover:bg-surface-elevated border px-4 py-2 text-sm font-medium disabled:opacity-60"
						>
							Cancelar
						</button>
						<button
							type="button"
							onClick={handleSave}
							disabled={isSaving}
							class="rounded-buttons bg-primary text-on-primary hover:bg-primary-active px-4 py-2 text-sm font-semibold disabled:opacity-60"
						>
							{isSaving ? 'Guardando…' : 'Guardar cambios'}
						</button>
					</div>

					<HoldToDeleteButton onConfirm={handleDelete} disabled={isSaving} />
				</div>
			</div>
		</div>
	);
}
