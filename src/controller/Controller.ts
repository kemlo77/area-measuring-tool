import { Model } from '../model/Model';
import { Coordinate } from '../model/shape/Coordinate';
import { CanvasView } from '../view/canvasview/CanvasView';

export class Controller {

    private model: Model;
    private canvasView: CanvasView;

    constructor(model: Model, canvasView: CanvasView) {
        this.model = model;
        this.canvasView = canvasView;
    }

    addShape(name: string): void {
        this.model.addShape(name);
    }

    removeSelectedShape(): void {
        this.model.removeSelectedShape();
    }

    canvasLeftClicked(coordinate: Coordinate): void {
        const imageCoordinate: Coordinate = this.canvasView.convertCanvasCoordinateToImageCoordinate(coordinate);
        this.model.reactToLeftClick(imageCoordinate);
    }

    canvasLeftMouseDown(coordinate: Coordinate): void {
        const imageCoordinate: Coordinate = this.canvasView.convertCanvasCoordinateToImageCoordinate(coordinate);
        this.model.reactToLeftMouseDown(imageCoordinate);
    }

    canvasLeftMouseUp(coordinate: Coordinate): void {
        const imageCoordinate: Coordinate = this.canvasView.convertCanvasCoordinateToImageCoordinate(coordinate);
        this.model.reactToLeftMouseUp(imageCoordinate);
    }

    canvasRightClicked(coordinate: Coordinate): void {
        const imageCoordinate: Coordinate = this.canvasView.convertCanvasCoordinateToImageCoordinate(coordinate);
        this.model.reactToRightClick(imageCoordinate);
    }

    canvasMouseMovement(mousePosition: Coordinate): void {
        const imageCoordinate: Coordinate = this.canvasView.convertCanvasCoordinateToImageCoordinate(mousePosition);
        this.model.reactToMouseMovement(imageCoordinate);
    }

}