import { expect } from 'chai';
import { PolygonArea } from '../built/PolygonArea';
import {AreaType } from '../built/AreaType.js';
import { Coordinate } from '../src/polygon/Coordinate';




describe('PolygonArea', () => {


    it('constructor - one argument', () => {
        const polygonArea: PolygonArea = new PolygonArea(AreaType.POSITIVE);
        expect(polygonArea.areaType).to.equal(AreaType.POSITIVE);
        expect(polygonArea.vertices.length).to.equal(0);
        expect(polygonArea.isClosed).to.equal(false);
    });

    it('constructor - two arguments', () => {
        const coordinates: Coordinate[] = [{ x: 100, y: 100 }, { x: 300, y: 100 }, { x: 150, y: 300 }];
        const polygonArea: PolygonArea = new PolygonArea(AreaType.POSITIVE, coordinates);
        expect(polygonArea.areaType).to.equal(AreaType.POSITIVE);
        expect(polygonArea.vertices.length).to.equal(3);
        expect(polygonArea.isClosed).to.equal(true);
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