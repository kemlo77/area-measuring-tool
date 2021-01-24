import { expect } from 'chai';
import { NegativePolygonArea } from '../built/NegativePolygonArea';
import { Coordinate } from '../src/shape/Coordinate';




describe('NegativePolygonArea', () => {


    it('constructor - zero arguments', () => {
        const polygonArea: NegativePolygonArea = new NegativePolygonArea();
        expect(polygonArea.vertices.length).to.equal(0);
        expect(polygonArea.isClosed).to.equal(false);
    });

    it('constructor - one arguments', () => {
        const coordinates: Coordinate[] = [{ x: 100, y: 100 }, { x: 300, y: 100 }, { x: 150, y: 300 }];
        const polygonArea: NegativePolygonArea = new NegativePolygonArea(coordinates);
        expect(polygonArea.vertices.length).to.equal(3);
        expect(polygonArea.isClosed).to.equal(true);
    });


    it('default color', () => {
        const polygonArea: NegativePolygonArea = new NegativePolygonArea();
        expect(polygonArea.color).to.equal('128,0,0');
    });

    it('setting the static color', () => {
        NegativePolygonArea.setColor('10,10,10');
        const polygonArea: NegativePolygonArea = new NegativePolygonArea();
        expect(polygonArea.color).to.equal('10,10,10');
    });

});