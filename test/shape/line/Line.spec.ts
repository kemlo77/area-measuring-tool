import { expect } from 'chai';
import { Line } from '../../../built/shape/line/Line';


describe('Line', () => {

    it('constructor with arguments', () => {
        const line: Line = new Line();
        expect(line.isSelected).to.equal(true);
        //expect(Polygons.area(rectangle)).to.equal(10000);
    });




});