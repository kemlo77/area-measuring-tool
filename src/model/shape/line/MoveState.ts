import { Coordinate } from '../Coordinate.js';
import { Point } from '../Point.js';
import { Segment } from '../Segment.js';
import { CompleteState } from './CompleteState.js';
import { Line } from './Line.js';
import { LineState } from './LineState.js';

export class MoveState implements LineState {

    private line: Line;

    constructor(line: Line) {
        this.line = line;
    }

    /* istanbul ignore next */
    handleLeftClick(pointClicked: Point): void {
        //
    }

    /* istanbul ignore next */
    handleLeftMouseDown(pointClicked: Point): void {
        //
    }

    handleLeftMouseUp(pointClicked: Point): void {
        const otherPoint: Point = this.line.nonMovingPoint;
        if (pointClicked.notTooCloseToPoint(otherPoint, Line.minimumDistanceBetweenPoints)) {
            this.line.replacePointSelectedForMoveWithNewPoint(pointClicked);
            this.line.resetMovePoint();
            this.line.setCurrentState(new CompleteState(this.line));
        }
    }

    calculateSegment(): Segment {
        return null;
    }

    calculateStillSegment(): Segment {
        return null;
    }

    calculateMovingSegment(mousePosition: Coordinate): Segment {
        const mousePositionPoint: Point = new Point(mousePosition);
        return new Segment(this.line.nonMovingPoint, mousePositionPoint);
    }

}