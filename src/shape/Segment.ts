import { Point } from './Point.js';
import { MathUtil } from './MathUtil.js';
import { SimpleSegment } from './SimpleSegment.js';

export class Segment implements SimpleSegment {
    public p1: Point;
    public p2: Point;

    constructor(punkt1: Point, punkt2: Point) {
        this.p1 = punkt1;
        this.p2 = punkt2;
    }

    get length(): number {
        return this.p1.distanceToOtherPoint(this.p2);
    }

    containsThisVertex(vertex: Point): boolean {
        return (this.p1 === vertex || this.p2 === vertex);
    }

    doesNotContainThisVertex(vertex: Point): boolean {
        return !this.containsThisVertex(vertex);
    }

    doesNotIntersectAnyOfTheseSegments(segmentArrayIn: Segment[]): boolean {
        for (const segment of segmentArrayIn) {
            if (MathUtil.calculateIntersect(segment, this) !== null) {
                return false;
            }
        }
        return true;
    }

    intersectsThisSegment(segment: Segment): boolean {
        if (MathUtil.calculateIntersect(this, segment) !== null) {
            return true;
        }
        return false;
    }
}