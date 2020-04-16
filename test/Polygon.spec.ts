import { expect } from 'chai';
import { Polygon } from '../built/Polygon.js';

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
            const square: Polygon = returnSquare();
            it('Trying to remove point but not within minimum distance ' + step, () => {
                square.rotateVertices(step);
                square.handleRightClick({ x: 100 - square.deleteDistance, y: 100 });
                expect(square.vertices.length).to.equal(4);
                expect(square.isClosed).to.equal(true, 'Polygon not closed');
            });
        }

        for (let step = 0; step < 4; step++) {
            const square: Polygon = returnSquare();
            it('All points are possible to remove normally ' + step, () => {
                square.rotateVertices(step);
                square.handleRightClick({ x: 100, y: 100 });
                expect(square.vertices.length).to.equal(3);
                expect(square.isClosed).to.equal(true, 'Polygon not closed');
            });
        }

        for (let step = 0; step < 4; step++) {
            const square: Polygon = returnSquare();
            it('Erasing segment and thus opening the polygon ' + step, () => {
                square.rotateVertices(step);
                square.handleRightClick({ x: 150, y: 100 });
                expect(square.vertices.length).to.equal(4);
                expect(square.isClosed).to.equal(false, 'Polygon still closed');
            });
        }

        for (let step = 0; step < 4; step++) {
            const square: Polygon = returnSquare();
            it('trying to erase segment but not within minimum segment distance ' + step, () => {
                square.rotateVertices(step);
                square.handleRightClick({ x: 150, y: 100 + square.deleteDistance + 1 });
                expect(square.vertices.length).to.equal(4);
                expect(square.isClosed).to.equal(true, 'Polygon not closed.');
            });
        }




    });

});

function returnSquare(): Polygon {
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

// Regretting
// 'regretting' a vertex (by right clicking)
// 'regretting' all vertices (by right clicking a lot)

// adding vertex
// adding a vertex to a segment
// adding segment not possible when intersecting other line
// adding segment not possible when too close to other vertex

// Closing
// closing a polygon by clicking on first point
// not possible to close polygon if intersecting a segment

// Erasing


// Moving
// normally all vertexes are possible to move
// not possible to move a vertex if it means that the new polygon has segments that intersect
// not possible to move a vertex if it means that the new position is to close to an existing segment
// vertices next to new vertex are possible to move
