import { expect } from 'chai';
import { MathUtil } from '../built/MathUtil.js';


describe('MathUtil', () => {
    describe('arrayRotate()', () => {
        it('rotating forward one step', () => {
            const rotatedLetters: string[] = MathUtil.arrayRotate(['a','b','c','d'],1);
            expect(rotatedLetters).to.eql(['b','c','d','a']);
        });

        it('rotating 0 steps', () => {
            const rotatedLetters: string[] = MathUtil.arrayRotate(['a','b','c','d'],0);
            expect(rotatedLetters).to.eql(['a','b','c','d']);
        });

        it('rotating backward one step', () => {
            const rotatedLetters: string[] = MathUtil.arrayRotate(['a','b','c','d'],-1);
            expect(rotatedLetters).to.eql(['d','a','b','c']);
        });
    });
});