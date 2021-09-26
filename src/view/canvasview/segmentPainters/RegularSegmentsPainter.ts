import { Coordinate } from '../../../model/shape/Coordinate';
import { SegmentShape } from '../../../model/shape/SegmentShape';
import { Segment } from '../../../model/shape/Segment';
import { AbstractSegmentPainter } from './AbstractSegmentPainter';



export class RegularSegmentsPainter extends AbstractSegmentPainter {

    private static instance: RegularSegmentsPainter;
    private lineWidth: number = 3;


    public static getInstance(): RegularSegmentsPainter {
        if (!RegularSegmentsPainter.instance) {
            RegularSegmentsPainter.instance = new RegularSegmentsPainter();
        }
        return RegularSegmentsPainter.instance;
    }

    drawStill(segmentShape: SegmentShape): void {
        const stillSegments: Segment[] = segmentShape.getStillSegments();

        this.drawStillSegments(stillSegments, this.lineWidth, '0,0,255');
        if (segmentShape.isSelected) {
            this.drawEndPointsOnSegments(stillSegments, '0,0,255', this.stillCanvasCtx);
        }
    }

    drawMovement(segmentShape: SegmentShape, mousePosition: Coordinate): void {
        const movingSegments: Segment[] = segmentShape.getMovingSegments(mousePosition);

        this.clearUsedPartOfCanvas();
        this.drawMovingSegments(movingSegments, this.lineWidth, '0,0,255');
        this.drawEndPointsOnSegments(movingSegments, '0,0,255', this.movementCanvasCtx);
    }



}