import { Polygon } from './Polygon.js';
import { Segment } from './Segment.js';
import { PolygonState } from './PolygonState.js';
import { Point } from './Point.js';
import { ClosedState } from './ClosedState.js';
import { Coordinate } from './Coordinate.js';
import { PaintableSegment } from './PaintableSegment.js';
import { PointToSegmentProjection } from './PointToSegmentProjection.js';

export class UnselectedState implements PolygonState {

    private polygon: Polygon;
    private closedState: ClosedState;

    constructor(polygon: Polygon, closedState: ClosedState) {
        this.polygon = polygon;
        this.closedState =closedState;
    }


    handleLeftClick(polygon: Polygon, pointClicked: Point): void {
        const projection: PointToSegmentProjection = this.closedState.checkIfCloseToSegment(polygon.segments, pointClicked, Polygon.interactDistance);
        if (projection.withinMinimumDistance) {
            polygon.setCurrentState(this.closedState);
        }
    }

    handleRightClick(polygon: Polygon, pointClicked: Point): void {
        //
    }

    calculateSegments(polygon: Polygon): Segment[] {
        return this.closedState.calculateSegments(polygon);
    }

    calculatePaintableStillSegments(polygon: Polygon): PaintableSegment[] {
        return this.closedState.calculatePaintableStillSegments(polygon);
    }

    calculatePaintableMovingSegments(polygon: Polygon, mousePosition: Coordinate): PaintableSegment[] {
        return new Array<PaintableSegment>();
    }

}