import { Polygon } from './Polygon.js';
import { Segment } from './Segment.js';
import { PolygonState } from './PolygonState.js';
import { Point } from './Point.js';
import { ClosedState } from './ClosedState.js';
import { MathUtil } from './MathUtil.js';
import { Coordinate } from './Coordinate.js';
import { PaintableSegment } from './PaintableSegment.js';

export class OpenState implements PolygonState {

    private polygon: Polygon;

    constructor(polygon: Polygon) {
        this.polygon = polygon;
    }



    handleLeftClick(polygon: Polygon, pointClicked: Point): void {
        if (polygon.numberOfVertices >= 2) {
            if (pointClicked.closeEnoughToPoint(polygon.firstVertex, Polygon.interactDistance)) {
                if (polygon.numberOfSegments >= 2) {
                    if (this.noIntersectingSegmentsWhenClosing(polygon)) {
                        this.closePolygon(polygon);
                    } else {
                        console.warn('Cannot close because new segment intersects old segment.');
                    }

                } else {
                    console.warn('Cannot close, not enough segments.');
                }
            }
            else {
                if (pointClicked.noneOfThesePointsTooClose(polygon.vertices, Polygon.minimumDistanceBetweenPoints)) {
                    if (this.noIntersectingSegmentsWhenAddingSegment(polygon, pointClicked)) {
                        this.addVertex(polygon, pointClicked);
                    } else {
                        console.warn('New segment intersects with existing segment.');
                    }
                } else {
                    console.warn('New vertex to close to existing vertex.');
                }
            }
        }
        else {
            if (polygon.numberOfVertices === 0) {
                this.addVertex(polygon, pointClicked);
            }
            else {
                if (pointClicked.notTooCloseToPoint(polygon.firstVertex, Polygon.minimumDistanceBetweenPoints)) {
                    this.addVertex(polygon, pointClicked);
                } else {
                    console.warn('Too close to first point');
                }

            }
        }
    }

    addVertex(polygon: Polygon, vertex: Point): void {
        polygon.vertices.push(vertex);
    }

    noIntersectingSegmentsWhenAddingSegment(polygon: Polygon, pointClicked: Point): boolean {
        if (polygon.enforceNonComplexPolygon) {
            const candidateSegment: Segment = new Segment(polygon.lastVertex, pointClicked);
            const segmentsToCheck: Segment[] = polygon.segments;
            segmentsToCheck.pop(); // not checking with the last segment (they have a common vertex)
            return candidateSegment.doesNotIntersectAnyOfTheseSegments(segmentsToCheck);
        }
        else {
            return true;
        }
    }

    noIntersectingSegmentsWhenClosing(polygon: Polygon): boolean {
        if (polygon.enforceNonComplexPolygon) {
            const nyttSegment: Segment = new Segment(polygon.lastVertex, polygon.firstVertex);
            const segmentsToCheck: Segment[] = polygon.segments;
            segmentsToCheck.shift(); // not checking with the first and
            segmentsToCheck.pop(); // last segment (they have a common vertex)
            return nyttSegment.doesNotIntersectAnyOfTheseSegments(segmentsToCheck);
        }
        else {
            return true;
        }
    }

    handleRightClick(polygon: Polygon, pointClicked: Point): void {
        polygon.vertices.pop();
    }


    closePolygon(polygon: Polygon): void {
        polygon.setCurrentState(new ClosedState(polygon));
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
        if (polygon.numberOfVertices > 0) {
            paintableSegment.push({ p1: polygon.lastVertex, p2: mousePosition });
        }
        return paintableSegment;
    }

}