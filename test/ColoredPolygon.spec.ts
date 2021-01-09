import { expect } from 'chai';
import { PolygonArea } from '../built/PolygonArea';
import {AreaType } from '../built/AreaType.js';

let rectangle: PolygonArea;


describe('PolygonArea', () => {



    beforeEach(() => {
        rectangle = new PolygonArea(AreaType.POSITIVE);
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

    it('different types have different color', () => {
        const positiveArea: PolygonArea = new PolygonArea(AreaType.POSITIVE);
        const negativeArea: PolygonArea = new PolygonArea(AreaType.NEGATIVE);
        expect(positiveArea.color).not.to.equal(negativeArea.color);
    });

    it('setting positive color', () => {
        PolygonArea.setPositiveColor('10,10,10');
        const positiveArea: PolygonArea = new PolygonArea(AreaType.POSITIVE);
        expect(positiveArea.color).to.equal('10,10,10');
    });

    it('setting negative color', () => {
        PolygonArea.setNegativeColor('20,20,20');
        const negativeArea: PolygonArea = new PolygonArea(AreaType.NEGATIVE);
        expect(negativeArea.color).to.equal('20,20,20');
    });

    it('getting area type', () => {
        const negativeArea: PolygonArea = new PolygonArea(AreaType.NEGATIVE);
        expect(negativeArea.areaType).to.equal(AreaType.NEGATIVE);
    });







});