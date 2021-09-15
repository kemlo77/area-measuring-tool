import { Coordinate } from '../../model/shape/Coordinate';
import { Polygon } from '../../model/shape/polygon/Polygon';
import { Segment } from '../../model/shape/Segment';
import { AbstractSegmentPainter } from './AbstractSegmentPainter';

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
        const movingSegments: Segment[] = polygon.getMovingSegments(mousePosition);
        this.clearUsedPartOfCanvas();
        this.drawMovingSegments(movingSegments, 3, this._color);
        this.drawNonMovingPointsOnMovingSegments(movingSegments, polygon.movePoint, this._color);
    }

}