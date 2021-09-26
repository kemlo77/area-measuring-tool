import { Coordinate } from '../../../model/shape/Coordinate';
import { Point } from '../../../model/shape/Point';
import { Segment } from '../../../model/shape/Segment';
import { SegmentShape } from '../../../model/shape/SegmentShape';
import { Vector } from '../../../model/shape/Vector';
import { AbstractSegmentPainter } from './../segmentPainters/AbstractSegmentPainter';

export class StripedSegmentsPainter extends AbstractSegmentPainter {

    private static instance: StripedSegmentsPainter;
    private lineWidth: number = 3;


    public static getInstance(): StripedSegmentsPainter {
        if (!StripedSegmentsPainter.instance) {
            StripedSegmentsPainter.instance = new StripedSegmentsPainter();
        }
        return StripedSegmentsPainter.instance;
    }

    drawStill(segmentShape: SegmentShape): void {
        const stillSegments: Segment[] = segmentShape.getStillSegments();

        this.drawStillSegments(stillSegments, this.lineWidth, '255,255,0');
        stillSegments.forEach((it) => {
            this.drawStillSegments(this.generateRulerLines(it), 1, '0,0,0');
        });
        if (segmentShape.isSelected) {
            this.drawEndPointsOnSegments(stillSegments, '0,0,0', this.stillCanvasCtx);
        }

    }


    drawMovement(segmentShape: SegmentShape, mousePosition: Coordinate): void {
        const movingSegments: Segment[] = segmentShape.getMovingSegments(mousePosition);

        this.clearUsedPartOfCanvas();
        this.drawMovingSegments(movingSegments, this.lineWidth, '255,255,0');
        movingSegments.forEach((it) => {
            this.drawMovingSegments(this.generateRulerLines(it), 1, '0,0,0');
        });
        this.drawEndPointsOnSegments(movingSegments, '0,0,0', this.movementCanvasCtx);
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

    private jumpToNewPoint(point: Point, direction: Vector, distance: number): Point {
        //TODO: städa bort den här if:en?
        if (Math.abs(direction.norm - 1) > 0.000001) {
            console.warn('direction given is not a unit vector. Has length: ' + direction.norm);
        }
        const newPointX: number = point.x + direction.x * distance;
        const newPointY: number = point.y + direction.y * distance;
        return new Point(newPointX, newPointY);
    }

}