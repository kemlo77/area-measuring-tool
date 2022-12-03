import { expect } from 'chai';
import { Color } from '../../../src/model/meassuringshape/Color';

describe('Color', () => {


    it('toRgbString', () => {
        const color: Color = new Color(0, 0, 0);
        expect(color.toRgbString()).to.equal('rgb(0,0,0)');
    });

    it('toRgbaString', () => {
        const color: Color = new Color(255, 255, 255);
        expect(color.toRgbaString()).to.equal('rgba(255,255,255,1)');
    });

    it('red', () => {
        const color: Color = new Color(255, 128, 64);
        expect(color.red).to.equal(255);
    });

    it('green', () => {
        const color: Color = new Color(255, 128, 64);
        expect(color.green).to.equal(128);
    });

    it('blue', () => {
        const color: Color = new Color(255, 128, 64);
        expect(color.blue).to.equal(64);
    });


    it('throws error when faulty red value given to constructor -1', () => {
        expect(() => new Color(-1, 0, 0)).to.throw(/The given rgb values are not valid/);
    });

    it('throws error when faulty red value given to constructor 256', () => {
        expect(() => new Color(256, 0, 0)).to.throw(/The given rgb values are not valid/);
    });


    it('throws error when faulty green value given to constructor -1', () => {
        expect(() => new Color(0, -1, 0)).to.throw(/The given rgb values are not valid/);
    });

    it('throws error when faulty green value given to constructor 256', () => {
        expect(() => new Color(0, 256, 0)).to.throw(/The given rgb values are not valid/);
    });


    it('throws error when faulty blue value given to constructor -1', () => {
        expect(() => new Color(0, 0, -1)).to.throw(/The given rgb values are not valid/);
    });

    it('throws error when faulty blue value given to constructor 256', () => {
        expect(() => new Color(0, 0, 256)).to.throw(/The given rgb values are not valid/);
    });

});