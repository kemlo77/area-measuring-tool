import { expect } from 'chai';
import { Ruler } from '../../built/model/Ruler';


describe('Ruler', () => {


    it('constructor - zero arguments', () => {
        const ruler: Ruler = new Ruler();
        expect(ruler.p1).to.equal(null);
        expect(ruler.p2).to.equal(null);
        expect(ruler.isComplete).to.equal(false);
        expect(ruler.name).to.equal('Ruler_0');
        
    });

    it('constructor - two arguments', () => {
        const ruler: Ruler = new Ruler({x:100, y:200}, {x: 300, y:400});
        expect(ruler.p1.x).to.equal(100);
        expect(ruler.p1.y).to.equal(200);
        expect(ruler.p2.x).to.equal(300);
        expect(ruler.p2.y).to.equal(400);
        expect(ruler.isComplete).to.equal(true);
        expect(ruler.name).to.equal('Ruler_1');
    });


    it('default color', () => {
        const ruler: Ruler = new Ruler();
        expect(ruler.color).to.equal('255,255,0');
    });

    it('setting the static color', () => {
        Ruler.setColor('10,10,10');
        const ruler: Ruler = new Ruler();
        expect(ruler.color).to.equal('10,10,10');
    });

    it('setting the name', () => {
        const ruler: Ruler = new Ruler();
        ruler.name = 'newName';
        expect(ruler.name).to.equal('newName');
    });

});