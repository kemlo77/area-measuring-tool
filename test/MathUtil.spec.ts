import { expect } from 'chai';
import { MathUtil } from '../built/MathUtil.js';
import { Point } from '../built/Point.js';
import { Segment } from '../built/Segment.js';


describe('MathUtil', () => {


    const rotatingTest: { description: string, angle: number }[] = [
        { description: '45  degrees', angle: Math.PI * 0.25 },
        { description: '90  degrees', angle: Math.PI * 0.5, },
        { description: '135 degrees', angle: Math.PI * 0.75 },
        { description: '180 degrees', angle: Math.PI },
        { description: '225 degrees', angle: Math.PI * 1.25 },
        { description: '270 degrees', angle: Math.PI * 1.5 },
        { description: '315 degrees', angle: Math.PI * 1.75 }
    ];

    rotatingTest.forEach((testData) => {
        it('calculateIntersect() -  no intersect around first point: ' + testData.description, () => {
            const segmentA: Segment = new Segment(new Point(0, 0), new Point(10, 0));
            const pointA: Point = new Point(0.01, 0);
            const pointB: Point = new Point(10, 0);
            pointA.rotateClockwise(testData.angle);
            pointB.rotateClockwise(testData.angle);
            const segmentB: Segment = new Segment(pointA, pointB);
            expect(MathUtil.calculateIntersect(segmentA, segmentB)).to.equal(null);
        });
    });

    rotatingTest.forEach((testData) => {
        it('calculateIntersect() - no intersect around second point: -' + testData.description, () => {
            const segmentA: Segment = new Segment(new Point(-10, 0), new Point(0, 0));
            const pointA: Point = new Point(-0.01, 0);
            const pointB: Point = new Point(-10, 0);
            pointA.rotateClockwise(-testData.angle);
            pointB.rotateClockwise(-testData.angle);
            const segmentB: Segment = new Segment(pointA, pointB);
            expect(MathUtil.calculateIntersect(segmentA, segmentB)).to.equal(null);
        });
    });

    rotatingTest.forEach((testData) => {
        it('calculateIntersect() -  intersect around first point: ' + testData.description, () => {
            const segmentA: Segment = new Segment(new Point(0, 0), new Point(10, 0));
            const pointA: Point = new Point(0, 0);
            const pointB: Point = new Point(10, 0);
            pointA.rotateClockwise(testData.angle);
            pointB.rotateClockwise(testData.angle);
            const segmentB: Segment = new Segment(pointA, pointB);
            expect(MathUtil.calculateIntersect(segmentA, segmentB)).not.to.equal(null);
        });
    });

    rotatingTest.forEach((testData) => {
        it('calculateIntersect() - intersect around second point: -' + testData.description, () => {
            const segmentA: Segment = new Segment(new Point(-10, 0), new Point(0, 0));
            const pointA: Point = new Point(0, 0);
            const pointB: Point = new Point(-10, 0);
            pointA.rotateClockwise(-testData.angle);
            pointB.rotateClockwise(-testData.angle);
            const segmentB: Segment = new Segment(pointA, pointB);
            expect(MathUtil.calculateIntersect(segmentA, segmentB)).not.to.equal(null);
        });
    });


    const rotatingTest2: { description: string, angle: number }[] = [
        { description: '45  degrees', angle: Math.PI * 0.25 },
        { description: '90  degrees', angle: Math.PI * 0.5, },
        { description: '135 degrees', angle: Math.PI * 0.75 },
        // skipping 180 degrees
        { description: '225 degrees', angle: Math.PI * 1.25 },
        { description: '270 degrees', angle: Math.PI * 1.5 },
        { description: '315 degrees', angle: Math.PI * 1.75 }
    ];
    rotatingTest2.forEach((testData) => {
        it('calculateIntersect() - no intersect around middle of segment: ' + testData.description, () => {
            const segmentA: Segment = new Segment(new Point(0, 0), new Point(10, 0));
            const pointA: Point = new Point(0.01, 0);
            const pointB: Point = new Point(10, 0);
            pointA.rotateClockwise(testData.angle).translate(5, 0);
            pointB.rotateClockwise(testData.angle).translate(5, 0);
            const segmentB: Segment = new Segment(pointA, pointB);
            expect(MathUtil.calculateIntersect(segmentA, segmentB)).to.equal(null);
        });
    });

    rotatingTest2.forEach((testData) => {
        it('calculateIntersect() - intersect around middle of segment: ' + testData.description, () => {
            const segmentA: Segment = new Segment(new Point(0, 0), new Point(10, 0));
            const pointA: Point = new Point(0, 0);
            const pointB: Point = new Point(10, 0);
            pointA.rotateClockwise(testData.angle).translate(5, 0);
            pointB.rotateClockwise(testData.angle).translate(5, 0);
            const segmentB: Segment = new Segment(pointA, pointB);
            expect(MathUtil.calculateIntersect(segmentA, segmentB)).not.to.equal(null);
        });
    });

    for (let step = -10; step < 4; step += 2) {
        it('calculateIntersect() - segments ontop of eachother ' + step, () => {
            const segmentA: Segment = new Segment(new Point(0, -5), new Point(0, 5));
            const segmentB: Segment = new Segment(new Point(0, step), new Point(0, (step+8)));
            expect(MathUtil.calculateIntersect(segmentA, segmentB)).not.to.equal(null);
        });
    }

        it('calculateIntersect() - along same line but not overlapping' , () => {
            const segmentA: Segment = new Segment(new Point(0, -5), new Point(0, 5));
            const segmentB: Segment = new Segment(new Point(0, -10), new Point(0, -6));
            expect(MathUtil.calculateIntersect(segmentA, segmentB)).to.equal(null);
            const segmentC: Segment = new Segment(new Point(0, 6), new Point(0, 10));
            expect(MathUtil.calculateIntersect(segmentA, segmentC)).to.equal(null);
        });


        it('calculateIntersect() - parallel' , () => {
            const segmentA: Segment = new Segment(new Point(0, -5), new Point(0, 5));
            const segmentB: Segment = new Segment(new Point(2, -5), new Point(2, 5));
            expect(MathUtil.calculateIntersect(segmentA, segmentB)).to.equal(null);

            const segmentC: Segment = new Segment(new Point(-2, -5), new Point(-2, 5));
            expect(MathUtil.calculateIntersect(segmentA, segmentC)).to.equal(null);
        });

        it('calculateIntersect() - to short to intersect 1' , () => {
            const segmentA: Segment = new Segment(new Point(-1, 1), new Point(-10, 10));
            const segmentB: Segment = new Segment(new Point(2, -3), new Point(5, 20));
            expect(MathUtil.calculateIntersect(segmentA, segmentB)).to.equal(null);
        });


        it('calculateIntersect() - to short to intersect 1' , () => {
            const segmentA: Segment = new Segment(new Point(-1, 1), new Point(-10, 10));
            const segmentB: Segment = new Segment(new Point(2, 3), new Point(10, 4));
            expect(MathUtil.calculateIntersect(segmentA, segmentB)).to.equal(null);
        });

        it('calculateIntersect() - to short to intersect 2' , () => {
            const segmentA: Segment = new Segment(new Point(-1, 1), new Point(-2, 10));
            const segmentB: Segment = new Segment(new Point(-3, 3), new Point(-10, 4));
            expect(MathUtil.calculateIntersect(segmentA, segmentB)).to.equal(null);
        });

        [1,5,10].forEach((yValue)=>{
            it('projectPointOntoSegment() - succesful projection' , () => {
                const segment: Segment = new Segment(new Point(0, 1), new Point(0, 10));
                const point: Point = new Point(1,yValue);
                expect(MathUtil.projectPointOntoSegment(segment,point).successful).to.equal(true);
                expect(MathUtil.projectPointOntoSegment(segment,point).norm).to.equal(1);
                expect(MathUtil.projectPointOntoSegment(segment,point).point.x).to.equal(0);
                expect(MathUtil.projectPointOntoSegment(segment,point).point.y).to.equal(yValue);
            });
        });

        [0.99, 10.01].forEach((yValue)=>{
            it('projectPointOntoSegment() - succesful projection' , () => {
                const segment: Segment = new Segment(new Point(0, 1), new Point(0, 10));
                const point: Point = new Point(1,yValue);
                expect(MathUtil.projectPointOntoSegment(segment,point).successful).to.equal(false);
                expect(MathUtil.projectPointOntoSegment(segment,point).norm).to.equal(null);
                expect(MathUtil.projectPointOntoSegment(segment,point).point).to.equal(null);
            });
        });


});