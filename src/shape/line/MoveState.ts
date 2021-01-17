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


    handleLeftClick(pointClicked: Point): void {
        //
    }

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

    calculateStillSegment(): Segment {
        return null;
    }

    calculateMovingSegment(mousePosition: Coordinate): Segment {
        //TODO: det här borde kunna göras snyggare om Point hade en construktor
        // som tar Coordinate
        const point2: Point = new Point(mousePosition.x, mousePosition.y);
        return new Segment(this.pointThatIsNotMoving(), point2);
    }

}