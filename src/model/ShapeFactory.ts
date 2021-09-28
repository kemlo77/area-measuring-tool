import { MeassuringShape } from './MeassuringShape';
import { SegmentedMeassuringShape } from './SegmentedMeassuringShape';
import { Line } from './shape/segmentShapes/line/Line';
import { Polygon } from './shape/segmentShapes/polygon/Polygon';
import { RegularSegmentsPainter } from '../view/canvasview/segmentPainters/RegularSegmentsPainter';
import { StripedSegmentsPainter } from '../view/canvasview/segmentPainters/StripedSegmentsPainter';
import { AreaValueSign } from './AreaValueSign';
import { SegmentedMeassuringShapeBuilder } from './SegmentedMeassuringShapeBuilder';

export class ShapeFactory {

    getShape(name: string): MeassuringShape {

        if (name === 'PositivePolygonArea') {
            return new SegmentedMeassuringShapeBuilder(new Polygon(), true).color('0,80,120').build();
        } else if (name === 'NegativePolygonArea') {
            return new SegmentedMeassuringShapeBuilder(new Polygon, true).color('128,0,0')
                .areaValueSign(AreaValueSign.NEGATIVE).build();
        } else if (name === 'Ruler') {
            return new SegmentedMeassuringShapeBuilder(new Line(), false).color('255,255,0')
                .designatedPainter(new StripedSegmentsPainter()).build();
        } else if (name === 'Line') {
            return new SegmentedMeassuringShapeBuilder(new Line(), false).build();
        } else if (name === 'Polygon') {
            return new SegmentedMeassuringShapeBuilder(new Polygon, true).build();
        }

        return null;
    }

}