import { expect } from 'chai';
import { Polygon } from '../../../built/shape/polygon/Polygon';
import { PaintableSegment } from '../../../src/shape/PaintableSegment';
import { Segment } from '../../../built/shape/Segment';


describe('Polygon - open', () => {



    describe('Adding vertices', () => {

        it('Adding vertex - happt case', () => {
            const shape: Polygon = new Polygon();
            shape.handleLeftClick({ x: 100, y: 100 });
            expect(shape.vertices.length).is.equal(1);
            shape.handleLeftClick({ x: 120, y: 120 });
            expect(shape.vertices.length).is.equal(2);
        });

        it('Second vertex is too close to first vertex', () => {
            const shape: Polygon = new Polygon();
            shape.handleLeftClick({ x: 100, y: 100 });
            expect(shape.vertices.length).is.equal(1);
            shape.handleLeftClick({ x: 101, y: 101 });
            expect(shape.vertices.length).is.equal(1);
        });


        it('Too close to existing vertex', () => {
            const square: Polygon = new Polygon();
            square.handleLeftClick({ x: 100, y: 100 });
            square.handleLeftClick({ x: 200, y: 100 });
            square.handleLeftClick({ x: 200, y: 200 });
            square.handleLeftClick({ x: 100, y: 200 });
            expect(square.isClosed).is.equal(false, 'wrongly closed');
            square.handleLeftClick({ x: 200, y: 100 });
            expect(square.isClosed).is.equal(false, 'wrongly closed');
        });

        it('Cannot add because segment intersects other segment', () => {
            const shape: Polygon = new Polygon();
            shape.handleLeftClick({ x: 100, y: 100 });
            shape.handleLeftClick({ x: 200, y: 100 });
            shape.handleLeftClick({ x: 200, y: 200 });
            expect(shape.vertices.length).is.equal(3);
            shape.handleLeftClick({ x: 150, y: 50 });
            expect(shape.vertices.length).is.equal(3);
        });

    });



    describe('Closing', () => {

        it('Closing by clicking on first point', () => {
            const triangle: Polygon = new Polygon();
            triangle.handleLeftClick({ x: 100, y: 100 });
            triangle.handleLeftClick({ x: 200, y: 100 });
            triangle.handleLeftClick({ x: 200, y: 200 });
            expect(triangle.isClosed).is.equal(false, 'wrongly closed');
            triangle.handleLeftClick({ x: 100, y: 100 });
            expect(triangle.isClosed).is.equal(true, 'not closed?');
        });

        it('Cannot close - intersecting an old segment (second segment)', () => {
            const square: Polygon = new Polygon();
            square.handleLeftClick({ x: 150, y: 50 });
            square.handleLeftClick({ x: 100, y: 100 });
            square.handleLeftClick({ x: 200, y: 100 });
            square.handleLeftClick({ x: 200, y: 200 });
            square.handleLeftClick({ x: 100, y: 200 });
            expect(square.isClosed).is.equal(false, 'wrongly closed');
            square.handleLeftClick({ x: 150, y: 50 });
            expect(square.isClosed).is.equal(false, 'wrongly closed');
        });

        it('Cannot close - intersecting an old segment (second to last segment)', () => {
            const shape: Polygon = new Polygon();
            shape.handleLeftClick({ x: 250, y: 150 });
            shape.handleLeftClick({ x: 200, y: 50 });
            shape.handleLeftClick({ x: 100, y: 100 });
            shape.handleLeftClick({ x: 200, y: 100 });
            shape.handleLeftClick({ x: 200, y: 200 });
            shape.handleLeftClick({ x: 100, y: 200 });
            expect(shape.isClosed).is.equal(false, 'wrongly closed');
            shape.handleLeftClick({ x: 250, y: 150 });
            expect(shape.isClosed).is.equal(false, 'wrongly closed');
        });

        it('Cannot close - only two segments', () => {
            const shape: Polygon = new Polygon();
            shape.handleLeftClick({ x: 100, y: 100 });
            shape.handleLeftClick({ x: 200, y: 100 });
            shape.handleLeftClick({ x: 100, y: 100 });
            expect(shape.isClosed).is.equal(false, 'wrongly closed');
            expect(shape.vertices.length).is.equal(2);
        });

    });

    describe('Regretting', () => {
        it('Regretting', () => {
            const square: Polygon = new Polygon();
            square.handleLeftClick({ x: 100, y: 100 });
            square.handleLeftClick({ x: 200, y: 100 });
            square.handleLeftClick({ x: 200, y: 200 });
            square.handleLeftClick({ x: 100, y: 200 });
            expect(square.vertices.length).is.equal(4);
            expect(square.segments.length).is.equal(3);
            square.handleRightClick({ x: 10, y: 10 });
            expect(square.vertices.length).is.equal(3);
            expect(square.segments.length).is.equal(2);
            square.handleRightClick({ x: 10, y: 10 });
            expect(square.vertices.length).is.equal(2);
            expect(square.segments.length).is.equal(1);
            square.handleRightClick({ x: 10, y: 10 });
            expect(square.vertices.length).is.equal(1);
            expect(square.segments.length).is.equal(0);
            square.handleRightClick({ x: 10, y: 10 });
            expect(square.vertices.length).is.equal(0);
            expect(square.segments.length).is.equal(0);
            square.handleRightClick({ x: 10, y: 10 });
            expect(square.vertices.length).is.equal(0);
            expect(square.segments.length).is.equal(0);
        });
    });

    describe('Getting segments', () => {
        it('calculateSegments() - just the first vertex', () => {
            const shape: Polygon = new Polygon();
            shape.handleLeftClick({ x: 100, y: 100 });
            expect(shape.segments.length).is.equal(0);
        });

        it('calculateSegments() - two vertices', () => {
            const shape: Polygon = new Polygon();
            shape.handleLeftClick({ x: 100, y: 200 });
            shape.handleLeftClick({ x: 300, y: 400 });
            const segments: Segment[] = shape.segments;
            expect(segments.length).is.equal(1);
            expect(segments[0].p1.x).is.equal(100);
            expect(segments[0].p1.y).is.equal(200);
            expect(segments[0].p2.x).is.equal(300);
            expect(segments[0].p2.y).is.equal(400);
        });

        it('calculateSegments() - three vertices', () => {
            const shape: Polygon = new Polygon();
            shape.handleLeftClick({ x: 100, y: 200 });
            shape.handleLeftClick({ x: 300, y: 400 });
            shape.handleLeftClick({ x: 500, y: 600 });
            const segments: Segment[] = shape.segments;
            expect(segments.length).is.equal(2);
            expect(segments[0].p1.x).is.equal(100);
            expect(segments[0].p1.y).is.equal(200);
            expect(segments[0].p2.x).is.equal(300);
            expect(segments[0].p2.y).is.equal(400);

            expect(segments[1].p1.x).is.equal(300);
            expect(segments[1].p1.y).is.equal(400);
            expect(segments[1].p2.x).is.equal(500);
            expect(segments[1].p2.y).is.equal(600);
        });

        it('getPaintableStillSegments()', () => {
            const square: Polygon = new Polygon();
            square.handleLeftClick({ x: 100, y: 200 });
            square.handleLeftClick({ x: 300, y: 400 });
            square.handleLeftClick({ x: 500, y: 600 });
            const paintableSegments: PaintableSegment[] = square.getPaintableStillSegments();
            expect(paintableSegments.length).is.equal(2);
            expect(paintableSegments[0].p1.x).is.equal(100);
            expect(paintableSegments[0].p1.y).is.equal(200);
            expect(paintableSegments[0].p2.x).is.equal(300);
            expect(paintableSegments[0].p2.y).is.equal(400);

            expect(paintableSegments[1].p1.x).is.equal(300);
            expect(paintableSegments[1].p1.y).is.equal(400);
            expect(paintableSegments[1].p2.x).is.equal(500);
            expect(paintableSegments[1].p2.y).is.equal(600);
        });

        it('calculatePaintableMovingSegments() - 1 or more vertices added', () => {
            const square: Polygon = new Polygon();
            square.handleLeftClick({ x: 100, y: 200 });

            const movingSegments: PaintableSegment[] = square.getPaintableMovingSegments({ x: 300, y: 400 });

            expect(movingSegments.length).is.equal(1);
            expect(movingSegments[0].p1.x).is.equal(100);
            expect(movingSegments[0].p1.y).is.equal(200);
            expect(movingSegments[0].p2.x).is.equal(300);
            expect(movingSegments[0].p2.y).is.equal(400);

        });

        it('calculatePaintableMovingSegments() - no vertices added', () => {
            const square: Polygon = new Polygon();
            const movingSegments: PaintableSegment[] = square.getPaintableMovingSegments({ x: 300, y: 400 });
            expect(movingSegments.length).is.equal(0);
        });
    });

});

function getSquarePolygon(): Polygon {
    return new Polygon([{ x: 100, y: 100 }, { x: 200, y: 100 }, { x: 200, y: 200 }, { x: 100, y: 200 }]);
}