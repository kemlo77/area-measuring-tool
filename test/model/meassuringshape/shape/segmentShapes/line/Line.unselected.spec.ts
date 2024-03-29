import { expect } from 'chai';
import { Line } from '../../../../../../src/model/meassuringshape/shape/segmentShapes/line/Line';
import { Segment } from '../../../../../../src/model/meassuringshape/shape/segmentShapes/Segment';


function getLineInStateUnselected(): Line {
    const line: Line = new Line({ x: 10, y: 20 }, { x: 40, y: 60 });
    line.handleLeftMouseDown({ x: 200, y: 200 });
    return line;
}

describe('Line - unselected', () => {

    it('Length ', () => {
        const line: Line = getLineInStateUnselected();
        expect(line.length).to.equal(50);
    });

    it('getter p1', () => {
        const line: Line = getLineInStateUnselected();
        expect(line.p1.x).to.equal(10);
        expect(line.p1.y).to.equal(20);
    });

    it('getter p1', () => {
        const line: Line = getLineInStateUnselected();
        expect(line.p2.x).to.equal(40);
        expect(line.p2.y).to.equal(60);
    });

    it('getter movePoint', () => {
        const line: Line = getLineInStateUnselected();
        expect(line.movePoint).to.equal(null);
    });

    it('calculateSegment()', () => {
        const line: Line = getLineInStateUnselected();
        const segment: Segment = line.segment;
        expect(segment.p1.x).to.equal(10);
        expect(segment.p1.y).to.equal(20);
        expect(segment.p2.x).to.equal(40);
        expect(segment.p2.y).to.equal(60);
    });

    it('calculateStillSegment()', () => {
        const line: Line = getLineInStateUnselected();
        const segments: Segment[] = line.getStillSegments();
        expect(segments[0].length).to.equal(50);

        expect(segments[0].p1.x).to.equal(10);
        expect(segments[0].p1.y).to.equal(20);
        expect(segments[0].p2.x).to.equal(40);
        expect(segments[0].p2.y).to.equal(60);
    });

    it('calculateMovingSegment()', () => {
        const line: Line = getLineInStateUnselected();
        const segments: Segment[] = line.getMovingSegments({ x: 100, y: 200 });
        expect(segments.length).to.equal(0);
    });

    it('handleLeftClick() - not on line', () => {
        const line: Line = getLineInStateUnselected();
        expect(line.isSelected).to.equal(false);
        line.handleLeftClick({ x: 200, y: 200 });
        expect(line.isSelected).to.equal(false);
    });

    it('handleLeftClick() - close to line', () => {
        const line: Line = getLineInStateUnselected();
        expect(line.isSelected).to.equal(false);
        line.handleLeftClick({ x: 26, y: 39 });
        expect(line.isSelected).to.equal(true);
    });






});