import { Polygon } from './polygon/Polygon.js';

export class PolygonArea extends Polygon {

    private _color: string;

    constructor(color?: string) {
        super();
        if(color === undefined || color === null) {
            this._color = '0,80,120';
        } else {
            // TODO: check that color-string is correct, use regex
            this._color = color;
        }
    }

    get color(): string {
        return this._color;
    }

    set color(color: string) {

        this._color = color;
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