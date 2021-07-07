import { Coordinate } from '../Coordinate.js';
import { MathUtil } from '../MathUtil.js';
import { Point } from '../Point.js';
import { Segment } from '../Segment.js';
import { CompleteState } from './CompleteState.js';
import { Line } from './Line.js';
import { LineState } from './LineState.js';

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