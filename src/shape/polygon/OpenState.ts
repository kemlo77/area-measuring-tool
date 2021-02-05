import { Polygon } from './Polygon.js';
import { Segment } from '../Segment.js';
import { PolygonState } from './PolygonState.js';
import { Point } from '../Point.js';
import { ClosedState } from './ClosedState.js';
import { Coordinate } from '../Coordinate.js';

export class OpenState implements PolygonState {

    private polygon: Polygon;

    constructor(polygon: Polygon) {
        this.polygon = polygon;
    }



    handleLeftClick(pointClicked: Point): void {
        const minimumDistance: number = Polygon.minimumDistanceBetweenPoints;
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
                if (pointClicked.noneOfThesePointsTooClose(this.polygon.vertices, minimumDistance)) {
                    if (this.noIntersectingSegmentsWhenAddingSegment(pointClicked)) {
                        this.polygon.addVertex(pointClicked);
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
                this.polygon.addVertex(pointClicked);
            }
            else {
                if (pointClicked.notTooCloseToPoint(this.polygon.firstVertex, minimumDistance)) {
                    this.polygon.addVertex(pointClicked);
                } else {
                    console.warn('Too close to first point');
                }

            }
        }
    }

    private noIntersectingSegmentsWhenAddingSegment(pointClicked: Point): boolean {
        const candidateSegment: Segment = new Segment(this.polygon.lastVertex, pointClicked);
        const segmentsToCheck: Segment[] = this.polygon.segments;
        segmentsToCheck.pop(); // not checking with the last segment (they have a common vertex)
        return candidateSegment.doesNotIntersectAnyOfTheseSegments(segmentsToCheck);
    }

    private noIntersectingSegmentsWhenClosing(): boolean {
        const newSegment: Segment = new Segment(this.polygon.lastVertex, this.polygon.firstVertex);
        const segmentsToCheck: Segment[] = this.polygon.segments;
        segmentsToCheck.shift(); // not checking with the first and
        segmentsToCheck.pop(); // last segment (they have a common vertex)
        return newSegment.doesNotIntersectAnyOfTheseSegments(segmentsToCheck);
    }

    handleRightClick(pointClicked: Point): void {
        this.polygon.removeLastVertex();
    }

    handleLeftMouseDown(pointClicked: Point): void {
        //
    }

    handleLeftMouseUp(pointClicked: Point): void {
        //
    }

    closePolygon(): void {
        this.polygon.setCurrentState(new ClosedState(this.polygon));
    }

    calculateSegments(): Segment[] {
        const calculatedSegments: Segment[] = [];
        for (const currentVertex of this.polygon.vertices) {
            const followingVertex: Point = this.polygon.getFollowingVertex(currentVertex);
            const currentSegment: Segment = new Segment(currentVertex, followingVertex);
            calculatedSegments.push(currentSegment);
        }
        calculatedSegments.pop(); // since polygon is open
        return calculatedSegments;
    }

    calculateStillSegments(): Segment[] {
        return this.calculateSegments();
    }

    calculateMovingSegments(mousePosition: Coordinate): Segment[] {
        const mousePositionPoint: Point = new Point(mousePosition);
        const movingSegment: Segment[] = [];
        if (this.polygon.numberOfVertices > 0) {
            movingSegment.push(new Segment(this.polygon.lastVertex, mousePositionPoint));
        }
        return movingSegment;
    }

}