import { Coordinate } from '../../../model/shape/Coordinate';
import { CanvasAssistant } from '../CanvasAssistant';
import { SegmentsPainter } from './SegmentsPainter';
import { Point } from '../../../model/shape/Point';
import { SegmentShape } from '../../../model/shape/segmentShapes/SegmentShape';
import { Segment } from '../../../model/shape/segmentShapes/Segment';

export abstract class AbstractSegmentsPainter extends CanvasAssistant implements SegmentsPainter {

    private recentlyPaintedMovingSegments: Segment[] = [];

    abstract drawStill(segmentShape: SegmentShape, color: string): void;
    abstract drawMovement(segmentShape: SegmentShape, color: string, mousePosition: Coordinate): void;

    drawStillSegments(segments: Segment[], width: number, color: string): void {
        segments.forEach((it) => {
            this.drawLine(it.p1, it.p2, width, color, this.stillCanvasCtx);
        });

    }

    drawMovingSegments(segments: Segment[], width: number, color: string): void {
        segments.forEach((it) => {
            this.drawLine(it.p1, it.p2, width, color, this.movementCanvasCtx);
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

    drawEndPointsOnSegments(segments: Segment[], color: string, ctx: CanvasRenderingContext2D): void {
        const uniqueEndpoints: Point[] = this.extractUniqueEndpoints(segments);
        uniqueEndpoints.forEach((it) => { this.drawHollowDot(it, color, ctx); });
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
            this.movementCanvasCtx.clearRect(xOffset, yOffset, width, height);

            //TODO: tre rader för att se "used part of canvas"
            //this.movementCanvasCtx.beginPath();
            //this.movementCanvasCtx.rect(xOffset, yOffset, width, height);
            //this.movementCanvasCtx.stroke();

            this.recentlyPaintedMovingSegments = [];
        }
    }

}