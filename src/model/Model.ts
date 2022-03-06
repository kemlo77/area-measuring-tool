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



    get listOfShapes(): MeassuringShape[] {
        return this.shapes.slice();
    }

    set shapeFactory(shapeFactory: ShapeFactory) {
        this._shapeFactory = shapeFactory;
    }

    addShape(name: string): void {
        if (this.noShapeIsSelected()) {
            const newShape: MeassuringShape = this._shapeFactory.getShape(name);
            if (newShape !== null) {
                this.shapes.push(newShape);
            }
        }
    }

    removeSelectedShape(): void {
        const selectedShape: MeassuringShape = this.getSelectedShape();
        if (selectedShape !== null) {
            this.removeShapeFromList(selectedShape);
            const dummyCoordinate: Coordinate = { x: 0, y: 0 };
            this.notifyOfModelChange(dummyCoordinate);
        }
    }

    private removeShapeFromList(shape: MeassuringShape): void {
        const index: number = this.shapes.indexOf(shape);
        this.shapes.splice(index, 1);
    }

    reactToLeftClick(coordinate: Coordinate): void {
        if (this.noShapeIsSelected()) {
            this.trySelectingAnyShapeByLeftClick(coordinate);
        } else {
            this.getSelectedShape().handleLeftClick(coordinate);
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

    reactToMouseMovement(mousePosition: Coordinate): void {
        this.notifyOfMouseMovement(mousePosition);
    }

    //TODO: skriva om dom här fyra följande eftersom det är svårläst?
    reactToRightClick(coordinate: Coordinate): void {
        const action: ShapeAction = (shape, coordinate) => shape.handleRightClick(coordinate);
        this.anySelectedShapeReactsToMouseEvent(coordinate, action);
    }

    reactToLeftMouseDown(coordinate: Coordinate): void {
        const action: ShapeAction = (shape, coordinate) => shape.handleLeftMouseDown(coordinate);
        this.anySelectedShapeReactsToMouseEvent(coordinate, action);
    }

    reactToLeftMouseUp(coordinate: Coordinate): void {
        const action: ShapeAction = (shape, coordinate) => shape.handleLeftMouseUp(coordinate);
        this.anySelectedShapeReactsToMouseEvent(coordinate, action);
    }

    private anySelectedShapeReactsToMouseEvent(coordinate: Coordinate, action: ShapeAction): void {
        const selectedShape: MeassuringShape = this.getSelectedShape();
        if (selectedShape !== null) {
            action(selectedShape, coordinate);
            this.notifyOfModelChange(coordinate);
        }
    }


    noShapeIsSelected(): boolean {
        return this.shapes.every((it) => { return !it.isSelected; });
    }

    getSelectedShape(): MeassuringShape {
        for (const shape of this.shapes) {
            if (shape.isSelected) {
                return shape;
            }
        }
        return null;
    }

    onlyAreaShapes(): MeassuringShape[] {
        return this.shapes.filter((it) => it.hasArea);
    }

    onlyLengthShapes(): MeassuringShape[] {
        return this.shapes.filter((it) => !it.hasArea);
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