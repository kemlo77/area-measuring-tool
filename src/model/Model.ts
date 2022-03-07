import { Subject } from '../controller/Subject';
import { Observer } from '../view/Observer';
import { ConcreteShapeFactory } from './ConcreteShapeFactory';
import { MeassuringShape } from './MeassuringShape';
import { Coordinate } from './shape/Coordinate';
import { ShapeFactory } from './ShapeFactory';

type ShapeAction = (shape: MeassuringShape, coordinate: Coordinate) => void;

export class Model implements Subject {

    private _listeners: Set<Observer> = new Set();
    private shapes: MeassuringShape[] = [];
    private _shapeFactory: ShapeFactory = new ConcreteShapeFactory();

    set shapeFactory(shapeFactory: ShapeFactory) {
        this._shapeFactory = shapeFactory;
    }

    get allShapes(): MeassuringShape[] {
        return this.shapes.slice();
    }

    get areaShapes(): MeassuringShape[] {
        return this.shapes.filter((it) => it.hasArea);
    }

    get lengthShapes(): MeassuringShape[] {
        return this.shapes.filter((it) => !it.hasArea);
    }

    addShape(name: string): void {
        //It shall not be possible to add a shape while another is selected
        if (this.selectedShape) {
            return;
        }
        const newShape: MeassuringShape = this._shapeFactory.getShape(name);
        if (newShape) {
            this.shapes.push(newShape);
        }

    }

    removeSelectedShape(): void {
        if (this.selectedShape) {
            this.removeShapeFromList(this.selectedShape);
            const dummyCoordinate: Coordinate = { x: 0, y: 0 };
            this.notifyOfModelChange(dummyCoordinate);
        }
    }

    private removeShapeFromList(shape: MeassuringShape): void {
        const index: number = this.shapes.indexOf(shape);
        this.shapes.splice(index, 1);
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
        for (const shape of this.shapes) {
            shape.handleLeftClick(coordinate);
            if (shape.isSelected) {
                break;
            }
        }
    }

    get selectedShape(): MeassuringShape {
        for (const shape of this.shapes) {
            if (shape.isSelected) {
                return shape;
            }
        }
        return null;
    }


    subscribe(observer: Observer): void {
        this._listeners.add(observer);
    }

    unsubscribe(observer: Observer): void {
        this._listeners.delete(observer);
    }

    notifyOfMouseMovement(mousePosition: Coordinate): void {
        this._listeners.forEach((observer) => { observer.updateBecauseOfMovementInModel(this, mousePosition); });
    }

    notifyOfModelChange(mousePosition: Coordinate): void {
        this._listeners.forEach((observer) => {
            observer.updateBecauseModelHasChanged(this);
            observer.updateBecauseOfMovementInModel(this, mousePosition);
        });
    }
}