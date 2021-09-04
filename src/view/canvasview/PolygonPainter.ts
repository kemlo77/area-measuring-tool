import { Coordinate } from '../../model/shape/Coordinate.js';
import { Polygon } from '../../model/shape/polygon/Polygon.js';
import { Segment } from '../../model/shape/Segment.js';
import { AbstractSegmentPainter } from './AbstractSegmentPainter.js';

export class PolygonPainter extends AbstractSegmentPainter {

    private _color: string = '0,0,0';
    private static instance: PolygonPainter;


    public static getInstance(): PolygonPainter {
        if (!PolygonPainter.instance) {
            PolygonPainter.instance = new PolygonPainter();
        }
        return PolygonPainter.instance;
    }

    drawStill(motif: any): void {
        const polygon: Polygon = motif as Polygon;
        this.drawStillSegments(polygon.getStillSegments(), 3, this._color);

        if (polygon.isSelected) {
            polygon.nonMovingVertices
                .forEach((it) => { this.drawHollowDot(it, this._color, this.stillCanvasCtx); });
        }
    }

    drawMovement(motif: any, mousePosition: Coordinate): void {
        const polygon: Polygon = motif as Polygon;

        this.clearUsedPartOfCanvas();
        const movingSegments: Segment[] = polygon.getMovingSegments(mousePosition);
        this.drawMovingSegments(movingSegments, 3, this._color);
        if (polygon.isMoving) {
            polygon.verticesNextToTheVerticeMoving.forEach((it) => {
                this.drawHollowDot(it, this._color, this.movementCanvasCtx);
            });
        } else if (polygon.isOpen) {
            if (polygon.vertices.length > 0) {
                this.drawHollowDot(polygon.lastVertex, this._color, this.movementCanvasCtx);
            }
        }
    }

}