import { expect } from 'chai';
import { Model } from '../../src/model/Model';
import { MockShapeFactory } from '../../src/model/MockShapeFactory';
import { SegmentedMeassuringShapeBuilder } from '../../src/model/SegmentedMeassuringShapeBuilder';
import { AreaValueSign } from '../../src/model/AreaValueSign';
import { MockSegmentsPainter } from '../../src/view/canvasview/segmentPainters/MockSegmentsPainter';
import { SegmentedMeassuringShape } from '../../src/model/SegmentedMeassuringShape';
import { Polygon } from '../../src/model/shape/segmentShapes/polygon/Polygon';
import { InteractiveSegmentShape } from '../../src/model/shape/segmentShapes/InteractiveSegmentShape';


describe('SegmentedMeassuringShapeBuilder', () => {

    const polygon: InteractiveSegmentShape = 
    new Polygon([{ x: 100, y: 100 }, { x: 200, y: 100 }, { x: 200, y: 200 }, { x: 100, y: 200 }]);

    it('build positive red polygon-area', () => {
        const shape: SegmentedMeassuringShape =
        new SegmentedMeassuringShapeBuilder(polygon, true)
            .color('reeed')
            .areaValueSign(AreaValueSign.POSITIVE)
            .designatedPainter(new MockSegmentsPainter())
            .build();
        expect(shape.area).to.equal(10000);
        expect(shape.color).to.equal('reeed');
    });

    it('build negative red polygon-area', () => {
        const shape: SegmentedMeassuringShape =
        new SegmentedMeassuringShapeBuilder(polygon, true)
            .color('bluuuue')
            .areaValueSign(AreaValueSign.NEGATIVE)
            .designatedPainter(new MockSegmentsPainter())
            .build();
        expect(shape.area).to.equal(-10000);
        expect(shape.color).to.equal('bluuuue');
    });

});