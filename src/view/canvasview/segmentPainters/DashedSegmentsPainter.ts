import { Color } from '../../../model/Color';
import { Segment } from '../../../model/shape/segmentShapes/Segment';
import { DrawingCanvasWrapper } from '../DrawingCanvasWrapper';
import { AbstractSegmentsPainter } from './AbstractSegmentsPainter';

export class DashedSegmentsPainter extends AbstractSegmentsPainter {

    protected lineWidth: number = 2;
    private dashPattern: number[] = [10, 10];

    protected drawSegmentsInCanvas(segments: Segment[], color: Color, canvas: DrawingCanvasWrapper): void {
        segments.forEach((segment) => {
            canvas.drawDashedLine(segment.p1, segment.p2, this.lineWidth, color, this.dashPattern);
        });
    }

}