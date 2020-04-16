import { Polygon } from './Polygon.js';
import { Segment } from './Segment.js';
import { PolygonState } from './PolygonState.js';
import { Point } from './Point.js';
import { ClosedState } from './ClosedState.js';
import { Coordinate } from './Coordinate.js';
import { PaintableSegment } from './PaintableSegment.js';
import { PointToSegmentProjection } from './PointToSegmentProjection.js';

export class UnselectedState implements PolygonState {

    private static instance: UnselectedState;

    private constructor() { }

    public static getInstance(): UnselectedState {
        if (!UnselectedState.instance) {
            UnselectedState.instance = new UnselectedState();
        }
        return UnselectedState.instance;
    }

    stateName(): string { return 'UnselectedState'; } // TODO: ta bort senare

    handleLeftClick(polygon: Polygon, pointClicked: Point): void {
        const projection: PointToSegmentProjection = ClosedState.getInstance().checkIfCloseToLine(polygon.segments, pointClicked, polygon.insertNewPointDistance);
        if(projection.withinMinimumDistance) {
            polygon.setCurrentState(ClosedState.getInstance());
        }
    }

    handleRightClick(polygon: Polygon, pointClicked: Point): void {
        //
    }

    calculateSegments(polygon: Polygon): Segment[] {
        return ClosedState.getInstance().calculateSegments(polygon);
    }

    calculatePaintableStillSegments(polygon: Polygon): PaintableSegment[] {
        return ClosedState.getInstance().calculatePaintableStillSegments(polygon);
    }

    calculatePaintableMovingSegments(polygon: Polygon, mousePosition: Coordinate): PaintableSegment[] {
        return new Array<PaintableSegment>();
    }

}