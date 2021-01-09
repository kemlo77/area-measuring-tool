import { Coordinate } from './polygon/Coordinate.js';
import { CanvasStudio } from './painter/CanvasStudio.js';
import { PolygonArea } from './PolygonArea.js';
import { AreaType } from './AreaType.js';
import { Polygon } from './polygon/Polygon.js';

const listOfPolygons: Polygon[] = new Array();
const canvasStudio: CanvasStudio = CanvasStudio.getInstance();

export function canvasLeftClicked(event: MouseEvent, canvasId: string): void {
	const coordinate: Coordinate = getMouseCoordinate(event, canvasId);

	// kolla om nån redan är vald
	if (getSelectedPolygon() === null) {
		// kolla om nån blir vald genom vänsterklick. Ta den första träffen och avbryt sen
		for (const polygon of listOfPolygons) {
			polygon.handleLeftClick(coordinate);
			if (polygon.isSelected) {
				break;
			}
		}
	} else {
		getSelectedPolygon().handleLeftClick(coordinate);
	}

	paintAllStill();
	paintSelectedMovement(coordinate);
}

export function addNewPolygonArea(isPositive: boolean): void {
	if (noSelectedPolygons()) {
		if(isPositive) {
			listOfPolygons.push(new PolygonArea(AreaType.POSITIVE));
		} else {
			listOfPolygons.push(new PolygonArea(AreaType.NEGATIVE));
		}
	}
}

export function addNewPolygon(): void {
	if (noSelectedPolygons()) {
			listOfPolygons.push(new Polygon());
	}
}

function noSelectedPolygons(): boolean {
	return listOfPolygons.every((it) => { return it.isClosed; });
}

export function removeSelectedPolygon(): void {
	const selectedPolygon: Polygon = getSelectedPolygon();
	if (selectedPolygon !== null) {
		removePolygonFromList(selectedPolygon);
		canvasStudio.clearTheMovementCanvas(); // TODO: Feature envy?
		paintAllStill();
	}
}

function removePolygonFromList(polygon: Polygon): void {
	const index: number = listOfPolygons.indexOf(polygon);
	listOfPolygons.splice(index, 1);
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
	if (event.button === 0) { // left mouse button
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
	if (event.button === 0) { // left mouse button
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

function getSelectedPolygon(): Polygon {
	for (const polygon of listOfPolygons) {
		if (polygon.isSelected) {
			return polygon;
		}
	}
	return null;
}

function paintAllStill(): void {
	canvasStudio.paintStill(listOfPolygons);
}

function paintSelectedMovement(mousePosition: Coordinate): void {
	const selectedPolygon: Polygon = getSelectedPolygon();
	if (selectedPolygon !== null) {
		canvasStudio.paintMovement(selectedPolygon, mousePosition);
	}
}