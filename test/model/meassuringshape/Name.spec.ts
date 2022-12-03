import { expect } from 'chai';
import { Name } from '../../../src/model/meassuringshape/Name';

describe('Name', () => {


    it('happy case', () => {
        const name: Name = new Name('tralala');
        expect(name.value).to.equal('tralala');
    });

    it('throws error when called with empty string', () => {
        expect(() => new Name('')).to.throw(/Invalid parameters/);
    });

    it('throws error when called with  too long string', () => {
        const ten: string = 'abcdefghij';
        const fortyOne: string = ten + ten + ten + ten + '1';
        expect(() => new Name(fortyOne)).to.throw(/Invalid parameters/);
    });

});