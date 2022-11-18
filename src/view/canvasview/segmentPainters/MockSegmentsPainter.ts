import { Color } from '../../../model/Color';
import { Coordinate } from '../../../model/shape/Coordinate';
import { SegmentShape } from '../../../model/shape/segmentShapes/SegmentShape';
import { SegmentsPainter } from './SegmentsPainter';



export class MockSegmentsPainter implements SegmentsPainter {

    drawStill(segmentShape: SegmentShape, color: Color): void {
        //
    }

    drawMovement(segmentShape: SegmentShape, color: Color, mousePosition: Coordinate): void {
        //
    }

}