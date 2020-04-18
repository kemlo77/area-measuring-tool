import { expect } from 'chai';
import { Point } from '../built/Point.js';


describe('Point', () => {
    describe('translate()', () => {
        it('should return -1 when the value is not present', () => {
            const firstPoint: Point = new Point(1, 2);
            // const secondPoint: Point = new Point(1,2);
            firstPoint.translate(10, 10);
            expect(firstPoint.x).to.equal(11);
            expect(firstPoint.y).to.equal(12);
        });
    });
});