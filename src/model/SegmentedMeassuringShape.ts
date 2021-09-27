import { SegmentsPainter } from '../view/canvasview/segmentPainters/SegmentsPainter';
import { MeassuringShape } from './MeassuringShape';
import { Coordinate } from './shape/Coordinate';
import { InteractiveSegmentShape } from './shape/segmentShapes/InteractiveSegmentShape';


export class SegmentedMeassuringShape extends MeassuringShape {
    
    private _shape: InteractiveSegmentShape;
    private _segmentPainter: SegmentsPainter;
    private _hasArea: boolean;

    constructor(shape: InteractiveSegmentShape, segmentPainter: SegmentsPainter, color: string, hasArea: boolean) {
        super(color);
        this._shape = shape;
        this._segmentPainter = segmentPainter;
        this._hasArea = hasArea;
    }

    get isSelected(): boolean {
        return this._shape.isSelected;
    }

    get hasArea(): boolean {
        return this._hasArea;
    }

    get area(): number {
        return this._shape.area;
    }

    get length(): number {
        return this._shape.length;
    }

    designatedPainterDrawStill(): void {
        this._segmentPainter.drawStill(this._shape, this.color);
    }

    designatedPainterDrawMovement(mousePosition: Coordinate): void {
        this._segmentPainter.drawMovement(this._shape, this.color, mousePosition);
    }

    handleLeftClick(coordinate: Coordinate): void {
        this._shape.handleLeftClick(coordinate);
    }

    handleRightClick(coordinate: Coordinate): void {
        this._shape.handleRightClick(coordinate);
    }

    handleLeftMouseDown(coordinate: Coordinate): void {
        this._shape.handleLeftMouseDown(coordinate);
    }

    handleLeftMouseUp(coordinate: Coordinate): void {
        this._shape.handleLeftMouseUp(coordinate);
    }
}