import { expect } from 'chai';
import { Polygon } from '../built/Polygon';
import { Point } from '../built/Point';
import { Segment } from '../built/Segment';
import { PaintableSegment } from '../src/PaintableSegment';


describe('Polygon - move', () => {

    describe('Moving', () => {

        it('moving vertex in triangle', () => {
            const triangle: Polygon = new Polygon();
            triangle.handleLeftClick({ x: 100, y: 100 });
            triangle.handleLeftClick({ x: 300, y: 100 });
            triangle.handleLeftClick({ x: 200, y: 300 });
            triangle.handleLeftClick({ x: 100, y: 100 }); // closing
            triangle.handleLeftClick({ x: 100, y: 100 }); // marking for move
            expect(triangle.isMoving).is.equal(true);
            triangle.handleLeftClick({ x: 110, y: 110 }); // moved
            expect(triangle.isMoving).is.equal(false);
        });

        for (let step = 0; step < 4; step++) {
            const square: Polygon = getSquare();
            it('All vertices are normally possible to move ' + step, () => {
                square.rotateVertices(-step);
                square.handleLeftClick({ x: 100, y: 100 });
                square.handleLeftClick({ x: 50, y: 50 });
                expect(square.vertices[step].x).to.equal(50);
                expect(square.vertices[step].y).to.equal(50);
                expect(square.isClosed).to.equal(true, 'Polygon not closed.');
            });
        }

        for (let step = 0; step < 4; step++) {
            const square: Polygon = getSquare();
            it('Not possible to move vertex too close to existing vertex A' + step, () => {
                square.rotateVertices(-step);
                square.handleLeftClick({ x: 100, y: 100 });
                square.handleLeftClick({ x: 200 - Polygon.minimumDistanceBetweenPoints + 1, y: 199 }); // clicking near another vertex
                square.handleRightClick({ x: 10, y: 10 });  // right  clicking in the void to abort move
                expect(square.vertices[step].x).to.equal(100);
                expect(square.vertices[step].y).to.equal(100);
                expect(square.isClosed).to.equal(true, 'Polygon not closed.');
            });
        }

        for (let step = 0; step < 4; step++) {
            const square: Polygon = getSquare();
            it('Possible to move vertex when NOT too close to other vertex B' + step, () => {
                square.rotateVertices(-step);
                square.handleLeftClick({ x: 100, y: 100 });
                square.handleLeftClick({ x: 200 - Polygon.minimumDistanceBetweenPoints, y: 199 }); // clicking near another vertex
                square.handleRightClick({ x: 10, y: 10 });  // right  clicking in the void to abort move
                expect(square.vertices[step].x).not.to.equal(100);
                expect(square.vertices[step].y).not.to.equal(100);
                expect(square.isClosed).to.equal(true, 'Polygon not closed.');
            });
        }

        it('Aborting a move', () => {
            const square: Polygon = getSquare();
            square.handleLeftClick({ x: 100, y: 100 });
            expect(square.isClosed).is.equal(false);
            square.handleRightClick({ x: 10, y: 10 }); // aborting
            expect(square.isClosed).is.equal(true);
        });

        for (let step = 0; step < 4; step++) {
            const square: Polygon = getSquare();
            it('vertices next to new vertex are possible to move ' + step, () => {
                square.rotateVertices(-step);

                const vertexBefore: Point = square.vertices[step];

                // adding vertex
                square.handleLeftClick({ x: 150, y: 100 });
                expect(square.numberOfSegments).is.equal(5);

                const addedVertex: Point = square.getFollowingVertex(vertexBefore);
                const vertexAfter: Point = square.getFollowingVertex(addedVertex);

                // moving vertex before added point
                square.handleLeftClick({ x: 100, y: 100 });
                square.handleLeftClick({ x: 90, y: 100 });
                expect(vertexBefore.x).to.equal(90);
                expect(vertexBefore.y).to.equal(100);
                expect(square.isClosed).to.equal(true, 'Polygon not closed.');

                // moving vertex before added point
                square.handleLeftClick({ x: 200, y: 100 });
                square.handleLeftClick({ x: 210, y: 100 });
                expect(vertexAfter.x).to.equal(210);
                expect(vertexAfter.y).to.equal(100);
                expect(square.isClosed).to.equal(true, 'Polygon not closed.');


            });
        }

        for (let step = 0; step < 4; step++) {
            const square: Polygon = getSquare();
            it('Not possible to move vertex too close to existing vertex' + step, () => {
                square.rotateVertices(-step);
                square.handleLeftClick({ x: 100, y: 100 });
                square.handleLeftClick({ x: 200 - Polygon.minimumDistanceBetweenPoints + 1, y: 199 }); // clicking near another vertex
                square.handleRightClick({ x: 10, y: 10 });  // right  clicking in the void to abort move
                expect(square.vertices[step].x).to.equal(100);
                expect(square.vertices[step].y).to.equal(100);
                expect(square.isClosed).to.equal(true, 'Polygon not closed.');
            });
        }



        for (let step = 0; step < 4; step++) {
            const square: Polygon = getSquare();
            it('Not possible to move when move creates intersection (neighbouring segments) ' + step, () => {
                square.rotateVertices(-step);
                // side 1
                square.handleLeftClick({ x: 100, y: 100 });
                square.handleLeftClick({ x: 150, y: 250 }); // moving here should not work
                square.handleRightClick({ x: 10, y: 10 });  // right  clicking in the void to abort move
                expect(square.vertices[step].x).to.equal(100); // no move should have occured
                expect(square.vertices[step].y).to.equal(100);
                expect(square.isClosed).to.equal(true, 'Polygon not closed.');
                // side 2
                square.handleLeftClick({ x: 100, y: 100 });
                square.handleLeftClick({ x: 250, y: 150 }); // moving here should not work
                square.handleRightClick({ x: 10, y: 10 });  // right  clicking in the void to abort move
                expect(square.vertices[step].x).to.equal(100); // no move should have occured
                expect(square.vertices[step].y).to.equal(100);
                expect(square.isClosed).to.equal(true, 'Polygon not closed.');
            });
        }


        for (let step = 0; step < 6; step++) {
            const square: Polygon = new Polygon();
            square.handleLeftClick({ x: 100, y: 100 });
            square.handleLeftClick({ x: 200, y: 100 });
            square.handleLeftClick({ x: 200, y: 190 });
            square.handleLeftClick({ x: 110, y: 110 });
            square.handleLeftClick({ x: 190, y: 200 });
            square.handleLeftClick({ x: 100, y: 200 });
            square.handleLeftClick({ x: 100, y: 100 });
            it('Not possible to move when move creates intersection (not neighbouring segments) ' + step, () => {
                square.rotateVertices(-step);
                // side 1
                square.handleLeftClick({ x: 100, y: 100 });
                square.handleLeftClick({ x: 125, y: 175 }); // moving here should not work
                square.handleRightClick({ x: 10, y: 10 });  // right  clicking in the void to abort move
                expect(square.vertices[step].x).to.equal(100); // no move should have occured
                expect(square.vertices[step].y).to.equal(100);
                expect(square.isClosed).to.equal(true, 'Polygon not closed.');
                // side 2
                square.handleLeftClick({ x: 100, y: 100 });
                square.handleLeftClick({ x: 175, y: 125 }); // moving here should not work
                square.handleRightClick({ x: 10, y: 10 });  // right  clicking in the void to abort move
                expect(square.vertices[step].x).to.equal(100); // no move should have occured
                expect(square.vertices[step].y).to.equal(100);
                expect(square.isClosed).to.equal(true, 'Polygon not closed.');
            });
        }


    });

    describe('Getting segments', () => {


        it('calculateSegments() - three vertices', () => {
            const shape: Polygon = new Polygon();
            shape.handleLeftClick({ x: 100, y: 100 });
            shape.handleLeftClick({ x: 300, y: 100 });
            shape.handleLeftClick({ x: 150, y: 300 });
            shape.handleLeftClick({ x: 100, y: 100 }); // closing it
            shape.handleLeftClick({ x: 100, y: 100 }); // marking for move
            const segments: Segment[] = shape.segments;
            expect(segments.length).is.equal(3);
            expect(segments[0].p1.x).is.equal(100);
            expect(segments[0].p1.y).is.equal(100);
            expect(segments[0].p2.x).is.equal(300);
            expect(segments[0].p2.y).is.equal(100);

            expect(segments[1].p1.x).is.equal(300);
            expect(segments[1].p1.y).is.equal(100);
            expect(segments[1].p2.x).is.equal(150);
            expect(segments[1].p2.y).is.equal(300);

            expect(segments[2].p1.x).is.equal(150);
            expect(segments[2].p1.y).is.equal(300);
            expect(segments[2].p2.x).is.equal(100);
            expect(segments[2].p2.y).is.equal(100);
        });

        for (let step = 0; step < 6; step++) {
            it('getPaintableStillSegments() - ' + step, () => {
                const shape: Polygon = new Polygon();
                shape.handleLeftClick({ x: 100, y: 100 });
                shape.handleLeftClick({ x: 150, y: 100 }); // extra
                shape.handleLeftClick({ x: 200, y: 100 });
                shape.handleLeftClick({ x: 200, y: 150 }); // extra
                shape.handleLeftClick({ x: 200, y: 200 });
                shape.handleLeftClick({ x: 100, y: 200 });
                shape.handleLeftClick({ x: 100, y: 100 }); // closing
                shape.rotateVertices(1);
                shape.handleLeftClick({ x: 100, y: 100 }); // marking for move
                const paintableStillSegments: PaintableSegment[] = shape.getPaintableStillSegments();
                expect(paintableStillSegments.length).is.equal(4);
                paintableStillSegments.forEach((segment) => {
                    const movePointInSegmentsFirst: boolean = segment.p1.x === 100 && segment.p1.y === 100;
                    const movePointInSegmentsSecond: boolean = segment.p1.x === 100 && segment.p1.y === 100;
                    expect(movePointInSegmentsFirst).to.equal(false);
                    expect(movePointInSegmentsSecond).to.equal(false);
                });
            });
        }

        for (let step = 0; step < 6; step++) {
            it('calculatePaintableMovingSegments() - ' + step, () => {
                const shape: Polygon = new Polygon();
                shape.handleLeftClick({ x: 100, y: 100 });
                shape.handleLeftClick({ x: 150, y: 100 }); // extra
                shape.handleLeftClick({ x: 200, y: 100 });
                shape.handleLeftClick({ x: 200, y: 150 }); // extra
                shape.handleLeftClick({ x: 200, y: 200 });
                shape.handleLeftClick({ x: 100, y: 200 });
                shape.handleLeftClick({ x: 100, y: 100 }); // closing
                shape.rotateVertices(1);
                shape.handleLeftClick({ x: 100, y: 100 }); // marking for move
                const paintableMovingSegments: PaintableSegment[] = shape.getPaintableMovingSegments({ x: 10, y: 10 });
                expect(paintableMovingSegments.length).is.equal(2);

                paintableMovingSegments.forEach((segment) => {
                    const movePointInSegmentsFirst: boolean = segment.p1.x === 10 && segment.p1.y === 10;
                    const movePointInSegmentsSecond: boolean = segment.p2.x === 10 && segment.p2.y === 10;
                    expect(movePointInSegmentsFirst || movePointInSegmentsSecond).to.equal(true);
                });
            });
        }


    });

});

function getSquare(): Polygon {
    const square: Polygon = new Polygon();
    square.handleLeftClick({ x: 100, y: 100 });
    square.handleLeftClick({ x: 200, y: 100 });
    square.handleLeftClick({ x: 200, y: 200 });
    square.handleLeftClick({ x: 100, y: 200 });
    square.handleLeftClick({ x: 100, y: 100 });
    return square;
}