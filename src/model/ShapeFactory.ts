import { BubbelGum } from './BubbelGum';
import { Line } from './shape/segmentShapes/line/Line';
import { Polygon } from './shape/segmentShapes/polygon/Polygon';
import { RegularSegmentsPainter } from '../view/canvasview/segmentPainters/RegularSegmentsPainter';
import { StripedSegmentsPainter } from '../view/canvasview/segmentPainters/StripedSegmentsPainter';


export class ShapeFactory {

    getShape(name: string): BubbelGum {

        if (name === 'NegativePolygonArea') {
            return new BubbelGum(new Polygon(), new RegularSegmentsPainter());
        } else if (name === 'PositivePolygonArea') {
            return new BubbelGum(new Polygon(), new StripedSegmentsPainter());
        } else if (name === 'Ruler') {
            return new BubbelGum(new Line(), new StripedSegmentsPainter());
        } else if (name === 'Line') {
            return new BubbelGum(new Line(), new RegularSegmentsPainter());
        } else if (name === 'Polygon') {
            return new BubbelGum(new Polygon(), new RegularSegmentsPainter());
        }

        return null;
    }

}