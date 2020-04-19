import { Polygon } from './Polygon.js';
import { PolygonState } from './PolygonState.js';
import { Point } from './Point.js';
import { ClosedState } from './ClosedState.js';
import { Segment } from './Segment.js';
import { MathUtil } from './MathUtil.js';
import { Coordinate } from './Coordinate.js';
import { PaintableSegment } from './PaintableSegment.js';

export class MoveState implements PolygonState {

    private polygon: Polygon;

    constructor(polygon: Polygon) {
        this.polygon = polygon;
    }



    handleLeftClick(pointClicked: Point): void {
        if (pointClicked.noneOfThesePointsTooClose(this.polygon.verticesExceptMovePoint, Polygon.minimumDistanceBetweenPoints)) {
            if (this.noIntersectingSegmentsWhenMoving(pointClicked)) {
                this.moveSelectedVertexTo(pointClicked);
            } else {
                console.warn('Moving vertex there will cause segments to intersect.');
            }
        } else {
            console.warn('Moved vertex is too close to other vertex.');
        }
    }

    handleRightClick(pointClicked: Point): void {
        // aborting move mode
        this.polygon.movePoint = null;
        this.polygon.setCurrentState(new ClosedState(this.polygon));
    }

    noIntersectingSegmentsWhenMoving(movePointCandidate: Point): boolean {
        if (this.polygon.enforceNonComplexPolygon) {
            if (!this.checkIfMovedIntersects(movePointCandidate, this.polygon.movePoint)) {
                return true;
            } else {
                return false;
            }
        }
        else {
            return true;
        }
    }

    moveSelectedVertexTo(toPoint: Point): void {
        this.polygon.movePoint.copyValues(toPoint); // copying values to point referenced by movePoint
        this.polygon.movePoint = null; // removing the reference
        this.polygon.setCurrentState(new ClosedState(this.polygon));
    }



    // checking if the two segments containing a point (being moved) intersects with the other segments in a polygon (after move)
    checkIfMovedIntersects(moveToCandidateLocation: Point, movingVertex: Point): boolean {
        const segments: Segment[] = this.calculateSegments();
        // if polygon has more than 3 segments, otherwise return false
        if (segments.length > 3) {

            const precedingVertex: Point = this.polygon.getPrecedingVertex(movingVertex);
            const followingVertex: Point = this.polygon.getFollowingVertex(movingVertex);

            // creating two candidate segments containing the moveToCandidateLocation
            const firstCheckedSegment: Segment = new Segment(precedingVertex, moveToCandidateLocation);
            const secondCheckedSegment: Segment = new Segment(moveToCandidateLocation, followingVertex);

            // general idea: no need to check if neighbouring segments intersect with current segment (being checked)
            for (const segment of segments) {

                if (segment.containsThisVertex(movingVertex)) { continue; }

                if (!segment.containsThisVertex(precedingVertex)) {
                    if (MathUtil.calculateIntersect(firstCheckedSegment, segment)) { return true; }
                }

                if (!segment.containsThisVertex(followingVertex)) {
                    if (MathUtil.calculateIntersect(secondCheckedSegment, segment)) { return true; }
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

    calculateSegments(): Segment[] {
        const calculatedSegments: Segment[] = new Array();
        for (const vertex of this.polygon.vertices) {
            const precedingVertex: Point = this.polygon.getPrecedingVertex(vertex);
            const currentSegment: Segment = new Segment(precedingVertex, vertex);
            calculatedSegments.push(currentSegment);
        }
        return calculatedSegments;
    }

    calculatePaintableStillSegments(): PaintableSegment[] {
        const paintableSegment: PaintableSegment[] = new Array();
        // TODO: skriv om raderna nedan
        const movingPointIndex: number = this.polygon.vertices.indexOf(this.polygon.movePoint);
        const calculatedSegments: Segment[] = MathUtil.arrayRotate(this.calculateSegments(), movingPointIndex + 2);
        calculatedSegments.pop();
        calculatedSegments.pop();
        for (const segment of calculatedSegments) {
            paintableSegment.push({ p1: segment.p1, p2: segment.p2 });
        }
        return paintableSegment;
    }


    calculatePaintableMovingSegments(mousePosition: Coordinate): PaintableSegment[] {
        const paintableSegment: PaintableSegment[] = new Array();

        const pointBefore: Point = this.polygon.getPrecedingVertex(this.polygon.movePoint);
        const pointAfter: Point = this.polygon.getFollowingVertex(this.polygon.movePoint);
        paintableSegment.push({ p1: pointBefore, p2: mousePosition });
        paintableSegment.push({ p1: pointAfter, p2: mousePosition });
        return paintableSegment;
    }
}