import { Coordinate } from '../../../model/shape/Coordinate';
import { Segment } from '../../../model/shape/segmentShapes/Segment';
import { SegmentShape } from '../../../model/shape/segmentShapes/SegmentShape';
import { AbstractSegmentsPainter } from './AbstractSegmentsPainter';



export class RegularSegmentsPainter extends AbstractSegmentsPainter {

    private lineWidth: number = 3;

    drawStill(segmentShape: SegmentShape, color: string): void {
        const stillSegments: Segment[] = segmentShape.getStillSegments();

        this.drawSegmentsInCanvas(stillSegments, this.lineWidth, color, this._stillCanvas);

        if (segmentShape.isSelected) {
            this.drawEndpointsInCanvas(stillSegments, color, this._stillCanvas);
        }
    }

    drawMovement(segmentShape: SegmentShape, color: string, mousePosition: Coordinate): void {
        const movingSegments: Segment[] = segmentShape.getMovingSegments(mousePosition);

        this.clearUsedPartOfCanvas();

        this.drawSegmentsInCanvas(movingSegments, this.lineWidth, color, this._movementCanvas);

        this.addToSegmentsRecentlyPaintedInMovementLayer(movingSegments);

        this.drawEndpointsInCanvas(movingSegments, color, this._movementCanvas);
    }



}