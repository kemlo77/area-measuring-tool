import { Coordinate } from './model/meassuringshape/shape/Coordinate';
import { Controller } from './controller/Controller';

export class Router {

	private _controller: Controller;

	constructor(controller: Controller) {
		this._controller = controller;
	}

	addShape(name: string): void {
		this._controller.addShape(name);
	}

	removeSelectedShape(): void {
		this._controller.removeSelectedShape();
	}

	canvasLeftClicked(event: MouseEvent, canvasId: string): void {
		const mousePosition: Coordinate = this.getMouseCoordinate(event, canvasId);
		this._controller.canvasLeftClicked(mousePosition);
	}

	canvasMouseDown(event: MouseEvent, canvasId: string): void {
		const mousePosition: Coordinate = this.getMouseCoordinate(event, canvasId);
		if (this.isLeftMouseButton(event)) {
			this._controller.canvasLeftMouseDown(mousePosition);
		}
	}

	canvasMouseUp(event: MouseEvent, canvasId: string): void {
		const mousePosition: Coordinate = this.getMouseCoordinate(event, canvasId);
		if (this.isLeftMouseButton(event)) {
			this._controller.canvasLeftMouseUp(mousePosition);
		}
	}

	canvasRightClicked(event: MouseEvent, canvasId: string): void {
		event.preventDefault();
		const mousePosition: Coordinate = this.getMouseCoordinate(event, canvasId);
		this._controller.canvasRightClicked(mousePosition);
	}

	canvasMouseMovement(event: MouseEvent, canvasId: string): void {
		const mousePosition: Coordinate = this.getMouseCoordinate(event, canvasId);
		this._controller.canvasMouseMovement(mousePosition);
	}


	private isLeftMouseButton(event: MouseEvent): boolean {
		return event.button === 0;
	}

	getMouseCoordinate(event: MouseEvent, elementId: string): Coordinate {
		const rect: DOMRect = document.getElementById(elementId).getBoundingClientRect();
		const x: number = event.clientX - rect.left;
		const y: number = event.clientY - rect.top;
		return { x, y };
	}


}
