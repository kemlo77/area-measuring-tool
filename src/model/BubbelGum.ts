import { RegularSegmentsPainter } from '../view/canvasview/segmentPainters/RegularSegmentsPainter';
import { SegmentsPainter } from '../view/canvasview/segmentPainters/SegmentsPainter';
import { Coordinate } from './shape/Coordinate';
import { InteractiveSegmentShape } from './shape/segmentShapes/InteractiveSegmentShape';
import { Segment } from './shape/segmentShapes/Segment';



export class BubbelGum implements InteractiveSegmentShape {

    private static initializedObjects: number = 0;
    private _color: string = '128,0,0';
    private _name: string;
    private _shape: InteractiveSegmentShape;
    private _segmentPainter: SegmentsPainter;
    private _hasArea: boolean;

    constructor(shape: InteractiveSegmentShape, segmentPainter: SegmentsPainter, color: string, hasArea: boolean) {
        this._name = 'Shape_' + BubbelGum.initializedObjects++;
        this._shape = shape;
        this._segmentPainter = new RegularSegmentsPainter();
        this._segmentPainter = segmentPainter;
        this._color = color;
        this._hasArea = hasArea;
    }

    get color(): string {
        return this._color;
    }

    set color(color: string) {
        // TODO: kolla att strängen som kommer har rätt format
        this._color = color;
    }

    get name(): string {
        return this._name;
    }

    set name(newName: string) {
        this._name = newName;
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
        this._segmentPainter.drawStill(this._shape, this._color);
    }

    designatedPainterDrawMovement(mousePosition: Coordinate): void {
        this._segmentPainter.drawMovement(this._shape, this._color, mousePosition);
    }


    get isSelected(): boolean {
        return this._shape.isSelected;
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


    getStillSegments(): Segment[] {
        return this._shape.getStillSegments();
    }
    getMovingSegments(mousePosition: Coordinate): Segment[] {
        return this._shape.getMovingSegments(mousePosition);
    }


}