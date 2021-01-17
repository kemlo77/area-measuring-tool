import { Coordinate } from '../Coordinate.js';
import { MathUtil } from '../MathUtil.js';
import { Point } from '../Point.js';
import { Segment } from '../Segment.js';
import { Vector } from '../Vector.js';
import { CompleteState } from './CompleteState.js';
import { Line } from './Line.js';
import { LineState } from './LineState.js';

export class UnselectedState implements LineState {

    private line: Line;

    constructor(line: Line) {
        this.line = line;
    }


    handleLeftClick(pointClicked: Point): void {
        if (this.isTheLineClicked(pointClicked)) {
            this.line.setCurrentState(new CompleteState(this.line));
        }
    }

    private isTheLineClicked(pointClicked: Point): boolean {
        const segment: Segment = this.calculateSegment();
        const vector: Vector = MathUtil.projectPointOntoSegment(segment, pointClicked);
        if (vector !== null && vector.norm < Line.interactDistance) {
            return true;
        } else {
            return false;
        }
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
        return this.calculateSegment();
    }

}