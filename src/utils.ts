import { FINE_SPLATTER_2_B64, FINE_SPLATTER_3_B64, FINE_SPLATTER_B64, SPLATTER_B64, SPLATTER_B64_2, SPLATTER_B64_3 } from "./assets/base64";

export function randomDisplacement(min: number, max: number): [number, number] {
	const angle = Math.random() * Math.PI * 2;
	const dist = min + (max - min) * Math.random();

	const x = Math.round(Math.cos(angle) * dist);
	const y = Math.round(Math.sin(angle) * dist);

	return [x, y];
}

export function randomRotation(min: number, max: number): number {
	return min + Math.random() * (max - min);
}

export interface ISplatterSettings {
	bigSplatDisplacements: [number, number][];
	fineSplatterRotations: number[];
	bigSplatLevel: number;
	bigSplatScale: number;
	fineSplatterLevel: number;
	fullBlood: boolean;
}

export type BloodLevel = 1 | 2 | 3 | 4 | 5 | 6;
export function generateSplatterSettings(level: BloodLevel): ISplatterSettings {
	const bigSplatDisplacements = new Array(3).fill([0, 0]).map(() => randomDisplacement(0, 500));
	const fineSplatterRotations = new Array(3).fill(0).map(() => randomRotation(-10, 10));

	const fullBlood = level === 6;

	return {
		bigSplatDisplacements,
		fineSplatterRotations,
		bigSplatLevel: level - 2,
		bigSplatScale: (level - 2) / 2,
		fineSplatterLevel: level,
		fullBlood
	}
}

export const FINE_SPLATTERS = [FINE_SPLATTER_B64, FINE_SPLATTER_2_B64, FINE_SPLATTER_3_B64];
export const BIG_SPLATTERS = [SPLATTER_B64, SPLATTER_B64_2, SPLATTER_B64_3];

export function getDistortedFontSize(fontSize: number, distortion: number, charIndex: number, numChars: number): number {
	// Elliptical arc
	const b2 = (fontSize * distortion) ** 2; // Ellipse minor radius
	const x2 = ((charIndex / (numChars - 1) - 0.5) * 2) ** 2;

	// Difference in font
	const y = Math.round(Math.sqrt((1 - x2) * b2));

	return fontSize - y;
}