import { CanvasPainter } from './CanvasPainter.js';
import { Coordinate } from '../polygon/Coordinate.js';
import { PaintableSegment } from '../polygon/PaintableSegment.js';
import { Polygon } from '../polygon/Polygon.js';

export class CanvasPolygonPainter extends CanvasPainter {

    private oldXMin: number = 0;
    private oldXMax: number = 1;
    private oldYMin: number = 0;
    private oldYMax: number = 1;


    private static instance: CanvasPolygonPainter;

    private constructor() {
        super();
    }

    public static getInstance(): CanvasPolygonPainter {
        if (!CanvasPolygonPainter.instance) {
            CanvasPolygonPainter.instance = new CanvasPolygonPainter();
        }
        return CanvasPolygonPainter.instance;
    }


    drawStill(motif: any): void {
        const polygon: Polygon = motif as Polygon;

        polygon.getPaintableStillSegments()
            .forEach((it) => { this.drawOneStillSegment(it, this.defaultColor); });

        if (polygon.isSelected) {
            for (const vertex of polygon.vertices) {
                if (vertex === polygon.movePoint) {
                    continue;
                }
                this.drawFilledDot(vertex, this.defaultColor, this.whiteColor);
            }
        }

    }

    drawMovement(motif: any, mousePosition: Coordinate): void {
        this.clearUsedPartOfCanvas();
        const polygon: Polygon = motif as Polygon;

        const segments: PaintableSegment[] = polygon.getPaintableMovingSegments(mousePosition);
        if (segments.length > 0) {
            for (const segment of segments) {
                this.drawOneMovingSegment(segment, this.defaultColor);
            }
            this.saveExtremes(segments);
        }

    }

    drawFilledDot(dot2paint: Coordinate, outerColor: string, innerColor: string): void {
        this.drawDot(dot2paint, 4, outerColor);
        this.drawDot(dot2paint, 2, innerColor);
    }

    drawDot(dot2paint: Coordinate, diam: number, rgbIn: string): void {
        this.stillCanvasCtx.fillStyle = 'rgba(' + rgbIn + ',1)';
        this.stillCanvasCtx.beginPath();
        this.stillCanvasCtx.arc(dot2paint.x, dot2paint.y, diam, 0, Math.PI * 2, true);
        this.stillCanvasCtx.closePath();
        this.stillCanvasCtx.fill();
    }

    drawOneStillSegment(segment2draw: PaintableSegment, lineColor: string): void {
        this.drawLine(segment2draw.p1, segment2draw.p2, lineColor, this.stillCanvasCtx);
    }

    drawOneMovingSegment(segment2draw: PaintableSegment, lineColor: string): void {
        this.drawLine(segment2draw.p1, segment2draw.p2, lineColor, this.movementCanvasCtx);
    }

    drawLine(startP: Coordinate, endP: Coordinate, lineColor: string, ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = 'rgba(' + lineColor + ',1)';
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.moveTo(startP.x, startP.y);
        ctx.lineTo(endP.x, endP.y);
        ctx.closePath();
        ctx.stroke();
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