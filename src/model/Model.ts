import { Coordinate } from '../shape/Coordinate.js';
import { InteractiveShape } from '../shape/InteractiveShape.js';
import { ShapeFactory } from '../ShapeFactory.js';

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
        // kolla om nån redan är vald
        if (this.getSelectedShape() === null) {
            // kolla om nån blir vald genom vänsterklick. Ta den första träffen och avbryt sen
            for (const shape of this.shapes) {
                shape.handleLeftClick(coordinate);
                if (shape.isSelected) {
                    break;
                }
            }
        } else {
            this.getSelectedShape().handleLeftClick(coordinate);
        }
    }

    anySelectedShapeReactToRightClick(coordinate: Coordinate): InteractiveShape {
        const selectedShape: InteractiveShape = this.getSelectedShape();
        if (selectedShape !== null) {
            selectedShape.handleRightClick(coordinate);
        }
        return selectedShape;
    }

    anySelectedShapeReactToLeftMouseDown(coordinate: Coordinate): InteractiveShape {
        const selectedShape: InteractiveShape = this.getSelectedShape();
        if (selectedShape !== null) {
            selectedShape.handleLeftMouseDown(coordinate);
        }
        return selectedShape;
    }

    anySelectedShapeReactToLeftMouseUp(coordinate: Coordinate): InteractiveShape {
        const selectedShape: InteractiveShape = this.getSelectedShape();
        if (selectedShape !== null) {
            selectedShape.handleLeftMouseUp(coordinate);
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