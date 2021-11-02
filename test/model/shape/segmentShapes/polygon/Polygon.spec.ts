import { expect } from 'chai';
import { Polygon } from '../../../../../src/model/shape/segmentShapes/polygon/Polygon';

let rectangle: Polygon;


function getSquarePolygon(): Polygon {
    return new Polygon([{ x: 100, y: 100 }, { x: 200, y: 100 }, { x: 200, y: 200 }, { x: 100, y: 200 }]);
}

function getTrianglePolygon(): Polygon {
    return new Polygon([{ x: 100, y: 100 }, { x: 300, y: 100 }, { x: 200, y: 300 }]);
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

    it('constructor with arguments', () => {
        const rectangle: Polygon = getSquarePolygon();
        expect(rectangle.isClosed).to.equal(true);
        expect(rectangle.area).to.equal(10000);
    });

    it('constructor with argument null', () => {
        const rectangle: Polygon = new Polygon(null);
        expect(rectangle.isClosed).to.equal(false);
        expect(rectangle.numberOfVertices).to.equal(0);
    });



    it('segments()', () => {
        expect(rectangle.segments.length).to.equal(8);
    });

    it('numberOfVertices()', () => {
        expect(rectangle.numberOfVertices).to.equal(8);
    });

    it('numberOfSegments - closed', () => {
        const square: Polygon = getSquarePolygon();
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
        const square: Polygon = getSquarePolygon();
        expect(square.verticesExceptMovePoint.length).to.equal(4);
    });

    it('verticesExceptMovePoint - with a movePoint selected', () => {
        const square: Polygon = getSquarePolygon();
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

    it('getStillSegments', () => {
        expect(rectangle.getStillSegments().length).to.equal(8);
    });

    it('getMovingSegments', () => {
        expect(rectangle.getMovingSegments({ x: 0, y: 0 }).length).to.equal(0);
    });



    it('reversePolygonDirection()', () => {
        const triangle: Polygon = getTrianglePolygon();
        triangle.reversePolygonDirection();
        expect(triangle.vertices[0].x).to.equal(200);
        expect(triangle.vertices[0].y).to.equal(300);
        expect(triangle.vertices[1].x).to.equal(300);
        expect(triangle.vertices[1].y).to.equal(100);
        expect(triangle.vertices[2].x).to.equal(100);
        expect(triangle.vertices[2].y).to.equal(100);
    });




    it('rotateVertices()', () => {
        const triangle: Polygon = getTrianglePolygon();
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

    it('create new polygon using old polygon', () => {
        const oldtriangle: Polygon = getTrianglePolygon();
        const newTriangle: Polygon = new Polygon(oldtriangle.vertices);
        expect(newTriangle.vertices[0].x).to.equal(100);
        expect(newTriangle.vertices[0].y).to.equal(100);
        expect(newTriangle.vertices[1].x).to.equal(300);
        expect(newTriangle.vertices[1].y).to.equal(100);
        expect(newTriangle.vertices[2].x).to.equal(200);
        expect(newTriangle.vertices[2].y).to.equal(300);
    });

    it('isClockwise', () => {
        const triangle: Polygon = new Polygon([{ x: 100, y: 100 }, { x: 300, y: 100 }, { x: 200, y: 300 }]);

        expect(triangle.isClockwise).to.equal(true);
        triangle.reversePolygonDirection();
        expect(triangle.isClockwise).to.equal(false);
    });

    it('isClockwise called for open polygon', () => {
        const triangle: Polygon = new Polygon();
        expect(triangle.isClockwise).to.equal(null);
    });

    it('Area - when polygon closed', () => {
        expect(rectangle.area).to.equal(10000);
    });

    it('Area - when polygon not closed', () => {
        const shape: Polygon = new Polygon();
        expect(shape.area).to.equal(0);
    });

    it('length', () => {
        expect(rectangle.length).to.equal(400);
    });

});


