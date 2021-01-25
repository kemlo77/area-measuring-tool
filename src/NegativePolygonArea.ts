import { PolygonArea } from './PolygonArea.js';
import { Coordinate } from './shape/Coordinate.js';

export class NegativePolygonArea extends PolygonArea {

    private static color: string = '128,0,0';
    private static initializedObjects: number = 0;
    private _name: string;

    constructor(vertices?: Array<Coordinate>) {
        super(vertices);
        this._name = 'Negative_' + NegativePolygonArea.initializedObjects;
        NegativePolygonArea.initializedObjects++;
    }

    get color(): string {
        return NegativePolygonArea.color;
    }

    static setColor(color: string): void {
        // TODO: kolla att strängen som kommer har rätt format
        NegativePolygonArea.color = color;
    }

    get name(): string {
        return this._name;
    }

    set name(newName: string) {
        this._name = newName;
    }

}