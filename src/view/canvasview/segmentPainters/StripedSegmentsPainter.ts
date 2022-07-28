import { Segment } from '../../../model/shape/segmentShapes/Segment';
import { CanvasWrapper } from '../canvaswrapper';
import { AbstractSegmentsPainter } from './AbstractSegmentsPainter';

export class StripedSegmentsPainter extends AbstractSegmentsPainter {

    protected lineWidth: number = 4;
    private dashPattern: number[] = [5, 7];

    protected drawSegmentsInCanvas(segments: Segment[], color: string, canvas: CanvasWrapper): void {
        super.drawSegmentsInCanvas(segments, this.yellow, canvas);

        segments.forEach((it) => {
            canvas.drawDashedLine(it.p1, it.p2, this.lineWidth, this.black, this.dashPattern);
        });
    }

    protected drawEndpointsInCanvas(segments: Segment[], color: string, canvas: CanvasWrapper): void {
        super.drawEndpointsInCanvas(segments, this.black, canvas);
    }

}