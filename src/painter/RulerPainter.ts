import { Ruler } from '../Ruler.js';
import { Coordinate } from '../shape/Coordinate.js';
import { Point } from '../shape/Point.js';
import { Segment } from '../shape/Segment.js';
import { SimpleSegment } from '../shape/SimpleSegment.js';
import { Vector } from '../shape/Vector.js';
import { AbstractSegmentPainter } from './AbstractSegmentPainter.js';

export class RulerPainter extends AbstractSegmentPainter {

    private static instance: RulerPainter;

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
            this.drawStillSegments([segment], 3, ruler.color);
            this.drawStillSegments(this.generateSubSegments(segment), 3, '0,0,0');
            if (ruler.isComplete) {
                this.drawHollowDot(segment.p1, '0,0,0', this.stillCanvasCtx);
                this.drawHollowDot(segment.p2, '0,0,0', this.stillCanvasCtx);
            } else if (!ruler.isSelected) {
                this.drawStillSegments(this.generateEndMarkerSegments(segment), 3, '0,0,0');
            }
        }
    }

    private generateEndMarkerSegments(segment: Segment): Segment[] {
        const segments: Segment[] = new Array();
        const vector: Vector = new Vector(segment.p1, segment.p2);
        const direction: Vector = vector.generatePerpendicularUnitVector();
        const halfTheWidth: number = 5;
        [segment.p1, segment.p2].forEach((point) => {
            let point1: Point = this.jumpToNewPoint(point, direction, halfTheWidth);
            let point2: Point = this.jumpToNewPoint(point, direction, -halfTheWidth);
            const newSegment: Segment = new Segment(point1, point2);
            segments.push(newSegment);
        });
        return segments;
    }

    private generateSubSegments(segment: Segment): Segment[] {
        //TODO: hantera så att man utgår från den som inte är move-point?
        const segments: Segment[] = new Array();
        const vector: Vector = new Vector(segment.p1, segment.p2);
        const unitVector: Vector = vector.generateUnitVector();
        const perpendicularUnitVector: Vector = vector.generatePerpendicularUnitVector();
        let unitDistance: number = 20;
        let distanceMeasured: number = 0;
        let unitsPassed: number = 0;
        let lastPointUsed: Point = segment.p1;
        while (distanceMeasured < segment.length) {
            const distanceRemaining: number = segment.length - distanceMeasured;
            if (distanceRemaining < unitDistance) {
                unitDistance = distanceRemaining;
            }
            let newPoint: Point = this.jumpToNewPoint(lastPointUsed, unitVector, unitDistance);
            if (unitsPassed % 2 == 0) {
                const segmentToAdd: Segment = new Segment(lastPointUsed, newPoint);
                segments.push(segmentToAdd);
            }
            lastPointUsed = newPoint;
            unitsPassed++;
            distanceMeasured += unitDistance;
        }

        const penultimatePoint2: Point = this.jumpToNewPoint(lastPointUsed, unitVector, -1);
        const lastSegment: Segment = new Segment(penultimatePoint2, segment.p2);
        segments.push(lastSegment);
        return segments;
    }

    private jumpToNewPoint(point: Point, direction: Vector, distance: number): Point {
        if (direction.norm > 1) { console.warn('direction given is not a unit vector'); };
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
                this.drawMovingSegments([segment], 3, ruler.color);
                this.drawMovingSegments(this.generateSubSegments(segment), 3, '0,0,0');
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