import { Polygon } from './Polygon.js';
import { CanvasPainter } from './CanvasPainter.js';
import { Coordinate } from './Coordinate.js';

let firstPolygon: Polygon;


export function init(): void {
	firstPolygon = new Polygon();
}

export function clearEntirely(): void {
	firstPolygon = new Polygon();
	CanvasPainter.getInstance().clearBothCanvas();
}

function handleClick(isLeftClick: boolean, mousePosition: Coordinate): void {
	if (isLeftClick) {
		firstPolygon.handleLeftClick(mousePosition);
	}
	else {
		firstPolygon.handleRightClick(mousePosition);
	}
	firstPolygon.drawSegments();
	firstPolygon.drawMovement(mousePosition);
}



export function canvasLeftClicked(event: MouseEvent, canvasId: string): void {
	const rect: ClientRect = document.getElementById(canvasId).getBoundingClientRect();
	const x: number = event.clientX - rect.left;
	const y: number = event.clientY - rect.top;
	handleClick(true, { x, y });
}

export function canvasRightClicked(event: MouseEvent, canvasId: string): void {
	const rect: ClientRect = document.getElementById(canvasId).getBoundingClientRect();
	const x: number = event.clientX - rect.left;
	const y: number = event.clientY - rect.top;
	handleClick(false, { x, y });
}
export function getMousePos(event: MouseEvent, canvasId: string): void {
	const rect: ClientRect = document.getElementById(canvasId).getBoundingClientRect();
	const x: number = event.clientX - rect.left;
	const y: number = event.clientY - rect.top;
	// TODO: borde nog inte specifikt ange vilken polygon här, kanske hämta aktuell?
	firstPolygon.drawMovement({ x, y });
}