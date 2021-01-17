import { Coordinate } from '../shape/Coordinate.js';
import { SimpleSegment } from '../shape/SimpleSegment.js';
import { Polygon } from '../shape/polygon/Polygon.js';
import { AbstractSegmentPainter } from './AbstractSegmentPainter.js';

export class PolygonPainter extends AbstractSegmentPainter {

    private _color: string = '0,0,0';


    private static instance: PolygonPainter;

    private constructor() {
        super();
    }

    public static getInstance(): PolygonPainter {
        if (!PolygonPainter.instance) {
            PolygonPainter.instance = new PolygonPainter();
        }
        return PolygonPainter.instance;
    }

    drawStill(motif: any): void {
        const polygon: Polygon = motif as Polygon;
        this.drawStillSegments(polygon.getStillSegments(), this._color);

        if (polygon.isSelected) {
            polygon.vertices
                .filter((it) => it !== polygon.movePoint)
                .forEach((it) => { this.drawHollowDot(it, this._color, this.stillCanvasCtx); });
        }
    }

    drawMovement(motif: any, mousePosition: Coordinate): void {
        const polygon: Polygon = motif as Polygon;

        this.clearUsedPartOfCanvas();
        const segments: SimpleSegment[] = polygon.getMovingSegments(mousePosition);
        this.drawMovingSegments(segments, this._color);
        if (polygon.isMoving) {
            this.drawHollowDot(polygon.getPrecedingVertex(polygon.movePoint), this._color, this.movementCanvasCtx);
            this.drawHollowDot(polygon.getFollowingVertex(polygon.movePoint), this._color, this.movementCanvasCtx);
        } else if (polygon.isOpen) {
            if (polygon.vertices.length > 0) {
                this.drawHollowDot(polygon.lastVertex, this._color, this.movementCanvasCtx);
            }
        }
    }

}