import { Coordinate } from '../../../model/shape/Coordinate';
import { Segment } from '../../../model/shape/segmentShapes/Segment';
import { SegmentShape } from '../../../model/shape/segmentShapes/SegmentShape';
import { AbstractSegmentsPainter } from './AbstractSegmentsPainter';

export class StripedSegmentsPainter extends AbstractSegmentsPainter {

    private lineWidth: number = 1;
    private dashPattern: number[] = [2, 5];

    drawStill(segmentShape: SegmentShape, color: string): void {
        const stillSegments: Segment[] = segmentShape.getStillSegments();

        this.drawSegmentsInCanvas(stillSegments, this.lineWidth, this.yellow, this._stillCanvas);
        this.drawDashedSegmentsInCanvas(stillSegments, this.lineWidth, this.black, this.dashPattern, this._stillCanvas);

        if (segmentShape.isSelected) {
            this.drawEndpointsInCanvas(stillSegments, this.black, this._stillCanvas);
        }
    }


    drawMovement(segmentShape: SegmentShape, color: string, mousePosition: Coordinate): void {
        const movingSegments: Segment[] = segmentShape.getMovingSegments(mousePosition);

        this.clearUsedPartOfCanvas();

        this.drawSegmentsInCanvas(movingSegments, this.lineWidth, this.yellow, this._movementCanvas);
        this.drawDashedSegmentsInCanvas(movingSegments, this.lineWidth, this.black, this.dashPattern, this._movementCanvas);

        this.addToSegmentsRecentlyPaintedInMovementLayer(movingSegments);

        this.drawEndpointsInCanvas(movingSegments, this.black, this._movementCanvas);
    }

}