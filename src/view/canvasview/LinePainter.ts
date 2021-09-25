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
        const stillSegments: Segment[] = line.getStillSegments();

        this.drawStillSegments(stillSegments, 3, this._color);
        if (line.isSelected) {
            this.drawEndPointsOnSegments(stillSegments, this._color, this.stillCanvasCtx);
        }
    }

    drawMovement(motif: any, mousePosition: Coordinate): void {
        const line: Line = motif as Line;
        const movingSegments: Segment[] = line.getMovingSegments(mousePosition);

        this.clearUsedPartOfCanvas();
        this.drawMovingSegments(movingSegments, 3, this._color);
        this.drawEndPointsOnSegments(movingSegments, this._color, this.movementCanvasCtx);
    }
}