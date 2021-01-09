import { expect } from 'chai';
import { Polygon } from '../../built/polygon/Polygon';
import { Polygons } from '../../built/polygon/Polygons';

const rectangle: Polygon = new Polygon([
    { x: 100, y: 100 }, // upper left
    { x: 150, y: 100 },
    { x: 200, y: 100 }, // upper right
    { x: 200, y: 150 },
    { x: 200, y: 200 }, // lower right
    { x: 150, y: 200 },
    { x: 100, y: 200 }, // lower left
    { x: 100, y: 150 }
]);


describe('Polygons', () => {


    it('isClockwise', () => {
        const triangle: Polygon = new Polygon([{ x: 100, y: 100 }, { x: 300, y: 100 }, { x: 200, y: 300 }]);

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