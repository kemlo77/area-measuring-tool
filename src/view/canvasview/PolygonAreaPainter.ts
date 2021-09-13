
import { AbstractPolygonArea } from '../../model/AbstractPolygonArea.js';
import { Coordinate } from '../../model/shape/Coordinate.js';
import { Segment } from '../../model/shape/Segment.js';
import { AbstractSegmentPainter } from './AbstractSegmentPainter.js';



export class PolygonAreaPainter extends AbstractSegmentPainter {

    private static instance: PolygonAreaPainter;


    public static getInstance(): PolygonAreaPainter {
        if (!PolygonAreaPainter.instance) {
            PolygonAreaPainter.instance = new PolygonAreaPainter();
        }
        return PolygonAreaPainter.instance;
    }

    drawStill(motif: any): void {
        const polygon: AbstractPolygonArea = motif as AbstractPolygonArea;
        this.drawStillSegments(polygon.getStillSegments(), 3, polygon.color);

        if (polygon.isSelected) {
            polygon.nonMovingVertices
                .forEach((it) => { this.drawHollowDot(it, polygon.color, this.stillCanvasCtx); });
        }
    }

    drawMovement(motif: any, mousePosition: Coordinate): void {
        const polygon: AbstractPolygonArea = motif as AbstractPolygonArea;
        const movingSegments: Segment[] = polygon.getMovingSegments(mousePosition);
        this.clearUsedPartOfCanvas();
        this.drawMovingSegments(movingSegments, 3, polygon.color);
        this.drawNonMovingPointsOnMovingSegments(movingSegments, polygon.movePoint, polygon.color);
    }



}