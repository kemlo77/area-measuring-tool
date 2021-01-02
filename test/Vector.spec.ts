import { expect } from 'chai';
import { Point } from '../built/polygon/Point.js';
import { Vector } from '../built/polygon/Vector.js';


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

    it('constructor - from x- and y-component 2', () => {
        expect(() => new Vector('3', '4')).to.throw(/Invalid parameters/);
    });

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



});