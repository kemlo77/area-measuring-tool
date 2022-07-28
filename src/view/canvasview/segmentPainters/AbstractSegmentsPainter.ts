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
    protected black: string = '0,0,0';
    protected yellow: string = '255,255,0';

    private segmentsRecentlyPaintedInMovementLayer: Segment[] = [];

    abstract drawStill(segmentShape: SegmentShape, color: string): void;
    abstract drawMovement(segmentShape: SegmentShape, color: string, mousePosition: Coordinate): void;

    drawSegmentsInCanvas(segments: Segment[], width: number, color: string, canvas: CanvasWraper): void {
        segments.forEach((it) => {
            canvas.drawLine(it.p1, it.p2, width, color);
        });
    }

    drawDashedSegmentsInCanvas(
        segments: Segment[],
        width: number,
        color: string,
        pattern: number[],
        canvas: CanvasWraper
    ): void {
        segments.forEach((it) => {
            canvas.drawDashedLine(it.p1, it.p2, width, color, pattern);
        });

    }

    drawEndpointsInCanvas(segments: Segment[], color: string, canvas: CanvasWraper): void {
        const uniqueEndpoints: Point[] = this.extractUniqueEndpoints(segments);
        uniqueEndpoints.forEach((it) => { canvas.drawHollowDot(it, color); });
    }

    fillPolygonInStillLayer(points: Point[], color: string): void {
        this._stillCanvas.fillPolygon(points, color);
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

    addToSegmentsRecentlyPaintedInMovementLayer(segments: Segment[]): void {
        this.segmentsRecentlyPaintedInMovementLayer = this.segmentsRecentlyPaintedInMovementLayer.concat(segments);
    }

    clearUsedPartOfCanvas(): void {
        if (this.segmentsRecentlyPaintedInMovementLayer.length > 0) {
            let oldXMin: number = 0;
            let oldXMax: number = 1;
            let oldYMin: number = 0;
            let oldYMax: number = 1;

            const coordinates: Coordinate[] = [];
            this.segmentsRecentlyPaintedInMovementLayer.forEach((segment) => {
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

            this.segmentsRecentlyPaintedInMovementLayer = [];
        }
    }

    private maxValue(numbers: number[]): number {
        return numbers.reduce((previous, current) => Math.max(previous, current));
    }

    private minValue(numbers: number[]): number {
        return numbers.reduce((previous, current) => Math.min(previous, current));
    }

    protected jumpToNewPoint(fromPoint: Point, direction: Vector, distance: number): Point {
        const newPointX: number = fromPoint.x + direction.x * distance;
        const newPointY: number = fromPoint.y + direction.y * distance;
        return new Point(newPointX, newPointY);
    }

}