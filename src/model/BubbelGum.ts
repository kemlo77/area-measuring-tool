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

    constructor(shape: InteractiveSegmentShape, segmentPainter: SegmentsPainter) {
        this._name = 'Shape_' + BubbelGum.initializedObjects++;
        this._shape = shape;
        this._segmentPainter = new RegularSegmentsPainter();
        this._segmentPainter = segmentPainter;
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

    get area(): number {
        return 9999;
    }

    get length(): number {
        return 8888;
    }

    get perimeterLength(): number {
        return 7777;
    }

    get paintingStrategy(): SegmentsPainter {
        return this._segmentPainter;
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