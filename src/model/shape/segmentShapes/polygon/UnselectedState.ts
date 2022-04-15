import { Polygon } from './Polygon';

import { PolygonState } from './PolygonState';
import { Point } from '../../Point';
import { ClosedState } from './ClosedState';
import { Coordinate } from '../../Coordinate';
import { MathService } from '../Math.service';
import { Segment } from '../Segment';

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

    private anySegmentClicked(pointClicked: Point): boolean {
        for (const segment of this.polygon.segments) {
            const distance: number =
                MathService.distanceBetweenPointAndPointProjectedOnSegment(segment, pointClicked);
            if (distance < Polygon.interactDistance) {
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

    calculateStillSegments(): Segment[] {
        return this.closedState.calculateStillSegments();
    }

    calculateMovingSegments(mousePosition: Coordinate): Segment[] {
        return this.closedState.calculateMovingSegments(mousePosition);
    }

}