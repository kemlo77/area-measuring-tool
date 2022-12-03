import { expect } from 'chai';
import { Point } from '../../../../src/model/meassuringshape/shape/Point';
import { Vector } from '../../../../src/model/meassuringshape/shape/Vector';


describe('Vector', () => {

    it('constructor - from two points', () => {
        const pointA: Point = new Point(1, 2);
        const pointB: Point = new Point(3, 4);
        const vector: Vector = new Vector(pointA, pointB);
        expect(vector.x).to.equal(2);
        expect(vector.y).to.equal(2);
    });

    it('constructor - from x- and y-component 1', () => {
        const vector: Vector = new Vector(3, 4);
        expect(vector.x).to.equal(3);
        expect(vector.y).to.equal(4);
    });

    // it('constructor - from x- and y-component 2', () => {
    //     expect(() => new Vector('3', '4')).to.throw(/Invalid parameters/);
    // });

    it('norm', () => {
        const pointA: Point = new Point(1, 2);
        const pointB: Point = new Point(4, 6);
        const vector: Vector = new Vector(pointA, pointB);
        expect(vector.norm).to.equal(5);
    });

    it('dotProduct', () => {
        const vector1: Vector = new Vector(2, 2);
        const vector2: Vector = new Vector(7, 3);
        expect(Vector.dotProduct(vector1, vector2)).to.equal(20);
    });

    it('generateUnitVector', () => {
        const vector1: Vector = new Vector(2, 2);
        const unitVector: Vector = vector1.generateUnitVector();
        expect(unitVector.x).to.be.closeTo(0.707106, 0.000001);
        expect(unitVector.y).to.be.closeTo(0.707106, 0.000001);
    });

    it('generatePerpendicularUnitVector', () => {
        const vector1: Vector = new Vector(2, 2);
        const unitVector: Vector = vector1.generatePerpendicularUnitVector();
        expect(unitVector.x).to.be.closeTo(0.707106, 0.000001);
        expect(unitVector.y).to.be.closeTo(-0.707106, 0.000001);
    });

    it('generateNegativeVector', () => {
        const vector1: Vector = new Vector(3, 2);
        const negativeVector: Vector = vector1.generateNegativeVector();
        expect(negativeVector.x).to.equal(-3);
        expect(negativeVector.y).to.equal(-2);
    });



});