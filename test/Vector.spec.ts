import { expect } from 'chai';
import { Point } from '../built/Point.js';
import { Vector } from '../built/Vector.js';


describe('Vector', () => {

    it('constructor - from two points', () => {
        const pointA: Point = new Point(1,2);
        const pointB: Point = new Point(3,4);
        const vector: Vector = new Vector(pointA,pointB);
        expect(vector.x).to.equal(2);
        expect(vector.y).to.equal(2);
    });

    it('constructor - from x- and y-component', () => {
        const vector: Vector = new Vector(3,4);
        expect(vector.x).to.equal(3);
        expect(vector.y).to.equal(4);
    });

    it('constructor - from x- and y-component', () => {
        expect(() => new Vector('3','4')).to.throw(/Invalid parameters/);
    });

    it('length', () => {
        const pointA: Point = new Point(1,2);
        const pointB: Point = new Point(4,6);
        const vector: Vector = new Vector(pointA,pointB);
        expect(vector.length).to.equal(5);
    });




});