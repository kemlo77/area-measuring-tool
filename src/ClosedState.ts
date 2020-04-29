import { Polygon } from './Polygon.js';
import { MoveState } from './MoveState.js';
import { PolygonState } from './PolygonState.js';
import { Point } from './Point.js';
import { OpenState } from './OpenState.js';
import { Segment } from './Segment.js';
import { MathUtil } from './MathUtil.js';
import { Coordinate } from './Coordinate.js';
import { PaintableSegment } from './PaintableSegment.js';
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
            const segmentClicked: Segment = this.findClosestSegment(pointClicked, Polygon.interactDistance);
            if (segmentClicked !== null) {
                const projectionVector: Vector = MathUtil.projectPointOntoSegment(segmentClicked, pointClicked);
                const candidatePoint: Point = new Point(pointClicked.x+projectionVector.x,pointClicked.y+projectionVector.y);
                // calculating distance to both points on clicked segment
                // so that it is not possible to insert a point too close to another
                const segmPointDist1: number = candidatePoint.distanceToOtherPoint(segmentClicked.p1);
                const segmPointDist2: number = candidatePoint.distanceToOtherPoint(segmentClicked.p2);
                if (((segmPointDist1 > Polygon.minimumDistanceBetweenPoints) && (segmPointDist2 > Polygon.minimumDistanceBetweenPoints))) {
                    // inserting the point in the segment-array
                    this.polygon.insertVertex(candidatePoint, segmentClicked.p1);
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
            const segmentClicked: Segment = this.findClosestSegment(pointClicked, Polygon.interactDistance);
            if (segmentClicked !== null) {
                this.removeSelectedSegment(segmentClicked);
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

    findClosestSegment(candidatePoint: Point, minDistanceIn: number): Segment {
        let smallestRecordedDistance: number = minDistanceIn;
        let segmentProjectedOn: Segment = null;

        for (const segment of this.polygon.segments) {
            const projectionVector: Vector = MathUtil.projectPointOntoSegment(segment, candidatePoint);

            if (projectionVector !== null && projectionVector.norm < minDistanceIn) {
                if (projectionVector.norm < smallestRecordedDistance) {
                    smallestRecordedDistance = projectionVector.norm;
                    segmentProjectedOn = segment;
                }
            }
        }
        return segmentProjectedOn;
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
