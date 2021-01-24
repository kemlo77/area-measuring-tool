import { expect } from 'chai';
import { PositivePolygonArea } from '../built/PositivePolygonArea';
import { Coordinate } from '../src/shape/Coordinate';




describe('PositivePolygonArea', () => {


    it('constructor - zero arguments', () => {
        const polygonArea: PositivePolygonArea = new PositivePolygonArea();
        expect(polygonArea.vertices.length).to.equal(0);
        expect(polygonArea.isClosed).to.equal(false);
    });

    it('constructor - one arguments', () => {
        const coordinates: Coordinate[] = [{ x: 100, y: 100 }, { x: 300, y: 100 }, { x: 150, y: 300 }];
        const polygonArea: PositivePolygonArea = new PositivePolygonArea(coordinates);
        expect(polygonArea.vertices.length).to.equal(3);
        expect(polygonArea.isClosed).to.equal(true);
    });


    it('default color', () => {
        const polygonArea: PositivePolygonArea = new PositivePolygonArea();
        expect(polygonArea.color).to.equal('0,80,120');
    });

    it('setting the static color', () => {
        PositivePolygonArea.setColor('10,10,10');
        const polygonArea: PositivePolygonArea = new PositivePolygonArea();
        expect(polygonArea.color).to.equal('10,10,10');
    });

});