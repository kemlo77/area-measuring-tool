import { expect } from 'chai';
import { Polygon } from '../../built/polygon/Polygon';

let rectangle: Polygon;


function getSquare(): Polygon {
    const square: Polygon = new Polygon();
    square.handleLeftClick({ x: 100, y: 100 });
    square.handleLeftClick({ x: 200, y: 100 });
    square.handleLeftClick({ x: 200, y: 200 });
    square.handleLeftClick({ x: 100, y: 200 });
    square.handleLeftClick({ x: 100, y: 100 });
    return square;
}


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

    it('segments()', () => {
        expect(rectangle.segments.length).to.equal(8);
    });

    it('numberOfVertices()', () => {
        expect(rectangle.numberOfVertices).to.equal(8);
    });

    it('numberOfSegments - closed', () => {
        const square: Polygon = getSquare();
        expect(square.numberOfSegments).to.equal(4);
    });

    it('numberOfSegments - not  even a single vertex', () => {
        const square: Polygon = new Polygon();
        expect(square.numberOfSegments).to.equal(0);
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

    it('firstVertex()', () => {
        expect(rectangle.firstVertex.x).to.equal(100);
        expect(rectangle.firstVertex.y).to.equal(100);
    });

    it('lastVertex()', () => {
        expect(rectangle.lastVertex.x).to.equal(100);
        expect(rectangle.lastVertex.y).to.equal(150);
    });

    it('verticesExceptMovePoint - no movePoint selected', () => {
        const square: Polygon = getSquare();
        expect(square.verticesExceptMovePoint.length).to.equal(4);
    });

    it('verticesExceptMovePoint - with a movePoint selected', () => {
        const square: Polygon = getSquare();
        square.handleLeftMouseDown({ x: 100, y: 100 });
        expect(square.verticesExceptMovePoint.length).to.equal(3);
    });

    it('isClosed', () => {
        expect(rectangle.isClosed).to.equal(true);
    });

    it('isSelected - selected', () => {
        expect(rectangle.isSelected).to.equal(true);
    });

    it('isSelected - not selected', () => {
        rectangle.handleLeftClick({ x: 10, y: 10 });
        expect(rectangle.isSelected).to.equal(false);
    });

    it('isMoving - not moving', () => {
        expect(rectangle.isMoving).to.equal(false);
    });

    it('isMoving - moving', () => {
        rectangle.handleLeftMouseDown({ x: 100, y: 100 });
        expect(rectangle.isMoving).to.equal(true);
    });

    it('getPaintableStillSegments', () => {
        expect(rectangle.getPaintableStillSegments().length).to.equal(8);
    });

    it('getPaintableMovingSegments', () => {
        expect(rectangle.getPaintableMovingSegments().length).to.equal(0);
    });



    it('reversePolygonDirection()', () => {
        const triangle: Polygon = new Polygon();
        triangle.handleLeftClick({ x: 100, y: 100 });
        triangle.handleLeftClick({ x: 300, y: 100 });
        triangle.handleLeftClick({ x: 200, y: 300 });
        triangle.handleLeftClick({ x: 100, y: 100 });
        triangle.reversePolygonDirection();
        expect(triangle.vertices[0].x).to.equal(200);
        expect(triangle.vertices[0].y).to.equal(300);
        expect(triangle.vertices[1].x).to.equal(300);
        expect(triangle.vertices[1].y).to.equal(100);
        expect(triangle.vertices[2].x).to.equal(100);
        expect(triangle.vertices[2].y).to.equal(100);
    });




    it('rotateVertices()', () => {
        const triangle: Polygon = new Polygon();
        triangle.handleLeftClick({ x: 100, y: 100 });
        triangle.handleLeftClick({ x: 300, y: 100 });
        triangle.handleLeftClick({ x: 200, y: 300 });
        triangle.handleLeftClick({ x: 100, y: 100 });
        triangle.rotateVertices(1);

        expect(triangle.vertices[0].x).to.equal(300);
        expect(triangle.vertices[0].y).to.equal(100);

        expect(triangle.vertices[1].x).to.equal(200);
        expect(triangle.vertices[1].y).to.equal(300);

        expect(triangle.vertices[2].x).to.equal(100);
        expect(triangle.vertices[2].y).to.equal(100);




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


