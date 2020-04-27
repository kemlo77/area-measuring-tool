import { expect } from 'chai';
import { Polygon } from '../built/Polygon';

let rectangle: Polygon;



describe('Polygon', () => {



    beforeEach(() => {
        rectangle = new Polygon();
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


    it('Area', () => {
        expect(rectangle.area).to.equal(10000);
    });

    it('isClosed', () => {
        expect(rectangle.isClosed).to.equal(true);
    });

    it('perimeterLength', () => {
        expect(rectangle.perimeterLength).to.equal(400);
    });

    it('numberOfSegments - closed', () => {
        const square: Polygon = getSquare();
        expect(square.numberOfSegments).to.equal(4);
    });

    it('numberOfSegments - just the first vertex', () => {
        const square: Polygon = new Polygon();
        square.handleLeftClick({ x: 150, y: 100 });
        expect(square.numberOfSegments).to.equal(0);
    });

    it('numberOfSegments - two vertices', () => {
        const square: Polygon = new Polygon();
        square.handleLeftClick({ x: 150, y: 100 });
        square.handleLeftClick({ x: 150, y: 200 });
        expect(square.numberOfSegments).to.equal(1);
    });

    it('verticesExceptMovePoint - no movePoint selected', () => {
        const square: Polygon = getSquare();
        expect(square.verticesExceptMovePoint.length).to.equal(4);
    });

    it('verticesExceptMovePoint - with a movePoint selected', () => {
        const square: Polygon = getSquare();
        square.handleLeftClick({ x: 100, y: 100 });
        expect(square.verticesExceptMovePoint.length).to.equal(3);
    });

    it('arrayRotate() - forward one step', () => {
        const rotatedLetters: string[] = Polygon.arrayRotate(['a', 'b', 'c', 'd'], 1);
        expect(rotatedLetters).to.eql(['b', 'c', 'd', 'a']);
    });

    it('arrayRotate() - rotating 0 steps', () => {
        const rotatedLetters: string[] = Polygon.arrayRotate(['a', 'b', 'c', 'd'], 0);
        expect(rotatedLetters).to.eql(['a', 'b', 'c', 'd']);
    });

    it('arrayRotate() - rotating backward one step', () => {
        const rotatedLetters: string[] = Polygon.arrayRotate(['a', 'b', 'c', 'd'], -1);
        expect(rotatedLetters).to.eql(['d', 'a', 'b', 'c']);
    });

});

function getSquare(): Polygon {
    const square: Polygon = new Polygon();
    square.handleLeftClick({ x: 100, y: 100 });
    square.handleLeftClick({ x: 200, y: 100 });
    square.handleLeftClick({ x: 200, y: 200 });
    square.handleLeftClick({ x: 100, y: 200 });
    square.handleLeftClick({ x: 100, y: 100 });
    return square;
}



// Antal segment
// Totala längden av alla segment
// Arean
// Clockwise
// Closed returnerar true om den är closed
// clockwise enforced



// when closed
// adding a vertex to a segment


// Erasing
// TODO: kolla om det finns nåt kvar av erase att testa (se ClosedState)


// Moving
// TODO: kolla om det finns nåt kvar av detta att testa i ClosedState eller MoveState
