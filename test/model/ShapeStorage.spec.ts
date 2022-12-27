import { expect } from 'chai';
import { ShapeStorage } from '../../src/model/ShapeStorage';
import { MockShapeFactory } from '../../src/model/meassuringshape/MockShapeFactory';
import { ShapeFactory } from '../../src/model/meassuringshape/ShapeFactory';
import { MeassuringShape } from '../../src/model/meassuringshape/MeassuringShape';


describe('ShapeStorage', () => {

    let shapeStorage: ShapeStorage;
    const shapeFactory: ShapeFactory = new MockShapeFactory();

    function getUnselectedAreaShape(): MeassuringShape {
        const meassuringShape: MeassuringShape = shapeFactory.getShape('Polygon');
        meassuringShape.handleLeftClick({ x: 100, y: 100 });
        meassuringShape.handleLeftClick({ x: 200, y: 200 });
        meassuringShape.handleLeftClick({ x: 100, y: 200 });
        meassuringShape.handleLeftClick({ x: 100, y: 100 }); //closing triangle
        meassuringShape.handleLeftClick({ x: 400, y: 400 }); //deselecting
        return meassuringShape;
    }

    function getSelectedLengthShape(): MeassuringShape {
        const meassuringShape: MeassuringShape = shapeFactory.getShape('Line');
        meassuringShape.handleLeftMouseDown({ x: 10, y: 20 });
        meassuringShape.handleLeftMouseUp({ x: 110, y: 220 });
        return meassuringShape;
    }

    beforeEach(() => {
        shapeStorage = new ShapeStorage();
    });

    it('getShapeById', () => {
        const unselectedShape: MeassuringShape = getUnselectedAreaShape();
        shapeStorage.add(unselectedShape);
        expect(shapeStorage.getShapeById(unselectedShape.id)).to.equal(unselectedShape);
    });

    it('removeSelectedShape', () => {
        const selectedShape: MeassuringShape = getSelectedLengthShape();
        shapeStorage.add(selectedShape);
        const unselectedShape: MeassuringShape = getUnselectedAreaShape();
        shapeStorage.add(unselectedShape);
        shapeStorage.removeSelectedShape();
        expect(shapeStorage.getSelectedShape()).to.be.undefined;
        expect(shapeStorage.getAllShapes().length).to.equal(1);
    });

    it('removeShapeById', () => {
        const selectedShape: MeassuringShape = getSelectedLengthShape();
        shapeStorage.add(selectedShape);
        const unselectedShape: MeassuringShape = getUnselectedAreaShape();
        shapeStorage.add(unselectedShape);
        shapeStorage.removeShapeById(selectedShape.id);
        expect(shapeStorage.getSelectedShape()).to.be.undefined;
        expect(shapeStorage.getAllShapes().length).to.equal(1);
    });

    it('removeShapeById throws error for unexisting id', () => {
        const selectedShape: MeassuringShape = getSelectedLengthShape();
        shapeStorage.add(selectedShape);
        expect(() => shapeStorage.removeShapeById(1234)).to.throw(/The id does not exist in storage/);
    });

    it('getSelectedShape - one is selected', () => {
        const selectedShape: MeassuringShape = getSelectedLengthShape();
        shapeStorage.add(selectedShape);
        const unselectedShape: MeassuringShape = getUnselectedAreaShape();
        shapeStorage.add(unselectedShape);
        expect(shapeStorage.getSelectedShape()).to.equal(selectedShape);
    });

    it('getSelectedShape - no one is selected', () => {
        const meassuringShape: MeassuringShape = getSelectedLengthShape();
        meassuringShape.handleLeftMouseDown({ x: 300, y: 300 }); //deselecting it
        shapeStorage.add(meassuringShape);
        expect(shapeStorage.getSelectedShape()).to.be.undefined;
    });

    it('getAllShapes', () => {
        const selectedShape: MeassuringShape = getSelectedLengthShape();
        shapeStorage.add(selectedShape);
        const unselectedShape: MeassuringShape = getUnselectedAreaShape();
        shapeStorage.add(unselectedShape);
        expect(shapeStorage.getAllShapes().length).to.equal(2);
    });

    it('getAreaShapes', () => {
        const selectedShape: MeassuringShape = getSelectedLengthShape();
        shapeStorage.add(selectedShape);
        const unselectedShape1: MeassuringShape = getUnselectedAreaShape();
        shapeStorage.add(unselectedShape1);
        const unselectedShape2: MeassuringShape = getUnselectedAreaShape();
        shapeStorage.add(unselectedShape2);
        expect(shapeStorage.getAreaShapes().length).to.equal(2);
    });

    it('getLengthShapes', () => {
        const selectedShape1: MeassuringShape = getSelectedLengthShape();
        shapeStorage.add(selectedShape1);
        const selectedShape2: MeassuringShape = getSelectedLengthShape();
        shapeStorage.add(selectedShape2);
        const unselectedShape: MeassuringShape = getUnselectedAreaShape();
        shapeStorage.add(unselectedShape);
        expect(shapeStorage.getLengthShapes().length).to.equal(2);
    });

});