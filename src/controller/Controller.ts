import { Model } from '../model/Model';
import { Coordinate } from '../model/shape/Coordinate';
import { Observer } from '../view/Observer';
import { Subject } from './Subject';

type ModelHandleMouseEvent = (model: Model, coordinate: Coordinate) => boolean;

export class Controller implements Subject {

    private model: Model;
    private _listeners: Set<Observer> = new Set();


    constructor(model: Model) {
        this.model = model;
    }

    subscribe(observer: Observer): void {
        this._listeners.add(observer);
    }

    unsubscribe(observer: Observer): void {
        this._listeners.delete(observer);
    }

    addShape(name: string): void {
        this.model.addShape(name);
    }

    removeSelectedShape(): void {
        this.model.removeSelectedShape();
        const dummyCoordinate: Coordinate = { x: 0, y: 0 };
        this.notifyOfModelChange(dummyCoordinate);
    }

    canvasLeftClicked(coordinate: Coordinate): void {
        this.model.reactToLeftClick(coordinate);
        // Always updating visuals since it is not known if a shape was selected/deselected
        this.notifyOfModelChange(coordinate);
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
        const aShapeIsUpdated: boolean = action(this.model, coordinate);
        if (aShapeIsUpdated) {
            this.notifyOfModelChange(coordinate);
        }
    }

    notifyOfMouseMovement(mousePosition: Coordinate): void {
        this._listeners.forEach((observer) => { observer.updateBecauseOfMovementInModel(this.model, mousePosition); });
    }

    notifyOfModelChange(mousePosition: Coordinate): void {
        this._listeners.forEach((observer) => {
            observer.updateBecauseModelHasChanged(this.model);
            observer.updateBecauseOfMovementInModel(this.model, mousePosition);
        });
    }

}