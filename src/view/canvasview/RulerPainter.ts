import { Ruler } from '../../model/Ruler.js';
import { Coordinate } from '../../model/shape/Coordinate.js';
import { Point } from '../../model/shape/Point.js';
import { Segment } from '../../model/shape/Segment.js';
import { Vector } from '../../model/shape/Vector.js';
import { AbstractSegmentPainter } from './AbstractSegmentPainter.js';

export class RulerPainter extends AbstractSegmentPainter {

    private static instance: RulerPainter;
    private lineWidth: number = 3;


    public static getInstance(): RulerPainter {
        if (!RulerPainter.instance) {
            RulerPainter.instance = new RulerPainter();
        }
        return RulerPainter.instance;
    }

    drawStill(motif: any): void {
        const ruler: Ruler = motif as Ruler;
        const segment: Segment[] = ruler.getStillSegments();
        if (segment.length>0) {
            this.drawStillSegments(segment, this.lineWidth, ruler.color);
            this.drawStillSegments(this.generateRulerLines(segment[0]), 1, '0,0,0');
            if (ruler.isComplete) {
                this.drawHollowDot(segment[0].p1, '0,0,0', this.stillCanvasCtx);
                this.drawHollowDot(segment[0].p2, '0,0,0', this.stillCanvasCtx);
            }
        }
    }

    private generateRulerLines(segment: Segment): Segment[] {
        const segments: Segment[] = [];
        const vector: Vector = new Vector(segment.p1, segment.p2);
        const direction: Vector = vector.generateUnitVector();
        const perpendicular: Vector = vector.generatePerpendicularUnitVector();
        const distanceBetweenLines: number = 15;
        let distanceTravelled: number = 0;
        while (distanceTravelled + distanceBetweenLines < segment.length) {
            distanceTravelled += distanceBetweenLines;
            const newPoint: Point = this.jumpToNewPoint(segment.p1, direction, distanceTravelled);
            segments.push(this.generateRulerLine(newPoint, perpendicular));
        }
        segments.push(this.generateRulerLine(segment.p1, perpendicular));
        segments.push(this.generateRulerLine(segment.p2, perpendicular));
        return segments;
    }

    private generateRulerLine(point: Point, direction: Vector): Segment {
        const point1: Point = this.jumpToNewPoint(point, direction, this.lineWidth / 2);
        const point2: Point = this.jumpToNewPoint(point, direction, -this.lineWidth / 2);
        return new Segment(point1, point2);
    }

    private jumpToNewPoint(point: Point, direction: Vector, distance: number): Point {
        if (Math.abs(direction.norm - 1) > 0.000001) {
            console.warn('direction given is not a unit vector. Has length: ' + direction.norm);
        }
        const newPointX: number = point.x + direction.x * distance;
        const newPointY: number = point.y + direction.y * distance;
        return new Point(newPointX, newPointY);
    }

    drawMovement(motif: any, mousePosition: Coordinate): void {
        const ruler: Ruler = motif as Ruler;
        const segment: Segment[] = ruler.getMovingSegments(mousePosition);
        if (segment.length > 0) {
            if (ruler.isMoving) {
                this.clearUsedPartOfCanvas();
                this.drawMovingSegments(segment, this.lineWidth, ruler.color);
                this.drawMovingSegments(this.generateRulerLines(segment[0]), 1, '0,0,0');
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