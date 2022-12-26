import { Subject } from './Subject';
import { Observer } from '../view/Observer';
import { ConcreteShapeFactory } from './meassuringshape/ConcreteShapeFactory';
import { MeassuringShape } from './meassuringshape/MeassuringShape';
import { Coordinate } from './meassuringshape/shape/Coordinate';
import { ShapeFactory } from './meassuringshape/ShapeFactory';
import { ShapeStorage } from './ShapeStorage';

type ShapeAction = (shape: MeassuringShape, coordinate: Coordinate) => void;

export class Model implements Subject {

    private _listeners: Set<Observer> = new Set();
    private _shapeStorage = new ShapeStorage();
    private _shapeFactory: ShapeFactory = new ConcreteShapeFactory();

    set shapeFactory(shapeFactory: ShapeFactory) {
        this._shapeFactory = shapeFactory;
    }

    get allShapes(): MeassuringShape[] {
        return this._shapeStorage.getAllShapes();
    }

    get areaShapes(): MeassuringShape[] {
        return this._shapeStorage.getAreaShapes();
    }

    get lengthShapes(): MeassuringShape[] {
        return this._shapeStorage.getLengthShapes();
    }

    addShape(name: string): void {
        //It shall not be possible to add a shape while another is selected
        if (this.selectedShape) {
            return;
        }
        const newShape: MeassuringShape = this._shapeFactory.getShape(name);
        if (newShape) {
            this._shapeStorage.add(newShape);
        }

    }

    removeSelectedShape(): void {
        this._shapeStorage.removeSelectedShape();
        const dummyCoordinate: Coordinate = { x: 0, y: 0 };
        this.notifyOfModelChange(dummyCoordinate);
    }

    removeShapeById(id: number): void {
        this._shapeStorage.removeShapeById(id);
        const dummyCoordinate: Coordinate = { x: 0, y: 0 };
        this.notifyOfModelChange(dummyCoordinate);
    }

    reactToMouseMovement(mousePosition: Coordinate): void {
        this.notifyOfMouseMovement(mousePosition);
    }

    reactToRightClick(coordinate: Coordinate): void {
        if (this.selectedShape) {
            this.selectedShape.handleRightClick(coordinate);
            this.notifyOfModelChange(coordinate);
        }
    }

    reactToLeftMouseDown(coordinate: Coordinate): void {
        if (this.selectedShape) {
            this.selectedShape.handleLeftMouseDown(coordinate);
            this.notifyOfModelChange(coordinate);
        }
    }

    reactToLeftMouseUp(coordinate: Coordinate): void {
        if (this.selectedShape) {
            this.selectedShape.handleLeftMouseUp(coordinate);
            this.notifyOfModelChange(coordinate);
        }
    }

    reactToLeftClick(coordinate: Coordinate): void {
        if (this.selectedShape) {
            this.selectedShape.handleLeftClick(coordinate);
        } else {
            this.trySelectingAnyShapeByLeftClick(coordinate);

        }
        // Always updating visuals since it is not known if a shape was selected/deselected
        this.notifyOfModelChange(coordinate);
    }

    private trySelectingAnyShapeByLeftClick(coordinate: Coordinate): void {
        for (const shape of this._shapeStorage.getAllShapes()) {
            shape.handleLeftClick(coordinate);
            if (shape.isSelected) {
                break;
            }
        }
    }

    get selectedShape(): MeassuringShape {
        return this._shapeStorage.getSelectedShape();
    }


    subscribe(observer: Observer): void {
        this._listeners.add(observer);
    }

    unsubscribe(observer: Observer): void {
        this._listeners.delete(observer);
    }

    notifyOfMouseMovement(mousePosition: Coordinate): void {
        this._listeners.forEach((observer) => { observer.updateBecauseOfMovementInModel(mousePosition); });
    }

    notifyOfModelChange(mousePosition: Coordinate): void {
        this._listeners.forEach((observer) => {
            observer.updateBecauseModelHasChanged();
            observer.updateBecauseOfMovementInModel(mousePosition);
        });
    }
}