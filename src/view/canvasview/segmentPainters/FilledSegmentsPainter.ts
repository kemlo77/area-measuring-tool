import { Point } from '../../../model/shape/Point';
import { CanvasWrapper } from '../canvaswrapper';
import { AbstractSegmentsPainter } from './AbstractSegmentsPainter';


export class FilledSegmentsPainter extends AbstractSegmentsPainter {

    fillPolygonInCanvas(points: Point[], color: string, canvas: CanvasWrapper): void {
        canvas.fillPolygon(points, color);
    }

}