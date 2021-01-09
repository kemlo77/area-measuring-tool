import { expect } from 'chai';
import { Polygon } from '../../built/polygon/Polygon';
import { Polygons } from '../../built/polygon/Polygons';

let rectangle: Polygon;


describe('Polygons', () => {



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

    it('isClockwise', () => {
        const triangle: Polygon = new Polygon();
        triangle.handleLeftClick({ x: 100, y: 100 });
        triangle.handleLeftClick({ x: 300, y: 100 });
        triangle.handleLeftClick({ x: 200, y: 300 });
        triangle.handleLeftClick({ x: 100, y: 100 });
        expect(Polygons.isClockwise(triangle)).to.equal(true);
        triangle.reversePolygonDirection();
        expect(Polygons.isClockwise(triangle)).to.equal(false);
    });

    it('isClockwise called for open polygon', () => {
        const triangle: Polygon = new Polygon();
        expect(Polygons.isClockwise(triangle)).to.equal(null);
    });

    it('Area - when polygon closed', () => {
        expect(Polygons.area(rectangle)).to.equal(10000);
    });

    it('Area - when polygon not closed', () => {
        const shape: Polygon = new Polygon();
        expect(Polygons.area(shape)).to.equal(0);
    });

    it('perimeterLength', () => {
        expect(Polygons.perimeterLength(rectangle)).to.equal(400);
    });

});