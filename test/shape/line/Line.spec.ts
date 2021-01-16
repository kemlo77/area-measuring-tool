import { expect } from 'chai';
import { Line } from '../../../built/shape/line/Line.js';
import { Point } from '../../../built/shape/Point.js';


describe('Line', () => {

    it('constructor with no arguments', () => {
        const line: Line = new Line();
        expect(line.isSelected).to.equal(true);
        //expect(Polygons.area(rectangle)).to.equal(10000);
    });

    it('constructor with two arguments', () => {
        //const line: Line = new Line(new Point(3,4),new Point(4,5));
        const line: Line = new Line({x:3, y:4},{x:90, y:88});
        expect(line.isComplete).to.equal(true);
        //expect(Polygons.area(rectangle)).to.equal(10000);
    });




});