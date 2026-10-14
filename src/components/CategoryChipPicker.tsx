import type { Category } from '../lib/types';

interface Props {
	categories: Category[];
	selectedIds: string[];
	onToggle: (categoryId: string) => void;
	disabled?: boolean;
}

export default function CategoryChipPicker({
	categories,
	selectedIds,
	onToggle,
	disabled,
}: Props) {
	if (categories.length === 0) return null;

	return (
		<div class="flex flex-wrap gap-2">
			{categories.map((category) => {
				const selected = selectedIds.includes(category.id);
				return (
					<button
						key={category.id}
						type="button"
						disabled={disabled}
						onClick={() => onToggle(category.id)}
						class={`rounded-tags border px-3 py-1 text-xs font-medium tracking-wide uppercase transition disabled:opacity-60 ${
							selected ? 'text-white' : 'text-muted border-line'
						}`}
						style={
							selected
								? {
										backgroundColor: category.color,
										borderColor: category.color,
									}
								: undefined
						}
					>
						{category.name}
					</button>
				);
			})}
		</div>
	);
}
