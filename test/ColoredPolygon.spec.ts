import { expect } from 'chai';
import { PolygonArea} from '../built/PolygonArea';

let rectangle: PolygonArea;


describe('PolygonArea', () => {



    beforeEach(() => {
        rectangle = new PolygonArea();
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






    it('makeDirectionClockWise()', () => {
        const triangle: PolygonArea = new PolygonArea();
        triangle.handleLeftClick({ x: 100, y: 100 });
        triangle.handleLeftClick({ x: 300, y: 100 });
        triangle.handleLeftClick({ x: 200, y: 300 });
        triangle.handleLeftClick({ x: 100, y: 100 });
        expect(triangle.isCounterclockwise).to.equal(false);
        triangle.makeDirectionCounterClockwise();
        expect(triangle.isCounterclockwise).to.equal(true);
        triangle.makeDirectionClockWise();
        expect(triangle.isCounterclockwise).to.equal(false);
    });





    it('Area - when polygon closed', () => {
        expect(rectangle.area).to.equal(10000);
    });

    it('Area - when polygon not closed', () => {
        const shape: PolygonArea = new PolygonArea();
        expect(shape.area).to.equal(0);
    });



    it('perimeterLength', () => {
        expect(rectangle.perimeterLength).to.equal(400);
    });

 




});