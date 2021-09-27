import { BubbelGum } from './BubbelGum';
import { Line } from './shape/segmentShapes/line/Line';
import { Polygon } from './shape/segmentShapes/polygon/Polygon';
import { RegularSegmentsPainter } from '../view/canvasview/segmentPainters/RegularSegmentsPainter';
import { StripedSegmentsPainter } from '../view/canvasview/segmentPainters/StripedSegmentsPainter';


export class ShapeFactory {

    getShape(name: string): BubbelGum {

        if (name === 'NegativePolygonArea') {
            return new BubbelGum(new Polygon(), new RegularSegmentsPainter(), '255,0,0', true);
        } else if (name === 'PositivePolygonArea') {
            return new BubbelGum(new Polygon(), new StripedSegmentsPainter(), '0,0,255', true);
        } else if (name === 'Ruler') {
            return new BubbelGum(new Line(), new StripedSegmentsPainter(), '255,255,0', false);
        } else if (name === 'Line') {
            return new BubbelGum(new Line(), new RegularSegmentsPainter(), '0,0,0', false);
        } else if (name === 'Polygon') {
            return new BubbelGum(new Polygon(), new RegularSegmentsPainter(), '0,0,0', true);
        }

        return null;
    }

}