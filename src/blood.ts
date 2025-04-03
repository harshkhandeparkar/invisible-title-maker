export function randomDisplacement(min: number, max: number): [number, number] {
	const angle = Math.random() * Math.PI * 2;
	const dist = min + (max - min) * Math.random();

	const x = Math.round(Math.cos(angle) * dist);
	const y = Math.round(Math.sin(angle) * dist);

	return [x, y];
}