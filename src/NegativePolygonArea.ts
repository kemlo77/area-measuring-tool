import { PolygonArea } from './PolygonArea.js';
import { Coordinate } from './shape/Coordinate.js';

export class NegativePolygonArea extends PolygonArea {

    private static color: string = '128,0,0';

    constructor(vertices?: Array<Coordinate>) {
        super(vertices);
    }

    get color(): string {
        return NegativePolygonArea.color;
    }

    static setColor(color: string): void {
        // TODO: kolla att strängen som kommer har rätt format
        NegativePolygonArea.color = color;
    }

}