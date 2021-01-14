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
            this.oldXMax = coordinates
                .map((coordinate) => coordinate.x)
                .reduce((previous, current) => Math.max(previous, current));
            this.oldXMin = coordinates
                .map((coordinate) => coordinate.x)
                .reduce((previous, current) => Math.min(previous, current));
            this.oldYMax = coordinates
                .map((coordinate) => coordinate.y)
                .reduce((previous, current) => Math.max(previous, current));
            this.oldYMin = coordinates
                .map((coordinate) => coordinate.y)
                .reduce((previous, current) => Math.min(previous, current));
        }
    }

    clearUsedPartOfCanvas(): void {
        const xOffset: number = this.oldXMin - 2;
        const yOffset: number = this.oldYMin - 2;
        const width: number = this.oldXMax - this.oldXMin + 4;
        const height: number = this.oldYMax - this.oldYMin + 4;
        this.movementCanvasCtx.clearRect(xOffset, yOffset, width, height);

        this.oldXMin = 0;
        this.oldXMax = 1;
        this.oldYMin = 0;
        this.oldYMax = 1;
    }

}