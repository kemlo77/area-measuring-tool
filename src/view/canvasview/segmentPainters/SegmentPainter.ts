import { Coordinate } from '../../../model/shape/Coordinate';
import { SegmentShape } from '../../../model/shape/segmentShapes/SegmentShape';



export interface SegmentPainter {
    drawStill(segmentShape: SegmentShape): void;
    drawMovement(segmentShape: SegmentShape, mousePosition: Coordinate): void;
    clearTheStillCanvas(): void;
    clearTheMovementCanvas(): void;
}