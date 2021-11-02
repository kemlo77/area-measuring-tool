import { expect } from 'chai';
import { Line } from '../../../../../src/model/shape/segmentShapes/line/Line';
import { Segment } from '../../../../../src/model/shape/segmentShapes/Segment';


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
        const segments: Segment[] = line.getStillSegments();
        expect(segments.length).to.equal(0);
    });

    it('calculateMovingSegment()', () => {
        const line: Line = new Line();
        const segments: Segment[] = line.getMovingSegments({ x: 8, y: 9 });
        expect(segments.length).to.equal(0);
    });

    it('handleLeftMouseDown()', () => {
        const line: Line = new Line();
        line.handleLeftMouseDown({ x: 8, y: 9 });
        expect(line.p1.x).to.equal(8);
        expect(line.p1.y).to.equal(9);
        expect(line.isMoving).to.equal(true);
    });

});