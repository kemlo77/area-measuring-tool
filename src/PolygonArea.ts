import { Polygon } from './polygon/Polygon.js';
import {AreaType } from './AreaType.js';

export class PolygonArea extends Polygon {

    private static positiveColor: string = '0,80,120';
    private static negativeColor: string = '128,0,0';
    private type: AreaType;


    constructor(type: AreaType) {
        super();
        this.type = type;
    }

    get color(): string {
        if (this.type === AreaType.POSITIVE) {
            return PolygonArea.positiveColor;
        } else {
            return PolygonArea.negativeColor;
        }
    }

    static setPositiveColor(color: string): void {
        // TODO: kolla att strängen som kommer har rätt format
        PolygonArea.positiveColor = color;
    }

    static setNegativeColor(color: string): void {
        // TODO: kolla att strängen som kommer har rätt format
        PolygonArea.negativeColor = color;
    }

    get areaType(): AreaType {
        return this.type;
    }

    

}