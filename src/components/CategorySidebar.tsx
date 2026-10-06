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
			class={`rounded-buttons flex items-center justify-between px-3 py-2 text-left text-sm font-thin transition ${
				active
					? 'bg-signal-blue text-paper-white'
					: 'text-fog hover:bg-cobalt-surface'
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
			<span class={active ? 'text-paper-white/70' : 'text-mist'}>{count}</span>
		</button>
	);
}
