import { Coordinate } from '../shape/Coordinate.js';
import { Segment } from '../shape/Segment.js';
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
        this.drawStillSegments(polygon.getStillSegments(), 3, polygon.color);

        if (polygon.isSelected) {
            polygon.vertices
                .filter((it) => it !== polygon.movePoint)
                .forEach((it) => { this.drawHollowDot(it, polygon.color, this.stillCanvasCtx); });
        }

    }

    drawMovement(motif: any, mousePosition: Coordinate): void {
        const polygon: PolygonArea = motif as PolygonArea;
        this.clearUsedPartOfCanvas();
        const segments: Segment[] = polygon.getMovingSegments(mousePosition);
        this.drawMovingSegments(segments, 3, polygon.color);
        if (polygon.isMoving) {
            this.drawHollowDot(polygon.getPrecedingVertex(polygon.movePoint), polygon.color, this.movementCanvasCtx);
            this.drawHollowDot(polygon.getFollowingVertex(polygon.movePoint), polygon.color, this.movementCanvasCtx);
        } else if (polygon.isOpen) {
            if(polygon.vertices.length>0){
                this.drawHollowDot(polygon.lastVertex, polygon.color, this.movementCanvasCtx);
            }
        }
    }

}