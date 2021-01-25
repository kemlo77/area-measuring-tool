import { PolygonArea } from './PolygonArea.js';
import { Coordinate } from './shape/Coordinate.js';

export class PositivePolygonArea extends PolygonArea {

    private static color: string = '0,80,120';
    private static initializedObjects: number = 0;
    private _name: string;

    constructor(vertices?: Array<Coordinate>) {
        super(vertices);
        this._name = 'Positive_' + PositivePolygonArea.initializedObjects;
        PositivePolygonArea.initializedObjects++;
    }

    get color(): string {
        return PositivePolygonArea.color;
    }

    static setColor(color: string): void {
        // TODO: kolla att strängen som kommer har rätt format
        PositivePolygonArea.color = color;
    }

    get name(): string {
        return this._name;
    }

    set name(newName: string) {
        this._name = newName;
    }

}