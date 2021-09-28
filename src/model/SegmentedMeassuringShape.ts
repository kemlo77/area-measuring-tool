import { RegularSegmentsPainter } from '../view/canvasview/segmentPainters/RegularSegmentsPainter';
import { SegmentsPainter } from '../view/canvasview/segmentPainters/SegmentsPainter';
import { MeassuringShape } from './MeassuringShape';
import { Coordinate } from './shape/Coordinate';
import { InteractiveSegmentShape } from './shape/segmentShapes/InteractiveSegmentShape';


export class SegmentedMeassuringShape extends MeassuringShape {

    private _interactiveSegmentShape: InteractiveSegmentShape;
    private _designatedPainter: SegmentsPainter = new RegularSegmentsPainter();
    private _hasArea: boolean;

    constructor(shape: InteractiveSegmentShape, hasArea: boolean) {
        super();
        this._interactiveSegmentShape = shape;
        this._hasArea = hasArea;
    }

    get isSelected(): boolean {
        return this._interactiveSegmentShape.isSelected;
    }

    get hasArea(): boolean {
        return this._hasArea;
    }

    set hasArea(hasArea: boolean) {
        this._hasArea = hasArea;
    }

    get area(): number {
        return this._interactiveSegmentShape.area * this.areaValueSign;
    }

    get length(): number {
        return this._interactiveSegmentShape.length;
    }

    set designatedPainter(segmentPainter: SegmentsPainter) {
        this._designatedPainter = segmentPainter;
    }

    designatedPainterDrawStill(): void {
        this._designatedPainter.drawStill(this._interactiveSegmentShape, this.color);
    }

    designatedPainterDrawMovement(mousePosition: Coordinate): void {
        this._designatedPainter.drawMovement(this._interactiveSegmentShape, this.color, mousePosition);
    }

    handleLeftClick(coordinate: Coordinate): void {
        this._interactiveSegmentShape.handleLeftClick(coordinate);
    }

    handleRightClick(coordinate: Coordinate): void {
        this._interactiveSegmentShape.handleRightClick(coordinate);
    }

    handleLeftMouseDown(coordinate: Coordinate): void {
        this._interactiveSegmentShape.handleLeftMouseDown(coordinate);
    }

    handleLeftMouseUp(coordinate: Coordinate): void {
        this._interactiveSegmentShape.handleLeftMouseUp(coordinate);
    }
}