import type { Category } from '../lib/types';

interface Props {
	categories: Category[];
	counts: Record<string, number>;
	totalCount: number;
	selectedId: string | null;
	onSelect: (id: string | null) => void;
}

export default function CategorySidebar({
	categories,
	counts,
	totalCount,
	selectedId,
	onSelect,
}: Props) {
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
			class={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
				active ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
			}`}
		>
			<span class="flex items-center gap-2">
				{color && (
					<span
						class="h-2 w-2 rounded-full"
						style={{ backgroundColor: active ? '#fff' : color }}
					/>
				)}
				{label}
			</span>
			<span class={active ? 'text-slate-300' : 'text-slate-400'}>{count}</span>
		</button>
	);
}
