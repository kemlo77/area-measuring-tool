import { PaintableSegment } from '../polygon/PaintableSegment';
import { Polygon } from '../polygon/Polygon.js';
import { AbstractPainter } from './AbstractPainter.js';


export abstract class AbstractPolygonPainter extends AbstractPainter {

    private oldXMin: number = 0;
    private oldXMax: number = 1;
    private oldYMin: number = 0;
    private oldYMax: number = 1;

    drawStillPolygon(polygon: Polygon, color: string): void {
        polygon.getPaintableStillSegments()
            .forEach((it) => { this.drawOneSegment(it, color, this.stillCanvasCtx); });

        if (polygon.isSelected) {
            polygon.vertices
                .filter((it) => it !== polygon.movePoint)
                .forEach((it) => { this.drawHollowDot(it, color, this.stillCanvasCtx); });
        }
    }

    drawMovingSegments(segments: PaintableSegment[], color: string):void {
        if (segments.length > 0) {
            for (const segment of segments) {
                this.drawOneSegment(segment, color, this.movementCanvasCtx);
            }
            this.saveExtremes(segments);
        }
    }

    drawOneSegment(segment2draw: PaintableSegment, lineColor: string, ctx: CanvasRenderingContext2D): void {
        this.drawLine(segment2draw.p1, segment2draw.p2, lineColor, ctx);
    }


    saveExtremes(arrayWithSegments: PaintableSegment[]): void {
        this.oldXMin = arrayWithSegments[0].p1.x;
        this.oldXMax = arrayWithSegments[0].p1.x;
        this.oldYMin = arrayWithSegments[0].p1.y;
        this.oldYMax = arrayWithSegments[0].p1.y;
        for (const segment of arrayWithSegments) {
            if (this.oldXMin > segment.p1.x) { this.oldXMin = segment.p1.x; }
            if (this.oldXMax < segment.p1.x) { this.oldXMax = segment.p1.x; }
            if (this.oldYMin > segment.p1.y) { this.oldYMin = segment.p1.y; }
            if (this.oldYMax < segment.p1.y) { this.oldYMax = segment.p1.y; }

            if (this.oldXMin > segment.p2.x) { this.oldXMin = segment.p2.x; }
            if (this.oldXMax < segment.p2.x) { this.oldXMax = segment.p2.x; }
            if (this.oldYMin > segment.p2.y) { this.oldYMin = segment.p2.y; }
            if (this.oldYMax < segment.p2.y) { this.oldYMax = segment.p2.y; }
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