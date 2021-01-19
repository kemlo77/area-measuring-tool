import { Ruler } from '../Ruler.js';
import { Coordinate } from '../shape/Coordinate.js';
import { Point } from '../shape/Point.js';
import { Segment } from '../shape/Segment.js';
import { SimpleSegment } from '../shape/SimpleSegment.js';
import { Vector } from '../shape/Vector.js';
import { AbstractSegmentPainter } from './AbstractSegmentPainter.js';

export class RulerPainter extends AbstractSegmentPainter {

    private static instance: RulerPainter;
    private lineWidth: number = 3;

    private constructor() {
        super();
    }

    public static getInstance(): RulerPainter {
        if (!RulerPainter.instance) {
            RulerPainter.instance = new RulerPainter();
        }
        return RulerPainter.instance;
    }

    drawStill(motif: any): void {
        const ruler: Ruler = motif as Ruler;
        const segment: Segment = ruler.getStillSegment();
        if (segment !== null) {
            this.drawStillSegments([segment], this.lineWidth, ruler.color);
            this.drawStillSegments(this.generateRulerLines(segment), 1, '0,0,0');
            if (ruler.isComplete) {
                this.drawHollowDot(segment.p1, '0,0,0', this.stillCanvasCtx);
                this.drawHollowDot(segment.p2, '0,0,0', this.stillCanvasCtx);
            }
        }
    }

    private generateRulerLines(segment: Segment): Segment[] {
        const segments: Segment[] = new Array();
        const vector: Vector = new Vector(segment.p1, segment.p2);
        const direction: Vector = vector.generateUnitVector();
        const perpendicular: Vector = vector.generatePerpendicularUnitVector();
        let distanceBetweenLines: number = 15;
        let distanceTravelled: number = 0;
        while (distanceTravelled + distanceBetweenLines < segment.length) {
            distanceTravelled += distanceBetweenLines;
            let newPoint: Point = this.jumpToNewPoint(segment.p1, direction, distanceTravelled);
            segments.push(this.generateRulerLine(newPoint, perpendicular));
        }
        segments.push(this.generateRulerLine(segment.p1, perpendicular));
        segments.push(this.generateRulerLine(segment.p2, perpendicular));
        return segments;
    }

    private generateRulerLine(point: Point, direction: Vector): Segment {
        let point1: Point = this.jumpToNewPoint(point, direction, this.lineWidth / 2);
        let point2: Point = this.jumpToNewPoint(point, direction, -this.lineWidth / 2);
        return new Segment(point1, point2);
    }

    private jumpToNewPoint(point: Point, direction: Vector, distance: number): Point {
        if (direction.norm > 1) { console.warn('direction given is not a unit vector ' + direction.norm); };
        const newPointX: number = point.x + direction.x * distance;
        const newPointY: number = point.y + direction.y * distance;
        return new Point(newPointX, newPointY);
    }

    drawMovement(motif: any, mousePosition: Coordinate): void {
        const ruler: Ruler = motif as Ruler;
        const segment: Segment = ruler.getMovingSegment(mousePosition);
        if (segment !== null) {
            if (ruler.isMoving) {
                this.clearUsedPartOfCanvas();
                this.drawMovingSegments([segment], this.lineWidth, ruler.color);
                this.drawMovingSegments(this.generateRulerLines(segment), 1, '0,0,0');
                this.drawThePointNotMoving(ruler, this.movementCanvasCtx);
            }

        }
    }

    private drawThePointNotMoving(ruler: Ruler, ctx: CanvasRenderingContext2D): void {
        [ruler.p1, ruler.p2]
            .filter((it) => it !== ruler.movePoint)
            .forEach((it) => { this.drawHollowDot(it, '0,0,0', ctx); });
    }

}