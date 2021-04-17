import { Coordinate } from '../../model/shape/Coordinate.js';
import { Line } from '../../model/shape/line/Line.js';
import { Segment } from '../../model/shape/Segment.js';
import { AbstractSegmentPainter } from './AbstractSegmentPainter.js';

export class LinePainter extends AbstractSegmentPainter {

    private static instance: LinePainter;
    private _color: string = '0,0,0';


    public static getInstance(): LinePainter {
        if (!LinePainter.instance) {
            LinePainter.instance = new LinePainter();
        }
        return LinePainter.instance;
    }

    drawStill(motif: any): void {
        const line: Line = motif as Line;
        const segment: Segment[] = line.getStillSegments();
        if (segment.length > 0) {
            this.drawStillSegments(segment, 3, this._color);
            if (line.isComplete) {
                this.drawHollowDot(segment[0].p1, this._color, this.stillCanvasCtx);
                this.drawHollowDot(segment[0].p2, this._color, this.stillCanvasCtx);
            }
        }
    }

    drawMovement(motif: any, mousePosition: Coordinate): void {
        const line: Line = motif as Line;
        const segment: Segment[] = line.getMovingSegments(mousePosition);
        if (segment.length > 0) {
            if (line.isMoving) {
                this.clearUsedPartOfCanvas();
                this.drawMovingSegments(segment, 3, this._color);
                this.drawThePointNotMoving(line, this.movementCanvasCtx);
            }

        }
    }

    private drawThePointNotMoving(line: Line, ctx: CanvasRenderingContext2D): void {
        [line.p1, line.p2]
            .filter((it) => it !== line.movePoint)
            .forEach((it) => { this.drawHollowDot(it, this._color, ctx); });
    }

}