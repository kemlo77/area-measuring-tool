import { Coordinate } from '../polygon/Coordinate.js';
import { MathUtil } from '../polygon/MathUtil.js';
import { PaintableSegment } from '../polygon/PaintableSegment.js';
import { Point } from '../polygon/Point.js';
import { Segment } from '../polygon/Segment.js';
import { Vector } from '../polygon/Vector.js';
import { CompleteState } from './CompleteState.js';
import { Line } from './Line.js';
import { LineState } from './LineState.js';

export class UnselectedState implements LineState {

    private line: Line;

    constructor(line: Line) {
        this.line = line;
    }


    handleLeftClick(pointClicked: Point): void {
        //
    }

    handleLeftMouseDown(pointClicked: Point): void {
        if (this.isTheLineClicked(pointClicked)) {
            this.line.setCurrentState(new CompleteState(this.line));
        }
    }

    private isTheLineClicked(pointClicked: Point): boolean {
        const segment: Segment = this.theLineSegment();
        const vector: Vector = MathUtil.projectPointOntoSegment(segment, pointClicked);
        if (vector !== null && vector.norm < Line.interactDistance) {
            return true;
        } else {
            return false;
        }
    }

    private theLineSegment(): Segment {
        return new Segment(this.line.p1, this.line.p2);
    }

    handleLeftMouseUp(pointClicked: Point): void {
        //
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