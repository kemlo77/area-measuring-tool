import { Model } from '../model/Model.js';
import { DataView } from '../view/dataview/DataView.js';
import { Coordinate } from '../model/shape/Coordinate.js';
import { InteractiveShape } from '../model/shape/InteractiveShape.js';
import { CanvasStudio } from '../view/canvas/CanvasStudio.js';


export class Controller {

    private model: Model;
    private canvasStudio: CanvasStudio;
    private dataPresenter: DataView;

    constructor() {
        this.model = new Model();
        this.canvasStudio = CanvasStudio.getInstance();
        this.dataPresenter = DataView.getInstance();
        this.dataPresenter.setModel(this.model);
    }

    addShape(name: string): void {
        this.model.addShape(name);
    }

    removeSelectedShape(): void {
        this.model.removeSelectedShape();
        this.canvasStudio.clearTheMovementCanvas(); // TODO: Feature envy?
        const dummyCoordinate: Coordinate = { x: 0, y: 0 };
        this.updateVisuals(dummyCoordinate);
    }

    canvasLeftClicked(coordinate: Coordinate): void {
        this.model.reactToLeftClick(coordinate);
        // Always updating visuals since it is not known if a shape was selected/deselected
        this.updateVisuals(coordinate);
    }

    canvasLeftMouseDown(coordinate: Coordinate): void {
        const updatedShape: InteractiveShape = this.model.anySelectedShapeReactToLeftMouseDown(coordinate);
        if (updatedShape !== null) {
            this.updateVisuals(coordinate);
        }
    }

    canvasLeftMouseUp(coordinate: Coordinate): void {
        const updatedShape: InteractiveShape = this.model.anySelectedShapeReactToLeftMouseUp(coordinate);
        if (updatedShape !== null) {
            this.updateVisuals(coordinate);
        }
    }

    canvasRightClicked(coordinate: Coordinate): void {
        const updatedShape: InteractiveShape = this.model.anySelectedShapeReactToRightClick(coordinate);
        if (updatedShape !== null) {
            this.updateVisuals(coordinate);
        }
    }

    canvasMouseMovement(coordinate: Coordinate): void {
        this.paintSelectedMovement(coordinate);
    }


    private updateVisuals(mousePosition: Coordinate): void {
        this.paintAllStill();
        this.paintSelectedMovement(mousePosition);
        this.dataPresenter.updatePresentation();
    }

    private paintAllStill(): void {
        this.canvasStudio.paintStill(this.model.listOfShapes);
    }

    private paintSelectedMovement(mousePosition: Coordinate): void {
        const selectedShape: InteractiveShape = this.model.getSelectedShape();
        if (selectedShape !== null) {
            this.canvasStudio.paintMovement(selectedShape, mousePosition);
        }
    }


}