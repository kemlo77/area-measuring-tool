import { expect } from 'chai';
import { Point } from '../built/polygon/Point.js';
import { Segment } from '../built/polygon/Segment.js';


describe('Segment', () => {

    it('constructor', () => {
        const pointA: Point = new Point(1, 2);
        const pointB: Point = new Point(3, 4);
        const segment: Segment = new Segment(pointA, pointB);
        expect(segment.p1.x).to.equal(1);
        expect(segment.p1.y).to.equal(2);
        expect(segment.p2.x).to.equal(3);
        expect(segment.p2.y).to.equal(4);
    });

    it('length', () => {
        const pointA: Point = new Point(1, 2);
        const pointB: Point = new Point(4, 6);
        const segment: Segment = new Segment(pointA, pointB);
        expect(segment.length).to.equal(5);
    });

    it('containsThisVertex - contains vertex', () => {
        const pointA: Point = new Point(1, 2);
        const pointB: Point = new Point(4, 6);
        const segment: Segment = new Segment(pointA, pointB);
        expect(segment.containsThisVertex(pointA)).to.equal(true);
        expect(segment.containsThisVertex(pointB)).to.equal(true);
    });

    it('containsThisVertex - does not contain vertex', () => {
        const pointA: Point = new Point(1, 2);
        const pointB: Point = new Point(4, 6);
        const segment: Segment = new Segment(pointA, pointB);
        expect(segment.containsThisVertex(new Point(3, 7))).to.equal(false);
    });

    it('doesNotContainThisVertex - does not contain vertex', () => {
        const pointA: Point = new Point(1, 2);
        const pointB: Point = new Point(4, 6);
        const segment: Segment = new Segment(pointA, pointB);
        expect(segment.doesNotContainThisVertex(new Point(3, 7))).to.equal(true);
    });

    it('doesNotIntersectAnyOfTheseSegments - no intersection', () => {
        const s1: Segment = new Segment(new Point(0, 0), new Point(0, 1));
        const s2: Segment = new Segment(new Point(1, 0), new Point(1, 1));
        const s3: Segment = new Segment(new Point(2, 0), new Point(2, 1));
        const s4: Segment = new Segment(new Point(3, 0), new Point(3, 1));
        const s5: Segment = new Segment(new Point(4, 0), new Point(4, 1));
        const segments: Segment[] = [s2, s3, s4, s5];
        expect(s1.doesNotIntersectAnyOfTheseSegments(segments)).to.equal(true);
    });

    it('doesNotIntersectAnyOfTheseSegments - intersection', () => {
        const s1: Segment = new Segment(new Point(0, 0), new Point(0, 1));
        const s2: Segment = new Segment(new Point(1, 0), new Point(1, 1));
        const s3: Segment = new Segment(new Point(2, 0), new Point(2, 1));
        const s4: Segment = new Segment(new Point(3, 0), new Point(3, 1));
        const s5: Segment = new Segment(new Point(4, 0), new Point(4, 1));
        const s6: Segment = new Segment(new Point(-1, 0), new Point(1, 1));
        const segments: Segment[] = [s2, s3, s4, s5, s6];
        expect(s1.doesNotIntersectAnyOfTheseSegments(segments)).to.equal(false);
    });

    it('intersectsThisSegment - no intersection', () => {
        const s1: Segment = new Segment(new Point(0, 0), new Point(0, 1));
        const s2: Segment = new Segment(new Point(1, 0), new Point(1, 1));
        expect(s1.intersectsThisSegment(s2)).to.equal(false);
    });

    it('intersectsThisSegment - intersection', () => {
        const s1: Segment = new Segment(new Point(0, 0), new Point(0, 1));
        const s2: Segment = new Segment(new Point(-1, 0), new Point(1, 1));
        expect(s1.intersectsThisSegment(s2)).to.equal(true);
    });


});