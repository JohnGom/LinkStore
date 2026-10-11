import { useState } from 'preact/hooks';
import CategoryChipPicker from './CategoryChipPicker';
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
	const [isDeleting, setDeleting] = useState(false);
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
		if (
			!window.confirm(
				'¿Eliminar este enlace? Esta acción no se puede deshacer.',
			)
		)
			return;

		setDeleting(true);
		setError(null);
		try {
			await onDelete();
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'No se pudo eliminar el enlace.',
			);
			setDeleting(false);
		}
	}

	const isBusy = isSaving || isDeleting;

	return (
		<div class="bg-scrim/70 fixed inset-0 z-50 flex items-center justify-center p-4">
			<div class="shadow-card rounded-cards border-steel-border bg-indigo-surface w-full max-w-lg border p-6">
				<div class="mb-4 flex items-start justify-between gap-3">
					<div class="flex min-w-0 items-center gap-3">
						<div class="rounded-images flex h-10 w-10 shrink-0 items-center justify-center bg-white">
							<img src={link.faviconUrl} alt="" class="h-5 w-5" />
						</div>
						<div class="min-w-0">
							<h2 class="font-display text-paper-white truncate text-lg font-semibold">
								{link.title}
							</h2>
							<a
								href={link.url}
								target="_blank"
								rel="noreferrer noopener"
								class="text-signal-blue block truncate text-xs"
							>
								{link.url}
							</a>
						</div>
					</div>
					<button
						type="button"
						onClick={onClose}
						class="text-mist hover:bg-cobalt-surface hover:text-paper-white shrink-0 rounded-full p-1"
						aria-label="Cerrar"
					>
						✕
					</button>
				</div>

				{link.description && (
					<p class="text-fog mb-4 text-sm font-thin">{link.description}</p>
				)}

				<div class="flex flex-col gap-4">
					<div class="flex flex-col gap-2">
						<span class="text-fog text-sm font-thin">Categorías</span>
						<CategoryChipPicker
							categories={categories}
							selectedIds={selectedCategoryIds}
							onToggle={toggleCategory}
							disabled={isBusy}
						/>
						{categories.length === 0 && (
							<p class="text-mist text-xs font-thin">
								Todavía no tienes categorías.
							</p>
						)}
					</div>

					<label class="text-fog flex flex-col gap-1 text-sm font-thin">
						Nota personal
						<textarea
							rows={3}
							disabled={isBusy}
							placeholder="Agrega información adicional sobre este enlace…"
							value={personalNote}
							onInput={(event) =>
								setPersonalNote((event.target as HTMLTextAreaElement).value)
							}
							class="rounded-buttons border-steel-border bg-midnight-canvas text-paper-white placeholder:text-mist focus:border-signal-blue resize-none border px-3 py-2 text-sm outline-none disabled:opacity-60"
						/>
					</label>

					{error && <p class="text-tag-coral text-sm font-thin">{error}</p>}

					<div class="mt-2 flex items-center justify-between gap-2">
						<button
							type="button"
							onClick={handleDelete}
							disabled={isBusy}
							class="text-tag-coral rounded-buttons border border-current px-4 py-2 text-sm font-thin hover:bg-current/10 disabled:opacity-60"
						>
							{isDeleting ? 'Eliminando…' : 'Eliminar enlace'}
						</button>
						<div class="flex gap-2">
							<button
								type="button"
								onClick={onClose}
								disabled={isBusy}
								class="rounded-buttons border-paper-white/20 text-paper-white hover:bg-indigo-surface border px-4 py-2 text-sm font-thin disabled:opacity-60"
							>
								Cancelar
							</button>
							<button
								type="button"
								onClick={handleSave}
								disabled={isBusy}
								class="rounded-buttons bg-signal-blue text-paper-white hover:bg-signal-blue/90 px-4 py-2 text-sm font-thin disabled:opacity-60"
							>
								{isSaving ? 'Guardando…' : 'Guardar cambios'}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
