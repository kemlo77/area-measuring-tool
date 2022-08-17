import { Coordinate } from '../../model/shape/Coordinate';

export class CanvasWrapper {

    private _canvasElement: HTMLCanvasElement;
    private _canvasCtx: CanvasRenderingContext2D;
    private _image: HTMLImageElement;

    private static scaleFactor: number;
    private static xOffset: number;
    private static yOffset: number;

    constructor(canvasId: string) {
        this._canvasElement = document.getElementById(canvasId) as HTMLCanvasElement;
        this._canvasCtx = this._canvasElement.getContext('2d');
    }

    get height(): number {
        return this._canvasElement.height;
    }

    get width(): number {
        return this._canvasElement.width;
    }

    public adjustOpacity(value: number): void {
        const percentage: number = 1 - value / 100;
        this._canvasElement.style.opacity = percentage.toString();
    }

    public clearCanvas(): void {
        this._canvasCtx.clearRect(0, 0, this._canvasElement.width, this._canvasElement.height);
    }

    public clearPartOfCanvas(upperLeft: Coordinate, lowerRight: Coordinate): void {
        const p1: Coordinate = this.imageCoordinateToCanvasCoordinate(upperLeft);
        const p2: Coordinate = this.imageCoordinateToCanvasCoordinate(lowerRight);
        const width: number = p2.x - p1.x;
        const height: number = p2.y - p1.y;
        this._canvasCtx.clearRect(p1.x - 10, p1.y - 10, width + 20, height + 20);
    }

    public setImageInCanvas(image: HTMLImageElement): void {
        this._image = image;
        this.zoomExtents();
    }

    recalculateOffsets(): void {
        if (!this._image) {
            this.resetScaleAndOffsets();
            return;
        }
        this.calculateOffset();

    }

    private resetScaleAndOffsets(): void {
        CanvasWrapper.scaleFactor = 1;
        CanvasWrapper.xOffset = 0;
        CanvasWrapper.yOffset = 0;
    }

    zoomExtents(): void {
        CanvasWrapper.scaleFactor = this.calculateScaleForZoomToFit();
        this.calculateOffset();
        this.drawImageToCanvas();
        console.log('scale factor: ' + CanvasWrapper.scaleFactor);
    }

    zoomActualSize(): void {
        CanvasWrapper.scaleFactor = 1;
        this.calculateOffset();
        this.drawImageToCanvas();
        console.log('scale factor: ' + CanvasWrapper.scaleFactor);
    }

    zoomIn(): void {
        CanvasWrapper.scaleFactor = CanvasWrapper.scaleFactor * 2;
        this.calculateOffset();
        this.drawImageToCanvas();
        console.log('scale factor: ' + CanvasWrapper.scaleFactor);
    }

    zoomOut(): void {
        CanvasWrapper.scaleFactor = CanvasWrapper.scaleFactor / 2;
        this.calculateOffset();
        this.drawImageToCanvas();
        console.log('scale factor: ' + CanvasWrapper.scaleFactor);
    }

    canvasCoordinateToImageCoordinate(canvasCoordinate: Coordinate): Coordinate {
        const xPart: number = (canvasCoordinate.x - CanvasWrapper.xOffset) / CanvasWrapper.scaleFactor;
        const yPart: number = (canvasCoordinate.y - CanvasWrapper.yOffset) / CanvasWrapper.scaleFactor;
        return { x: xPart, y: yPart };
    }

    imageCoordinateToCanvasCoordinate(imageCoordinate: Coordinate): Coordinate {
        const xPart: number = (imageCoordinate.x * CanvasWrapper.scaleFactor) + CanvasWrapper.xOffset;
        const yPart: number = (imageCoordinate.y * CanvasWrapper.scaleFactor) + CanvasWrapper.yOffset;
        return { x: xPart, y: yPart };
    }


    private calculateOffset(): void {
        if (!this._image) {
            CanvasWrapper.xOffset = 0;
            CanvasWrapper.yOffset = 0;
            return;
        }
        CanvasWrapper.xOffset =
            - 0.5 * (CanvasWrapper.scaleFactor * this._image.width - this._canvasElement.clientWidth);
        CanvasWrapper.yOffset =
            - 0.5 * (CanvasWrapper.scaleFactor * this._image.height - this._canvasElement.clientHeight);
    }

