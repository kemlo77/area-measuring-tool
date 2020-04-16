import { Polygon } from './Polygon.js';
import { PolygonState } from './PolygonState.js';
import { Point } from './Point.js';
import { ClosedState } from './ClosedState.js';
import { Segment } from './Segment.js';
import { moduloInPolygon, calculateIntersect, arrayRotate } from './math.js';
import { Coordinate } from './Coordinate.js';
import { PaintableSegment } from './PaintableSegment.js';

export class MoveState implements PolygonState {

    private static instance: MoveState;

    private constructor() { }

    public static getInstance(): MoveState {
        if (!MoveState.instance) {
            MoveState.instance = new MoveState();
        }
        return MoveState.instance;
    }

    stateName(): string { return 'MoveState'; } // TODO: ta bort senare

    handleLeftClick(polygon: Polygon, pointClicked: Point): void {
        // empty space (moves to new point) -> ClosedState
        // if the clicked point is not too close to another point (not checking it self, there of the 4th argument in function call)
        if (pointClicked.isCloseToPoints(polygon.vertices, polygon.minimumDistanceBetweenPoints, polygon.movePoint) == null) {
            // if the points nearest segments do not intersect with other segments
            if (polygon.enforceNonComplexPolygon) {
                if (!this.checkIfMovedIntersects(polygon, pointClicked, polygon.movePoint)) {
                    polygon.movePoint.copyValues(pointClicked); // copying values so that it is still the same object
                    polygon.setCurrentState(ClosedState.getInstance());
                } else {
                    console.warn('Moving vertex there will cause segments to intersect.');
                }
            }
            else {
                polygon.movePoint.copyValues(pointClicked); // copying values so that it is still the same object
                polygon.setCurrentState(ClosedState.getInstance());
            }
        } else {
            console.warn('Moved vertex is too close to other vertex.');
        }
    }

    handleRightClick(polygon: Polygon, pointClicked: Point): void {
        // aborting move mode
        polygon.movePoint = null;
        polygon.setCurrentState(ClosedState.getInstance());

    }

    // checking if the two segments containing a point (being moved) intersects with the other segments in a polygon (after move)
    checkIfMovedIntersects(polygon: Polygon, moveToCandidateLocation: Point, movingVertex: Point): boolean {
        const segments: Segment[] = this.calculateSegments(polygon);
        // if polygon has more than 3 segments, otherwise return false
        if (segments.length > 3) {

            const precedingVertex: Point = polygon.getPrecedingVertex(movingVertex);
            const followingVertex: Point = polygon.getFollowingVertex(movingVertex);

            // creating two candidate segments containing the moveToCandidateLocation
            const firstCheckedSegment: Segment = new Segment(precedingVertex, moveToCandidateLocation);
            const secondCheckedSegment: Segment = new Segment(moveToCandidateLocation, followingVertex);

            // general idea: no need to check if neighbouring segments intersect with current segment (being checked)
            for (const segment of segments) {

                if (segment.containsThisVertex(movingVertex)) { continue; }

                if (!segment.containsThisVertex(precedingVertex)) {
                    if (calculateIntersect(firstCheckedSegment, segment)) { return true; }
                }

                if (!segment.containsThisVertex(followingVertex)) {
                    if (calculateIntersect(secondCheckedSegment, segment)) { return true; }
                }
            }
            // if arriving here, there are no intersects
            return false;
        }
        else {
            // if the polygon had only 3 sides, it is automatically ok
            return false;
        }
    }

    calculateSegments(polygon: Polygon): Segment[] {
        const calculatedSegments: Segment[] = new Array();
        for (const vertex of polygon.vertices) {
            const precedingVertex: Point = polygon.getPrecedingVertex(vertex);
            const currentSegment: Segment = new Segment(precedingVertex, vertex);
            calculatedSegments.push(currentSegment);
        }
        return calculatedSegments;
    }

    calculatePaintableStillSegments(polygon: Polygon): PaintableSegment[] {
        const paintableSegment: PaintableSegment[] = new Array();
        // TODO: skriv om raderna nedan
        const movingPointIndex: number = polygon.vertices.indexOf(polygon.movePoint);
        const calculatedSegments: Segment[] = arrayRotate(this.calculateSegments(polygon), movingPointIndex + 2);
        calculatedSegments.pop();
        calculatedSegments.pop();
        for (const segment of calculatedSegments) {
            paintableSegment.push({ p1: segment.p1, p2: segment.p2 });
        }
        return paintableSegment;
    }


    calculatePaintableMovingSegments(polygon: Polygon, mousePosition: Coordinate): PaintableSegment[] {
        const paintableSegment: PaintableSegment[] = new Array();

        const pointBefore: Point = polygon.getPrecedingVertex(polygon.movePoint);
        const pointAfter: Point = polygon.getFollowingVertex(polygon.movePoint);
        paintableSegment.push({ p1: pointBefore, p2: mousePosition });
        paintableSegment.push({ p1: pointAfter, p2: mousePosition });
        return paintableSegment;
    }
}