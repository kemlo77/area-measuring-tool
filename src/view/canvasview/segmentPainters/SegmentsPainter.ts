import { Coordinate } from '../../../model/shape/Coordinate';
import { SegmentShape } from '../../../model/shape/segmentShapes/SegmentShape';

export interface SegmentsPainter {
    drawStill(segmentShape: SegmentShape, color: string): void;
    drawMovement(segmentShape: SegmentShape, color: string, mousePosition: Coordinate): void;
}