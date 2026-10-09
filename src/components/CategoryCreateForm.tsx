import { useState } from 'preact/hooks';
import type { Category } from '../lib/types';

interface Props {
	onCreate: (name: string) => Promise<Category>;
	onCancel?: () => void;
}

export default function CategoryCreateForm({ onCreate, onCancel }: Props) {
	const [name, setName] = useState('');
	const [isSubmitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(event: Event) {
		event.preventDefault();
		if (!name.trim() || isSubmitting) return;

		setSubmitting(true);
		setError(null);
		try {
			await onCreate(name.trim());
			setName('');
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'No se pudo crear la categoría.',
			);
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<form onSubmit={handleSubmit} class="flex flex-col gap-2">
			<div class="flex gap-2">
				<input
					type="text"
					required
					maxLength={40}
					disabled={isSubmitting}
					placeholder="Nombre de categoría"
					value={name}
					onInput={(event) => setName((event.target as HTMLInputElement).value)}
					class="rounded-buttons border-steel-border bg-midnight-canvas text-paper-white placeholder:text-mist focus:border-signal-blue flex-1 border px-3 py-2 text-sm outline-none disabled:opacity-60"
				/>
				<button
					type="submit"
					disabled={isSubmitting}
					class="rounded-buttons bg-signal-blue text-paper-white hover:bg-signal-blue/90 px-3 py-2 text-sm font-thin whitespace-nowrap disabled:opacity-60"
				>
					{isSubmitting ? 'Creando…' : 'Crear'}
				</button>
				{onCancel && (
					<button
						type="button"
						onClick={onCancel}
						disabled={isSubmitting}
						class="text-mist hover:text-paper-white px-2 text-sm font-thin disabled:opacity-60"
					>
						Cancelar
					</button>
				)}
			</div>
			{error && <p class="text-tag-coral text-xs font-thin">{error}</p>}
		</form>
	);
}
