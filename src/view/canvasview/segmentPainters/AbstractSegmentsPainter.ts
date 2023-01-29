import { Coordinate } from '../../../model/meassuringshape/shape/Coordinate';
import { SegmentsPainter } from './SegmentsPainter';
import { Point } from '../../../model/meassuringshape/shape/Point';
import { SegmentShape } from '../../../model/meassuringshape/shape/segmentShapes/SegmentShape';
import { Segment } from '../../../model/meassuringshape/shape/segmentShapes/Segment';
import { CanvasWrapper } from '../CanvasWrapper';
import { DrawingCanvasWrapper } from '../DrawingCanvasWrapper';
import { Color } from '../../../model/meassuringshape/Color';

export abstract class AbstractSegmentsPainter implements SegmentsPainter {

    protected _movementCanvas: DrawingCanvasWrapper = new DrawingCanvasWrapper('movementLayer');
    protected _stillCanvas: DrawingCanvasWrapper = new DrawingCanvasWrapper('stillLayer');
    protected lineWidth: number = 3;

    private segmentsRecentlyPaintedInMovementLayer: Segment[] = [];

    drawStill(segmentShape: SegmentShape, color: Color): void {
        const stillSegments: Segment[] = segmentShape.getStillSegments();

        if (segmentShape.isClosed && !segmentShape.isMoving) {
            const firstPoints: Point[] = stillSegments.map(segment => segment.p1);
            this.fillPolygonInCanvas(firstPoints, color, this._stillCanvas);
        }

        this.drawSegmentsInCanvas(stillSegments, color, this._stillCanvas);

        if (segmentShape.isSelected) {
            this.drawEndpointsInCanvas(stillSegments, color, this._stillCanvas);
        }
    }

    drawMovement(segmentShape: SegmentShape, color: Color, mousePosition: Coordinate): void {
        const movingSegments: Segment[] = segmentShape.getMovingSegments(mousePosition);

        this.clearUsedPartOfCanvas();

        this.drawSegmentsInCanvas(movingSegments, color, this._movementCanvas);

        this.addToSegmentsRecentlyPaintedInMovementCanvas(movingSegments);

        this.drawEndpointsInCanvas(movingSegments, color, this._movementCanvas);
    }

    protected fillPolygonInCanvas(points: Point[], color: Color, canvas: CanvasWrapper): void {
        //
    }

    protected drawSegmentsInCanvas(segments: Segment[], color: Color, canvas: DrawingCanvasWrapper): void {
        segments.forEach((it) => {
            canvas.drawLine(it.p1, it.p2, this.lineWidth, color);
        });
    }

    protected drawEndpointsInCanvas(segments: Segment[], color: Color, canvas: DrawingCanvasWrapper): void {
        const uniqueEndpoints: Point[] = this.extractUniqueEndpoints(segments);
        uniqueEndpoints.forEach((it) => { canvas.drawHollowDot(it, color); });
    }

    private extractUniqueEndpoints(segments: Segment[]): Point[] {
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

    private addToSegmentsRecentlyPaintedInMovementCanvas(segments: Segment[]): void {
        this.segmentsRecentlyPaintedInMovementLayer = this.segmentsRecentlyPaintedInMovementLayer.concat(segments);
    }

    private clearUsedPartOfCanvas(): void {
        if (this.segmentsRecentlyPaintedInMovementLayer.length > 0) {

            const coordinates: Coordinate[] = [];
            this.segmentsRecentlyPaintedInMovementLayer.forEach((segment) => {
                coordinates.push(segment.p1);
                coordinates.push(segment.p2);
            });
            const xCoordinates: number[] = coordinates.map((coordinate) => coordinate.x);
            const yCoordinates: number[] = coordinates.map((coordinate) => coordinate.y);
            const xMax: number = this.maxValue(xCoordinates);
            const xMin: number = this.minValue(xCoordinates);
            const yMax: number = this.maxValue(yCoordinates);
            const yMin: number = this.minValue(yCoordinates);

            const upperLeft: Coordinate = { x: xMin, y: yMin };
            const lowerRight: Coordinate = { x: xMax, y: yMax };
            this._movementCanvas.clearPartOfCanvas(upperLeft, lowerRight);

            this.segmentsRecentlyPaintedInMovementLayer = [];
        }
    }

    private maxValue(numbers: number[]): number {
        return numbers.reduce((previous, current) => Math.max(previous, current));
    }

    private minValue(numbers: number[]): number {
        return numbers.reduce((previous, current) => Math.min(previous, current));
    }

}