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

    makeDirectionClockWise(): void {
        if (!this.isOpen && this.isCounterclockwise) {
            this.reversePolygonDirection();
        }
    }

    makeDirectionCounterClockwise(): void {
        if (!this.isOpen && !this.isCounterclockwise) {
            this.reversePolygonDirection();
        }
    }

    get isCounterclockwise(): boolean {
        if (!this.isOpen) {
            return (this.gaussShoelace() < 0);
        } else {
            return null;
        }
    }

    get area(): number {
        if (!this.isOpen) {
            return Math.abs(this.gaussShoelace());
        } else {
            return 0;
        }
    }

    private gaussShoelace(): number {
        let theSum: number = 0;
        for (const segment of this.segments) {
            theSum += segment.p1.x * segment.p2.y - segment.p1.y * segment.p2.x;
        }
        const area: number = theSum / 2;
        return area;
    }

    get perimeterLength(): number {
        return this.segments.reduce((sum, it) => sum + it.length, 0);
    }
    

}