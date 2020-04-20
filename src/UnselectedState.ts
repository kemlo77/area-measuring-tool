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
        this.closedState = closedState;
    }


    handleLeftClick(pointClicked: Point): void {
        const projection: PointToSegmentProjection = this.closedState.checkIfCloseToSegment(pointClicked, Polygon.interactDistance);
        if (projection.withinMinimumDistance) {
            this.polygon.setCurrentState(this.closedState);
        }
    }

    handleRightClick(pointClicked: Point): void {
        //
    }

    calculateSegments(): Segment[] {
        return this.closedState.calculateSegments();
    }

    calculatePaintableStillSegments(): PaintableSegment[] {
        return this.closedState.calculatePaintableStillSegments();
    }

    calculatePaintableMovingSegments(mousePosition: Coordinate): PaintableSegment[] {
        return new Array<PaintableSegment>();
    }

}