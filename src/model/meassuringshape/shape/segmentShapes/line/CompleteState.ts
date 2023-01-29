import { Coordinate } from '../../Coordinate';
import { Point } from '../../Point';
import { Line } from './Line';
import { LineState } from './LineState';
import { MoveState } from './MoveState';
import { MathService } from '../Math.service';
import { UnselectedState } from './UnselectedState';
import { Segment } from '../Segment';

export class CompleteState implements LineState {

    private line: Line;

    constructor(line: Line) {
        this.line = line;
    }

    /* istanbul ignore next */
    handleLeftClick(pointClicked: Point): void {
        //
    }

    handleLeftMouseDown(pointClicked: Point): void {
        if (pointClicked.closeEnoughToPoint(this.line.p1, Line.interactDistance)) {
            this.line.movePoint = this.line.p1;
            this.line.setCurrentState(new MoveState(this.line));
        } else if (pointClicked.closeEnoughToPoint(this.line.p2, Line.interactDistance)) {
            this.line.movePoint = this.line.p2;
            this.line.setCurrentState(new MoveState(this.line));
        } else if (!this.theSegmentIsClicked(pointClicked)) {
            this.line.setCurrentState(new UnselectedState(this.line));
        }
    }

    private theSegmentIsClicked(pointClicked: Point): boolean {
        const distance: number =
            MathService.distanceBetweenPointAndPointProjectedOnSegment(this.calculateSegment(), pointClicked);
        return distance < Line.interactDistance;
    }

    /* istanbul ignore next */
    handleLeftMouseUp(pointClicked: Point): void {
        //
    }

    calculateSegment(): Segment {
        return new Segment(this.line.p1, this.line.p2);
    }

    calculateStillSegment(): Segment {
        return this.calculateSegment();
    }

    calculateMovingSegment(mousePosition: Coordinate): Segment {
        return null;
    }

}