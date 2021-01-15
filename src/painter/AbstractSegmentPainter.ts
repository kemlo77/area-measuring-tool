import { Coordinate } from '../polygon/Coordinate';
import { PaintableSegment } from '../polygon/PaintableSegment';
import { Point } from '../polygon/Point';
import { AbstractPainter } from './AbstractPainter.js';


export abstract class AbstractSegmentPainter extends AbstractPainter {

    private oldXMin: number = 0;
    private oldXMax: number = 1;
    private oldYMin: number = 0;
    private oldYMax: number = 1;

    drawStillSegments(segments: PaintableSegment[], color: string): void {
        segments.forEach((it) => { this.drawOneSegment(it, color, this.stillCanvasCtx); });

    }

    drawMovingSegments(segments: PaintableSegment[], color: string): void {
        segments.forEach((it) => {
            this.drawOneSegment(it, color, this.movementCanvasCtx);
        });
        this.saveExtremes(segments);
    }

    drawOneSegment(segment2draw: PaintableSegment, lineColor: string, ctx: CanvasRenderingContext2D): void {
        this.drawLine(segment2draw.p1, segment2draw.p2, lineColor, ctx);
    }


    saveExtremes(arrayWithSegments: PaintableSegment[]): void {
        if (arrayWithSegments.length > 0) {
            const coordinates: Coordinate[] = new Array();
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