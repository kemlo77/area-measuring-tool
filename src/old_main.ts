import { Coordinate } from './shape/Coordinate.js';
import { CanvasStudio } from './painter/CanvasStudio.js';
import { Polygon } from './shape/polygon/Polygon.js';
import { InteractiveShape } from './shape/InteractiveShape.js';
import { Line } from './shape/line/Line.js';

const listOfShapes: InteractiveShape[] = [];
const canvasStudio: CanvasStudio = CanvasStudio.getInstance();

export function canvasLeftClicked(event: MouseEvent, canvasId: string): void {
	const mousePosition: Coordinate = getMouseCoordinate(event, canvasId);

	// kolla om nån redan är vald
	if (getSelectedShape() === null) {
		// kolla om nån blir vald genom vänsterklick. Ta den första träffen och avbryt sen
		for (const shape of listOfShapes) {
			shape.handleLeftClick(mousePosition);
			if (shape.isSelected) {
				break;
			}
		}
	} else {
		getSelectedShape().handleLeftClick(mousePosition);
	}

	updateVisuals(mousePosition);
}

export function addPolygon(): void {
	if (noShapeIsSelected()) {
		listOfShapes.push(new Polygon());
	}
}

export function addLine(): void {
	if (noShapeIsSelected()) {
		listOfShapes.push(new Line());
	}
}

function noShapeIsSelected(): boolean {
	return listOfShapes.every((it) => { return !it.isSelected; });
}

export function removeSelectedShape(): void {
	const selectedShape: InteractiveShape = getSelectedShape();
	if (selectedShape !== null) {
		removeShapeFromList(selectedShape);
		canvasStudio.clearTheMovementCanvas(); // TODO: Feature envy?
		const dummyCoordinate: Coordinate = { x: 0, y: 0 };
		updateVisuals(dummyCoordinate);
	}
}

function removeShapeFromList(shape: InteractiveShape): void {
	const index: number = listOfShapes.indexOf(shape);
	listOfShapes.splice(index, 1);
}

export function canvasRightClicked(event: MouseEvent, canvasId: string): void {
	event.preventDefault();
	const mousePosition: Coordinate = getMouseCoordinate(event, canvasId);
	const selectedShape: InteractiveShape = getSelectedShape();
	if (selectedShape !== null) {
		selectedShape.handleRightClick(mousePosition);
		updateVisuals(mousePosition);
	}

}

export function canvasMouseMovement(event: MouseEvent, canvasId: string): void {
	const coordinate: Coordinate = getMouseCoordinate(event, canvasId);
	paintSelectedMovement(coordinate);
}

export function canvasMouseDown(event: MouseEvent, canvasId: string): void {
	if (event.button === 0) { // left mouse button
		const mousePosition: Coordinate = getMouseCoordinate(event, canvasId);
		const selectedShape: InteractiveShape = getSelectedShape();
		if (selectedShape !== null) {
			selectedShape.handleLeftMouseDown(mousePosition);
			updateVisuals(mousePosition);
		}
	}

}

export function canvasMouseUp(event: MouseEvent, canvasId: string): void {
	if (event.button === 0) { // left mouse button
		const mousePosition: Coordinate = getMouseCoordinate(event, canvasId);
		const selectedShape: InteractiveShape = getSelectedShape();
		if (selectedShape !== null) {
			selectedShape.handleLeftMouseUp(mousePosition);
			updateVisuals(mousePosition);
		}
	}

}

function getMouseCoordinate(event: MouseEvent, elementId: string): Coordinate {
	const rect: ClientRect = document.getElementById(elementId).getBoundingClientRect();
	const x: number = event.clientX - rect.left;
	const y: number = event.clientY - rect.top;
	return { x, y };
}

function getSelectedShape(): InteractiveShape {
	for (const shape of listOfShapes) {
		if (shape.isSelected) {
			return shape;
		}
	}
	return null;
}

function updateVisuals(mousePosition: Coordinate): void {
	paintAllStill();
	paintSelectedMovement(mousePosition);
}

function paintAllStill(): void {
	canvasStudio.paintStill(listOfShapes);
}

function paintSelectedMovement(mousePosition: Coordinate): void {
	const selectedShape: InteractiveShape = getSelectedShape();
	if (selectedShape !== null) {
		canvasStudio.paintMovement(selectedShape, mousePosition);
	}
}