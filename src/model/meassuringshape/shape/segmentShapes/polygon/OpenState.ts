import { Polygon } from './Polygon';
import { Segment } from '../Segment';
import { PolygonState } from './PolygonState';
import { Point } from '../../Point';
import { ClosedState } from './ClosedState';
import { Coordinate } from '../../Coordinate';

export class OpenState implements PolygonState {

    private polygon: Polygon;

    constructor(polygon: Polygon) {
        this.polygon = polygon;
    }



    handleLeftClick(pointClicked: Point): void {
        if (this.polygon.numberOfVertices === 0) {
            this.polygon.addVertex(pointClicked);
            return;
        }

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
            return;
        }

        if (pointClicked.noneOfThesePointsTooClose(this.polygon.vertices, Polygon.minimumDistanceBetweenPoints)) {
            if (this.noIntersectingSegmentsWhenAddingSegment(pointClicked)) {
                this.polygon.addVertex(pointClicked);
            } else {
                console.warn('New segment intersects with existing segment.');
            }
        } else {
            console.warn('Too close to existing vertex');
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