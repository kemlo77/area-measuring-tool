import { Polygon } from './Polygon.js';
import { Segment } from './Segment.js';
import { PolygonState } from './PolygonState.js';
import { Point } from './Point.js';
import { ClosedState } from './ClosedState.js';
import { calculateIntersect } from './math.js';
import { Coordinate } from './Coordinate.js';
import { PaintableSegment } from './PaintableSegment.js';

export class OpenState implements PolygonState {

    private static instance: OpenState;

    private constructor() { }

    public static getInstance(): OpenState {
        if (!OpenState.instance) {
            OpenState.instance = new OpenState();
        }
        return OpenState.instance;
    }

    stateName(): string { return 'OpenState'; } // TODO: ta bort senare

    handleLeftClick(polygon: Polygon, pointClicked: Point): void {
        // check if this is the first segment
        if (polygon.vertices.length > 1) {
            // check if user clicks near the first point (wanting to close the polygon)
            if (pointClicked.distanceToOtherPoint(polygon.firstVertex) < polygon.minimumCloseDistance) {
                // if the plygon already has at least 2 segments
                if (polygon.vertices.length >= 3) {
                    // check that the segment between the last point and first point does not intersect with other segments
                    const nyttSegment: Segment = new Segment(polygon.lastVertex, polygon.firstVertex);
                    if (polygon.enforceNonComplexPolygon) {
                        if (this.checkIfIntersect(polygon.segments, nyttSegment, true)) {
                            console.warn('Cannot close because new segment intersects old segment.');
                        } else {
                            polygon.setCurrentState(ClosedState.getInstance());
                        }
                    }
                    else {
                        polygon.setCurrentState(ClosedState.getInstance());
                    }
                } else {
                    console.warn('Cannot close, not enough segments.');
                }
            }
            else {
                // if the new Segment does not intersect with other segments or the new point to close to other points, the add the point (+segment)
                const candidateSegment: Segment = new Segment(polygon.lastVertex, pointClicked);
                if (pointClicked.isCloseToPoints(polygon.vertices, polygon.minimumDistanceBetweenPoints) < 0) {
                    if (polygon.enforceNonComplexPolygon) {
                        if (!this.checkIfIntersect(polygon.segments, candidateSegment, false)) {
                            polygon.vertices.push(pointClicked);
                        } else {
                            console.warn('New segment intersects with existing segment.');
                        }
                    }
                    else {
                        polygon.vertices.push(pointClicked);
                    }
                } else {
                    console.warn('New vertex to close to existing vertex.');
                }
            }
        }
        else {
            if (polygon.vertices.length === 0) {
                polygon.vertices.push(pointClicked);
            }
            else {
                // if it is not to close to the fist point, add the second point
                if (pointClicked.distanceToOtherPoint(polygon.vertices[0]) > polygon.minimumDistanceBetweenPoints) {
                    polygon.vertices.push(pointClicked);
                } else {
                    console.warn('Too close to first point');
                }

            }
        }
    }

    handleRightClick(polygon: Polygon, pointClicked: Point): void {
        polygon.vertices.pop();
    }


    // checking if new Segment intersects with other segment in array
    // TODO: det är borde vara en instansmetod i Segment. Kanske döp om så att currentSegment.checkIfIntersectsWith(polygon.segments, skipFirstSegment)
    checkIfIntersect(segmentArrayIn: Segment[], nyttSegmentIn: Segment, skipFirstSegment: boolean): boolean {
        let startSegm = 0;
        if (skipFirstSegment) { startSegm = 1; }// skipping first segment in case user clicks the polygons first point
        // skipping the second to last (penultimate segment)
        for (let n = startSegm; n < segmentArrayIn.length - 1; n++) {

            if (calculateIntersect(segmentArrayIn[n], nyttSegmentIn)) {
                // returning true if there is a intersect
                return true;
            }
        }
        // arriving here, there is no intersect
        return false;
    }

    calculateSegments(polygon: Polygon): Segment[] {
        const calculatedSegments: Segment[] = new Array();
        for (let index = 1; index < polygon.vertices.length; index++) {
            const firstPoint: Point = polygon.vertices[index - 1];
            const secondPoint: Point = polygon.vertices[index];
            const currentSegment: Segment = new Segment(firstPoint, secondPoint);
            calculatedSegments.push(currentSegment);
        }
        return calculatedSegments;
    }

    calculatePaintableStillSegments(polygon: Polygon): PaintableSegment[] {
        const paintableSegment: PaintableSegment[] = new Array();
        const calculatedSegments: Segment[] = this.calculateSegments(polygon);
        for (const segment of calculatedSegments) {
            paintableSegment.push({ p1: segment.p1, p2: segment.p2 });
        }
        return paintableSegment;
    }

    calculatePaintableMovingSegments(polygon: Polygon, mousePosition: Coordinate): PaintableSegment[] {
        const paintableSegment: PaintableSegment[] = new Array();
        if(polygon.vertices.length>0){
            paintableSegment.push({ p1: polygon.lastVertex, p2: mousePosition });
        }
        return paintableSegment;
    }

}