import { Coordinate } from '../Coordinate.js';
import { PaintableSegment } from '../PaintableSegment.js';
import { Point } from '../Point.js';
import { Segment } from '../Segment.js';
import { UnselectedState } from './UnselectedState.js';
import { Line } from './Line.js';
import { LineState } from './LineState.js';
import { MoveState } from './MoveState.js';
import { Vector } from '../Vector.js';
import { MathUtil } from '../MathUtil.js';

export class CompleteState implements LineState {

    private line: Line;

    constructor(line: Line) {
        this.line = line;
    }


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
        } else if (this.theSegmentIsNotClicked(pointClicked)) {
            this.line.setCurrentState(new UnselectedState(this.line));
        }
    }

    private theLineSegment(): Segment {
        return new Segment(this.line.p1, this.line.p2);
    }

    private theSegmentIsNotClicked(pointClicked: Point): boolean {
        const vector: Vector = MathUtil.projectPointOntoSegment(this.theLineSegment(), pointClicked);
        if (vector !== null && vector.norm < Line.interactDistance) {
            return false;
        } else {
            return true;
        }
    }

    handleLeftMouseUp(pointClicked: Point): void {
        // Does nothing
    }

    calculateSegment(): Segment {
        return this.theLineSegment();
    }

    calculatePaintableStillSegment(): PaintableSegment {
        return this.theLineSegment();
    }

    calculatePaintableMovingSegment(mousePosition: Coordinate): PaintableSegment {
        return this.theLineSegment();
    }

}