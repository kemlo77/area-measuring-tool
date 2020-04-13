import { Polygon } from './Polygon.js';
import { Point } from './Point.js'; // TODO: Kanske skriva om denna så att handleClick tar ett json-obj istället typ {x: nnn, y: nnn}
import { CanvasPainter } from './CanvasPainter.js';

let firstPolygon: Polygon;


export function init(): void {
	firstPolygon = new Polygon();
}

export function clearEntirely(): void {
	firstPolygon = new Polygon();
	CanvasPainter.getInstance().clearBothCanvas();
}

function handleClick(isLeftClick: boolean, mousePosition: Point): void {
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
	const clickedPositionX: number = event.clientX - rect.left;
	const clickedPositionY: number = event.clientY - rect.top;
	const leftClickedPoint: Point = new Point(clickedPositionX, clickedPositionY);
	handleClick(true, leftClickedPoint);
}

export function canvasRightClicked(event: MouseEvent, canvasId: string): void {
	const rect: ClientRect = document.getElementById(canvasId).getBoundingClientRect();
	const clickedPositionX: number = event.clientX - rect.left;
	const clickedPositionY: number = event.clientY - rect.top;
	const rightClickedPoint: Point = new Point(clickedPositionX, clickedPositionY);
	handleClick(false, rightClickedPoint);
}
export function getMousePos(event: MouseEvent, canvasId: string): void {
	const rect: ClientRect = document.getElementById(canvasId).getBoundingClientRect();
	const mousePositionX: number = event.clientX - rect.left;
	const mousePositionY: number = event.clientY - rect.top;
	const mousePosition = new Point(mousePositionX, mousePositionY);
	// TODO: borde nog inte specifikt ange vilken polygon här, kanske hämta aktuell?
	firstPolygon.drawMovement(mousePosition);
}