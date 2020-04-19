import { expect } from 'chai';
import { Point } from '../built/Point.js';


describe('Point', () => {

    it('translate()', () => {
        const firstPoint: Point = new Point(1, 2);
        // const secondPoint: Point = new Point(1,2);
        firstPoint.translate(10, 10);
        expect(firstPoint.x).to.equal(11);
        expect(firstPoint.y).to.equal(12);
    });

    it('noneOfThesePointsTooClose()', () => {
        const firstPoint: Point = new Point(1, 2);
        const pointA: Point = new Point(1, 10);
        const pointB: Point = new Point(1, 10);
        const pointC: Point = new Point(1, 10);
        const distanceLimit: number = 7;
        const otherPoints: Point[] = [pointA, pointB, pointC];
        const noneTooClose: boolean = firstPoint.noneOfThesePointsTooClose(otherPoints, distanceLimit);
        expect(noneTooClose).to.equal(true);


    });



});