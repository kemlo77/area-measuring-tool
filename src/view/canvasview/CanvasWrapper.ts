import { Coordinate } from '../../model/shape/Coordinate';

export class CanvasWrapper {

    protected _canvasElement: HTMLCanvasElement;
    protected _canvasCtx: CanvasRenderingContext2D;
    protected static _scaleFactor: number;
    protected static _xOffset: number;
    protected static _yOffset: number;


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

    canvasToImage(canvasCoordinate: Coordinate): Coordinate {
        const xPart: number = (canvasCoordinate.x - CanvasWrapper._xOffset) / CanvasWrapper._scaleFactor;
        const yPart: number = (canvasCoordinate.y - CanvasWrapper._yOffset) / CanvasWrapper._scaleFactor;
        return { x: xPart, y: yPart };
    }

    imageToCanvas(imageCoordinate: Coordinate): Coordinate {
        const xPart: number = (imageCoordinate.x * CanvasWrapper._scaleFactor) + CanvasWrapper._xOffset;
        const yPart: number = (imageCoordinate.y * CanvasWrapper._scaleFactor) + CanvasWrapper._yOffset;
        return { x: xPart, y: yPart };
    }


    adaptCanvasToWindowResize(): void {
        this._canvasElement.width = window.innerWidth - 32;
        this._canvasElement.height = window.innerHeight - 32;
    }


}