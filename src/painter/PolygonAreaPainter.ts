import { Coordinate } from '../polygon/Coordinate.js';
import { PaintableSegment } from '../polygon/PaintableSegment.js';
import { PolygonArea } from '../PolygonArea.js';
import { AbstractSegmentPainter } from './AbstractSegmentPainter.js';


export class PolygonAreaPainter extends AbstractSegmentPainter {

    private static instance: PolygonAreaPainter;

    private constructor() {
        super();
    }

    public static getInstance(): PolygonAreaPainter {
        if (!PolygonAreaPainter.instance) {
            PolygonAreaPainter.instance = new PolygonAreaPainter();
        }
        return PolygonAreaPainter.instance;
    }

    drawStill(motif: any): void {
        const polygon: PolygonArea = motif as PolygonArea;
        this.drawStillSegments(polygon.getPaintableStillSegments(), polygon.color);

        if (polygon.isSelected) {
            polygon.vertices
                .filter((it) => it !== polygon.movePoint)
                .forEach((it) => { this.drawHollowDot(it, polygon.color, this.stillCanvasCtx); });
        }

    }

    drawMovement(motif: any, mousePosition: Coordinate): void {
        const polygon: PolygonArea = motif as PolygonArea;
        this.clearUsedPartOfCanvas();
        const segments: PaintableSegment[] = polygon.getPaintableMovingSegments(mousePosition);
        this.drawMovingSegments(segments, polygon.color);
    }

}