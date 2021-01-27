import { Polygon } from './shape/polygon/Polygon.js';
import { Coordinate } from './shape/Coordinate.js';

export abstract class AbstractPolygonArea extends Polygon {

    private static initializedObjects: number = 0;

    constructor(vertices?: Array<Coordinate>) {
        super(vertices);
    }

    generateSerialName(): string {
        return 'PolygonArea_' + AbstractPolygonArea.initializedObjects++;
    }

    abstract get color(): string;

    abstract get name(): string;


}