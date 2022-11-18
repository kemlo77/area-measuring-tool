import { Color } from '../../../model/Color';
import { Point } from '../../../model/shape/Point';
import { DrawingCanvasWrapper } from '../DrawingCanvasWrapper';
import { AbstractSegmentsPainter } from './AbstractSegmentsPainter';


export class FilledSegmentsPainter extends AbstractSegmentsPainter {

    fillPolygonInCanvas(points: Point[], color: Color, canvas: DrawingCanvasWrapper): void {
        canvas.fillPolygon(points, color);
    }

}