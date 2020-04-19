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
        const segmentLength: number = Math.sqrt(Math.pow((this.p1.x - this.p2.x), 2) + Math.pow((this.p1.y - this.p2.y), 2));
        return segmentLength;
    }

    containsThisVertex(vertex: Point): boolean {
        return (this.p1 === vertex || this.p2 === vertex);
    }

    doesNotIntersectAnyOfTheseSegments(segmentArrayIn: Segment[]): boolean {
        for (const segment of segmentArrayIn) {
            if (MathUtil.calculateIntersect(segment, this)) {
                return false;
            }
        }
        return true;
    }
}