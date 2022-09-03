import { Coordinate } from '../../model/shape/Coordinate';
import { ScaleFactorAndOffset } from './ScaleFactorAndOffset';

export class CanvasWrapper {

    protected _canvasElement: HTMLCanvasElement;
    protected _canvasCtx: CanvasRenderingContext2D;
    protected static scaleAndOffset: ScaleFactorAndOffset = new ScaleFactorAndOffset();

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
        return CanvasWrapper.scaleAndOffset.canvasToImage(canvasCoordinate);
    }

    imageToCanvas(imageCoordinate: Coordinate): Coordinate {
        return CanvasWrapper.scaleAndOffset.imageToCanvas(imageCoordinate);
    }

    protected toImageScale(canvasLength: number): number {
        return CanvasWrapper.scaleAndOffset.toImageScale(canvasLength);
    }

    protected toCanvasScale(imageLength: number): number {
        return CanvasWrapper.scaleAndOffset.toCanvasScale(imageLength);
    }


    adaptCanvasToWindowResize(): void {
        this._canvasElement.width = window.innerWidth - 32;
        this._canvasElement.height = window.innerHeight - 32;
    }


}