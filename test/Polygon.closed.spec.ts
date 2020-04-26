import { expect } from 'chai';
import { Polygon } from '../built/Polygon';


describe('Polygon - close', () => {





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