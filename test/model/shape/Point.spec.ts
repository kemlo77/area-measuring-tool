import { expect } from 'chai';
import { Point } from '../../../built/model/shape/Point.js';


describe('Point', () => {

    it('constructor - no parameters', () => {
        const pointA: Point = new Point();
        expect(pointA.x).to.equal(0);
        expect(pointA.y).to.equal(0);
    });

    it('constructor - with parameters', () => {
        const pointA: Point = new Point(1, 2);
        expect(pointA.x).to.equal(1);
        expect(pointA.y).to.equal(2);
    });

    it('constructor - with other Point as parameter', () => {
        const pointA: Point = new Point(1, 2);
        const pointB: Point = new Point(pointA);
        expect(pointB.x).to.equal(1);
        expect(pointB.y).to.equal(2);
    });

    it('constructor - with Coordinate', () => {
        const pointA: Point = new Point({ x: 1, y: 2 });
        expect(pointA.x).to.equal(1);
        expect(pointA.y).to.equal(2);
    });

    it('constructor - with faulty x-Coordinate', () => {
        expect(() => new Point({ x: 'asdf', y: 2 })).to.throw(/Invalid parameters/);
    });

    it('constructor - with faulty y-Coordinate', () => {
        expect(() => new Point({ x: 1, y: 'asdf' })).to.throw(/Invalid parameters/);
    });

    it('constructor - with just one coordinate', () => {
        expect(() => new Point(1)).to.throw(/Invalid parameters/);
    });

    it('constructor - with one letter as parameter', () => {
        expect(() => new Point('1')).to.throw(/Invalid parameters/);
    });

    const rotatingTest: { description: string, x: number, y: number, angle: number }[] = [
        { description: '0   degres', x: 1, y: 0, angle: 0 },
        { description: '45  degrees', x: Math.sqrt(2) / 2, y: -Math.sqrt(2) / 2, angle: Math.PI * 0.25 },
        { description: '90  degrees', x: 0, y: -1, angle: Math.PI * 0.5 },
        { description: '135 degrees', x: -Math.sqrt(2) / 2, y: -Math.sqrt(2) / 2, angle: Math.PI * 0.75 },
        { description: '180 degrees', x: -1, y: 0, angle: Math.PI },
        { description: '225 degrees', x: -Math.sqrt(2) / 2, y: Math.sqrt(2) / 2, angle: Math.PI * 1.25 },
        { description: '270 degrees', x: 0, y: 1, angle: Math.PI * 1.5 },
        { description: '315 degrees', x: Math.sqrt(2) / 2, y: Math.sqrt(2) / 2, angle: Math.PI * 1.75 }
    ];

    rotatingTest.forEach((testData) => {
        it('rotateClockwise(): ' + testData.description, () => {
            const pointA: Point = new Point(1, 0);
            const newPoint: Point = pointA.rotateClockwise(testData.angle);
            expect(newPoint.x).to.closeTo(testData.x, 0.000001, 'Wrong x-value');
            expect(newPoint.y).to.closeTo(testData.y, 0.000001, 'Wrong y-value');
        });
    });


    const runs: { description: string, x: number, y: number, expected: number }[] = [
        { description: '0   degres', x: 1, y: 0, expected: 0 },
        { description: '45  degrees', x: 1, y: 1, expected: Math.PI * 0.25 },
        { description: '90  degrees', x: 0, y: 1, expected: Math.PI * 0.5 },
        { description: '135 degrees', x: -1, y: 1, expected: Math.PI * 0.75 },
        { description: '180 degrees', x: -1, y: 0, expected: Math.PI },
        { description: '225 degrees', x: -1, y: -1, expected: Math.PI * 1.25 },
        { description: '270 degrees', x: 0, y: -1, expected: Math.PI * 1.5 },
        { description: '315 degrees', x: 1, y: -1, expected: Math.PI * 1.75 }
    ];

    runs.forEach((testData) => {
        it('getTheAngle(): ' + testData.description, () => {
            const pointA: Point = new Point(testData.x, testData.y);
            expect(pointA.getTheAngle()).to.equal(testData.expected);
        });
    });



    it('nearestPointWithinDistance() - all outside maxDistance', () => {
        const pointZero: Point = new Point(0, 0);
        const pointA: Point = new Point(2, 0);
        const pointB: Point = new Point(0, 2);
        const pointC: Point = new Point(-2, 0);
        const pointD: Point = new Point(0, -2);
        const pointE: Point = new Point(1, 0);
        const points: Point[] = [pointA, pointB, pointC, pointD, pointE];
        const nearestPoint: Point = pointZero.nearestPointWithinDistance(points, 1.2, pointE);
        expect(nearestPoint).to.equal(null);
    });

    it('nearestPointWithinDistance() - all outside maxDistance and skipPoint given', () => {
        const pointZero: Point = new Point(0, 0);
        const pointA: Point = new Point(2, 0);
        const pointB: Point = new Point(0, 2);
        const pointC: Point = new Point(-2, 0);
        const pointD: Point = new Point(0, -2);
        const points: Point[] = [pointA, pointB, pointC, pointD];
        const nearestPoint: Point = pointZero.nearestPointWithinDistance(points, 1.2);
        expect(nearestPoint).to.equal(null);
    });


    it('nearestPointWithinDistance() - ', () => {
        const pointZero: Point = new Point(0, 0);
        const pointA: Point = new Point(2, 0);
        const pointB: Point = new Point(0, 2);
        const pointC: Point = new Point(-2, 0);
        const pointD: Point = new Point(0, -2);
        const pointE: Point = new Point(1.2, 0); // this one is skipped
        const pointF: Point = new Point(1.3, 0); // closest point
        const points: Point[] = [pointA, pointB, pointC, pointD, pointE, pointF];
        const nearestPoint: Point = pointZero.nearestPointWithinDistance(points, 3, pointE);
        expect(nearestPoint.x).to.equal(pointF.x);
        expect(nearestPoint.y).to.equal(pointF.y);
    });

    it('distanceToOtherPoint()', () => {
        const pointA: Point = new Point(0, 0);
        const pointB: Point = new Point(3, 4);
        expect(pointA.distanceToOtherPoint(pointB)).to.equal(5);
    });



    it('translate()', () => {
        const firstPoint: Point = new Point(1, 2);
        // const secondPoint: Point = new Point(1,2);
        const newPoint: Point = firstPoint.translate(10, 10);
        expect(newPoint.x).to.equal(11);
        expect(newPoint.y).to.equal(12);
    });

    it('noneOfThesePointsTooClose() - all outside limit', () => {
        const firstPoint: Point = new Point(1, 2);
        const pointA: Point = new Point(1, 10);
        const pointB: Point = new Point(1, 10);
        const pointC: Point = new Point(1, 10);
        const distanceLimit: number = 7;
        const otherPoints: Point[] = [pointA, pointB, pointC];
        const noneTooClose: boolean = firstPoint.noneOfThesePointsTooClose(otherPoints, distanceLimit);
        expect(noneTooClose).to.equal(true);
    });

    it('noneOfThesePointsTooClose() - one inside limit', () => {
        const firstPoint: Point = new Point(1, 2);
        const pointA: Point = new Point(1, 10);
        const pointB: Point = new Point(1, 3);
        const pointC: Point = new Point(1, 10);
        const distanceLimit: number = 7;
        const otherPoints: Point[] = [pointA, pointB, pointC];
        const noneTooClose: boolean = firstPoint.noneOfThesePointsTooClose(otherPoints, distanceLimit);
        expect(noneTooClose).to.equal(false);
    });

    it('closeEnoughToPoint() - close enough', () => {
        const pointA: Point = new Point(0, 0);
        const pointB: Point = new Point(5, 0);
        expect(pointA.closeEnoughToPoint(pointB, 6)).to.equal(true);
    });

    it('closeEnoughToPoint() - not close enough', () => {
        const pointA: Point = new Point(0, 0);
        const pointB: Point = new Point(5, 0);
        expect(pointA.closeEnoughToPoint(pointB, 4)).to.equal(false);
    });

    it('notTooCloseToPoint() - too close', () => {
        const pointA: Point = new Point(0, 0);
        const pointB: Point = new Point(5, 0);
        expect(pointA.notTooCloseToPoint(pointB, 6)).to.equal(false);
    });

    it('notTooCloseToPoint() - not too close', () => {
        const pointA: Point = new Point(0, 0);
        const pointB: Point = new Point(5, 0);
        expect(pointA.notTooCloseToPoint(pointB, 4)).to.equal(true);
    });



});