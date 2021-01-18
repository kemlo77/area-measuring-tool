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
        const otherPoint: Point = this.pointThatIsNotMoving();
        if (pointClicked.notTooCloseToPoint(otherPoint, Line.minimumDistanceBetweenPoints)) {
            this.line.movePoint.copyValues(pointClicked);
            this.line.movePoint = null;
            this.line.setCurrentState(new CompleteState(this.line));
        }
    }

    private pointThatIsNotMoving(): Point {
        if (this.line.p1 === this.line.movePoint) {
            return this.line.p2;
        } else {
            return this.line.p1;
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
        return new Segment(this.pointThatIsNotMoving(), mousePositionPoint);
    }

}