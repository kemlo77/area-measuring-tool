import { ConcreteShapeFactory } from './ConcreteShapeFactory';
import { MeassuringShape } from './MeassuringShape';
import { Coordinate } from './shape/Coordinate';
import { ShapeFactory } from './ShapeFactory';

type ShapeAction = (shape: MeassuringShape, coordinate: Coordinate) => void;

export class Model {

    private shapes: MeassuringShape[] = [];
    private _shapeFactory: ShapeFactory = new ConcreteShapeFactory();

    get listOfShapes(): MeassuringShape[] {
        return this.shapes;
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
    }

    private trySelectingAnyShapeByLeftClick(coordinate: Coordinate): void {
        for (const shape of this.shapes) {
            shape.handleLeftClick(coordinate);
            if (shape.isSelected) {
                break;
            }
        }
    }

    //TODO: skriva om dom här fyra följande eftersom det är svårläst?
    anySelectedShapeReactToRightClick(coordinate: Coordinate): boolean {
        const action: ShapeAction = (shape, coordinate) => shape.handleRightClick(coordinate);
        return this.anySelectedShapeReactsToMouseEvent(coordinate, action);
    }

    anySelectedShapeReactToLeftMouseDown(coordinate: Coordinate): boolean {
        const action: ShapeAction = (shape, coordinate) => shape.handleLeftMouseDown(coordinate);
        return this.anySelectedShapeReactsToMouseEvent(coordinate, action);
    }

    anySelectedShapeReactToLeftMouseUp(coordinate: Coordinate): boolean {
        const action: ShapeAction = (shape, coordinate) => shape.handleLeftMouseUp(coordinate);
        return this.anySelectedShapeReactsToMouseEvent(coordinate, action);
    }

    private anySelectedShapeReactsToMouseEvent(coordinate: Coordinate, action: ShapeAction): boolean {
        const selectedShape: MeassuringShape = this.getSelectedShape();
        if (selectedShape !== null) {
            action(selectedShape, coordinate);
            return true;
        }
        return false;
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

}