import { Coordinate } from '../../../model/shape/Coordinate';
import { Point } from '../../../model/shape/Point';
import { Segment } from '../../../model/shape/segmentShapes/Segment';
import { SegmentShape } from '../../../model/shape/segmentShapes/SegmentShape';
import { Vector } from '../../../model/shape/Vector';
import { AbstractSegmentsPainter } from './AbstractSegmentsPainter';

export class StripedSegmentsPainter extends AbstractSegmentsPainter {

    private lineWidth: number = 3;

    drawStill(segmentShape: SegmentShape, color: string): void {
        const stillSegments: Segment[] = segmentShape.getStillSegments();

        this.drawStillSegments(stillSegments, this.lineWidth, color);
        stillSegments.forEach((it) => {
            this.drawStillSegments(this.generateRulerLines(it), 1, '0,0,0');
        });
        if (segmentShape.isSelected) {
            this.drawStillPoints(stillSegments, '0,0,0');
        }
    }


    drawMovement(segmentShape: SegmentShape, color: string, mousePosition: Coordinate): void {
        const movingSegments: Segment[] = segmentShape.getMovingSegments(mousePosition);

        this.clearUsedPartOfCanvas();
        this.drawMovingSegments(movingSegments, this.lineWidth, color);
        movingSegments.forEach((it) => {
            this.drawMovingSegments(this.generateRulerLines(it), 1, '0,0,0');
        });
        this.drawMovingPoints(movingSegments, '0,0,0');
    }

    private generateRulerLines(segment: Segment): Segment[] {
        const segments: Segment[] = [];
        const vector: Vector = new Vector(segment.p1, segment.p2);
        const direction: Vector = vector.generateUnitVector();
        const perpendicular: Vector = vector.generatePerpendicularUnitVector();
        const distanceBetweenLines: number = 15;
        let distanceTravelled: number = 0;
        while (distanceTravelled + distanceBetweenLines < segment.length) {
            distanceTravelled += distanceBetweenLines;
            const newPoint: Point = this.jumpToNewPoint(segment.p1, direction, distanceTravelled);
            segments.push(this.generateRulerLine(newPoint, perpendicular));
        }
        segments.push(this.generateRulerLine(segment.p1, perpendicular));
        segments.push(this.generateRulerLine(segment.p2, perpendicular));
        return segments;
    }

    private generateRulerLine(point: Point, direction: Vector): Segment {
        const point1: Point = this.jumpToNewPoint(point, direction, this.lineWidth / 2);
        const point2: Point = this.jumpToNewPoint(point, direction, -this.lineWidth / 2);
        return new Segment(point1, point2);
    }

}