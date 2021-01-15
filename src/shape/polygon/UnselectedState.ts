import { Polygon } from './Polygon.js';
import { Segment } from '../Segment.js';
import { PolygonState } from './PolygonState.js';
import { Point } from '../Point.js';
import { ClosedState } from './ClosedState.js';
import { Coordinate } from '../Coordinate.js';
import { PaintableSegment } from '../PaintableSegment.js';
import { MathUtil } from '../MathUtil.js';
import { Vector } from '../Vector.js';

export class UnselectedState implements PolygonState {

    private polygon: Polygon;
    private closedState: ClosedState;

    constructor(polygon: Polygon, closedState: ClosedState) {
        this.polygon = polygon;
        this.closedState = closedState;
    }


    handleLeftClick(pointClicked: Point): void {
        if (this.anySegmentClicked(pointClicked)) {
            this.polygon.setCurrentState(this.closedState);
        }
    }

    //TODO: skulle denna funktion kunna vara privat?
    //TODO: Gå igenom andra filer och sök funktioner som skulle kunna vara privata
    anySegmentClicked(pointClicked: Point): boolean {
        for (const segment of this.polygon.segments) {
            const vector: Vector = MathUtil.projectPointOntoSegment(segment, pointClicked);
            if (vector !== null && vector.norm < Polygon.interactDistance) {
                return true;
            }
        }
        return false;
    }

    /* istanbul ignore next */
    handleRightClick(pointClicked: Point): void {
        //
    }

    /* istanbul ignore next */
    handleLeftMouseDown(pointClicked: Point): void {
        //
    }

    /* istanbul ignore next */
    handleLeftMouseUp(pointClicked: Point): void {
        //
    }

    calculateSegments(): Segment[] {
        return this.closedState.calculateSegments();
    }

    calculatePaintableStillSegments(): PaintableSegment[] {
        return this.closedState.calculatePaintableStillSegments();
    }

    calculatePaintableMovingSegments(mousePosition: Coordinate): PaintableSegment[] {
        return this.closedState.calculatePaintableMovingSegments(mousePosition);
    }

}