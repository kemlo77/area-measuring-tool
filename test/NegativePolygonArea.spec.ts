import { expect } from 'chai';
import { NegativePolygonArea } from '../built/NegativePolygonArea';
import { Coordinate } from '../src/shape/Coordinate';




describe('NegativePolygonArea', () => {


    it('constructor - zero arguments', () => {
        const polygonArea: NegativePolygonArea = new NegativePolygonArea();
        expect(polygonArea.vertices.length).to.equal(0);
        expect(polygonArea.isClosed).to.equal(false);
        expect(polygonArea.name).to.match(/PolygonArea_[0-9]+/);
    });

    it('constructor - one arguments', () => {
        const coordinates: Coordinate[] = [
            { x: 100, y: 100 },
            { x: 200, y: 100 },
            { x: 200, y: 200 },
            { x: 100, y: 200 }
        ];
        const polygonArea: NegativePolygonArea = new NegativePolygonArea(coordinates);
        expect(polygonArea.vertices.length).to.equal(4);
        expect(polygonArea.isClosed).to.equal(true);
        expect(polygonArea.name).to.match(/PolygonArea_[0-9]+/);
        expect(polygonArea.area).to.equal(-10000);
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

    it('setting the name', () => {
        const area: NegativePolygonArea = new NegativePolygonArea();
        area.name = 'newName';
        expect(area.name).to.equal('newName');
    });

});