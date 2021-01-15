import { Line } from '../line/Line.js';
import { Coordinate } from '../polygon/Coordinate.js';
import { PaintableSegment } from '../polygon/PaintableSegment.js';
import { AbstractSegmentPainter } from './AbstractSegmentPainter.js';

export class LinePainter extends AbstractSegmentPainter {

    private static instance: LinePainter;
    private _color: string = '0,0,0';

    private constructor() {
        super();
    }

    public static getInstance(): LinePainter {
        if (!LinePainter.instance) {
            LinePainter.instance = new LinePainter();
        }
        return LinePainter.instance;
    }

    drawStill(motif: any): void {
        const line: Line = motif as Line;
        const segment: PaintableSegment = line.getPaintableStillSegment();
        if (segment !== null) {
            this.drawStillSegments([segment], this._color);
            if(line.isComplete) {
                this.drawHollowDot(segment.p1, this._color, this.stillCanvasCtx);
                this.drawHollowDot(segment.p2, this._color, this.stillCanvasCtx);
            }
        }
    }

    drawMovement(motif: any, mousePosition: Coordinate): void {
        const line: Line = motif as Line;
        const segment: PaintableSegment = line.getPaintableMovingSegment(mousePosition);
        if (segment !== null) {
            if(line.isMoving){
                this.clearUsedPartOfCanvas();
                this.drawMovingSegments([segment], this._color);
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