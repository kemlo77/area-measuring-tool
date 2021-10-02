import { MeassuringShape } from './MeassuringShape';
import { Polygon } from './shape/segmentShapes/polygon/Polygon';
import { MockSegmentsPainter } from '../view/canvasview/segmentPainters/MockSegmentsPainter';
import { SegmentedMeassuringShapeBuilder } from './SegmentedMeassuringShapeBuilder';
import { ShapeFactory } from './ShapeFactory';
import { Line } from './shape/segmentShapes/line/Line';

export class MockShapeFactory implements ShapeFactory {

    getShape(name: string): MeassuringShape {

        if (name === 'Polygon') {
            return new SegmentedMeassuringShapeBuilder(new Polygon(), true)
                .designatedPainter(new MockSegmentsPainter())
                .build();
        } else if (name === 'Line') {
            return new SegmentedMeassuringShapeBuilder(new Line(), false)
                .designatedPainter(new MockSegmentsPainter())
                .build();
        }

        return null;
    }

}