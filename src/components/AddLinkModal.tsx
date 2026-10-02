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
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
			<div class="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
				<div class="mb-4 flex items-center justify-between">
					<h2 class="text-lg font-semibold text-slate-900">Agregar enlace</h2>
					<button
						type="button"
						onClick={onClose}
						class="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
						aria-label="Cerrar"
					>
						✕
					</button>
				</div>
				<form class="flex flex-col gap-4" onSubmit={handleSubmit}>
					<label class="flex flex-col gap-1 text-sm font-medium text-slate-700">
						URL
						<input
							type="url"
							required
							placeholder="https://ejemplo.com"
							value={url}
							onInput={(event) =>
								setUrl((event.target as HTMLInputElement).value)
							}
							class="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
						/>
					</label>
					<p class="-mt-2 text-xs text-slate-400">
						El título, la imagen y el favicon se completarán automáticamente a
						partir de la URL en la próxima iteración.
					</p>
					<label class="flex flex-col gap-1 text-sm font-medium text-slate-700">
						Categoría
						<select
							value={categoryId}
							onChange={(event) =>
								setCategoryId((event.target as HTMLSelectElement).value)
							}
							class="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
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
							class="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
						>
							Cancelar
						</button>
						<button
							type="submit"
							class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
						>
							Guardar
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
