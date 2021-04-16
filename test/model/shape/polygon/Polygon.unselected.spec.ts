import { expect } from 'chai';
import { Polygon } from '../../../../built/model/shape/polygon/Polygon';


describe('Polygon - unselected', () => {

    it('handleLeftClick() - unselect', () => {
        const square: Polygon = getSquarePolygon();
        square.handleLeftClick({ x: 10, y: 10 });
        expect(square.isSelected).to.equal(false);
    });

    it('handleLeftClick() - reselect', () => {
        const square: Polygon = getSquarePolygon();
        square.handleLeftClick({ x: 10, y: 10 }); // unselecting
        square.handleLeftClick({ x: 100, y: 110 }); // reselecting
        expect(square.isSelected).to.equal(true);
    });

    it('handleLeftClick() failing to reselect 1', () => {
        const square: Polygon = getSquarePolygon();
        square.handleLeftClick({ x: 10, y: 10 }); // unselecting
        square.handleLeftClick({ x: 10, y: 10 }); // reselecting
        expect(square.isSelected).to.equal(false);
    });


    it('handleLeftClick() failing to reselect 2', () => {
        const square: Polygon = getSquarePolygon();
        square.handleLeftClick({ x: 10, y: 10 }); // unselecting
        square.handleRightClick({ x: 10, y: 10 }); // reselecting
        // right clicking has no effect
    });

    it('calculateSegments', () => {
        const square: Polygon = getSquarePolygon();
        square.handleLeftClick({ x: 10, y: 10 }); // unselecting
        expect(square.segments.length).to.equal(4);
    });

    it('calculatetillSegments()', () => {
        const square: Polygon = getSquarePolygon();
        square.handleLeftClick({ x: 10, y: 10 }); // unselecting
        expect(square.getStillSegments().length).to.equal(4);
    });

    it('calculateMovingSegments() 1', () => {
        const square: Polygon = getSquarePolygon();
        square.handleLeftClick({ x: 10, y: 10 }); // unselecting
        expect(square.getMovingSegments({ x: 10, y: 10 }).length).to.equal(0);
    });

    it('calculateMovingSegments() 2', () => {
        const square: Polygon = getSquarePolygon();
        square.handleLeftClick({ x: 10, y: 10 }); // unselecting
        expect(square.getMovingSegments({ x: 10, y: 10 }).length).to.equal(0);
    });

});

function getSquarePolygon(): Polygon {
    return new Polygon([{ x: 100, y: 100 }, { x: 200, y: 100 }, { x: 200, y: 200 }, { x: 100, y: 200 },]);
}