import { Point } from './Point.js';
import { MathUtil } from './MathUtil.js';

export class Segment {
    public p1: Point;
    public p2: Point;

    constructor(punkt1: Point, punkt2: Point) {
        this.p1 = punkt1;
        this.p2 = punkt2;
    }

    get length(): number {
        const xDelta: number = this.p1.x - this.p2.x;
        const yDelta: number = this.p1.y - this.p2.y;
        const segmentLength: number = Math.sqrt(xDelta * xDelta + yDelta * yDelta);
        return segmentLength;
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