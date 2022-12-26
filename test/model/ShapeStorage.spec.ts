import { expect } from 'chai';
import { Model } from '../../src/model/Model';
import { ShapeStorage } from '../../src/model/ShapeStorage';
import { MockShapeFactory } from '../../src/model/meassuringshape/MockShapeFactory';
import { ShapeFactory } from '../../src/model/meassuringshape/ShapeFactory';
import { MeassuringShape } from '../../src/model/meassuringshape/MeassuringShape';


describe('ShapeStorage', () => {

    let shapeStorage: ShapeStorage;
    const shapeFactory: ShapeFactory = new MockShapeFactory();

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
        shapeStorage = new ShapeStorage();
    });

    it('getSelectedShape - one is selected', () => {
        const meassuringShape: MeassuringShape = shapeFactory.getShape('Line');
        meassuringShape.handleLeftMouseDown({ x: 10, y: 20 });
        meassuringShape.handleLeftMouseUp({ x: 110, y: 220 });
        //shape is selected
        shapeStorage.add(meassuringShape);
        expect(shapeStorage.getSelectedShape()).to.equal(meassuringShape);
    });

    it('getSelectedShape - no one is selected', () => {
        const meassuringShape: MeassuringShape = shapeFactory.getShape('Line');
        meassuringShape.handleLeftMouseDown({ x: 10, y: 20 });
        meassuringShape.handleLeftMouseUp({ x: 110, y: 220 });
        meassuringShape.handleLeftMouseDown({ x: 300, y: 300 }); //deselecting it
        //expect(meassuringShape.isSelected).to.equal(false);
        shapeStorage.add(meassuringShape);
        expect(shapeStorage.getSelectedShape()).to.equal(undefined);
    });

    //TODO: mer tester för bättre coverage



});