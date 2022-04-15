import { expect } from 'chai';
import { ViewScaler } from '../../../src/view/dataview/ViewScaler';


describe('ViewScaler', () => {

    let viewScaler: ViewScaler;

    beforeEach(() => {
        viewScaler = new ViewScaler();
    });

    it('scaleFactor', () => {
        expect(viewScaler.scaleFactor).to.equal('0.1');
    });

    it('updateScaleGivenLength', () => {
        viewScaler.updateScaleGivenLength(10, 20);
        expect(viewScaler.scaleFactor).to.equal('0.5');
    });

    it('updateScaleGivenArea', () => {
        viewScaler.updateScaleGivenArea(25, 100);
        expect(viewScaler.scaleFactor).to.equal('0.5');
    });

    it('adjustAreaAccordingToScale', () => {
        expect(viewScaler.adjustLengthAccordingToScale(100))
            .to.equal('10');
    });

    it('adjustAreaAccordingToScale', () => {
        expect(viewScaler.adjustAreaAccordingToScale(100))
            .to.equal('1');
    });


});