import { PolygonArea } from './PolygonArea.js';
import { Coordinate } from './shape/Coordinate.js';

export class PositivePolygonArea extends PolygonArea {

    private static color: string = '0,80,120';

    constructor(vertices?: Array<Coordinate>) {
        super(vertices);
    }

    get color(): string {
        return PositivePolygonArea.color;
    }

    static setColor(color: string): void {
        // TODO: kolla att strängen som kommer har rätt format
        PositivePolygonArea.color = color;
    }

}