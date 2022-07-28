import { Coordinate } from '../../model/shape/Coordinate';

export class CanvasWraper {

    private _canvasElement: HTMLCanvasElement;
    private _canvasCtx: CanvasRenderingContext2D;
    private _image: HTMLImageElement;

    constructor(canvasId: string) {
        this._canvasElement = document.getElementById(canvasId) as HTMLCanvasElement;
        this._canvasCtx = this._canvasElement.getContext('2d');
    }

    get height(): number {
        return this._canvasElement.height;
    }

    public adjustOpacity(value: number): void {
        const percentage: number = 1 - value / 100;
        this._canvasElement.style.opacity = percentage.toString();
    }

    public clearCanvas(): void {
        this._canvasCtx.clearRect(0, 0, this._canvasElement.width, this._canvasElement.height);
    }

    public clearPartOfCanvas(xOffset: number, yOffset: number, width: number, height: number): void {
        this._canvasCtx.clearRect(xOffset, yOffset, width, height);
    }

    public setImageInCanvas(image: HTMLImageElement): void {
        this._image = image;
        this.drawImageToCanvas();
    }

    public resetImage(): void {
        this._image = null;
        this.clearCanvas();
    }

    public redrawImageToCanvas(): void {
        this.drawImageToCanvas();
    }

    private drawImageToCanvas(): void {
        if (this._image) {
            console.log('image.width x height:    ' + this._image.width + ' x ' + this._image.height);
            this._canvasCtx.drawImage(this._image, 0, 0, this._image.width, this._image.height,
                0, 0, this._canvasElement.clientWidth, this._canvasElement.clientHeight);
        }
    }

    updateCanvasWhenWindowSizeChanges(): void {
        this._canvasElement.width = window.innerWidth - 32;
        this._canvasElement.height = window.innerHeight - 32;
    }

    drawLine(p1: Coordinate, p2: Coordinate, width: number, lineColor: string): void {
        this._canvasCtx.strokeStyle = 'rgba(' + lineColor + ',1)';
        this._canvasCtx.beginPath();
        this._canvasCtx.lineWidth = width;
        this._canvasCtx.lineCap = 'round';
        this._canvasCtx.moveTo(p1.x, p1.y);
        this._canvasCtx.lineTo(p2.x, p2.y);
        this._canvasCtx.stroke();
    }

    drawDashedLine(p1: Coordinate, p2: Coordinate, width: number, lineColor: string, pattern: number[]): void {
        this._canvasCtx.strokeStyle = 'rgba(' + lineColor + ',1)';
        this._canvasCtx.beginPath();
        this._canvasCtx.setLineDash(pattern);
        this._canvasCtx.lineWidth = width;
        this._canvasCtx.moveTo(p1.x, p1.y);
        this._canvasCtx.lineTo(p2.x, p2.y);
        this._canvasCtx.stroke();
        this._canvasCtx.setLineDash([]);
    }

    drawDot(dot2paint: Coordinate, diam: number, rgbIn: string): void {
        this._canvasCtx.fillStyle = 'rgba(' + rgbIn + ',1)';
        this._canvasCtx.beginPath();
        this._canvasCtx.arc(dot2paint.x, dot2paint.y, diam, 0, Math.PI * 2, true);
        this._canvasCtx.closePath();
        this._canvasCtx.fill();
    }

    drawHollowDot(dot2paint: Coordinate, outerColor: string): void {
        this.drawDot(dot2paint, 4, outerColor);
        this.drawDot(dot2paint, 2, '255,255,255');
    }

    fillPolygon(vertices: Coordinate[], color: string): void {
        this._canvasCtx.fillStyle = 'rgba(' + color + ',0.1)';
        this._canvasCtx.beginPath();
        const startPoint: Coordinate = vertices.shift();
        this._canvasCtx.moveTo(startPoint.x, startPoint.y);
        for (const point of vertices) {
            this._canvasCtx.lineTo(point.x, point.y);
        }
        this._canvasCtx.closePath();
        this._canvasCtx.fill();
    }
}