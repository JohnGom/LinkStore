import { useState } from 'preact/hooks';
import type { Category } from '../lib/types';

interface Props {
	categories: Category[];
	onClose: () => void;
	onSubmit: (data: { url: string; categoryId: string }) => void;
}

export default function AddLinkModal({ categories, onClose, onSubmit }: Props) {
	const [url, setUrl] = useState('');
	const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '');

	function handleSubmit(event: Event) {
		event.preventDefault();
		if (!url.trim()) return;
		onSubmit({ url: url.trim(), categoryId });
	}

	return (
		<div class="bg-midnight-canvas/70 fixed inset-0 z-50 flex items-center justify-center p-4">
			<div class="shadow-card rounded-cards border-steel-border/40 bg-deep-surface w-full max-w-md border p-6">
				<div class="mb-4 flex items-center justify-between">
					<h2 class="font-display text-paper-white text-lg font-semibold">
						Agregar enlace
					</h2>
					<button
						type="button"
						onClick={onClose}
						class="text-mist hover:bg-indigo-surface hover:text-paper-white rounded-full p-1"
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
							placeholder="https://ejemplo.com"
							value={url}
							onInput={(event) =>
								setUrl((event.target as HTMLInputElement).value)
							}
							class="rounded-buttons border-steel-border bg-indigo-surface text-paper-white placeholder:text-mist focus:border-signal-blue border px-3 py-2 text-sm outline-none"
						/>
					</label>
					<p class="text-mist -mt-2 text-xs font-thin">
						El título y el favicon se completarán automáticamente a partir de la
						URL en la próxima iteración.
					</p>
					<label class="text-fog flex flex-col gap-1 text-sm font-thin">
						Categoría
						<select
							value={categoryId}
							onChange={(event) =>
								setCategoryId((event.target as HTMLSelectElement).value)
							}
							class="rounded-buttons border-steel-border bg-indigo-surface text-paper-white focus:border-signal-blue border px-3 py-2 text-sm outline-none"
						>
							{categories.map((category) => (
								<option key={category.id} value={category.id}>
									{category.name}
								</option>
							))}
						</select>
					</label>
					<div class="mt-2 flex justify-end gap-2">
						<button
							type="button"
							onClick={onClose}
							class="rounded-buttons border-paper-white/20 text-paper-white hover:bg-indigo-surface border px-4 py-2 text-sm font-thin"
						>
							Cancelar
						</button>
						<button
							type="submit"
							class="rounded-buttons bg-signal-blue text-paper-white hover:bg-signal-blue/90 px-4 py-2 text-sm font-thin"
						>
							Guardar
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
