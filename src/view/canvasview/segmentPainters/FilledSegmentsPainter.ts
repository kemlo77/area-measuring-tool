import { Point } from '../../../model/shape/Point';
import { DrawingCanvasWrapper } from '../DrawingCanvasWrapper';
import { AbstractSegmentsPainter } from './AbstractSegmentsPainter';


export class FilledSegmentsPainter extends AbstractSegmentsPainter {

    fillPolygonInCanvas(points: Point[], color: string, canvas: DrawingCanvasWrapper): void {
        canvas.fillPolygon(points, color);
    }

}