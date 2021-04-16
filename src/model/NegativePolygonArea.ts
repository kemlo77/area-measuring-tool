import { AbstractPolygonArea } from './AbstractPolygonArea.js';
import { Coordinate } from './shape/Coordinate.js';

export class NegativePolygonArea extends AbstractPolygonArea {

    private static color: string = '128,0,0';
    private _name: string;

    constructor(vertices?: Array<Coordinate>) {
        super(vertices);
        this._name = 'PolygonArea_' + this.id;
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

    get area(): number {
        return -super.area;
    }

}