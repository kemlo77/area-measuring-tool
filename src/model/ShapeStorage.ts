import { MeassuringShape } from './meassuringshape/MeassuringShape';

export class ShapeStorage {

    private shapes: MeassuringShape[] = [];


    add(shape: MeassuringShape): void {
        this.shapes.push(shape);
    }

    getShapeById(id: number): MeassuringShape | undefined {
        return this.shapes.find(shape => shape.id == id);
    }

    removeShapeById(id: number): void {
        const shapeWithId: MeassuringShape | undefined = this.getShapeById(id);
        if (!shapeWithId) {
            throw new Error('The id does not exist in storage');
        }
        this.removeFromArray(shapeWithId);
    }

    getSelectedShape(): MeassuringShape | undefined {
        return this.shapes.find(shape => shape.isSelected);
    }

    removeSelectedShape(): void {
        const selectedShape: MeassuringShape | undefined = this.getSelectedShape();
        if (selectedShape) {
            this.removeShapeById(selectedShape.id);
        }
    }

    private removeFromArray(shape: MeassuringShape): void {
        const index: number = this.shapes.indexOf(shape);
        if (index > -1) {
            this.shapes.splice(index, 1);
        }
    }

    getAllShapes(): MeassuringShape[] {
        return this.shapes.slice();
    }

    getAreaShapes(): MeassuringShape[] {
        return this.shapes.filter(shape => shape.hasArea);
    }

    getLengthShapes(): MeassuringShape[] {
        return this.shapes.filter(shape => !shape.hasArea);
    }

}