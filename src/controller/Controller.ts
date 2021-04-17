import { Model } from '../model/Model.js';
import { DataView } from '../view/dataview/DataView.js';
import { Coordinate } from '../model/shape/Coordinate.js';
import { InteractiveShape } from '../model/shape/InteractiveShape.js';
import { CanvasView } from '../view/canvasview/CanvasView.js';

type ModelHandleMouseEvent = (model: Model, coordinate: Coordinate) => InteractiveShape;

export class Controller {

    private model: Model;
    private canvasView: CanvasView;
    private dataView: DataView;

    constructor() {
        this.model = new Model();
        this.canvasView = CanvasView.getInstance();
        this.canvasView.setModel(this.model);
        this.dataView = DataView.getInstance();
        this.dataView.setModel(this.model);
    }

    addShape(name: string): void {
        this.model.addShape(name);
    }

    removeSelectedShape(): void {
        this.model.removeSelectedShape();
        this.canvasView.clearTheMovementCanvas(); // TODO: Feature envy?
        const dummyCoordinate: Coordinate = { x: 0, y: 0 };
        this.updateVisuals(dummyCoordinate);
    }

    canvasLeftClicked(coordinate: Coordinate): void {
        this.model.reactToLeftClick(coordinate);
        // Always updating visuals since it is not known if a shape was selected/deselected
        this.updateVisuals(coordinate);
    }

    canvasLeftMouseDown(coordinate: Coordinate): void {
        const action: ModelHandleMouseEvent =
            (model, coordinate) => model.anySelectedShapeReactToLeftMouseDown(coordinate);
        this.modelHandleMouseEventAndViewUpdated(coordinate, action);
    }

    canvasLeftMouseUp(coordinate: Coordinate): void {
        const action: ModelHandleMouseEvent =
            (model, coordinate) => model.anySelectedShapeReactToLeftMouseUp(coordinate);
        this.modelHandleMouseEventAndViewUpdated(coordinate, action);
    }

    canvasRightClicked(coordinate: Coordinate): void {
        const action: ModelHandleMouseEvent =
            (model, coordinate) => model.anySelectedShapeReactToRightClick(coordinate);
        this.modelHandleMouseEventAndViewUpdated(coordinate, action);
    }

    private modelHandleMouseEventAndViewUpdated(coordinate: Coordinate, action: ModelHandleMouseEvent): void {
        const updatedShape: InteractiveShape = action(this.model, coordinate);
        if (updatedShape !== null) {
            this.updateVisuals(coordinate);
        }
    }

    canvasMouseMovement(mousePosition: Coordinate): void {
        this.canvasView.paintMovement(mousePosition);
    }

    private updateVisuals(mousePosition: Coordinate): void {
        this.canvasView.paintStill();
        this.canvasView.paintMovement(mousePosition);
        this.dataView.updatePresentation();
    }

}