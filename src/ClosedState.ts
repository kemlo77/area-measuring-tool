import { Polygon } from './Polygon.js';
import { MoveState } from './MoveState.js';
import { PolygonState } from './PolygonState.js';
import { Point } from './Point.js';
import { OpenState } from './OpenState.js';
import { Segment } from './Segment.js';
import { MathUtil } from './MathUtil.js';
import { ProjectionResult } from './ProjectionResult.js';
import { Coordinate } from './Coordinate.js';
import { PaintableSegment } from './PaintableSegment.js';
import { PointToSegmentProjection } from './PointToSegmentProjection.js';
import { UnselectedState } from './UnselectedState.js';

export class ClosedState implements PolygonState {

    private polygon: Polygon;

    constructor(polygon: Polygon) {
        this.polygon = polygon;
    }


    handleLeftClick(polygon: Polygon, pointClicked: Point): void {
        const nearestPoint: Point = pointClicked.nearestPointWithinDistance(polygon.vertices, Polygon.interactDistance);
        if (nearestPoint !== null) {
            // on point (mark for move) -> MoveState
            polygon.movePoint = nearestPoint;
            polygon.setCurrentState(new MoveState(polygon));

        }
        else {
            // on vertex (new point)
            // if the click occured near a segment, insert a new point
            const projection: PointToSegmentProjection = this.checkIfCloseToSegment(polygon.segments, pointClicked, Polygon.interactDistance);
            if (projection.withinMinimumDistance) {
                // calculating distance to both points on clicked segment
                // so that it is not possible to insert a point too close to another
                const segmPointDist1: number = projection.projectionPointOnSegment.distanceToOtherPoint(projection.segmentProjectedOn.p1);
                const segmPointDist2: number = projection.projectionPointOnSegment.distanceToOtherPoint(projection.segmentProjectedOn.p2);
                if (((segmPointDist1 > Polygon.minimumDistanceBetweenPoints) && (segmPointDist2 > Polygon.minimumDistanceBetweenPoints))) {
                    // inserting the point in the segment-array
                    polygon.insertVertex(projection.projectionPointOnSegment, projection.segmentProjectedOn.p1);
                } else {
                    console.warn('New vertex too close to other vertex.');
                }
            } else {
                polygon.setCurrentState(new UnselectedState(polygon, this));
            }
        }
    }

    handleRightClick(polygon: Polygon, pointClicked: Point): void {
        // if the user rightclicked a point, remove it if there are more than 3 sides to the polygon
        const nearestPoint: Point = pointClicked.nearestPointWithinDistance(polygon.vertices, Polygon.interactDistance);

        if (nearestPoint !== null) {
            // if polygon has more than 3 sides it is ok to remove point (+segment)
            if (polygon.numberOfSegments > 3) {
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
            const projection: PointToSegmentProjection = this.checkIfCloseToSegment(polygon.segments, pointClicked, Polygon.interactDistance);
            if (projection.withinMinimumDistance) {
                // Changing start segment so that the one to be removed is the last one
                polygon.makeThisVertexFirst(projection.segmentProjectedOn.p2);
                // opening polygon
                polygon.setCurrentState(new OpenState(polygon));
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
                if (MathUtil.calculateIntersect(thePotentialNewSegment, segment) !== null) {
                    return true;
                }
            }
        }
        return false;
    }


    checkIfCloseToSegment(segmentArrayIn: Segment[], nyPunkt: Point, minDistanceIn: number): PointToSegmentProjection {
        let smallestDistance: number = minDistanceIn;
        let withinMinimumDistance: boolean = false;
        let segmentProjectedOn: Segment = null;
        let closestPoint: Point = new Point();

        for (const segment of segmentArrayIn) {
            // projecting point on segment
            const projectionResult: ProjectionResult = MathUtil.projectVector(segment, nyPunkt);
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


        if (Polygon.useIntegerCoords) {
            projectionPointOnSegment.x = Math.round(projectionPointOnSegment.x);
            projectionPointOnSegment.y = Math.round(projectionPointOnSegment.y);
        } else {
            projectionPointOnSegment.x = Math.round(projectionPointOnSegment.x * 100) / 100;
            projectionPointOnSegment.y = Math.round(projectionPointOnSegment.y * 100) / 100;
        }

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
