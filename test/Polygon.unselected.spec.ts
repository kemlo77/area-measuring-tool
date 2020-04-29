import { expect } from 'chai';
import { Polygon } from '../built/Polygon';


describe('Polygon - unselected', () => {

    it('handleLeftClick() - unselect', () => {
        const square: Polygon = getSquare();
        square.handleLeftClick({ x: 10, y: 10 });
        expect(square.isSelected).to.equal(false);
    });

    it('handleLeftClick() - reselect', () => {
        const square: Polygon = getSquare();
        square.handleLeftClick({ x: 10, y: 10 }); // unselecting
        square.handleLeftClick({ x: 100, y: 110 }); // reselecting
        expect(square.isSelected).to.equal(true);
    });

    it('handleLeftClick() failing to reselect 1', () => {
        const square: Polygon = getSquare();
        square.handleLeftClick({ x: 10, y: 10 }); // unselecting
        square.handleLeftClick({ x: 10, y: 10 }); // reselecting
        expect(square.isSelected).to.equal(false);
    });


    it('handleLeftClick() failing to reselect 2', () => {
        const square: Polygon = getSquare();
        square.handleLeftClick({ x: 10, y: 10 }); // unselecting
        square.handleRightClick({ x: 10, y: 10 }); // reselecting
        // right clicking has no effect
    });

    it('calculateSegments', () => {
        const square: Polygon = getSquare();
        square.handleLeftClick({ x: 10, y: 10 }); // unselecting
        expect(square.segments.length).to.equal(4);
    });

    it('calculatePaintableStillSegments()', () => {
        const square: Polygon = getSquare();
        square.handleLeftClick({ x: 10, y: 10 }); // unselecting
        expect(square.getPaintableStillSegments().length).to.equal(4);
    });

    it('calculatePaintableMovingSegments() 1', () => {
        const square: Polygon = getSquare();
        square.handleLeftClick({ x: 10, y: 10 }); // unselecting
        expect(square.getPaintableMovingSegments({ x: 10, y: 10 }).length).to.equal(0);
    });

    it('calculatePaintableMovingSegments() 2', () => {
        const square: Polygon = getSquare();
        square.handleLeftClick({ x: 10, y: 10 }); // unselecting
        expect(square.getPaintableMovingSegments({ x: 10, y: 10 }).length).to.equal(0);
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