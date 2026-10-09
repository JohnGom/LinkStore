// Paleta de tags de DESIGN.md — se asigna automáticamente al crear una
// categoría para que combine con el resto del sistema de diseño.
const TAG_COLORS = [
	'#00acfe', // sky
	'#ff33aa', // hot pink
	'#00cc4b', // lime
	'#9019e6', // violet
	'#ff8833', // tangerine
	'#ffcc02', // sunflower
	'#ff4433', // coral
	'#ea687c', // ember
	'#94ae43', // olive
	'#5c6f8a', // slate
];

export function randomTagColor(): string {
	return TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)];
}
