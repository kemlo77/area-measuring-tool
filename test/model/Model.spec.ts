import { expect } from 'chai';
import { Model } from '../../src/model/Model';
import { MockShapeFactory } from '../../src/model/meassuringshape/MockShapeFactory';


describe('Model', () => {

    let model: Model;

    function drawPolygonShapeAndDeselect(model: Model): void {
        drawPolygonShape(model);
        model.reactToLeftClick({ x: 1, y: 1 }); //clicking elsewhere
    }

    function drawPolygonShape(model: Model): void {
        model.addShape('Polygon');
        model.reactToLeftClick({ x: 100, y: 100 });
        model.reactToLeftClick({ x: 200, y: 200 });
        model.reactToLeftClick({ x: 100, y: 200 });
        model.reactToLeftClick({ x: 100, y: 100 }); //closing triangle
    }

    beforeEach(() => {
        model = new Model();
        model.shapeFactory = new MockShapeFactory();
    });

    it('allShapes', () => {

        expect(model.allShapes.length).to.equal(0);
        model.addShape('Polygon');
        expect(model.allShapes.length).to.equal(1);
    });

    it('addShape()', () => {
        expect(model.selectedShape).to.be.undefined;
        model.addShape('Polygon');
        expect(model.selectedShape).to.not.be.undefined;
    });

    it('addShape() - using shape name that does not exist', () => {
        expect(model.selectedShape).to.be.undefined;
        model.addShape('dragon');
        expect(model.selectedShape).to.be.undefined;
    });

    it('addShape() - try to add while another shape is selected', () => {
        model.addShape('Polygon');
        expect(model.selectedShape).to.not.be.null;
        expect(model.allShapes.length).to.equal(1);
        model.addShape('Polygon');
        expect(model.selectedShape).to.not.be.null;
        expect(model.allShapes.length).to.equal(1);
    });

    it('removeSelectedShape()', () => {
        model.addShape('Polygon');
        expect(model.allShapes.length).to.equal(1);
        model.removeSelectedShape();
        expect(model.allShapes.length).to.equal(0);
    });

    it('draw shape and deselect it', () => {
        drawPolygonShape(model);
        expect(model.selectedShape).to.not.be.undefined;
        model.reactToLeftClick({ x: 1, y: 1 }); //clicking elsewhere
        expect(model.selectedShape).to.be.undefined;
    });

    it('fail to reselect a shape', () => {
        drawPolygonShapeAndDeselect(model);
        expect(model.selectedShape).to.be.undefined;
        model.reactToLeftClick({ x: 1, y: 1 }); //clicking elsewhere
        expect(model.selectedShape).to.be.undefined;
    });

    it('reselecting a drawn shape', () => {
        drawPolygonShapeAndDeselect(model);
        expect(model.selectedShape).to.be.undefined;
        model.reactToLeftClick({ x: 100, y: 100 });
        expect(model.selectedShape).to.not.be.undefined;
    });

    it('try to remove shape, but no one is selected', () => {
        drawPolygonShapeAndDeselect(model);
        expect(model.selectedShape).to.be.undefined;
        expect(model.allShapes.length).to.equal(1);
        model.removeSelectedShape();
        expect(model.allShapes.length).to.equal(1);
    });


    it('areaShapes - empty', () => {
        model.addShape('Line');
        expect(model.areaShapes.length).to.equal(0);
    });

    it('areaShapes - one', () => {
        model.addShape('Polygon');
        expect(model.areaShapes.length).to.equal(1);
    });

    it('lengthShapes - one', () => {
        model.addShape('Line');
        expect(model.lengthShapes.length).to.equal(1);
    });

    it('lengthShapes - empty', () => {
        model.addShape('Polygon');
        expect(model.lengthShapes.length).to.equal(0);
    });

    it('draw a line, then deselect it', () => {
        model.addShape('Line');
        model.reactToLeftMouseDown({ x: 100, y: 100 });
        model.reactToLeftMouseUp({ x: 200, y: 200 });
        expect(model.selectedShape).to.not.be.undefined;
        model.reactToLeftMouseDown({ x: 300, y: 300 });
        expect(model.selectedShape).to.be.undefined;
        expect(model.allShapes.length).to.equal(1);
    });

});