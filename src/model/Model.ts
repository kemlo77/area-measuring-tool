import { Coordinate } from './shape/Coordinate.js';
import { InteractiveShape } from './shape/InteractiveShape.js';
import { ShapeFactory } from './ShapeFactory.js';

type ShapeAction = (shape: InteractiveShape, coordinate: Coordinate) => void;

//TODO: Borde jag implementera nåt interfejs?
export class Model {

    private shapes: InteractiveShape[] = [];
    private shapeFactory: ShapeFactory = new ShapeFactory();

    get listOfShapes(): InteractiveShape[] {
        return this.shapes;
    }

    addShape(name: string): void {
        if (this.noShapeIsSelected()) {
            const newShape: InteractiveShape = this.shapeFactory.getShape(name);
            if (newShape !== null) {
                this.shapes.push(newShape);
            }
        }
    }

    removeSelectedShape(): void {
        const selectedShape: InteractiveShape = this.getSelectedShape();
        if (selectedShape !== null) {
            this.removeShapeFromList(selectedShape);
        }
    }

    private removeShapeFromList(shape: InteractiveShape): void {
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

    anySelectedShapeReactToRightClick(coordinate: Coordinate): InteractiveShape {
        const action: ShapeAction = (shape, coordinate) => shape.handleRightClick(coordinate);
        return this.anySelectedShapeReactsToMouseEvent(coordinate, action);
    }

    anySelectedShapeReactToLeftMouseDown(coordinate: Coordinate): InteractiveShape {
        const action: ShapeAction = (shape, coordinate) => shape.handleLeftMouseDown(coordinate);
        return this.anySelectedShapeReactsToMouseEvent(coordinate, action);
    }

    anySelectedShapeReactToLeftMouseUp(coordinate: Coordinate): InteractiveShape {
        const action: ShapeAction = (shape, coordinate) => shape.handleLeftMouseUp(coordinate);
        return this.anySelectedShapeReactsToMouseEvent(coordinate, action);
    }

    private anySelectedShapeReactsToMouseEvent(coordinate: Coordinate, action: ShapeAction): InteractiveShape {
        const selectedShape: InteractiveShape = this.getSelectedShape();
        if (selectedShape !== null) {
            action(selectedShape, coordinate);
        }
        return selectedShape;
    }


    noShapeIsSelected(): boolean {
        return this.shapes.every((it) => { return !it.isSelected; });
    }

    getSelectedShape(): InteractiveShape {
        for (const shape of this.shapes) {
            if (shape.isSelected) {
                return shape;
            }
        }
        return null;
    }

}