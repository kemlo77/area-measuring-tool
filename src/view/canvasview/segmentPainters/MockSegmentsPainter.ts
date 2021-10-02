import { Coordinate } from '../../../model/shape/Coordinate';
import { SegmentShape } from '../../../model/shape/segmentShapes/SegmentShape';
import { SegmentsPainter } from './SegmentsPainter';



export class MockSegmentsPainter implements SegmentsPainter {

    drawStill(segmentShape: SegmentShape, color: string): void {
        //
    }

    drawMovement(segmentShape: SegmentShape, color: string, mousePosition: Coordinate): void {
        //
    }

    clearTheStillCanvas(): void {
        //
    }

    clearTheMovementCanvas(): void {
        //
    }

}