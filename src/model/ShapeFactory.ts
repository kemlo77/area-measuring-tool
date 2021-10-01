import { MeassuringShape } from './MeassuringShape';

import { Line } from './shape/segmentShapes/line/Line';
import { Polygon } from './shape/segmentShapes/polygon/Polygon';
import { FilledSegmentsPainter } from '../view/canvasview/segmentPainters/FilledSegmentsPainter';
import { StripedSegmentsPainter } from '../view/canvasview/segmentPainters/StripedSegmentsPainter';
import { AreaValueSign } from './AreaValueSign';
import { SegmentedMeassuringShapeBuilder } from './SegmentedMeassuringShapeBuilder';
import { DashedSegmentsPainter } from '../view/canvasview/segmentPainters/DashedSegmentsPainter';

export class ShapeFactory {

    getShape(name: string): MeassuringShape {

        if (name === 'PositivePolygonArea') {
            return new SegmentedMeassuringShapeBuilder(new Polygon(), true)
                .build();
        } else if (name === 'NegativePolygonArea') {
            return new SegmentedMeassuringShapeBuilder(new Polygon, true)
                .color('128,0,0')
                .areaValueSign(AreaValueSign.NEGATIVE)
                .designatedPainter(new FilledSegmentsPainter())
                .build();
        } else if (name === 'Ruler') {
            return new SegmentedMeassuringShapeBuilder(new Line(), false)
                .color('255,255,0')
                .designatedPainter(new StripedSegmentsPainter())
                .build();
        } else if (name === 'SymmetryLine') {
            return new SegmentedMeassuringShapeBuilder(new Line(), false)
                .designatedPainter(new DashedSegmentsPainter())
                .color('0,80,120')
                .build();
        }

        return null;
    }

}