import { Coordinate } from '../../../model/shape/Coordinate';
import { Segment } from '../../../model/shape/segmentShapes/Segment';
import { SegmentShape } from '../../../model/shape/segmentShapes/SegmentShape';
import { AbstractSegmentsPainter } from './AbstractSegmentsPainter';

export class DashedSegmentsPainter extends AbstractSegmentsPainter {

    private lineWidth: number = 2;
    private dashPattern: number[] = [10, 10];

    drawStill(segmentShape: SegmentShape, color: string): void {
        const stillSegments: Segment[] = segmentShape.getStillSegments();

        this.drawDashedSegmentsInCanvas(stillSegments, this.lineWidth, color, this.dashPattern, this._stillCanvas);

        if (segmentShape.isSelected) {
            this.drawEndpointsInCanvas(stillSegments, color, this._stillCanvas);
        }
    }


    drawMovement(segmentShape: SegmentShape, color: string, mousePosition: Coordinate): void {
        const movingSegments: Segment[] = segmentShape.getMovingSegments(mousePosition);

        this.clearUsedPartOfCanvas();

        this.drawDashedSegmentsInCanvas(movingSegments, this.lineWidth, color, this.dashPattern, this._movementCanvas);

        this.addToSegmentsRecentlyPaintedInMovementLayer(movingSegments);

        this.drawEndpointsInCanvas(movingSegments, color, this._movementCanvas);
    }


}