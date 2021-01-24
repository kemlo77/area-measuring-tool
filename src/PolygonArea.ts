import { Polygon } from './shape/polygon/Polygon.js';
import { Coordinate } from './shape/Coordinate.js';

export abstract class PolygonArea extends Polygon {

    constructor(vertices?: Array<Coordinate>) {
        super(vertices);
    }

    abstract get color(): string;


}