import { Polygon } from './shape/polygon/Polygon';
import { Coordinate } from './shape/Coordinate';

export abstract class AbstractPolygonArea extends Polygon {

    private static initializedObjects: number = 0;
    private _id: number;

    constructor(vertices?: Array<Coordinate>) {
        super(vertices);
        this._id = AbstractPolygonArea.initializedObjects++;
    }

    get id(): number {
        return this._id;
    }

    abstract get color(): string;

    abstract get name(): string;

    abstract set name(newName: string);


}