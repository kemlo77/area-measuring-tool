import { Polygon } from './Polygon';


export module Polygons {


    export function isClockwise(polygon: Polygon): boolean {
        if (!polygon.isOpen) {
            return (gaussShoelace(polygon)  > 0);
        } else {
            return null;
        }
    }

    export function area(polygon: Polygon): number {
        if (!polygon.isOpen) {
            return Math.abs(gaussShoelace(polygon));
        } else {
            return 0;
        }
    }

    function gaussShoelace(polygon: Polygon): number {
        let theSum: number = 0;
        for (const segment of polygon.segments) {
            theSum += segment.p1.x * segment.p2.y - segment.p1.y * segment.p2.x;
        }
        const area: number = theSum / 2;
        return area;
    }

    export function perimeterLength(polygon: Polygon): number {
        return polygon.segments.reduce((sum, it) => sum + it.length, 0);
    }



}