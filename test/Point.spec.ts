import { expect } from 'chai';
import { Point } from '../built/Point.js';


describe('Point', () => {

    it('constructor - no parameters', () => {
        const pointA: Point = new Point();
        expect(pointA.x).to.equal(0);
        expect(pointA.y).to.equal(0);
    });

    it('constructor - with parameters', () => {
        const pointA: Point = new Point(1,2);
        expect(pointA.x).to.equal(1);
        expect(pointA.y).to.equal(2);
    });

    it('constructor - with other Point as parameter', () => {
        const pointA: Point = new Point(1,2);
        const pointB: Point = new Point(pointA);
        expect(pointB.x).to.equal(1);
        expect(pointB.y).to.equal(2);
    });

    it('constructor - with other Point', () => {
        expect(()=>new Point(1)).to.throw(/Invalid parameters/);
    });

    const runs = [
        {description: 'options1', x: 1, y: 2, expected: 3},
        {description: 'options2', x: 1, y: 2, expected: 3}
      ];

      runs.forEach((testCase)=>{
          it('Test: ' + testCase.description,()=>{
            const pointA: Point = new Point(testCase.x,testCase.y);
            expect(pointA.x).to.equal(testCase.x);
            expect(pointA.y).to.equal(testCase.y);
          });


      });



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