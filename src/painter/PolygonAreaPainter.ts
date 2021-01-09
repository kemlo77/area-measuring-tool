import { Coordinate } from '../polygon/Coordinate.js';
import { PaintableSegment } from '../polygon/PaintableSegment.js';
import { PolygonArea } from '../PolygonArea.js';
import { AbstractPolygonPainter } from './AbstractPolygonPainter.js';


export class PolygonAreaPainter extends AbstractPolygonPainter {

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
        this.drawStillPolygon(polygon, polygon.color);

    }

    drawMovement(motif: any, mousePosition: Coordinate): void {
        const polygon: PolygonArea = motif as PolygonArea;
        this.clearUsedPartOfCanvas();
        const segments: PaintableSegment[] = polygon.getPaintableMovingSegments(mousePosition);
        this.drawMovingSegments(segments, polygon.color);
    }

}