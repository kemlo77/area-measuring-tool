import { Polygon } from './Polygon.js';
import { MoveState } from './MoveState.js';
import { PolygonState } from './PolygonState.js';
import { Point } from './Point.js';
import { OpenState } from './OpenState.js';
import { Segment } from './Segment.js';
import { moduloInPolygon, calculateIntersect, projectVector } from './math.js';
import { ProjectionResult } from './ProjectionResult.js';
import { Coordinate } from './Coordinate.js';
import { PaintableSegment } from './PaintableSegment.js';
import { PointToSegmentProjection } from './PointToSegmentProjection.js';
import { UnselectedState } from './UnselectedState.js';

export class ClosedState implements PolygonState {

    private static instance: ClosedState;

    private constructor() { }

    public static getInstance(): ClosedState {
        if (!ClosedState.instance) {
            ClosedState.instance = new ClosedState();
        }
        return ClosedState.instance;
    }

    stateName(): string { return 'ClosedState'; } // TODO: ta bort senare

    handleLeftClick(polygon: Polygon, pointClicked: Point): void {
        const nearestPoint: Point = pointClicked.isCloseToPoints(polygon.vertices, polygon.markForMoveDistance);
        if (nearestPoint !== null) {
            // on point (mark for move) -> MoveState
            polygon.movePoint = nearestPoint;
            polygon.setCurrentState(MoveState.getInstance());

        }
        else {
            // on vertex (new point)
            // if the click occured near a segment, insert a new point
            const projection: PointToSegmentProjection = this.checkIfCloseToLine(polygon.segments, pointClicked, polygon.insertNewPointDistance);
            if (projection.withinMinimumDistance) {
                // TODO: flytta den här avrundningen till 'checkIfCloseToLine'. Och/eller till en egen metod?
                // rounding coordinates to get integers
                if (polygon.useIntegerCoordinates) {
                    projection.projectionPointOnSegment.x = Math.round(projection.projectionPointOnSegment.x);
                    projection.projectionPointOnSegment.y = Math.round(projection.projectionPointOnSegment.y);
                } else {
                    projection.projectionPointOnSegment.x = Math.round(projection.projectionPointOnSegment.x * 100) / 100;
                    projection.projectionPointOnSegment.y = Math.round(projection.projectionPointOnSegment.y * 100) / 100;
                }
                // calculating distance to both points on clicked segment
                // so that it is not possible to insert a point too close to another
                const segmPointDist1: number = projection.projectionPointOnSegment.distanceToOtherPoint(projection.segmentProjectedOn.p1);
                const segmPointDist2: number = projection.projectionPointOnSegment.distanceToOtherPoint(projection.segmentProjectedOn.p2);
                if (((segmPointDist1 > polygon.minimumDistanceBetweenPoints) && (segmPointDist2 > polygon.minimumDistanceBetweenPoints))) {
                    // inserting the point in the segment-array
                    polygon.insertVertex(projection.projectionPointOnSegment, projection.segmentProjectedOn.p1);
                } else {
                    console.warn('New vertex too close to other vertex.');
                }
            } else {
                polygon.setCurrentState(UnselectedState.getInstance());
            }
        }
    }

    handleRightClick(polygon: Polygon, pointClicked: Point): void {
        // if the user rightclicked a point, remove it if there are more than 3 sides to the polygon
        const nearestPoint: Point = pointClicked.isCloseToPoints(polygon.vertices, polygon.deleteDistance);

        if (nearestPoint !== null) {
            // if polygon has more than 3 sides it is ok to remove point (+segment)
            if (polygon.vertices.length > 3) {
                // check that the segment created to fill the gap does not intersect with other segments
                if (polygon.enforceNonComplexPolygon) {
                    if (!this.checkIfRemovedPointCausesSegmentIntersect(polygon, nearestPoint)) {
                        // no intersects found
                        polygon.ejectVertex(nearestPoint);
                    }
                    else {
                        console.warn('Removing that point will cause remaining segments to intersect.');
                    }
                }
                else {
                    polygon.ejectVertex(nearestPoint);
                }
            } else {
                console.warn('Cannot remove vertex when polygon is a triangle.');
            }
        }
        // erase segment if user right clicked "on" segment
        else {
            // check if click was near segment
            const projection: PointToSegmentProjection = this.checkIfCloseToLine(polygon.segments, pointClicked, polygon.deleteDistance);
            if (projection.withinMinimumDistance) {
                // Changing start segment so that the one to be removed is the last one
                polygon.makeThisVertexFirst(projection.segmentProjectedOn.p2);
                // opening polygon
                polygon.setCurrentState(OpenState.getInstance());
            }
        }
    }

    private checkIfRemovedPointCausesSegmentIntersect(polygon: Polygon, deleteCandidateVertex: Point): boolean {
        const segmentArrayIn: Segment[] = polygon.segments;
        // A four sided polygon loosing a side becomes a triangle, that can have no sides intersecting.
        if (segmentArrayIn.length > 4) {
            const precedingVertex: Point = polygon.getPrecedingVertex(deleteCandidateVertex);
            const followingVertex: Point = polygon.getFollowingVertex(deleteCandidateVertex);
            const thePotentialNewSegment: Segment = new Segment(precedingVertex, followingVertex);
            for (const segment of polygon.segments) {
                if (segment.containsThisVertex(precedingVertex) || segment.containsThisVertex(followingVertex)) {
                    continue;
                }
                if (calculateIntersect(thePotentialNewSegment, segment) !== null) {
                    return true;
                }
            }
        }
        return false;
    }


    // checking if new point is near other polygon segments
    checkIfCloseToLine(segmentArrayIn: Segment[], nyPunkt: Point, minDistanceIn: number): PointToSegmentProjection {
        let smallestDistance: number = minDistanceIn;
        let withinMinimumDistance: boolean = false;
        let segmentProjectedOn: Segment = null;
        let closestPoint: Point = new Point();
        // checking with every segment
        for (const segment of segmentArrayIn) {
            // projecting point on segment
            const projectionResult: ProjectionResult = projectVector(segment, nyPunkt);
            // if it was between 0 and minDistanceIn
            if (projectionResult.successful && projectionResult.norm < minDistanceIn) {
                withinMinimumDistance = true;
                if (projectionResult.norm < smallestDistance) {
                    // if it is closer than minDistanceIn and closer than last saved, it is saved
                    smallestDistance = projectionResult.norm;
                    closestPoint = projectionResult.point;
                    segmentProjectedOn = segment;
                }
            }
        }
        const projectionPointOnSegment: Point = closestPoint;
        return {
            withinMinimumDistance,
            segmentProjectedOn,
            projectionPointOnSegment
        };
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
        for (const segment of this.calculateSegments(polygon)) {
            paintableSegment.push({ p1: segment.p1, p2: segment.p2 });
        }
        return paintableSegment;
    }

    calculatePaintableMovingSegments(polygon: Polygon, mousePosition: Coordinate): PaintableSegment[] {
        return new Array();
    }

}
