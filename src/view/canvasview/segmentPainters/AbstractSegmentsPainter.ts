import { Coordinate } from '../../../model/shape/Coordinate';
import { CanvasAssistant } from '../CanvasAssistant';
import { SegmentsPainter } from './SegmentsPainter';
import { Point } from '../../../model/shape/Point';
import { SegmentShape } from '../../../model/shape/segmentShapes/SegmentShape';
import { Segment } from '../../../model/shape/segmentShapes/Segment';

export abstract class AbstractSegmentsPainter extends CanvasAssistant implements SegmentsPainter {

    private oldXMin: number = 0;
    private oldXMax: number = 1;
    private oldYMin: number = 0;
    private oldYMax: number = 1;

    abstract drawStill(segmentShape: SegmentShape): void;
    abstract drawMovement(segmentShape: SegmentShape, mousePosition: Coordinate): void;

    drawStillSegments(segments: Segment[], width: number, color: string): void {
        segments.forEach((it) => {
            this.drawLine(it.p1, it.p2, width, color, this.stillCanvasCtx);
        });

    }

    drawMovingSegments(segments: Segment[], width: number, color: string): void {
        segments.forEach((it) => {
            this.drawLine(it.p1, it.p2, width, color, this.movementCanvasCtx);
        });
        this.saveExtremes(segments);
    }

    extractUniqueEndpoints(segments: Segment[]): Point[] {
        const uniquePoints: Set<Point> = new Set<Point>();
        for (let i: number = 0; i < segments.length; i++) {
            if (!uniquePoints.has(segments[i].p1)) {
                uniquePoints.add(segments[i].p1);
            }
            if (!uniquePoints.has(segments[i].p2)) {
                uniquePoints.add(segments[i].p2);
            }
        }
        return Array.from(uniquePoints);
    }

    drawEndPointsOnSegments(segments: Segment[], color: string, ctx: CanvasRenderingContext2D): void {
        const uniqueEndpoints: Point[] = this.extractUniqueEndpoints(segments);
        uniqueEndpoints.forEach((it) => { this.drawHollowDot(it, color, ctx); });
    }

    saveExtremes(arrayWithSegments: Segment[]): void {
        if (arrayWithSegments.length > 0) {
            const coordinates: Coordinate[] = [];
            arrayWithSegments.forEach((segment) => {
                coordinates.push(segment.p1);
                coordinates.push(segment.p2);
            });
            const xCoordinates: number[] = coordinates.map((coordinate) => coordinate.x);
            const yCoordinates: number[] = coordinates.map((coordinate) => coordinate.y);
            this.oldXMax = this.maxValue(xCoordinates);
            this.oldXMin = this.minValue(xCoordinates);
            this.oldYMax = this.maxValue(yCoordinates);
            this.oldYMin = this.minValue(yCoordinates);
        }
    }

    private maxValue(numbers: number[]): number {
        return numbers.reduce((previous, current) => Math.max(previous, current));
    }

    private minValue(numbers: number[]): number {
        return numbers.reduce((previous, current) => Math.min(previous, current));
    }

    clearUsedPartOfCanvas(): void {
        const xOffset: number = this.oldXMin - 4;
        const yOffset: number = this.oldYMin - 4;
        const width: number = this.oldXMax - this.oldXMin + 8;
        const height: number = this.oldYMax - this.oldYMin + 8;
        this.movementCanvasCtx.clearRect(xOffset, yOffset, width, height);

        this.oldXMin = 0;
        this.oldXMax = 1;
        this.oldYMin = 0;
        this.oldYMax = 1;
    }

}