import { Coordinate } from '../../../model/shape/Coordinate';
import { SegmentsPainter } from './SegmentsPainter';
import { Point } from '../../../model/shape/Point';
import { SegmentShape } from '../../../model/shape/segmentShapes/SegmentShape';
import { Segment } from '../../../model/shape/segmentShapes/Segment';
import { Vector } from '../../../model/shape/Vector';
import { CanvasWraper } from '../canvaswrapper';

export abstract class AbstractSegmentsPainter implements SegmentsPainter {

    protected _movementCanvas: CanvasWraper = new CanvasWraper('movementLayer');
    protected _stillCanvas: CanvasWraper = new CanvasWraper('stillLayer');

    private recentlyPaintedMovingSegments: Segment[] = [];

    abstract drawStill(segmentShape: SegmentShape, color: string): void;
    abstract drawMovement(segmentShape: SegmentShape, color: string, mousePosition: Coordinate): void;

    drawStillSegments(segments: Segment[], width: number, color: string): void {
        segments.forEach((it) => {
            this._stillCanvas.drawLine(it.p1, it.p2, width, color);
        });

    }

    drawMovingSegments(segments: Segment[], width: number, color: string): void {
        segments.forEach((it) => {
            this._movementCanvas.drawLine(it.p1, it.p2, width, color);
        });
        this.addSegmentsToRecentlyPaintedSegments(segments);
    }

    addSegmentsToRecentlyPaintedSegments(segments: Segment[]): void {
        this.recentlyPaintedMovingSegments = this.recentlyPaintedMovingSegments.concat(segments);
    }

    extractUniqueEndpoints(segments: Segment[]): Point[] {
        const uniquePoints: Set<Point> = new Set<Point>();
        for (const segment of segments) {
            if (!uniquePoints.has(segment.p1)) {
                uniquePoints.add(segment.p1);
            }
            if (!uniquePoints.has(segment.p2)) {
                uniquePoints.add(segment.p2);
            }
        }
        return Array.from(uniquePoints);
    }


    drawStillPoints(segments: Segment[], color: string): void {
        const uniqueEndpoints: Point[] = this.extractUniqueEndpoints(segments);
        uniqueEndpoints.forEach((it) => { this._stillCanvas.drawHollowDot(it, color); });
    }

    drawMovingPoints(segments: Segment[], color: string): void {
        const uniqueEndpoints: Point[] = this.extractUniqueEndpoints(segments);
        uniqueEndpoints.forEach((it) => { this._movementCanvas.drawHollowDot(it, color); });
    }

    private maxValue(numbers: number[]): number {
        return numbers.reduce((previous, current) => Math.max(previous, current));
    }

    private minValue(numbers: number[]): number {
        return numbers.reduce((previous, current) => Math.min(previous, current));
    }

    clearUsedPartOfCanvas(): void {
        if (this.recentlyPaintedMovingSegments.length > 0) {
            let oldXMin: number = 0;
            let oldXMax: number = 1;
            let oldYMin: number = 0;
            let oldYMax: number = 1;

            const coordinates: Coordinate[] = [];
            this.recentlyPaintedMovingSegments.forEach((segment) => {
                coordinates.push(segment.p1);
                coordinates.push(segment.p2);
            });
            const xCoordinates: number[] = coordinates.map((coordinate) => coordinate.x);
            const yCoordinates: number[] = coordinates.map((coordinate) => coordinate.y);
            oldXMax = this.maxValue(xCoordinates);
            oldXMin = this.minValue(xCoordinates);
            oldYMax = this.maxValue(yCoordinates);
            oldYMin = this.minValue(yCoordinates);

            const xOffset: number = oldXMin - 4;
            const yOffset: number = oldYMin - 4;
            const width: number = oldXMax - oldXMin + 8;
            const height: number = oldYMax - oldYMin + 8;
            this._movementCanvas.clearPartOfCanvas(xOffset, yOffset, width, height);

            this.recentlyPaintedMovingSegments = [];
        }
    }

    protected jumpToNewPoint(fromPoint: Point, direction: Vector, distance: number): Point {
        const newPointX: number = fromPoint.x + direction.x * distance;
        const newPointY: number = fromPoint.y + direction.y * distance;
        return new Point(newPointX, newPointY);
    }

}