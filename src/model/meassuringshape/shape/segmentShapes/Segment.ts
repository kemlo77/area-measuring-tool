import { Point } from '../Point';
import { MathService } from './Math.service';

export class Segment {
    private _p1: Point;
    private _p2: Point;

    constructor(punkt1: Point, punkt2: Point) {
        this._p1 = punkt1;
        this._p2 = punkt2;
    }

    get p1(): Point {
        return this._p1;
    }

    get p2(): Point {
        return this._p2;
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
            if (MathService.calculateIntersect(segment, this)) {
                return false;
            }
        }
        return true;
    }

    intersectsThisSegment(segment: Segment): boolean {
        if (MathService.calculateIntersect(this, segment)) {
            return true;
        }
        return false;
    }
}