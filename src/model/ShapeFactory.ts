import { MeassuringShape } from './MeassuringShape';
import { SegmentedMeassuringShape } from './SegmentedMeassuringShape';
import { Line } from './shape/segmentShapes/line/Line';
import { Polygon } from './shape/segmentShapes/polygon/Polygon';
import { RegularSegmentsPainter } from '../view/canvasview/segmentPainters/RegularSegmentsPainter';
import { StripedSegmentsPainter } from '../view/canvasview/segmentPainters/StripedSegmentsPainter';

export class ShapeFactory {

    getShape(name: string): MeassuringShape {

        if (name === 'NegativePolygonArea') {
            return new SegmentedMeassuringShape(new Polygon(), new RegularSegmentsPainter(), '128,0,0', true);
        } else if (name === 'PositivePolygonArea') {
            return new SegmentedMeassuringShape(new Polygon(), new StripedSegmentsPainter(), '0,80,120', true);
        } else if (name === 'Ruler') {
            return new SegmentedMeassuringShape(new Line(), new StripedSegmentsPainter(), '255,255,0', false);
        } else if (name === 'Line') {
            return new SegmentedMeassuringShape(new Line(), new RegularSegmentsPainter(), '0,0,0', false);
        } else if (name === 'Polygon') {
            return new SegmentedMeassuringShape(new Polygon(), new RegularSegmentsPainter(), '0,0,0', true);
        }

        return null;
    }

}