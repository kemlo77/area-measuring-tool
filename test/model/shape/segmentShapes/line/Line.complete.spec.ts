import { expect } from 'chai';
import { Line } from '../../../../../built/model/shape/segmentShapes/line/Line.js';
import { Segment } from '../../../../../built/model/shape/segmentShapes/Segment.js';


function getLineInStateComplete(): Line {
    return new Line({ x: 10, y: 20 }, { x: 40, y: 60 });
}

describe('Line - complete', () => {

    it('Length ', () => {
        const line: Line = getLineInStateComplete();
        expect(line.length).to.equal(50);
    });

    it('getter p1', () => {
        const line: Line = getLineInStateComplete();
        expect(line.p1.x).to.equal(10);
        expect(line.p1.y).to.equal(20);
    });

    it('getter p1', () => {
        const line: Line = getLineInStateComplete();
        expect(line.p2.x).to.equal(40);
        expect(line.p2.y).to.equal(60);
    });

    it('getter movePoint', () => {
        const line: Line = getLineInStateComplete();
        expect(line.movePoint).to.equal(null);
    });

    it('calculateSegment()', () => {
        const line: Line = getLineInStateComplete();
        const segment: Segment = line.segment;
        expect(segment.p1.x).to.equal(10);
        expect(segment.p1.y).to.equal(20);
        expect(segment.p2.x).to.equal(40);
        expect(segment.p2.y).to.equal(60);
    });

    it('calculateStillSegment()', () => {
        const line: Line = getLineInStateComplete();
        const segments: Segment[] = line.getStillSegments();
        expect(segments[0].length).to.equal(50);
        expect(segments[0].p1.x).to.equal(10);
        expect(segments[0].p1.y).to.equal(20);
        expect(segments[0].p2.x).to.equal(40);
        expect(segments[0].p2.y).to.equal(60);
    });

    it('calculateMovingSegment()', () => {
        const line: Line = getLineInStateComplete();
        const segments: Segment[] = line.getMovingSegments({ x: 100, y: 200 });
        expect(segments.length).to.equal(0);
    });

    it('handleLeftMouseDown() - select p1 and begin move', () => {
        const line: Line = getLineInStateComplete();
        line.handleLeftMouseDown({ x: 10, y: 20 });
        expect(line.isMoving).to.equal(true);
        expect(line.movePoint.x).to.equal(10);
        expect(line.movePoint.y).to.equal(20);
    });

    it('handleLeftMouseDown() - select p2 and begin move', () => {
        const line: Line = getLineInStateComplete();
        line.handleLeftMouseDown({ x: 40, y: 60 });
        expect(line.isMoving).to.equal(true);
        expect(line.movePoint.x).to.equal(40);
        expect(line.movePoint.y).to.equal(60);
    });

    it('handleLeftMouseDown() - clicking on segment', () => {
        const line: Line = getLineInStateComplete();
        line.handleLeftMouseDown({ x: 25, y: 40 });
        expect(line.isComplete).to.equal(true);
        expect(line.movePoint).to.equal(null);
    });



    it('handleLeftMouseDown() - make unselected', () => {
        const line: Line = getLineInStateComplete();
        line.handleLeftMouseDown({ x: 200, y: 200 });
        expect(line.isSelected).to.equal(false);
    });

    it('handleLeftMouseDown() - make unselected', () => {
        const line: Line = getLineInStateComplete();
        line.handleLeftMouseDown({ x: 200, y: 200 });
        expect(line.isSelected).to.equal(false);
    });


});