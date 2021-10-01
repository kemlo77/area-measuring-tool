import { Coordinate } from '../../../model/shape/Coordinate';
import { Point } from '../../../model/shape/Point';
import { Segment } from '../../../model/shape/segmentShapes/Segment';
import { SegmentShape } from '../../../model/shape/segmentShapes/SegmentShape';
import { AbstractSegmentsPainter } from './AbstractSegmentsPainter';



export class FilledSegmentsPainter extends AbstractSegmentsPainter {

    private lineWidth: number = 3;

    drawStill(segmentShape: SegmentShape, color: string): void {
        const stillSegments: Segment[] = segmentShape.getStillSegments();

        if(segmentShape.isClosed && !segmentShape.isMoving) {
            this.fillPolygon(stillSegments, color);
        }

        this.drawStillSegments(stillSegments, this.lineWidth, color);

        if (segmentShape.isSelected) {
            this.drawEndPointsOnSegments(stillSegments, color, this.stillCanvasCtx);
        }
    }

    drawMovement(segmentShape: SegmentShape, color: string, mousePosition: Coordinate): void {
        const movingSegments: Segment[] = segmentShape.getMovingSegments(mousePosition);

        this.clearUsedPartOfCanvas();
        this.drawMovingSegments(movingSegments, this.lineWidth, color);
        this.drawEndPointsOnSegments(movingSegments, color, this.movementCanvasCtx);
    }

    private fillPolygon(segments: Segment[], color: string): void {
        const firstPoints: Point[] = segments.map((segment: Segment) => {return segment.p1;});

        const ctx: CanvasRenderingContext2D = this.stillCanvasCtx;
        ctx.fillStyle = 'rgba(' + color + ',0.1)';
        ctx.beginPath();
        const startPoint: Point = firstPoints.shift();
        ctx.moveTo(startPoint.x, startPoint.y);
        for (const point of firstPoints) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.closePath();
        ctx.fill();


    }



}