    private calculateScaleForZoomToFit(): number {
        if (!this._image) {
            return 1;
        }
        if (this.theImageIsWiderThanTheCanvas()) {
            return this._canvasElement.clientWidth / this._image.width;
        } else {
            return this._canvasElement.clientHeight / this._image.height;
        }
    }

    zoomToFitWidthOrHeightScale(): void {
        if (this.theImageIsWiderThanTheCanvas()) {
            CanvasWrapper.scaleFactor = this._canvasElement.clientHeight / this._image.height;
        } else {
            CanvasWrapper.scaleFactor = this._canvasElement.clientWidth / this._image.width;
        }
    }

    private theImageIsWiderThanTheCanvas(): boolean {
        const imageRatio: number = this._image.width / this._image.height;
        const canvasRatio: number = this._canvasElement.clientWidth / this._canvasElement.clientHeight;
        return imageRatio > canvasRatio;
    }


    public resetImage(): void {
        this._image = null;
        this.resetScaleAndOffsets();
        this.clearCanvas();
    }

    public redrawImageToCanvas(): void {
        this.drawImageToCanvas();
    }

    private drawImageToCanvas(): void {
        this.clearCanvas();
        if (this._image) {
            console.log('image.width x height:    ' + this._image.width + ' x ' + this._image.height);
            this._canvasCtx.drawImage(
                this._image,
                0,
                0,
                this._image.width,
                this._image.height,
                CanvasWrapper.xOffset,
                CanvasWrapper.yOffset,
                this._image.width * CanvasWrapper.scaleFactor,
                this._image.height * CanvasWrapper.scaleFactor
            );
        }
    }

    adaptCanvasSizeToWindowSize(): void {
        this._canvasElement.width = window.innerWidth - 32;
        this._canvasElement.height = window.innerHeight - 32;
    }

    drawLine(p1: Coordinate, p2: Coordinate, width: number, lineColor: string): void {
        const convertedP1: Coordinate = this.imageCoordinateToCanvasCoordinate(p1);
        const convertedP2: Coordinate = this.imageCoordinateToCanvasCoordinate(p2);
        this._canvasCtx.strokeStyle = 'rgba(' + lineColor + ',1)';
        this._canvasCtx.beginPath();
        this._canvasCtx.lineWidth = width;
        this._canvasCtx.lineCap = 'round';
        this._canvasCtx.moveTo(convertedP1.x, convertedP1.y);
        this._canvasCtx.lineTo(convertedP2.x, convertedP2.y);
        this._canvasCtx.stroke();
    }

    drawDashedLine(p1: Coordinate, p2: Coordinate, width: number, lineColor: string, pattern: number[]): void {
        const convertedP1: Coordinate = this.imageCoordinateToCanvasCoordinate(p1);
        const convertedP2: Coordinate = this.imageCoordinateToCanvasCoordinate(p2);
        this._canvasCtx.strokeStyle = 'rgba(' + lineColor + ',1)';
        this._canvasCtx.beginPath();
        this._canvasCtx.setLineDash(pattern);
        this._canvasCtx.lineWidth = width;
        this._canvasCtx.lineCap = 'butt';
        this._canvasCtx.moveTo(convertedP1.x, convertedP1.y);
        this._canvasCtx.lineTo(convertedP2.x, convertedP2.y);
        this._canvasCtx.stroke();
        this._canvasCtx.setLineDash([]);
    }

    drawDot(dot2paint: Coordinate, diam: number, rgbIn: string): void {
        const convertedDot: Coordinate = this.imageCoordinateToCanvasCoordinate(dot2paint);
        this._canvasCtx.fillStyle = 'rgba(' + rgbIn + ',1)';
        this._canvasCtx.beginPath();
        this._canvasCtx.arc(convertedDot.x, convertedDot.y, diam, 0, Math.PI * 2, true);
        this._canvasCtx.closePath();
        this._canvasCtx.fill();
    }

    drawHollowDot(dot2paint: Coordinate, outerColor: string): void {
        this.drawDot(dot2paint, 4, outerColor);
        this.drawDot(dot2paint, 2, '255,255,255');
    }

    fillPolygon(vertices: Coordinate[], color: string): void {
        const convertedVertices: Coordinate[] = vertices.map(v => this.imageCoordinateToCanvasCoordinate(v));
        this._canvasCtx.fillStyle = 'rgba(' + color + ',0.1)';
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