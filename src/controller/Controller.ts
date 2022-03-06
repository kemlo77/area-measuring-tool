import { Model } from '../model/Model';
import { Coordinate } from '../model/shape/Coordinate';

export class Controller {

    private model: Model;

    constructor(model: Model) {
        this.model = model;
    }

    addShape(name: string): void {
        this.model.addShape(name);
    }

    removeSelectedShape(): void {
        this.model.removeSelectedShape();
    }

    canvasLeftClicked(coordinate: Coordinate): void {
        this.model.reactToLeftClick(coordinate);
    }

    canvasLeftMouseDown(coordinate: Coordinate): void {
        this.model.reactToLeftMouseDown(coordinate);
    }

    canvasLeftMouseUp(coordinate: Coordinate): void {
        this.model.reactToLeftMouseUp(coordinate);
    }

    canvasRightClicked(coordinate: Coordinate): void {
        this.model.reactToRightClick(coordinate);
    }

    canvasMouseMovement(mousePosition: Coordinate): void {
        this.model.reactToMouseMovement(mousePosition);
    }

}