import { NegativePolygonArea } from './NegativePolygonArea.js';
import { PositivePolygonArea } from './PositivePolygonArea.js';
import { Ruler } from './Ruler.js';
import { InteractiveShape } from './shape/InteractiveShape.js';
import { Line } from './shape/line/Line.js';
import { Polygon } from './shape/polygon/Polygon.js';


export class ShapeFactory {

    getShape(name: string): InteractiveShape {

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