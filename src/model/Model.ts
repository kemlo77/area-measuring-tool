import { BubbelGum } from './BubbelGum';
import { Coordinate } from './shape/Coordinate';
import { ShapeFactory } from './ShapeFactory';

type ShapeAction = (shape: BubbelGum, coordinate: Coordinate) => void;

export class Model {

    private shapes: BubbelGum[] = [];
    private shapeFactory: ShapeFactory = new ShapeFactory();

    get listOfShapes(): BubbelGum[] {
        return this.shapes;
    }

    addShape(name: string): void {
        if (this.noShapeIsSelected()) {
            const newShape: BubbelGum = this.shapeFactory.getShape(name);
            if (newShape !== null) {
                this.shapes.push(newShape);
            }
        }
    }

    removeSelectedShape(): void {
        const selectedShape: BubbelGum = this.getSelectedShape();
        if (selectedShape !== null) {
            this.removeShapeFromList(selectedShape);
        }
    }

    private removeShapeFromList(shape: BubbelGum): void {
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
        const selectedShape: BubbelGum = this.getSelectedShape();
        if (selectedShape !== null) {
            action(selectedShape, coordinate);
            return true;
        }
        return false;
    }


    noShapeIsSelected(): boolean {
        return this.shapes.every((it) => { return !it.isSelected; });
    }

    getSelectedShape(): BubbelGum {
        for (const shape of this.shapes) {
            if (shape.isSelected) {
                return shape;
            }
        }
        return null;
    }

    onlyAreaShapes(): BubbelGum[] {
        return this.shapes; //TODO: fixa filtret igen
    }

    onlyLengthShapes(): BubbelGum[] {
        return this.shapes; //TODO: fixa filtret igen
    }

}