import { Coordinate } from '../../../model/shape/Coordinate';
import { Point } from '../../../model/shape/Point';
import { Segment } from '../../../model/shape/segmentShapes/Segment';
import { SegmentShape } from '../../../model/shape/segmentShapes/SegmentShape';
import { Vector } from '../../../model/shape/Vector';
import { AbstractSegmentsPainter } from './AbstractSegmentsPainter';

export class DashedSegmentsPainter extends AbstractSegmentsPainter {

    private lineWidth: number = 3;

    drawStill(segmentShape: SegmentShape, color: string): void {
        const stillSegments: Segment[] = segmentShape.getStillSegments();

        stillSegments.forEach((it) => {
            this.drawStillSegments(this.generateDashes(it), 1, color);
        });
        if (segmentShape.isSelected) {
            this.drawStillPoints(stillSegments, color);
        }
    }


    drawMovement(segmentShape: SegmentShape, color: string, mousePosition: Coordinate): void {
        const movingSegments: Segment[] = segmentShape.getMovingSegments(mousePosition);

        this.clearUsedPartOfCanvas();
        movingSegments.forEach((it) => {
            this.drawMovingSegments(this.generateDashes(it), 1, color);
        });
        this.drawMovingPoints(movingSegments, color);
    }

    private generateDashes(segment: Segment): Segment[] {
        const segments: Segment[] = [];
        const vector: Vector = new Vector(segment.p1, segment.p2);
        const direction: Vector = vector.generateUnitVector();

        const lengthOfDashes: number = 10;
        const distanceBetweenDashes: number = 10;
        const period: number = lengthOfDashes + distanceBetweenDashes;
        let distanceTravelled: number = 0;
        while (distanceTravelled + period < segment.length) {
            distanceTravelled += period;
            if ((segment.length - distanceTravelled) > lengthOfDashes) {
                const newPoint: Point = this.jumpToNewPoint(segment.p1, direction, distanceTravelled);
                segments.push(this.generateDash(newPoint, direction, lengthOfDashes));
            }
        }
        segments.push(this.generateDash(segment.p1, direction, lengthOfDashes));
        segments.push(this.generateDash(segment.p2, direction.generateNegativeVector(), lengthOfDashes));
        return segments;
    }

    private generateDash(startPoint: Point, direction: Vector, dashLength: number): Segment {
        const endPoint: Point = this.jumpToNewPoint(startPoint, direction, dashLength);
        return new Segment(startPoint, endPoint);
    }

}