import { Coordinate } from './shape/Coordinate.js';
import { Controller } from './controller/Controller.js';


const controller: Controller = new Controller();

export function addShape(name: string): void {
	controller.addShape(name);
}

export function removeSelectedShape(): void {
	controller.removeSelectedShape();
}

export function canvasLeftClicked(event: MouseEvent, canvasId: string): void {
	const mousePosition: Coordinate = getMouseCoordinate(event, canvasId);
	controller.canvasLeftClicked(mousePosition);
}

export function canvasMouseDown(event: MouseEvent, canvasId: string): void {
	const mousePosition: Coordinate = getMouseCoordinate(event, canvasId);
	if (isLeftMouseButton(event)) {
		controller.canvasLeftMouseDown(mousePosition);
	}
}

export function canvasMouseUp(event: MouseEvent, canvasId: string): void {
	const mousePosition: Coordinate = getMouseCoordinate(event, canvasId);
	if (isLeftMouseButton(event)) {
		controller.canvasLeftMouseUp(mousePosition);
	}
}

export function canvasRightClicked(event: MouseEvent, canvasId: string): void {
	event.preventDefault();
	const mousePosition: Coordinate = getMouseCoordinate(event, canvasId);
	controller.canvasRightClicked(mousePosition);
}

export function canvasMouseMovement(event: MouseEvent, canvasId: string): void {
	const mousePosition: Coordinate = getMouseCoordinate(event, canvasId);
	controller.canvasMouseMovement(mousePosition);
}


function isLeftMouseButton(event: MouseEvent): boolean {
	return event.button === 0;
}

function getMouseCoordinate(event: MouseEvent, elementId: string): Coordinate {
	const rect: ClientRect = document.getElementById(elementId).getBoundingClientRect();
	const x: number = event.clientX - rect.left;
	const y: number = event.clientY - rect.top;
	return { x, y };
}