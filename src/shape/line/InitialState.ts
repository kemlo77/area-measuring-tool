import { Coordinate } from '../Coordinate';
import { MoveState } from './MoveState.js';
import { Point } from '../Point.js';
import { Segment } from '../Segment.js';
import { Line } from './Line.js';
import { LineState } from './LineState.js';

export class InitialState implements LineState {

    private line: Line;

    constructor(line: Line) {
        this.line = line;
    }

    /* istanbul ignore next */
    handleLeftClick(pointClicked: Point): void {
        //
    }

    handleLeftMouseDown(pointClicked: Point): void {
        this.line.p1 = pointClicked;
        this.line.p2 = new Point();
        this.line.movePoint = this.line.p2;
        this.line.setCurrentState(new MoveState(this.line));
    }

    /* istanbul ignore next */
    handleLeftMouseUp(pointClicked: Point): void {
        //
    }

    calculateSegment(): Segment {
        return null;
    }

    calculateStillSegment(): Segment {
        return null;
    }

    calculateMovingSegment(mousePosition: Coordinate): Segment {
        return null;
    }

}