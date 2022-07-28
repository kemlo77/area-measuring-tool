import { Coordinate } from '../../../model/shape/Coordinate';
import { SegmentsPainter } from './SegmentsPainter';
import { Point } from '../../../model/shape/Point';
import { SegmentShape } from '../../../model/shape/segmentShapes/SegmentShape';
import { Segment } from '../../../model/shape/segmentShapes/Segment';
import { CanvasWrapper } from '../canvaswrapper';

export abstract class AbstractSegmentsPainter implements SegmentsPainter {

    protected _movementCanvas: CanvasWrapper = new CanvasWrapper('movementLayer');
    protected _stillCanvas: CanvasWrapper = new CanvasWrapper('stillLayer');
    protected black: string = '0,0,0';
    protected yellow: string = '255,255,0';
    protected lineWidth: number = 3;

    private segmentsRecentlyPaintedInMovementLayer: Segment[] = [];

    drawStill(segmentShape: SegmentShape, color: string): void {
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

    drawMovement(segmentShape: SegmentShape, color: string, mousePosition: Coordinate): void {
        const movingSegments: Segment[] = segmentShape.getMovingSegments(mousePosition);

        this.clearUsedPartOfCanvas();

        this.drawSegmentsInCanvas(movingSegments, color, this._movementCanvas);

        this.addToSegmentsRecentlyPaintedInMovementCanvas(movingSegments);

        this.drawEndpointsInCanvas(movingSegments, color, this._movementCanvas);
    }

    protected fillPolygonInCanvas(points: Point[], color: string, canvas: CanvasWrapper): void {
        //
    }

    protected drawSegmentsInCanvas(segments: Segment[], color: string, canvas: CanvasWrapper): void {
        segments.forEach((it) => {
            canvas.drawLine(it.p1, it.p2, this.lineWidth, color);
        });
    }

    protected drawEndpointsInCanvas(segments: Segment[], color: string, canvas: CanvasWrapper): void {
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

}