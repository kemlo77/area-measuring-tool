import { Polygon } from './Polygon.js';
import { Coordinate } from './Coordinate.js';
import { CanvasStudio } from './painter/CanvasStudio.js';

const listOfPolygons: Polygon[] = new Array();
let firstPolygon: Polygon;


export function init(): void {
	firstPolygon = new Polygon();
}

export function canvasLeftClicked(event: MouseEvent, canvasId: string): void {
	const coordinate: Coordinate = getMouseCoordinate(event, canvasId);
	if (listOfPolygons.length === 0) {
		listOfPolygons.push(new Polygon());
	}

	// kolla om nån redan är vald
	if (getSelectedPolygon() === null) {
		// kolla om nån blir vald genom vänsterklick. Ta den första träffen och avbryt sen
		for (const polygon of listOfPolygons) {
			polygon.handleLeftClick(coordinate);
			if (polygon.isSelected) {
				break;
			}
		}
		// om fortfarande ingen vald, skapa en ny
		if (getSelectedPolygon() === null) {
			listOfPolygons.push(new Polygon());
			getSelectedPolygon().handleLeftClick(coordinate);
		}
	} else {
		getSelectedPolygon().handleLeftClick(coordinate);
	}

	paintAllStill();
	paintSelectedMovement(coordinate);
}


export function canvasRightClicked(event: MouseEvent, canvasId: string): void {
	const coordinate: Coordinate = getMouseCoordinate(event, canvasId);
	const selectedPolygon: Polygon = getSelectedPolygon();
	if (selectedPolygon !== null) {
		selectedPolygon.handleRightClick(coordinate);
		paintAllStill();
		paintSelectedMovement(coordinate);
	}
}
export function canvasMouseMovement(event: MouseEvent, canvasId: string): void {
	const coordinate: Coordinate = getMouseCoordinate(event, canvasId);
	paintSelectedMovement(coordinate);
}

export function canvasMouseDown(event: MouseEvent, canvasId: string): void {
	if (event.which === 1) { // left mouse button
		const coordinate: Coordinate = getMouseCoordinate(event, canvasId);
		const selectedPolygon: Polygon = getSelectedPolygon();
		if (selectedPolygon !== null) {
			selectedPolygon.handleLeftMouseDown(coordinate);
			paintAllStill();
			paintSelectedMovement(coordinate);
		}
	}
}

export function canvasMouseUp(event: MouseEvent, canvasId: string): void {
	if (event.which === 1) { // left mouse button
		const coordinate: Coordinate = getMouseCoordinate(event, canvasId);
		const selectedPolygon: Polygon = getSelectedPolygon();
		if (selectedPolygon !== null) {
			selectedPolygon.handleLeftMouseUp(coordinate);
			paintAllStill();
			paintSelectedMovement(coordinate);
		}
	}
}


function getMouseCoordinate(event: MouseEvent, elementId: string): Coordinate {
	const rect: ClientRect = document.getElementById(elementId).getBoundingClientRect();
	const x: number = event.clientX - rect.left;
	const y: number = event.clientY - rect.top;
	return { x, y };
}

export function clearEntirely(): void {
	firstPolygon = new Polygon();
	// CanvasStudio.getInstance().paintStill(firstPolygon);
}


function getSelectedPolygon(): Polygon {
	for (const polygon of listOfPolygons) {
		if (polygon.isSelected) {
			return polygon;
		}
	}
	return null;
}

function paintAllStill(): void {
	const canvasStudio: CanvasStudio = CanvasStudio.getInstance();
	canvasStudio.paintStill(listOfPolygons);
}

function paintSelectedMovement(mousePosition: Coordinate): void {
	const canvasStudio: CanvasStudio = CanvasStudio.getInstance();
	const selectedPolygon: Polygon = getSelectedPolygon();
	if (selectedPolygon !== null) {
		canvasStudio.paintMovement(selectedPolygon, mousePosition);
	}
}