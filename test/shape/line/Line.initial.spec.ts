import { expect } from 'chai';
import { Line } from '../../../built/shape/line/Line.js';


describe('Line - initial', () => {



    it('Length ', () => {
        const line: Line = new Line();
        expect(line.length).to.equal(0);
    });

    it('getter p1', () => {
        const line: Line = new Line();
        expect(line.p1).to.equal(null);
    });

    it('getter p2', () => {
        const line: Line = new Line();
        expect(line.p2).to.equal(null);
    });

    it('getter movePoint', () => {
        const line: Line = new Line();
        expect(line.movePoint).to.equal(null);
    });

    it('calculateSegment()', () => {
        const line: Line = new Line();
        expect(line.segment).to.equal(null);
    });

    it('calculateStillSegment()', () => {
        const line: Line = new Line();
        expect(line.getStillSegment()).to.equal(null);
    });

    it('calculateMovingSegment()', () => {
        const line: Line = new Line();
        expect(line.getMovingSegment({ x: 8, y: 9 })).to.equal(null);
    });

    it('handleLeftMouseDown()', () => {
        const line: Line = new Line();
        line.handleLeftMouseDown({x: 8, y: 9});
        expect(line.p1.x).to.equal(8);
        expect(line.p1.y).to.equal(9);
        expect(line.isMoving).to.equal(true);
    });

});