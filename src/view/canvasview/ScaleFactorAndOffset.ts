import { Coordinate } from '../../model/shape/Coordinate';
import { ImageCanvasWrapper } from './ImageCanvasWrapper';

export class ScaleFactorAndOffset {

    private _scaleFactor: number = 1;
    private _xOffset: number = 0;
    private _yOffset: number = 0;
    private _zoomToFitScaleFactor: number;
    private _image: HTMLImageElement;
    private _canvas: ImageCanvasWrapper;

    constructor(image?: HTMLImageElement, canvas?: ImageCanvasWrapper) {
        this._image = image;
        this._canvas = canvas;
        this.calculateZoomToFitScaleFactor();
    }

    private calculateZoomToFitScaleFactor(): void {
        if (this.thereIsNoImageOrCanvas()) {
            this._zoomToFitScaleFactor = 1;
            return;
        }

        if (this.theImageIsProportionallyWiderThanTheCanvas()) {
            this._zoomToFitScaleFactor = this._canvas.width / this._image.width;
            return;
        }

        this._zoomToFitScaleFactor = this._canvas.height / this._image.height;
    }

    private thereIsNoImageOrCanvas(): boolean {
        return !(this._image && this._canvas);
    }

    private theImageIsProportionallyWiderThanTheCanvas(): boolean {
        const imageRatio: number = this._image.width / this._image.height;
        const canvasRatio: number = this._canvas.width / this._canvas.height;
        return imageRatio > canvasRatio;
    }

    canvasHasBeenResized(): void {
        this.calculateZoomToFitScaleFactor();
    }


    get xOffset(): number {
        return this._xOffset;
    }

    set xOffset(length: number) {
        this._xOffset = length;
    }

    get yOffset(): number {
        return this._yOffset;
    }

    set yOffset(height: number) {
        this._yOffset = height;
    }

    get scaleFactor(): number {
        return this._scaleFactor;
    }

    oneToOneScale(): void {
        this._scaleFactor = 1;
    }

    doubleScaleFactor(): void {
        this._scaleFactor *= 2;
        if (this._scaleFactor > 4) {
            this._scaleFactor = 4;
        }
    }

    halfScaleFactor(): void {
        this._scaleFactor /= 2;
        if (this._scaleFactor < 0.25) {
            this._scaleFactor = 0.25;
        }
    }

    toFitScaleFactor(): void {
        this._scaleFactor = this._zoomToFitScaleFactor;
    }

    canvasToImage(canvasCoordinate: Coordinate): Coordinate {
        const xPart: number = (canvasCoordinate.x - this._xOffset) / this._scaleFactor;
        const yPart: number = (canvasCoordinate.y - this._yOffset) / this._scaleFactor;
        return { x: xPart, y: yPart };
    }

    imageToCanvas(imageCoordinate: Coordinate): Coordinate {
        const xPart: number = (imageCoordinate.x * this._scaleFactor) + this._xOffset;
        const yPart: number = (imageCoordinate.y * this._scaleFactor) + this._yOffset;
        return { x: xPart, y: yPart };
    }

    toImageScale(canvasLength: number): number {
        return canvasLength / this._scaleFactor;
    }

    toCanvasScale(imageLength: number): number {
        return imageLength * this._scaleFactor;
    }

}