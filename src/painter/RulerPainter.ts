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
        const segment: SimpleSegment = ruler.getStillSegment();
        if (segment !== null) {
            this.drawStillSegments([segment], ruler.color);
            this.drawStillSegments(this.generateSubSegments(segment), '0,0,0');
            if (ruler.isComplete) {
                this.drawHollowDot(segment.p1, ruler.color, this.stillCanvasCtx);
                this.drawHollowDot(segment.p2, ruler.color, this.stillCanvasCtx);
            }
        }
    }

    private generateSubSegments(segment: SimpleSegment): SimpleSegment[] {
        //TODO: hantera så att man utgår från den som inte är move-point?
        const p1: Point = new Point(segment.p1);
        const p2: Point = new Point(segment.p2);
        const segments: Segment[] = new Array();
        const vector: Vector = new Vector(p1, p2);
        const unitVector: Vector = vector.generateUnitVector();
        const unitDistance: number = 20;
        let distanceMeasured: number = 0;
        let unitsPassed: number = 0;
        let lastPoint: Point = p1;
        while (distanceMeasured + unitDistance < vector.norm) {
            const xPart: number = lastPoint.x + unitVector.x * unitDistance;
            const yPart: number = lastPoint.y + unitVector.y * unitDistance;
            let newPoint: Point = new Point(xPart, yPart);
            if (unitsPassed % 2 == 1) {
                const segmentToAdd: Segment = new Segment(lastPoint, newPoint);
                segments.push(segmentToAdd);
            }
            lastPoint = newPoint;
            unitsPassed++;
            distanceMeasured += unitDistance;
        }
        return segments;
    }

    drawMovement(motif: any, mousePosition: Coordinate): void {
        const ruler: Ruler = motif as Ruler;
        const segment: SimpleSegment = ruler.getMovingSegment(mousePosition);
        if (segment !== null) {
            if (ruler.isMoving) {
                this.clearUsedPartOfCanvas();
                this.drawMovingSegments([segment], ruler.color);
                //this.drawMovingSegments(this.generateSubSegments(segment), '0,0,0');
                this.drawThePointNotMoving(ruler, this.movementCanvasCtx);
            }

        }
    }

    private drawThePointNotMoving(ruler: Ruler, ctx: CanvasRenderingContext2D): void {
        [ruler.p1, ruler.p2]
            .filter((it) => it !== ruler.movePoint)
            .forEach((it) => { this.drawHollowDot(it, ruler.color, ctx); });
    }

}