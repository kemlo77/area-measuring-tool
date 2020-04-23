import { Polygon } from './Polygon.js';
import { Coordinate } from './Coordinate.js';
import { CanvasStudio } from './painter/CanvasStudio.js';

const listOfPolygons: Polygon[] = new Array();
let firstPolygon: Polygon;


export function init(): void {
	firstPolygon = new Polygon();
}

export function clearEntirely(): void {
	firstPolygon = new Polygon();
	// CanvasStudio.getInstance().paintStill(firstPolygon);
}

function handleClick(isLeftClick: boolean, mousePosition: Coordinate): void {
	if (listOfPolygons.length === 0) {
		listOfPolygons.push(new Polygon());
	}


	if (isLeftClick) {
		if (getSelectedPolygon() === null) {
			listOfPolygons.push(new Polygon());
		}
		// kolla om nån redan är vald
		// isf fortsätt som vanligt

		// om ingen är vald
		// kolla om nån blir vald genom vänsterklick. Ta den första träffen och avbryt sen
		// annars skapa en ny

		getSelectedPolygon().handleLeftClick(mousePosition);
	}
	else {
		// om nån är vald, så reagera på högerklicket. Annars inget.
		getSelectedPolygon().handleRightClick(mousePosition);
	}
	paintAllStill();
	paintSelectedMovement(mousePosition);
}

function allPolygonsUnselected(): boolean {
	let allUnselected: boolean = true;
	listOfPolygons.forEach((it) => { if (it.isSelected) { allUnselected = false; } });
	return allUnselected;
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
	// listOfPolygons.forEach((it) => { canvasStudio.paintStill(it); });
}

function paintSelectedMovement(mousePosition: Coordinate): void {
	const canvasStudio: CanvasStudio = CanvasStudio.getInstance();
	const selectedPolygon: Polygon = getSelectedPolygon();
	if (selectedPolygon !== null) {
		canvasStudio.paintMovement(selectedPolygon, mousePosition);
	}
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
	paintSelectedMovement({ x, y });
}