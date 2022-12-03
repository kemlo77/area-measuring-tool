import { MeassuringShape } from './MeassuringShape';
import { Line } from './shape/segmentShapes/line/Line';
import { Polygon } from './shape/segmentShapes/polygon/Polygon';
import { FilledSegmentsPainter } from '../../view/canvasview/segmentPainters/FilledSegmentsPainter';
import { StripedSegmentsPainter } from '../../view/canvasview/segmentPainters/StripedSegmentsPainter';
import { AreaValueSign } from '../meassuringshape/AreaValueSign';
import { SegmentedMeassuringShapeBuilder } from './SegmentedMeassuringShapeBuilder';
import { DashedSegmentsPainter } from '../../view/canvasview/segmentPainters/DashedSegmentsPainter';
import { ShapeFactory } from './ShapeFactory';
import { RegularSegmentsPainter } from '../../view/canvasview/segmentPainters/RegularSegmentsPainter';
import { Color } from './Color';
import { Name } from './Name';


export class ConcreteShapeFactory implements ShapeFactory {

    getShape(name: string): MeassuringShape {

        if (name === 'PositivePolygonArea') {
            return new SegmentedMeassuringShapeBuilder(new Polygon(), true)
                .name(new Name('positive polygon area'))
                .designatedPainter(new RegularSegmentsPainter())
                .build();
        }

        if (name === 'NegativePolygonArea') {
            return new SegmentedMeassuringShapeBuilder(new Polygon, true)
                .name(new Name('negative polygon area'))
                .color(new Color(128, 0, 0))
                .areaValueSign(AreaValueSign.NEGATIVE)
                .designatedPainter(new FilledSegmentsPainter())
                .build();
        }

        if (name === 'Ruler') {
            return new SegmentedMeassuringShapeBuilder(new Line(), false)
                .name(new Name('ruler'))
                .color(new Color(255, 255, 0))
                .designatedPainter(new StripedSegmentsPainter())
                .build();
        }

        if (name === 'SymmetryLine') {
            return new SegmentedMeassuringShapeBuilder(new Line(), false)
                .name(new Name('symmetry line'))
                .designatedPainter(new DashedSegmentsPainter())
                .color(new Color(0, 80, 120))
                .build();
        }

        return null;
    }

}