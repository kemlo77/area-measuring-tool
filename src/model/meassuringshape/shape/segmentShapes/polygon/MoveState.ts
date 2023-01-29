import { Polygon } from './Polygon';
import { PolygonState } from './PolygonState';
import { Point } from '../../Point';
import { ClosedState } from './ClosedState';
import { Segment } from '../Segment';
import { Coordinate } from '../../Coordinate';

export class MoveState implements PolygonState {

    private polygon: Polygon;

    constructor(polygon: Polygon) {
        this.polygon = polygon;
    }

    /* istanbul ignore next */
    handleLeftClick(pointClicked: Point): void {
        //
    }

    handleRightClick(pointClicked: Point): void {
        this.abortTheMove();
    }

    /* istanbul ignore next */
    handleLeftMouseDown(pointClicked: Point): void {
        //
    }

    handleLeftMouseUp(mousePosition: Point): void {
        if (this.polygon.mousePositionAtMoveStart.hasSameCoordinateAs(mousePosition)) {
            this.abortTheMove();
        } else {

            const verticesToCheck: Point[] = this.polygon.verticesExceptMovePoint;
            if (mousePosition.noneOfThesePointsTooClose(verticesToCheck, Polygon.minimumDistanceBetweenPoints)) {
                if (this.noIntersectingSegmentsWhenMoving(mousePosition)) {
                    this.moveSelectedVertexTo(mousePosition);
                } else {
                    console.warn('Moving vertex there will cause segments to intersect.');
                }
            } else {
                console.warn('Moved vertex is too close to other vertex.');
            }
        }

    }

    private abortTheMove(): void {
        this.polygon.resetMovePoint();
        this.polygon.setCurrentState(new ClosedState(this.polygon));
    }

    private noIntersectingSegmentsWhenMoving(candidateLocation: Point): boolean {
        return this.movedSegmentsDoNotIntersect(candidateLocation);
    }

    private moveSelectedVertexTo(toPoint: Point): void {
        this.polygon.replacePointSelectedForMoveWithNewPoint(toPoint);
        this.polygon.setCurrentState(new ClosedState(this.polygon));
    }

    private movedSegmentsDoNotIntersect(candidateLocation: Point): boolean {
        const segments: Segment[] = this.calculateSegments();
        if (segments.length <= 3) {
            return true;
        }

        const precedingVertex: Point = this.polygon.getPrecedingVertex(this.polygon.movePoint);
        const followingVertex: Point = this.polygon.getFollowingVertex(this.polygon.movePoint);

        const segmentBeforeMovePoint: Segment = new Segment(precedingVertex, candidateLocation);
        const segmentAfterMovePoint: Segment = new Segment(candidateLocation, followingVertex);

        for (const segment of segments) {

            // no need to check if neighbouring segments intersect with current segment
            if (segment.containsThisVertex(this.polygon.movePoint)) { continue; }

            if (segment.doesNotContainThisVertex(precedingVertex)) {
                if (segment.intersectsThisSegment(segmentBeforeMovePoint)) { return false; }
            }

            if (segment.doesNotContainThisVertex(followingVertex)) {
                if (segment.intersectsThisSegment(segmentAfterMovePoint)) { return false; }
            }
        }

        return true;
    }

    // TODO: borde jag skriva om den här. Nu returnerar den samma segment som i closedState.
    // Borde det vara segmenten så som den ser ut i move?
    calculateSegments(): Segment[] {
        const calculatedSegments: Segment[] = [];
        for (const vertex of this.polygon.vertices) {
            const followingVertex: Point = this.polygon.getFollowingVertex(vertex);
            const currentSegment: Segment = new Segment(vertex, followingVertex);
            calculatedSegments.push(currentSegment);
        }
        return calculatedSegments;
    }

    calculateStillSegments(): Segment[] {
        return this.calculateSegments()
            .filter((segment) => segment.doesNotContainThisVertex(this.polygon.movePoint));
    }


    calculateMovingSegments(mousePosition: Coordinate): Segment[] {
        const mousePositionPoint: Point = new Point(mousePosition);
        const segments: Segment[] = [];

        const pointBefore: Point = this.polygon.getPrecedingVertex(this.polygon.movePoint);
        const pointAfter: Point = this.polygon.getFollowingVertex(this.polygon.movePoint);

        segments.push(new Segment(pointBefore, mousePositionPoint));
        segments.push(new Segment(pointAfter, mousePositionPoint));
        return segments;
    }
}