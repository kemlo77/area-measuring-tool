import { AbstractPolygonArea } from './AbstractPolygonArea';
import { Ruler } from './Ruler';
import { Coordinate } from './shape/Coordinate';
import { InteractiveShape } from './shape/InteractiveShape';
import { ShapeFactory } from './ShapeFactory';

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
        const selectedShape: InteractiveShape = this.getSelectedShape();
        if (selectedShape !== null) {
            action(selectedShape, coordinate);
            return true;
        }
        return false;
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

    onlyAreaShapes(): AbstractPolygonArea[] {
        return this.shapes
            .filter((shape) => shape instanceof AbstractPolygonArea)
            .map((shape) => shape as AbstractPolygonArea);
    }

    onlyLengthShapes(): Ruler[] {
        return this.shapes
            .filter((it) => it instanceof Ruler)
            .map((it) => it as Ruler);
    }

}