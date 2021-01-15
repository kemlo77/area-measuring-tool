import { Coordinate } from '../polygon/Coordinate.js';
import { PaintableSegment } from '../polygon/PaintableSegment.js';
import { Polygon } from '../polygon/Polygon.js';
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
        this.drawStillSegments(polygon.getPaintableStillSegments(), this._color);

        if (polygon.isSelected) {
            polygon.vertices
                .filter((it) => it !== polygon.movePoint)
                .forEach((it) => { this.drawHollowDot(it, this._color, this.stillCanvasCtx); });
        }
    }

    drawMovement(motif: any, mousePosition: Coordinate): void {
        const polygon: Polygon = motif as Polygon;

        this.clearUsedPartOfCanvas();
        const segments: PaintableSegment[] = polygon.getPaintableMovingSegments(mousePosition);
        this.drawMovingSegments(segments, this._color);
        if (polygon.isMoving) {
            this.drawHollowDot(polygon.getPrecedingVertex(polygon.movePoint), this._color, this.movementCanvasCtx);
            this.drawHollowDot(polygon.getFollowingVertex(polygon.movePoint), this._color, this.movementCanvasCtx);
        } else if (polygon.isOpen) {
            this.drawHollowDot(polygon.lastVertex, this._color, this.movementCanvasCtx);
        }

    }

}