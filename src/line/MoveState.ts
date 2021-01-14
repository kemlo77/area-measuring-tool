import { Coordinate } from '../polygon/Coordinate.js';
import { PaintableSegment } from '../polygon/PaintableSegment.js';
import { Point } from '../polygon/Point.js';
import { Segment } from '../polygon/Segment.js';
import { CompleteState } from './CompleteState.js';
import { Line } from './Line.js';
import { LineState } from './LineState.js';

export class MoveState implements LineState {

    private line: Line;

    constructor(line: Line) {
        this.line = line;
    }


    handleLeftClick(pointClicked: Point): void {
        //
    }

    handleLeftMouseDown(pointClicked: Point): void {
        //
    }

    handleLeftMouseUp(pointClicked: Point): void {
        const otherPoint: Point = this.pointThatIsNotMoving();
        if ( pointClicked.notTooCloseToPoint(otherPoint, Line.minimumDistanceBetweenPoints)){
            this.line.movePoint.copyValues(pointClicked);
            this.line.movePoint = null;
            this.line.setCurrentState(new CompleteState(this.line));
        }
    }

    pointThatIsNotMoving(): Point {
        if (this.line.p1 === this.line.movePoint) {
            return this.line.p2;
        } else {
            return this.line.p1;
        }
    }

    calculateSegment(): Segment {
        return null;
    }

    calculatePaintableStillSegment(): PaintableSegment {
        return null;
    }

    calculatePaintableMovingSegment(mousePosition: Coordinate): PaintableSegment {
        return { p1: this.pointThatIsNotMoving(), p2: mousePosition };
    }

}