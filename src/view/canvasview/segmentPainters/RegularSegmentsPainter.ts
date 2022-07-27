import { Coordinate } from '../../../model/shape/Coordinate';
import { Segment } from '../../../model/shape/segmentShapes/Segment';
import { SegmentShape } from '../../../model/shape/segmentShapes/SegmentShape';
import { AbstractSegmentsPainter } from './AbstractSegmentsPainter';



export class RegularSegmentsPainter extends AbstractSegmentsPainter {

    private lineWidth: number = 3;

    drawStill(segmentShape: SegmentShape, color: string): void {
        const stillSegments: Segment[] = segmentShape.getStillSegments();

        this.drawStillSegments(stillSegments, this.lineWidth, color);
        if (segmentShape.isSelected) {
            this.drawStillPoints(stillSegments, color);
        }
    }

    drawMovement(segmentShape: SegmentShape, color: string, mousePosition: Coordinate): void {
        const movingSegments: Segment[] = segmentShape.getMovingSegments(mousePosition);

        this.clearUsedPartOfCanvas();
        this.drawMovingSegments(movingSegments, this.lineWidth, color);
        this.drawMovingPoints(movingSegments, color);
    }



}