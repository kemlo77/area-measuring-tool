import { Color } from '../../../model/meassuringshape/Color';
import { Coordinate } from '../../../model/meassuringshape/shape/Coordinate';
import { SegmentShape } from '../../../model/meassuringshape/shape/segmentShapes/SegmentShape';

export interface SegmentsPainter {
    drawStill(segmentShape: SegmentShape, color: Color): void;
    drawMovement(segmentShape: SegmentShape, color: Color, mousePosition: Coordinate): void;
}