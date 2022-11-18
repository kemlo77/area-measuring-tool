import { MeassuringShape } from './MeassuringShape';
import { Line } from './shape/segmentShapes/line/Line';
import { Polygon } from './shape/segmentShapes/polygon/Polygon';
import { FilledSegmentsPainter } from '../view/canvasview/segmentPainters/FilledSegmentsPainter';
import { StripedSegmentsPainter } from '../view/canvasview/segmentPainters/StripedSegmentsPainter';
import { AreaValueSign } from './AreaValueSign';
import { SegmentedMeassuringShapeBuilder } from './SegmentedMeassuringShapeBuilder';
import { DashedSegmentsPainter } from '../view/canvasview/segmentPainters/DashedSegmentsPainter';
import { ShapeFactory } from './ShapeFactory';
import { RegularSegmentsPainter } from '../view/canvasview/segmentPainters/RegularSegmentsPainter';
import { Color } from './Color';

export class ConcreteShapeFactory implements ShapeFactory {

    getShape(name: string): MeassuringShape {

        if (name === 'PositivePolygonArea') {
            return new SegmentedMeassuringShapeBuilder(new Polygon(), true)
                .designatedPainter(new RegularSegmentsPainter())
                .build();
        }

        if (name === 'NegativePolygonArea') {
            return new SegmentedMeassuringShapeBuilder(new Polygon, true)
                .color(new Color(128, 0, 0))
                .areaValueSign(AreaValueSign.NEGATIVE)
                .designatedPainter(new FilledSegmentsPainter())
                .build();
        }

        if (name === 'Ruler') {
            return new SegmentedMeassuringShapeBuilder(new Line(), false)
                .color(new Color(255, 255, 0))
                .designatedPainter(new StripedSegmentsPainter())
                .build();
        }

        if (name === 'SymmetryLine') {
            return new SegmentedMeassuringShapeBuilder(new Line(), false)
                .designatedPainter(new DashedSegmentsPainter())
                .color(new Color(0, 80, 120))
                .build();
        }

        return null;
    }

}