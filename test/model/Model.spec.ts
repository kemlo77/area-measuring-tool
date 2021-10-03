import { expect } from 'chai';
import { Model } from '../../built/model/Model';
import { MockShapeFactory } from '../../built/model/MockShapeFactory';


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

    it('listOfShapes', () => {

        expect(model.listOfShapes.length).to.equal(0);
        model.addShape('Polygon');
        expect(model.listOfShapes.length).to.equal(1);
    });

    it('addShape()', () => {
        expect(model.noShapeIsSelected()).to.equal(true);
        model.addShape('Polygon');
        expect(model.noShapeIsSelected()).to.equal(false);
    });

    it('addShape() - using shape name that does not exist', () => {
        expect(model.noShapeIsSelected()).to.equal(true);
        model.addShape('dragon');
        expect(model.noShapeIsSelected()).to.equal(true);
    });

    it('addShape() - try to add while another shape is selected', () => {
        model.addShape('Polygon');
        expect(model.noShapeIsSelected()).to.equal(false);
        expect(model.listOfShapes.length).to.equal(1);
        model.addShape('Polygon');
        expect(model.noShapeIsSelected()).to.equal(false);
        expect(model.listOfShapes.length).to.equal(1);
    });

    it('removeSelectedShape()', () => {
        model.addShape('Polygon');
        expect(model.listOfShapes.length).to.equal(1);
        model.removeSelectedShape();
        expect(model.listOfShapes.length).to.equal(0);
    });

    it('draw shape and deselect it', () => {
        drawPolygonShape(model);
        expect(model.noShapeIsSelected()).to.equal(false);
        model.reactToLeftClick({ x: 1, y: 1 }); //clicking elsewhere
        expect(model.noShapeIsSelected()).to.equal(true);
    });

    it('fail to reselect a shape', () => {
        drawPolygonShapeAndDeselect(model);
        expect(model.noShapeIsSelected()).to.equal(true);
        model.reactToLeftClick({ x: 1, y: 1 }); //clicking elsewhere
        expect(model.noShapeIsSelected()).to.equal(true);
    });

    it('reselecting a drawn shape', () => {
        drawPolygonShapeAndDeselect(model);
        expect(model.noShapeIsSelected()).to.equal(true);
        model.reactToLeftClick({ x: 100, y: 100 });
        expect(model.noShapeIsSelected()).to.equal(false);
    });

    it('try to remove shape, but no one is selected', () => {
        drawPolygonShapeAndDeselect(model);
        expect(model.noShapeIsSelected()).to.equal(true);
        expect(model.listOfShapes.length).to.equal(1);
        model.removeSelectedShape();
        expect(model.listOfShapes.length).to.equal(1);
    });

    it('anySelectedShapeReactToLeftMouseDown()', () => {
        model.addShape('Line');
        const shapeReacted1: boolean = model.anySelectedShapeReactToLeftMouseDown({ x: 100, y: 100 });
        expect(shapeReacted1).to.equal(true);
    });

    it('anySelectedShapeReactToLeftMouseDown() - no one is selected', () => {
        const shapeReacted1: boolean = model.anySelectedShapeReactToLeftMouseDown({ x: 100, y: 100 });
        expect(shapeReacted1).to.equal(false);
    });

    it('anySelectedShapeReactToLeftMouseUp()', () => {
        model.addShape('Line');
        const shapeReacted1: boolean = model.anySelectedShapeReactToLeftMouseUp({ x: 100, y: 100 });
        expect(shapeReacted1).to.equal(true);
    });

    it('anySelectedShapeReactToLeftMouseUp() - no one is selected', () => {
        const shapeReacted1: boolean = model.anySelectedShapeReactToLeftMouseUp({ x: 100, y: 100 });
        expect(shapeReacted1).to.equal(false);
    });

    it('anySelectedShapeReactToRightClick()', () => {
        model.addShape('Line');
        const shapeReacted1: boolean = model.anySelectedShapeReactToRightClick({ x: 100, y: 100 });
        expect(shapeReacted1).to.equal(true);
    });

    it('anySelectedShapeReactToRightClick() - no one is selected', () => {
        const shapeReacted1: boolean = model.anySelectedShapeReactToRightClick({ x: 100, y: 100 });
        expect(shapeReacted1).to.equal(false);
    });

    it('onlyAreaShapes() - empty', () => {
        model.addShape('Line');
        expect(model.onlyAreaShapes().length).to.equal(0);
    });

    it('onlyAreaShapes() - one', () => {
        model.addShape('Polygon');
        expect(model.onlyAreaShapes().length).to.equal(1);
    });

    it('onlyLengthShapes() - one', () => {
        model.addShape('Line');
        expect(model.onlyLengthShapes().length).to.equal(1);
    });

    it('onlyAreaShapes() - empty', () => {
        model.addShape('Polygon');
        expect(model.onlyLengthShapes().length).to.equal(0);
    });

    it('draw a line, then deselect it', () => {
        model.addShape('Line');
        const shapeReacted1: boolean = model.anySelectedShapeReactToLeftMouseDown({ x: 100, y: 100 });
        expect(shapeReacted1).to.equal(true);
        const shapeReacted2: boolean = model.anySelectedShapeReactToLeftMouseUp({ x: 200, y: 200 });
        expect(shapeReacted2).to.equal(true);
        expect(model.noShapeIsSelected()).to.equal(false);
        const shapeReacted3: boolean = model.anySelectedShapeReactToLeftMouseDown({ x: 300, y: 300 });
        expect(shapeReacted3).to.equal(true);
        expect(model.noShapeIsSelected()).to.equal(true);
        expect(model.listOfShapes.length).to.equal(1);
    });

});