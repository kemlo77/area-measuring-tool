import { CanvasPainter } from './CanvasPainter.js';
import { Coordinate } from '../Coordinate.js';
import { PaintableSegment } from '../PaintableSegment.js';
import { Polygon } from '../Polygon.js';

export class CanvasPolygonPainter extends CanvasPainter {

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
        this.clearTheStillCanvas();
        // draw 'segments' not marked as moving
        // draw dots
        const polygon: Polygon = motif as Polygon;
        polygon.getPaintableStillSegments().forEach((it) => { this.drawOneSegment(it, this.defaultColor); });
        console.log('CanvasPolygonPainter drawing still Polygon parts');
    }
    drawMovement(motif: any, mousePosition: Coordinate): void {
        this.clearUsedCanvas();
        // draw 'segments' marked as moving
        const polygon: Polygon = motif as Polygon;
        polygon.getPaintableMovingSegments(mousePosition).forEach((it) => { this.drawOneSegment(it, this.defaultColor); });
        console.log('CanvasPolygonPainter drawing moving Polygon parts');
        this.saveExtremes([{ x: 1, y: 2 }, { x: 1, y: 2 }]);
    }



    // draw a point with inner and outer color
    drawDoubleDot(dot2paint: Coordinate, outerColor: string, innerColor: string): void {
        // outer color (larger)
        this.drawDot(dot2paint, 4, outerColor);
        // inner color (smaler drawn on top of the other)
        this.drawDot(dot2paint, 2, innerColor);
    }

    drawDot(dot2paint: Coordinate, diam: number, rgbIn: string): void {
        this.stillCanvasCtx.fillStyle = 'rgba(' + rgbIn + ',1)';
        this.stillCanvasCtx.beginPath();
        this.stillCanvasCtx.arc(dot2paint.x, dot2paint.y, diam, 0, Math.PI * 2, true);
        this.stillCanvasCtx.closePath();
        this.stillCanvasCtx.fill();
    }

    drawOneSegment(segment2draw: PaintableSegment, lineColor: string): void {
        this.drawLine(segment2draw.p1, segment2draw.p2, lineColor, this.stillCanvasCtx);
    }

    drawLine(startP: Coordinate, endP: Coordinate, lineColor: string, ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = 'rgba(' + lineColor + ',1)';
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(startP.x, startP.y);
        ctx.lineTo(endP.x, endP.y);
        ctx.closePath();
        ctx.stroke();
    }



    private oldXMin: number = 0;
    private oldXMax: number = 1;
    private oldYMin: number = 0;
    private oldYMax: number = 1;

    saveExtremes(arrayWithPoints: Coordinate[]): void {
        this.oldXMin = arrayWithPoints[0].x;
        this.oldXMax = arrayWithPoints[0].x;
        this.oldYMin = arrayWithPoints[0].y;
        this.oldYMax = arrayWithPoints[0].y;
        for (let p = 1; p < arrayWithPoints.length; p++) {
            if (this.oldXMin > arrayWithPoints[p].x) { this.oldXMin = arrayWithPoints[p].x; }
            if (this.oldXMax < arrayWithPoints[p].x) { this.oldXMax = arrayWithPoints[p].x; }
            if (this.oldYMin > arrayWithPoints[p].y) { this.oldYMin = arrayWithPoints[p].y; }
            if (this.oldYMax < arrayWithPoints[p].y) { this.oldYMax = arrayWithPoints[p].y; }
        }
    }

    clearUsedCanvas(): void {
        this.movementCanvasCtx.clearRect(this.oldXMin - 2, this.oldYMin - 2, this.oldXMax - this.oldXMin + 4, this.oldYMax - this.oldYMin + 4);
    }

}