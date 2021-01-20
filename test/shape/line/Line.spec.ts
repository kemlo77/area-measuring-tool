import { expect } from 'chai';
import { Line } from '../../../built/shape/line/Line.js';
import { Point } from '../../../built/shape/Point.js';


describe('Line', () => {

    it('constructor with no arguments', () => {
        const line: Line = new Line();
        expect(line.isSelected).to.equal(true);
    });

    it('constructor with one arguments', () => {
        expect(() => new Line({x:3, y:4})).to.throw(/Invalid parameters/);
    });

    it('constructor with two arguments - Coordinates', () => {
        const line: Line = new Line({x:3, y:4},{x:90, y:88});
        expect(line.isComplete).to.equal(true);
        expect(line.isSelected).to.equal(true);
    });

    it('constructor with two arguments - Points', () => {
        const line: Line = new Line(new Point(3,4), new Point (40,50));
        expect(line.isComplete).to.equal(true);
        expect(line.isSelected).to.equal(true);
        expect(line.p1.x).to.equal(3);
        expect(line.p1.y).to.equal(4);
        expect(line.p2.x).to.equal(40);
        expect(line.p2.y).to.equal(50);
    });

    it('constructor with two arguments - points too close', () => {
        expect(() => new Line({x:3, y:4}, {x:4, y:5})).to.throw(/Invalid parameters - coordinates too close/);
    });

    it('Line first vertex set - leftMouseDown', () => {
        const line: Line = new Line();
        line.handleLeftMouseDown({x: 123,y: 132});
        expect(line.isMoving).to.equal(true);
        expect(line.isSelected).to.equal(true);
    });


    it('Line second vertex set - mouseup', () => {
        const line: Line = new Line();
        line.handleLeftMouseDown({x: 123,y: 132});
        line.handleLeftMouseUp({x: 200, y: 300});
        expect(line.isComplete).to.equal(true);
        expect(line.isSelected).to.equal(true);
    });

    it('line toggle selected', () => {
        const line: Line = new Line({x:45, y:40},{x:90, y:88});
        expect(line.isComplete).to.equal(true);
        expect(line.isSelected).to.equal(true);
        line.handleLeftMouseDown({x:1, y:1});
        expect(line.isComplete).to.equal(false);
        expect(line.isSelected).to.equal(false);
        line.handleLeftClick({x:46, y:41});
        expect(line.isSelected).to.equal(true);
    });

    it('line - length', () => {
        const line: Line = new Line({x:10, y:10},{x:40, y:50});
        expect(line.length).to.equal(50);
    });


});