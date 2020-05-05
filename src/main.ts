import { Polygon } from './Polygon.js';
import { Coordinate } from './Coordinate.js';
import { CanvasStudio } from './painter/CanvasStudio.js';

const listOfPolygons: Polygon[] = new Array();


export function init(): void {
	// TODO: vad ska denna metod göra egentligen
}

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

export function addNewPolygon(): void {
	if(noSelectedPolygons()) {
		listOfPolygons.push(new Polygon());
	}
}

function noSelectedPolygons(): boolean {
	return listOfPolygons.every((it)=>{return it.isClosed;});
}

export function removeSelectedPolygon(): void {
	const index: number = listOfPolygons.indexOf(getSelectedPolygon());
	listOfPolygons.splice(index, 1);
	// TODO: clear moving canvas
	paintAllStill();
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