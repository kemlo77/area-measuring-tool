import { CanvasPainter } from './CanvasPainter.js';
import { Coordinate } from '../polygon/Coordinate.js';
import { PaintableSegment } from '../polygon/PaintableSegment.js';
import { PolygonArea } from '../PolygonArea.js';


export class CanvasPolygonAreaPainter extends CanvasPainter {

    private oldXMin: number = 0;
    private oldXMax: number = 1;
    private oldYMin: number = 0;
    private oldYMax: number = 1;


    private static instance: CanvasPolygonAreaPainter;

    private constructor() {
        super();
    }

    public static getInstance(): CanvasPolygonAreaPainter {
        if (!CanvasPolygonAreaPainter.instance) {
            CanvasPolygonAreaPainter.instance = new CanvasPolygonAreaPainter();
        }
        return CanvasPolygonAreaPainter.instance;
    }


    drawStill(motif: any): void {
        const polygon: PolygonArea = motif as PolygonArea;

        polygon.getPaintableStillSegments()
            .forEach((it) => { this.drawOneSegment(it, polygon.color, this.stillCanvasCtx); });

        if (polygon.isSelected) {
            for (const vertex of polygon.vertices) {
                if (vertex === polygon.movePoint) {
                    continue;
                }
                this.drawHollowDot(vertex, polygon.color, this.stillCanvasCtx);
            }
        }

    }

    drawMovement(motif: any, mousePosition: Coordinate): void {
        this.clearUsedPartOfCanvas();
        const polygon: PolygonArea = motif as PolygonArea;

        const segments: PaintableSegment[] = polygon.getPaintableMovingSegments(mousePosition);
        if (segments.length > 0) {
            for (const segment of segments) {
                this.drawOneSegment(segment, polygon.color, this.movementCanvasCtx);
            }
            this.saveExtremes(segments);
        }

    }

    private drawOneSegment(segment2draw: PaintableSegment, lineColor: string, ctx: CanvasRenderingContext2D): void {
        this.drawLine(segment2draw.p1, segment2draw.p2, lineColor, ctx);
    }


    private saveExtremes(arrayWithSegments: PaintableSegment[]): void {
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

    private clearUsedPartOfCanvas(): void {
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