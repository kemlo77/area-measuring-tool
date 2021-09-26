import { NegativePolygonArea } from './NegativePolygonArea';
import { PositivePolygonArea } from './PositivePolygonArea';
import { Ruler } from './Ruler';
import { InteractiveSegmentShape } from './shape/InteractiveSegmentShape';
import { Line } from './shape/line/Line';
import { Polygon } from './shape/polygon/Polygon';


export class ShapeFactory {

    getShape(name: string): InteractiveSegmentShape {

        if (name === 'NegativePolygonArea') {
            return new NegativePolygonArea();
        } else if (name === 'PositivePolygonArea') {
            return new PositivePolygonArea();
        } else if (name === 'Ruler') {
            return new Ruler();
        } else if (name === 'Line') {
            return new Line();
        } else if (name === 'Polygon') {
            return new Polygon();
        }

        return null;
    }

}