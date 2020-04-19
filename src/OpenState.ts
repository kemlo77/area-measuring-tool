import { Polygon } from './Polygon.js';
import { Segment } from './Segment.js';
import { PolygonState } from './PolygonState.js';
import { Point } from './Point.js';
import { ClosedState } from './ClosedState.js';
import { Coordinate } from './Coordinate.js';
import { PaintableSegment } from './PaintableSegment.js';

export class OpenState implements PolygonState {

    private polygon: Polygon;

    constructor(polygon: Polygon) {
        this.polygon = polygon;
    }



    handleLeftClick(pointClicked: Point): void {
        if (this.polygon.numberOfVertices >= 2) {
            if (pointClicked.closeEnoughToPoint(this.polygon.firstVertex, Polygon.interactDistance)) {
                if (this.polygon.numberOfSegments >= 2) {
                    if (this.noIntersectingSegmentsWhenClosing()) {
                        this.closePolygon();
                    } else {
                        console.warn('Cannot close because new segment intersects old segment.');
                    }

                } else {
                    console.warn('Cannot close, not enough segments.');
                }
            }
            else {
                if (pointClicked.noneOfThesePointsTooClose(this.polygon.vertices, Polygon.minimumDistanceBetweenPoints)) {
                    if (this.noIntersectingSegmentsWhenAddingSegment(pointClicked)) {
                        this.addVertex(pointClicked);
                    } else {
                        console.warn('New segment intersects with existing segment.');
                    }
                } else {
                    console.warn('New vertex to close to existing vertex.');
                }
            }
        }
        else {
            if (this.polygon.numberOfVertices === 0) {
                this.addVertex(pointClicked);
            }
            else {
                if (pointClicked.notTooCloseToPoint(this.polygon.firstVertex, Polygon.minimumDistanceBetweenPoints)) {
                    this.addVertex(pointClicked);
                } else {
                    console.warn('Too close to first point');
                }

            }
        }
    }

    addVertex(vertex: Point): void {
        this.polygon.vertices.push(vertex);
    }

    noIntersectingSegmentsWhenAddingSegment(pointClicked: Point): boolean {
        if (this.polygon.enforceNonComplexPolygon) {
            const candidateSegment: Segment = new Segment(this.polygon.lastVertex, pointClicked);
            const segmentsToCheck: Segment[] = this.polygon.segments;
            segmentsToCheck.pop(); // not checking with the last segment (they have a common vertex)
            return candidateSegment.doesNotIntersectAnyOfTheseSegments(segmentsToCheck);
        }
        else {
            return true;
        }
    }

    noIntersectingSegmentsWhenClosing(): boolean {
        if (this.polygon.enforceNonComplexPolygon) {
            const newSegment: Segment = new Segment(this.polygon.lastVertex, this.polygon.firstVertex);
            const segmentsToCheck: Segment[] = this.polygon.segments;
            segmentsToCheck.shift(); // not checking with the first and
            segmentsToCheck.pop(); // last segment (they have a common vertex)
            return newSegment.doesNotIntersectAnyOfTheseSegments(segmentsToCheck);
        }
        else {
            return true;
        }
    }

    handleRightClick(pointClicked: Point): void {
        this.polygon.vertices.pop();
    }


    closePolygon(): void {
        this.polygon.setCurrentState(new ClosedState(this.polygon));
    }

    calculateSegments(): Segment[] {
        const calculatedSegments: Segment[] = new Array();
        for (let index = 1; index < this.polygon.vertices.length; index++) {
            const firstPoint: Point = this.polygon.vertices[index - 1];
            const secondPoint: Point = this.polygon.vertices[index];
            const currentSegment: Segment = new Segment(firstPoint, secondPoint);
            calculatedSegments.push(currentSegment);
        }
        return calculatedSegments;
    }

    calculatePaintableStillSegments(): PaintableSegment[] {
        const paintableSegment: PaintableSegment[] = new Array();
        const calculatedSegments: Segment[] = this.calculateSegments();
        for (const segment of calculatedSegments) {
            paintableSegment.push({ p1: segment.p1, p2: segment.p2 });
        }
        return paintableSegment;
    }

    calculatePaintableMovingSegments(mousePosition: Coordinate): PaintableSegment[] {
        const paintableSegment: PaintableSegment[] = new Array();
        if (this.polygon.numberOfVertices > 0) {
            paintableSegment.push({ p1: this.polygon.lastVertex, p2: mousePosition });
        }
        return paintableSegment;
    }

}