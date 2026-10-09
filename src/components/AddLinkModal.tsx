import { useEffect, useState } from 'preact/hooks';
import CategoryCreateForm from './CategoryCreateForm';
import type { Category } from '../lib/types';

interface Props {
	categories: Category[];
	onClose: () => void;
	onSubmit: (data: { url: string; categoryId: string }) => Promise<void>;
	onCreateCategory: (name: string) => Promise<Category>;
}

export default function AddLinkModal({
	categories,
	onClose,
	onSubmit,
	onCreateCategory,
}: Props) {
	const [url, setUrl] = useState('');
	const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '');
	const [isSubmitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isCreatingCategory, setCreatingCategory] = useState(
		categories.length === 0,
	);

	useEffect(() => {
		if (
			categories.length > 0 &&
			!categories.some((category) => category.id === categoryId)
		) {
			setCategoryId(categories[0].id);
		}
	}, [categories]);

	async function handleSubmit(event: Event) {
		event.preventDefault();
		if (!url.trim() || isSubmitting) return;

		setSubmitting(true);
		setError(null);
		try {
			await onSubmit({ url: url.trim(), categoryId });
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'No se pudo guardar el enlace.',
			);
			setSubmitting(false);
		}
	}

	async function handleCreateCategory(name: string) {
		const created = await onCreateCategory(name);
		setCategoryId(created.id);
		setCreatingCategory(false);
		return created;
	}

	return (
		<div class="bg-midnight-canvas/70 fixed inset-0 z-50 flex items-center justify-center p-4">
			<div class="shadow-card rounded-cards border-steel-border bg-indigo-surface w-full max-w-md border p-6">
				<div class="mb-4 flex items-center justify-between">
					<h2 class="font-display text-paper-white text-lg font-semibold">
						Agregar enlace
					</h2>
					<button
						type="button"
						onClick={onClose}
						class="text-mist hover:bg-cobalt-surface hover:text-paper-white rounded-full p-1"
						aria-label="Cerrar"
					>
						✕
					</button>
				</div>
				<form class="flex flex-col gap-4" onSubmit={handleSubmit}>
					<label class="text-fog flex flex-col gap-1 text-sm font-thin">
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
							class="rounded-buttons border-steel-border bg-midnight-canvas text-paper-white placeholder:text-mist focus:border-signal-blue border px-3 py-2 text-sm outline-none disabled:opacity-60"
						/>
					</label>
					<p class="text-mist -mt-2 text-xs font-thin">
						El título, la descripción y el favicon se completan automáticamente
						a partir de la URL.
					</p>

					<div class="flex flex-col gap-2">
						<span class="text-fog text-sm font-thin">Categoría</span>

						{!isCreatingCategory && categories.length > 0 && (
							<select
								value={categoryId}
								disabled={isSubmitting}
								onChange={(event) =>
									setCategoryId((event.target as HTMLSelectElement).value)
								}
								class="rounded-buttons border-steel-border bg-midnight-canvas text-paper-white focus:border-signal-blue border px-3 py-2 text-sm outline-none disabled:opacity-60"
							>
								{categories.map((category) => (
									<option key={category.id} value={category.id}>
										{category.name}
									</option>
								))}
							</select>
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
								class="text-signal-blue self-start text-xs font-thin"
							>
								+ Nueva categoría
							</button>
						)}
					</div>

					{error && <p class="text-tag-coral text-sm font-thin">{error}</p>}
					<div class="mt-2 flex justify-end gap-2">
						<button
							type="button"
							onClick={onClose}
							disabled={isSubmitting}
							class="rounded-buttons border-paper-white/20 text-paper-white hover:bg-indigo-surface border px-4 py-2 text-sm font-thin disabled:opacity-60"
						>
							Cancelar
						</button>
						<button
							type="submit"
							disabled={isSubmitting}
							class="rounded-buttons bg-signal-blue text-paper-white hover:bg-signal-blue/90 px-4 py-2 text-sm font-thin disabled:opacity-60"
						>
							{isSubmitting ? 'Guardando…' : 'Guardar'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
