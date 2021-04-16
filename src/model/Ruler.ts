import { Coordinate } from './shape/Coordinate.js';
import { Line } from './shape/line/Line.js';


export class Ruler extends Line {

    private static _color: string = '255,255,0';
    private static initializedObjects: number = 0;
    private _name: string;

    constructor(coordinate1?: Coordinate, coordinate2?: Coordinate) {
        super(coordinate1, coordinate2);
        this._name = 'Ruler_' + Ruler.initializedObjects;
        Ruler.initializedObjects++;
    }

    get color(): string {
        return Ruler._color;
    }

    static setColor(newColor: string): void {
        Ruler._color = newColor;
    }

    get name(): string {
        return this._name;
    }

    set name(newName: string) {
        this._name = newName;
    }

}