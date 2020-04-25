import { expect } from 'chai';
import { Polygon } from '../built/Polygon';
import { Point } from '../built/Point';

let rectangle: Polygon;



describe('Polygon', () => {



    beforeEach(() => {
        rectangle = new Polygon();
        rectangle.handleLeftClick({ x: 100, y: 100 }); // upper left
        rectangle.handleLeftClick({ x: 150, y: 100 });
        rectangle.handleLeftClick({ x: 200, y: 100 }); // upper right
        rectangle.handleLeftClick({ x: 200, y: 150 });
        rectangle.handleLeftClick({ x: 200, y: 200 }); // lower right
        rectangle.handleLeftClick({ x: 150, y: 200 });
        rectangle.handleLeftClick({ x: 100, y: 200 }); // lower left
        rectangle.handleLeftClick({ x: 100, y: 150 });
        rectangle.handleLeftClick({ x: 100, y: 100 }); // closing

    });


    it('Area', () => {
        expect(rectangle.area).to.equal(10000);
    });

    it('isClosed', () => {
        expect(rectangle.isClosed).to.equal(true);
    });

    it('perimeterLength', () => {
        expect(rectangle.perimeterLength).to.equal(400);
    });

    it('numberOfSegments - closed', () => {
        const square: Polygon = getSquare();
        expect(square.numberOfSegments).to.equal(4);
    });

    it('numberOfSegments - just the first vertex', () => {
        const square: Polygon = new Polygon();
        square.handleLeftClick({ x: 150, y: 100 });
        expect(square.numberOfSegments).to.equal(0);
    });

    it('numberOfSegments - two vertices', () => {
        const square: Polygon = new Polygon();
        square.handleLeftClick({ x: 150, y: 100 });
        square.handleLeftClick({ x: 150, y: 200 });
        expect(square.numberOfSegments).to.equal(1);
    });

    it('verticesExceptMovePoint - no movePoint selected', () => {
        const square: Polygon = getSquare();
        expect(square.verticesExceptMovePoint.length).to.equal(4);
    });

    it('verticesExceptMovePoint - with a movePoint selected', () => {
        const square: Polygon = getSquare();
        square.handleLeftClick({ x: 100, y: 100 });
        expect(square.verticesExceptMovePoint.length).to.equal(3);
    });

    it('arrayRotate() - forward one step', () => {
        const rotatedLetters: string[] = Polygon.arrayRotate(['a', 'b', 'c', 'd'], 1);
        expect(rotatedLetters).to.eql(['b', 'c', 'd', 'a']);
    });

    it('arrayRotate() - rotating 0 steps', () => {
        const rotatedLetters: string[] = Polygon.arrayRotate(['a', 'b', 'c', 'd'], 0);
        expect(rotatedLetters).to.eql(['a', 'b', 'c', 'd']);
    });

    it('arrayRotate() - rotating backward one step', () => {
        const rotatedLetters: string[] = Polygon.arrayRotate(['a', 'b', 'c', 'd'], -1);
        expect(rotatedLetters).to.eql(['d', 'a', 'b', 'c']);
    });




    describe('Delete', () => {

        for (let step = 0; step < 6; step++) {
            const vShape: Polygon = new Polygon();
            vShape.handleLeftClick({ x: 100, y: 100 });
            vShape.handleLeftClick({ x: 100, y: 200 });
            vShape.handleLeftClick({ x: 200, y: 500 }); // point to be removed
            vShape.handleLeftClick({ x: 300, y: 200 });
            vShape.handleLeftClick({ x: 300, y: 100 });
            vShape.handleLeftClick({ x: 200, y: 400 });
            vShape.handleLeftClick({ x: 100, y: 100 }); // closing
            it('Removed vertex makes resulting new segment intersect with other segments ' + step, () => {
                vShape.rotateVertices(step);
                vShape.handleRightClick({ x: 200, y: 500 });
                expect(vShape.vertices.length).to.equal(6);
                expect(vShape.isClosed).to.equal(true, 'Polygon not closed');

            });
        }

        for (let step = 0; step < 3; step++) {
            const triangle: Polygon = new Polygon();
            triangle.handleLeftClick({ x: 100, y: 100 });
            triangle.handleLeftClick({ x: 300, y: 100 });
            triangle.handleLeftClick({ x: 200, y: 300 });
            triangle.handleLeftClick({ x: 100, y: 100 });
            it('Cannot remove when polygon only has 3 vertices ' + step, () => {
                triangle.rotateVertices(step);
                triangle.handleRightClick({ x: 100, y: 100 });
                expect(triangle.vertices.length).to.equal(3);
                expect(triangle.isClosed).to.equal(true, 'Polygon not closed');
            });
        }

        for (let step = 0; step < 4; step++) {
            const square: Polygon = getSquare();
            it('Trying to remove point but not within minimum distance ' + step, () => {
                square.rotateVertices(step);
                square.handleRightClick({ x: 100 - Polygon.interactDistance, y: 100 });
                expect(square.vertices.length).to.equal(4);
                expect(square.isClosed).to.equal(true, 'Polygon not closed');
            });
        }

        for (let step = 0; step < 4; step++) {
            const square: Polygon = getSquare();
            it('All points are possible to remove normally ' + step, () => {
                square.rotateVertices(step);
                square.handleRightClick({ x: 100, y: 100 });
                expect(square.vertices.length).to.equal(3);
                expect(square.isClosed).to.equal(true, 'Polygon not closed');
            });
        }

        for (let step = 0; step < 4; step++) {
            const square: Polygon = getSquare();
            it('Erasing segment and thus opening the polygon ' + step, () => {
                square.rotateVertices(step);
                square.handleRightClick({ x: 150, y: 100 });
                expect(square.vertices.length).to.equal(4);
                expect(square.isClosed).to.equal(false, 'Polygon still closed');
            });
        }

        for (let step = 0; step < 4; step++) {
            const square: Polygon = getSquare();
            it('trying to erase segment but not within minimum segment distance ' + step, () => {
                square.rotateVertices(step);
                square.handleRightClick({ x: 150, y: 100 + Polygon.interactDistance + 1 });
                expect(square.vertices.length).to.equal(4);
                expect(square.isClosed).to.equal(true, 'Polygon not closed.');
            });
        }




    });

    describe('Moving', () => {

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
            it('Possible to move vertex when NOT too close to other vertex ' + step, () => {
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
            it('vertices next to new vertex are possible to move', () => {
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

    describe('Closing', () => {
        it('Closing by clicking on first point', () => {
            const square: Polygon = new Polygon();
            square.handleLeftClick({ x: 100, y: 100 });
            square.handleLeftClick({ x: 200, y: 100 });
            square.handleLeftClick({ x: 200, y: 200 });
            square.handleLeftClick({ x: 100, y: 200 });
            expect(square.isClosed).is.equal(false, 'wrongly closed');
            square.handleLeftClick({ x: 100, y: 100 });
            expect(square.isClosed).is.equal(true, 'not closed?');
        });

        it('Not being able to close by clickint at wrong point', () => {
            const square: Polygon = new Polygon();
            square.handleLeftClick({ x: 100, y: 100 });
            square.handleLeftClick({ x: 200, y: 100 });
            square.handleLeftClick({ x: 200, y: 200 });
            square.handleLeftClick({ x: 100, y: 200 });
            expect(square.isClosed).is.equal(false, 'wrongly closed');
            square.handleLeftClick({ x: 200, y: 100 });
            expect(square.isClosed).is.equal(false, 'wrongly closed');
        });

        it('Cannot close because intersecting an old segment (second segment', () => {
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

        it('Cannot close because intersecting an old segment (second to last segment', () => {
            const square: Polygon = new Polygon();
            square.handleLeftClick({ x: 250, y: 150 });
            square.handleLeftClick({ x: 200, y: 50 });
            square.handleLeftClick({ x: 100, y: 100 });
            square.handleLeftClick({ x: 200, y: 100 });
            square.handleLeftClick({ x: 200, y: 200 });
            square.handleLeftClick({ x: 100, y: 200 });
            expect(square.isClosed).is.equal(false, 'wrongly closed');
            square.handleLeftClick({ x: 250, y: 150 });
            expect(square.isClosed).is.equal(false, 'wrongly closed');
        });

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



// Antal segment
// Totala längden av alla segment
// Arean
// Clockwise
// Closed returnerar true om den är closed
// clockwise enforced

// Regretting
// 'regretting' a vertex (by right clicking)
// 'regretting' all vertices (by right clicking a lot)

// adding vertex
// adding a vertex to a segment
// adding segment not possible when intersecting other line
// adding segment not possible when too close to other vertex



// Erasing
// TODO: kolla om det finns nåt kvar av erase att testa (se ClosedState)


// Moving
// TODO: kolla om det finns nåt kvar av detta att testa i ClosedState eller MoveState
