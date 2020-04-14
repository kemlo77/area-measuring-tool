import { expect } from 'chai';
import { Polygon } from '../built/Polygon.js';

let rectangle: Polygon;



describe('main', () => {



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


    it('Happy case - close polygon', () => {
        expect(rectangle.area).to.equal(10000);
    });
});



// Antal segment
// Totala längden av alla segment
// Arean
// Clockwise
// Closed returnerar true om den är closed

// Regretting
// 'regretting' a vertex (by right clicking)
// 'regretting' all vertices (by right clicking a lot)

// adding vertex
// adding a vertex to a segment
// adding segment not possible when intersecting other line
// adding segment not possible when too close to other vertex

// Closing
// closing a polygon by clicking on first point
// not possible to close polygon if intersecting a segment

// Erasing
// normally all vertices are possible to erase
// not possible to erase a polygon if it means that the new polygon has segments that instersect
// erasing segment and thus opening the polygon
// erasing a vertex
// vertices next to new vertex are possible to move

// Moving
// normally all vertexes are possible to move
// not possible to move a vertex if it means that the new polygon has segments that intersect
// not possible to move a vertex if it means that the new position is to close to an existing segment
