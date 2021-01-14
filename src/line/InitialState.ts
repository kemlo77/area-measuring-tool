import { Coordinate } from '../polygon/Coordinate';
import { MoveState } from '../line/MoveState.js';
import { PaintableSegment } from '../polygon/PaintableSegment.js';
import { Point } from '../polygon/Point.js';
import { Segment } from '../polygon/Segment.js';
import { Line } from './Line.js';
import { LineState } from './LineState.js';

export class InitialState implements LineState {

    private line: Line;

    constructor(line: Line) {
        this.line = line;
    }


    handleLeftClick(pointClicked: Point): void {
        //
    }

    handleLeftMouseDown(pointClicked: Point): void {
        this.line.p1 = pointClicked;
        this.line.p2 = new Point();
        this.line.movePoint = this.line.p2;
        this.line.setCurrentState(new MoveState(this.line));
    }

    handleLeftMouseUp(pointClicked: Point): void {
        //
    }

    calculateSegment(): Segment {
        //TODO: vad är snyggast? Att returnera en tom array eller null?
        return null;
    }

    calculatePaintableStillSegment(): PaintableSegment {
        return null;
    }

    calculatePaintableMovingSegment(mousePosition: Coordinate): PaintableSegment {
        return null;
    }

}