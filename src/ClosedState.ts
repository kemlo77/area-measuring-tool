import { Polygon } from './Polygon.js';
import { MoveState } from './MoveState.js';
import { PolygonState } from './PolygonState.js';
import { Point } from './Point.js';
import { OpenState } from './OpenState.js';
import { Segment } from './Segment.js';
import { MathUtil } from './MathUtil.js';
import { Coordinate } from './Coordinate.js';
import { PaintableSegment } from './PaintableSegment.js';
import { PointToSegmentProjection } from './PointToSegmentProjection.js';
import { UnselectedState } from './UnselectedState.js';
import { Vector } from './Vector.js';

export class ClosedState implements PolygonState {

    private polygon: Polygon;

    constructor(polygon: Polygon) {
        this.polygon = polygon;
    }


    handleLeftClick(pointClicked: Point): void {
        const vertexSelectedForMove: Point = pointClicked.nearestPointWithinDistance(this.polygon.vertices, Polygon.interactDistance);
        if (vertexSelectedForMove !== null) {
            this.beginMovingThisVertex(vertexSelectedForMove);
        }
        else {
            // if the click occured near a segment, insert a new point
            const projection: PointToSegmentProjection = this.checkIfCloseToSegment(pointClicked, Polygon.interactDistance);
            if (projection.withinMinimumDistance) {
                // calculating distance to both points on clicked segment
                // so that it is not possible to insert a point too close to another
                const segmPointDist1: number = projection.projectionPointOnSegment.distanceToOtherPoint(projection.segmentProjectedOn.p1);
                const segmPointDist2: number = projection.projectionPointOnSegment.distanceToOtherPoint(projection.segmentProjectedOn.p2);
                if (((segmPointDist1 > Polygon.minimumDistanceBetweenPoints) && (segmPointDist2 > Polygon.minimumDistanceBetweenPoints))) {
                    // inserting the point in the segment-array
                    this.polygon.insertVertex(projection.projectionPointOnSegment, projection.segmentProjectedOn.p1);
                } else {
                    console.warn('New vertex too close to other vertex.');
                }
            } else {
                this.polygon.setCurrentState(new UnselectedState(this.polygon, this));
            }
        }
    }

    beginMovingThisVertex(vertex: Point): void {
        this.polygon.movePoint = vertex;
        this.polygon.setCurrentState(new MoveState(this.polygon));
    }

    handleRightClick(pointClicked: Point): void {
        const removeCandidateVertex: Point = pointClicked.nearestPointWithinDistance(this.polygon.vertices, Polygon.interactDistance);

        if (removeCandidateVertex !== null) {
            if (this.polygon.numberOfSegments > 3) {
                if (this.noIntersectingSegmentsWhenRemovingVertex(removeCandidateVertex)) {
                    this.removeSelectedVertex(removeCandidateVertex);
                } else {
                    console.warn('Removing that point will cause remaining segments to intersect.');
                }
            } else {
                console.warn('Cannot remove vertex when polygon is a triangle.');
            }
        }
        else {
            const projection: PointToSegmentProjection = this.checkIfCloseToSegment(pointClicked, Polygon.interactDistance);
            if (projection.withinMinimumDistance) {
                this.removeSelectedSegment(projection.segmentProjectedOn);
            }
        }
    }

    removeSelectedSegment(segment: Segment): void {
        this.polygon.makeThisVertexFirst(segment.p2);
        this.polygon.setCurrentState(new OpenState(this.polygon));
    }

    removeSelectedVertex(vertex: Point): void {
        this.polygon.ejectVertex(vertex);
    }

    noIntersectingSegmentsWhenRemovingVertex(removeCandidateVertex: Point): boolean {
        if (this.polygon.enforceNonComplexPolygon) {
            return !this.checkIfRemovedPointCausesSegmentIntersect(removeCandidateVertex);
        }
        else {
            return true;
        }
    }

    private checkIfRemovedPointCausesSegmentIntersect(deleteCandidateVertex: Point): boolean {
        const segmentArrayIn: Segment[] = this.polygon.segments;
        // A four sided polygon loosing a side becomes a triangle, that can have no sides intersecting.
        if (segmentArrayIn.length > 4) {
            const precedingVertex: Point = this.polygon.getPrecedingVertex(deleteCandidateVertex);
            const followingVertex: Point = this.polygon.getFollowingVertex(deleteCandidateVertex);
            const thePotentialNewSegment: Segment = new Segment(precedingVertex, followingVertex);
            for (const segment of this.polygon.segments) {
                if (segment.containsThisVertex(precedingVertex) || segment.containsThisVertex(followingVertex)) {
                    continue;
                }
                if (thePotentialNewSegment.intersectsThisSegment(segment)) {
                    return true;
                }
            }
        }
        return false;
    }

    // returns the segment that was closest to the clicked point if it is within the minumum distance
    checkIfCloseToSegment(nyPunkt: Point, minDistanceIn: number): PointToSegmentProjection {
        const segments: Segment[] = this.polygon.segments;
        let smallestDistance: number = minDistanceIn;
        let withinMinimumDistance: boolean = false;
        let segmentProjectedOn: Segment = null;
        let closestPoint: Point = new Point(); // TODO: skulle det gå skriva om utan att skapa en sån här point

        for (const segment of segments) {
            // projecting point on segment
            const projectionVector: Vector = MathUtil.projectPointOntoSegment(segment, nyPunkt);
            // if it was between 0 and minDistanceIn
            if (projectionVector !== null && projectionVector.norm < minDistanceIn) {
                withinMinimumDistance = true;
                if (projectionVector.norm < smallestDistance) {
                    // if it is closer than minDistanceIn and closer than last saved, it is saved
                    smallestDistance = projectionVector.norm;
                    closestPoint = new Point(nyPunkt.x + projectionVector.x, nyPunkt.y + projectionVector.y);
                    segmentProjectedOn = segment;
                }
            }
        }
        const projectionPointOnSegment: Point = closestPoint;

        this.trimUnnecessaryCoordinatePrecision(projectionPointOnSegment);

        return {
            withinMinimumDistance,
            segmentProjectedOn,
            projectionPointOnSegment
        };
    }

    trimUnnecessaryCoordinatePrecision(point: Point): void {
        if (Polygon.useIntegerCoords) {
            point.x = Math.round(point.x);
            point.y = Math.round(point.y);
        } else {
            point.x = Math.round(point.x * 100) / 100;
            point.y = Math.round(point.y * 100) / 100;
        }
    }


    calculateSegments(): Segment[] {
        const calculatedSegments: Segment[] = new Array();
        for (const vertex of this.polygon.vertices) {
            const followingVertex: Point = this.polygon.getFollowingVertex(vertex);
            const currentSegment: Segment = new Segment(vertex, followingVertex);
            calculatedSegments.push(currentSegment);
        }
        return calculatedSegments;
    }

    calculatePaintableStillSegments(): PaintableSegment[] {
        const paintableSegment: PaintableSegment[] = new Array();
        for (const segment of this.calculateSegments()) {
            paintableSegment.push({ p1: segment.p1, p2: segment.p2 });
        }
        return paintableSegment;
    }

    calculatePaintableMovingSegments(mousePosition: Coordinate): PaintableSegment[] {
        return new Array();
    }

}
