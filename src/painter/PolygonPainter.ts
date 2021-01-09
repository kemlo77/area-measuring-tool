import { Coordinate } from '../polygon/Coordinate.js';
import { PaintableSegment } from '../polygon/PaintableSegment.js';
import { Polygon } from '../polygon/Polygon.js';
import { AbstractPolygonPainter } from './AbstractPolygonPainter.js';

export class PolygonPainter extends AbstractPolygonPainter {

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
        this.drawStillPolygon(polygon, this._color);
    }

    drawMovement(motif: any, mousePosition: Coordinate): void {
        const polygon: Polygon = motif as Polygon;

        this.clearUsedPartOfCanvas();
        const segments: PaintableSegment[] = polygon.getPaintableMovingSegments(mousePosition);
        this.drawMovingSegments(segments, this._color);
    }

}