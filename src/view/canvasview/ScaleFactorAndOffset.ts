import { Coordinate } from '../../model/shape/Coordinate';

export class ScaleFactorAndOffset {

    private _scaleFactor: number = 1;
    private _xOffset: number = 0;
    private _yOffset: number = 0;

    calculateNewScaleFactor(canvasDist: number, imageDist: number): void {
        this._scaleFactor = canvasDist / imageDist;
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

    oneToOneScale(): void {
        this._scaleFactor = 1;
    }

    doubleScaleFactor(): void {
        if (this._scaleFactor < 4) {
            this._scaleFactor *= 2;
        }
        //TODO: om man försöker minska över, sätt till 4
    }

    halfScaleFactor(): void {
        if (this._scaleFactor > 0.25) {
            this._scaleFactor /= 2;
        }
        //TODO: om man försöker minska under 1/4, sätt till 1/4
    }

    resetScaleAndOffsets(): void {
        this._scaleFactor = 1;
        this._xOffset = 0;
        this._yOffset = 0;
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