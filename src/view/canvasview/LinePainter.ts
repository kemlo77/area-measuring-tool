import { Coordinate } from '../../model/shape/Coordinate';
import { Line } from '../../model/shape/line/Line';
import { Segment } from '../../model/shape/Segment';
import { AbstractSegmentPainter } from './AbstractSegmentPainter';

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
        const segments: Segment[] = line.getStillSegments();
        this.drawStillSegments(segments, 3, this._color);
        if (line.isSelected) {
            line.nonMovingEndpoints.forEach((it) => {
                this.drawHollowDot(it, this._color, this.stillCanvasCtx);
            });
        }
    }

    drawMovement(motif: any, mousePosition: Coordinate): void {
        const line: Line = motif as Line;
        const segments: Segment[] = line.getMovingSegments(mousePosition);
        this.clearUsedPartOfCanvas();
        this.drawMovingSegments(segments, 3, this._color);
        this.drawNonMovingPointsOnMovingSegments(segments, line.movePoint, this._color);


    }

    private drawThePointNotMoving(line: Line, ctx: CanvasRenderingContext2D): void {
        this.drawHollowDot(line.nonMovingPoint, this._color, ctx);
    }

}