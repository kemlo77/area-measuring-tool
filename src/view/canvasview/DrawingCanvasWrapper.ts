import { Color } from '../../model/meassuringshape/Color';
import { Coordinate } from '../../model/meassuringshape/shape/Coordinate';
import { CanvasWrapper } from './CanvasWrapper';

export class DrawingCanvasWrapper extends CanvasWrapper {

    public clearPartOfCanvas(upperLeft: Coordinate, lowerRight: Coordinate): void {
        const p1: Coordinate = this.imageToCanvas(upperLeft);
        const p2: Coordinate = this.imageToCanvas(lowerRight);
        const width: number = p2.x - p1.x;
        const height: number = p2.y - p1.y;
        this._canvasCtx.clearRect(p1.x - 10, p1.y - 10, width + 20, height + 20);
    }

    drawLine(p1: Coordinate, p2: Coordinate, width: number, lineColor: Color): void {
        const convertedP1: Coordinate = this.imageToCanvas(p1);
        const convertedP2: Coordinate = this.imageToCanvas(p2);
        this._canvasCtx.strokeStyle = lineColor.toRgbaString();
        this._canvasCtx.beginPath();
        this._canvasCtx.lineWidth = width;
        this._canvasCtx.lineCap = 'round';
        this._canvasCtx.moveTo(convertedP1.x, convertedP1.y);
        this._canvasCtx.lineTo(convertedP2.x, convertedP2.y);
        this._canvasCtx.stroke();
    }

    drawDashedLine(p1: Coordinate, p2: Coordinate, width: number, lineColor: Color, pattern: number[]): void {
        const convertedP1: Coordinate = this.imageToCanvas(p1);
        const convertedP2: Coordinate = this.imageToCanvas(p2);
        this._canvasCtx.strokeStyle = lineColor.toRgbString();
        this._canvasCtx.beginPath();
        this._canvasCtx.setLineDash(pattern);
        this._canvasCtx.lineWidth = width;
        this._canvasCtx.lineCap = 'butt';
        this._canvasCtx.moveTo(convertedP1.x, convertedP1.y);
        this._canvasCtx.lineTo(convertedP2.x, convertedP2.y);
        this._canvasCtx.stroke();
        this._canvasCtx.setLineDash([]);
    }

    private drawDot(dot2paint: Coordinate, diam: number, rgbIn: Color): void {
        this._canvasCtx.fillStyle = rgbIn.toRgbString();
        this._canvasCtx.beginPath();
        this._canvasCtx.arc(dot2paint.x, dot2paint.y, diam, 0, Math.PI * 2, true);
        this._canvasCtx.closePath();
        this._canvasCtx.fill();
    }

    drawHollowDot(dot2paint: Coordinate, outerColor: Color): void {
        const convertedDot: Coordinate = this.imageToCanvas(dot2paint);
        this.drawDot(convertedDot, 4, outerColor);
        this.drawDot(convertedDot, 2, Color.white);
    }

    fillPolygon(vertices: Coordinate[], color: Color): void {
        const convertedVertices: Coordinate[] = vertices.map(v => this.imageToCanvas(v));
        //TODO: this should probably be a function in Color-class
        const colorWithAlphaAtTenPercent: string = `rgba(${color.red}, ${color.green}, ${color.blue}, 0.1)`;
        this._canvasCtx.fillStyle = colorWithAlphaAtTenPercent;
        this._canvasCtx.beginPath();
        const startPoint: Coordinate = convertedVertices.shift();
        this._canvasCtx.moveTo(startPoint.x, startPoint.y);
        for (const point of convertedVertices) {
            this._canvasCtx.lineTo(point.x, point.y);
        }
        this._canvasCtx.closePath();
        this._canvasCtx.fill();
    }
}