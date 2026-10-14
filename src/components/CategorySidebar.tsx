import { useState } from 'preact/hooks';
import CategoryCreateForm from './CategoryCreateForm';
import type { Category } from '../lib/types';

interface Props {
	categories: Category[];
	counts: Record<string, number>;
	totalCount: number;
	selectedId: string | null;
	onSelect: (id: string | null) => void;
	onCreateCategory: (name: string) => Promise<Category>;
}

export default function CategorySidebar({
	categories,
	counts,
	totalCount,
	selectedId,
	onSelect,
	onCreateCategory,
}: Props) {
	const [isCreating, setCreating] = useState(false);

	return (
		<nav class="flex flex-col gap-1">
			<SidebarItem
				label="Todos"
				count={totalCount}
				active={selectedId === null}
				onClick={() => onSelect(null)}
			/>
			{categories.map((category) => (
				<SidebarItem
					key={category.id}
					label={category.name}
					count={counts[category.id] ?? 0}
					active={selectedId === category.id}
					color={category.color}
					onClick={() => onSelect(category.id)}
				/>
			))}

			{isCreating ? (
				<div class="mt-2 px-1">
					<CategoryCreateForm
						onCreate={async (name) => {
							const created = await onCreateCategory(name);
							setCreating(false);
							return created;
						}}
						onCancel={() => setCreating(false)}
					/>
				</div>
			) : (
				<button
					type="button"
					onClick={() => setCreating(true)}
					class="text-ink decoration-primary rounded-buttons mt-2 px-3 py-2 text-left text-sm font-medium underline underline-offset-2 hover:decoration-2"
				>
					+ Nueva categoría
				</button>
			)}
		</nav>
	);
}

function SidebarItem({
	label,
	count,
	active,
	color,
	onClick,
}: {
	label: string;
	count: number;
	active: boolean;
	color?: string;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			class={`rounded-buttons flex items-center justify-between px-3 py-2 text-left text-sm font-medium transition ${
				active
					? 'bg-primary text-on-primary'
					: 'text-muted hover:bg-surface-elevated'
			}`}
		>
			<span class="flex items-center gap-2">
				{color && (
					<span
						class="h-2 w-2 rounded-full"
						style={{
							backgroundColor: active ? 'var(--color-on-primary)' : color,
						}}
					/>
				)}
				{label}
			</span>
			<span class={active ? 'text-on-primary/70' : 'text-subtle'}>{count}</span>
		</button>
	);
}
