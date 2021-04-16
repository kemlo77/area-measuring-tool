import { expect } from 'chai';
import { Polygon } from '../../../..//built/model/shape/polygon/Polygon';
import { Point } from '../../../../built/model/shape/Point';
import { Segment } from '../../../../built/model/shape/Segment';

describe('Polygon - move', () => {

    describe('Moving', () => {

        it('moving vertex in triangle', () => {
            const triangle: Polygon = new Polygon([
                { x: 100, y: 100 },
                { x: 300, y: 100 },
                { x: 200, y: 300 }
            ]);

            triangle.handleLeftMouseDown({ x: 100, y: 100 }); // marking for move
            expect(triangle.isMoving).is.equal(true);
            triangle.handleLeftMouseUp({ x: 110, y: 110 }); // moved
            expect(triangle.isMoving).is.equal(false);
        });

        for (let step: number = 0; step < 4; step++) {
            const square: Polygon = getSquarePolygon();
            it('All vertices are normally possible to move ' + step, () => {
                square.rotateVertices(-step);
                square.handleLeftMouseDown({ x: 100, y: 100 });
                square.handleLeftMouseUp({ x: 50, y: 50 });
                expect(square.vertices[step].x).to.equal(50);
                expect(square.vertices[step].y).to.equal(50);
                expect(square.isClosed).to.equal(true, 'Polygon not closed.');
            });
        }

        for (let step: number = 0; step < 4; step++) {
            const square: Polygon = getSquarePolygon();
            it('Not possible to move vertex too close to existing vertex A' + step, () => {
                square.rotateVertices(-step);
                square.handleLeftClick({ x: 100, y: 100 });
                // clicking near another vertex
                square.handleLeftClick({ x: 200 - Polygon.minimumDistanceBetweenPoints + 1, y: 199 });

                square.handleRightClick({ x: 10, y: 10 });  // right  clicking in the void to abort move
                expect(square.vertices[step].x).to.equal(100);
                expect(square.vertices[step].y).to.equal(100);
                expect(square.isClosed).to.equal(true, 'Polygon not closed.');
            });
        }

        for (let step: number = 0; step < 4; step++) {
            const square: Polygon = getSquarePolygon();
            it('Possible to move vertex when NOT too close to other vertex B' + step, () => {
                square.rotateVertices(-step);
                square.handleLeftMouseDown({ x: 100, y: 100 });

                // clicking near another vertex
                square.handleLeftMouseUp({ x: 200 - Polygon.minimumDistanceBetweenPoints, y: 199 });

                square.handleRightClick({ x: 10, y: 10 });  // right  clicking in the void to abort move
                expect(square.vertices[step].x).not.to.equal(100);
                expect(square.vertices[step].y).not.to.equal(100);
                expect(square.isClosed).to.equal(true, 'Polygon not closed.');
            });
        }

        it('Aborting a move', () => {
            const square: Polygon = getSquarePolygon();
            square.handleLeftMouseDown({ x: 100, y: 100 });
            expect(square.isMoving).is.equal(true);
            square.handleRightClick({ x: 10, y: 10 }); // aborting
            expect(square.isClosed).is.equal(true);
        });

        for (let step: number = 0; step < 4; step++) {
            const square: Polygon = getSquarePolygon();
            it('vertices next to new vertex are possible to move ' + step, () => {
                square.rotateVertices(-step);

                const vertexBefore: Point = square.vertices[step];

                // adding vertex
                square.handleLeftMouseDown({ x: 150, y: 100 });
                expect(square.isMoving).to.equal(true);
                square.handleLeftMouseUp({ x: 150, y: 100 });
                expect(square.numberOfSegments).is.equal(5);

                const addedVertex: Point = square.getFollowingVertex(vertexBefore);
                const vertexAfter: Point = square.getFollowingVertex(addedVertex);

                // moving vertex before added point
                square.handleLeftMouseDown({ x: 100, y: 100 });
                square.handleLeftMouseUp({ x: 90, y: 100 });
                expect(vertexBefore.x).to.equal(90);
                expect(vertexBefore.y).to.equal(100);
                expect(square.isClosed).to.equal(true, 'Polygon not closed.');

                // moving vertex before added point
                square.handleLeftMouseDown({ x: 200, y: 100 });
                square.handleLeftMouseUp({ x: 210, y: 100 });
                expect(vertexAfter.x).to.equal(210);
                expect(vertexAfter.y).to.equal(100);
                expect(square.isClosed).to.equal(true, 'Polygon not closed.');


            });
        }

        for (let step: number = 0; step < 4; step++) {
            const square: Polygon = getSquarePolygon();
            it('Not possible to move vertex too close to existing vertex' + step, () => {
                square.rotateVertices(-step);
                square.handleLeftClick({ x: 100, y: 100 });

                // clicking near another vertex
                square.handleLeftClick({ x: 200 - Polygon.minimumDistanceBetweenPoints + 1, y: 199 });

                square.handleRightClick({ x: 10, y: 10 });  // right  clicking in the void to abort move
                expect(square.vertices[step].x).to.equal(100);
                expect(square.vertices[step].y).to.equal(100);
                expect(square.isClosed).to.equal(true, 'Polygon not closed.');
            });
        }



        for (let step: number = 0; step < 4; step++) {
            const square: Polygon = getSquarePolygon();
            it('Not possible to move when move creates intersection (neighbouring segments) ' + step, () => {
                square.rotateVertices(-step);
                // side 1
                square.handleLeftMouseDown({ x: 100, y: 100 });
                square.handleLeftClick({ x: 150, y: 250 }); // moving here should not work
                square.handleRightClick({ x: 10, y: 10 });  // right  clicking in the void to abort move
                expect(square.vertices[step].x).to.equal(100); // no move should have occured
                expect(square.vertices[step].y).to.equal(100);
                expect(square.isClosed).to.equal(true, 'Polygon not closed.');
                // side 2
                square.handleLeftMouseDown({ x: 100, y: 100 });
                square.handleLeftClick({ x: 250, y: 150 }); // moving here should not work
                square.handleRightClick({ x: 10, y: 10 });  // right  clicking in the void to abort move
                expect(square.vertices[step].x).to.equal(100); // no move should have occured
                expect(square.vertices[step].y).to.equal(100);
                expect(square.isClosed).to.equal(true, 'Polygon not closed.');
            });
        }


        for (let step: number = 0; step < 6; step++) {
            const square: Polygon = new Polygon([
                { x: 100, y: 100 },
                { x: 200, y: 100 },
                { x: 200, y: 190 },
                { x: 110, y: 110 },
                { x: 190, y: 200 },
                { x: 100, y: 200 }
            ]);

            it('Not possible to move when move creates intersection (not neighbouring segments) ' + step, () => {
                square.rotateVertices(-step);
                // side 1
                square.handleLeftMouseDown({ x: 100, y: 100 });
                square.handleLeftMouseUp({ x: 125, y: 175 }); // moving here should not work
                square.handleRightClick({ x: 10, y: 10 });  // right  clicking in the void to abort move
                expect(square.vertices[step].x).to.equal(100); // no move should have occured
                expect(square.vertices[step].y).to.equal(100);
                expect(square.isClosed).to.equal(true, 'Polygon not closed.');
                // side 2
                square.handleLeftMouseDown({ x: 100, y: 100 });
                square.handleLeftMouseUp({ x: 175, y: 125 }); // moving here should not work
                square.handleRightClick({ x: 10, y: 10 });  // right  clicking in the void to abort move
                expect(square.vertices[step].x).to.equal(100); // no move should have occured
                expect(square.vertices[step].y).to.equal(100);
                expect(square.isClosed).to.equal(true, 'Polygon not closed.');
            });
        }


    });

    describe('Getting segments', () => {


        it('calculateSegments() - three vertices', () => {
            const shape: Polygon = new Polygon([
                { x: 100, y: 100 },
                { x: 300, y: 100 },
                { x: 150, y: 300 }
            ]);

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

        for (let step: number = 0; step < 6; step++) {
            it('getStillSegments() - ' + step, () => {
                const shape: Polygon = new Polygon([
                    { x: 100, y: 100 },
                    { x: 150, y: 100 }, // extra
                    { x: 200, y: 100 },
                    { x: 200, y: 150 }, // extra
                    { x: 200, y: 200 },
                    { x: 100, y: 200 }
                ]);

                shape.rotateVertices(1);
                shape.handleLeftMouseDown({ x: 100, y: 100 }); // marking for move
                const stillSegments: Segment[] = shape.getStillSegments();
                expect(stillSegments.length).is.equal(4);
                stillSegments.forEach((segment) => {
                    const movePointInSegmentsFirst: boolean = segment.p1.x === 100 && segment.p1.y === 100;
                    const movePointInSegmentsSecond: boolean = segment.p1.x === 100 && segment.p1.y === 100;
                    expect(movePointInSegmentsFirst).to.equal(false);
                    expect(movePointInSegmentsSecond).to.equal(false);
                });
            });
        }

        for (let step: number = 0; step < 6; step++) {
            it('calculateMovingSegments() - ' + step, () => {
                const shape: Polygon = new Polygon([
                    { x: 100, y: 100 },
                    { x: 150, y: 100 }, // extra
                    { x: 200, y: 100 },
                    { x: 200, y: 150 }, // extra
                    { x: 200, y: 200 },
                    { x: 100, y: 200 }
                ]);

                shape.rotateVertices(1);
                shape.handleLeftMouseDown({ x: 100, y: 100 }); // marking for move
                const movingSegments: Segment[] = shape.getMovingSegments({ x: 10, y: 10 });
                expect(movingSegments.length).is.equal(2);

                movingSegments.forEach((segment) => {
                    const movePointInSegmentsFirst: boolean = segment.p1.x === 10 && segment.p1.y === 10;
                    const movePointInSegmentsSecond: boolean = segment.p2.x === 10 && segment.p2.y === 10;
                    expect(movePointInSegmentsFirst || movePointInSegmentsSecond).to.equal(true);
                });
            });
        }


    });

});

function getSquarePolygon(): Polygon {
    return new Polygon([{ x: 100, y: 100 }, { x: 200, y: 100 }, { x: 200, y: 200 }, { x: 100, y: 200 }]);
}