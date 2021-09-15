import { Coordinate } from '../Coordinate';
import { MathUtil } from '../MathUtil';
import { Point } from '../Point';
import { Segment } from '../Segment';
import { CompleteState } from './CompleteState';
import { Line } from './Line';
import { LineState } from './LineState';

export class UnselectedState implements LineState {

    private line: Line;

    constructor(line: Line) {
        this.line = line;
    }


    handleLeftClick(pointClicked: Point): void {
        if (this.theSegmentIsClicked(pointClicked)) {
            this.line.setCurrentState(new CompleteState(this.line));
        }
    }

    private theSegmentIsClicked(pointClicked: Point): boolean {
        const distance: number =
            MathUtil.distanceBetweenPointAndPointProjectedOnSegment(this.calculateSegment(), pointClicked);
        return distance < Line.interactDistance;
    }


    /* istanbul ignore next */
    handleLeftMouseDown(pointClicked: Point): void {
        //
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