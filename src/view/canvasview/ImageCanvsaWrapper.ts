import { CanvasWrapper } from './CanvasWrapper';

export class ImageCanvasWrapper extends CanvasWrapper {

    private _image: HTMLImageElement;

    public setImageInCanvas(image: HTMLImageElement): void {
        this._image = image;
        this.zoomToFit();
    }

    public resetImage(): void {
        this._image = null;
        this.resetScaleAndOffsets();
        this.clearCanvas();
    }

    private resetScaleAndOffsets(): void {
        CanvasWrapper._scaleFactor = 1;
        CanvasWrapper._xOffset = 0;
        CanvasWrapper._yOffset = 0;
    }

    private thereIsNoImage(): boolean {
        return !this._image;
    }

    private drawImageToCanvas(): void {
        this.clearCanvas();
        if (this.thereIsNoImage()) {
            return;
        }
        console.log('image.width x height:    ' + this._image.width + ' x ' + this._image.height);
        this._canvasCtx.drawImage(
            this._image,
            0,
            0,
            this._image.width,
            this._image.height,
            CanvasWrapper._xOffset,
            CanvasWrapper._yOffset,
            this._image.width * CanvasWrapper._scaleFactor,
            this._image.height * CanvasWrapper._scaleFactor
        );

    }

    //overriding super class method
    adaptCanvasToWindowResize(): void {
        super.adaptCanvasToWindowResize();
        this.recalculateAndSetOffsets();
        this.drawImageToCanvas();
    }

    zoomToFit(): void {
        this.adjustScalefactorForImageToFit();
        this.recalculateAndSetOffsets();
        this.drawImageToCanvas();
    }

    zoomActualSize(): void {
        this.setScalefactorToOne();
        this.recalculateAndSetOffsets();
        this.drawImageToCanvas();
    }

    zoomIn(): void {
        this.increaseScalefactorTwofold();
        this.recalculateAndSetOffsets();
        this.drawImageToCanvas();
    }

    zoomOut(): void {
        this.decreaseScalefactorByHalf();
        this.recalculateAndSetOffsets();
        this.drawImageToCanvas();
    }


    private adjustScalefactorForImageToFit(): void {
        if (this.thereIsNoImage()) {
            this.resetScaleAndOffsets();
            return;
        }

        if (this.theImageIsWiderThanTheCanvas()) {
            CanvasWrapper._scaleFactor = this.width / this._image.width;
        } else {
            CanvasWrapper._scaleFactor = this.height / this._image.height;
        }
    }

    private theImageIsWiderThanTheCanvas(): boolean {
        const imageRatio: number = this._image.width / this._image.height;
        const canvasRatio: number = this.width / this.height;
        return imageRatio > canvasRatio;
    }

    private setScalefactorToOne(): void {
        CanvasWrapper._scaleFactor = 1;
    }

    private increaseScalefactorTwofold(): void {
        if (CanvasWrapper._scaleFactor < 4) {
            CanvasWrapper._scaleFactor *= 2;
        }
    }

    private decreaseScalefactorByHalf(): void {
        if (CanvasWrapper._scaleFactor > 0.25) {
            CanvasWrapper._scaleFactor /= 2;
        }
    }

    private recalculateAndSetOffsets(): void {
        if (this.thereIsNoImage()) {
            this.resetScaleAndOffsets();
            return;
        }
        const scaledImageWidth: number = CanvasWrapper._scaleFactor * this._image.width;
        const scaledImageHeight: number = CanvasWrapper._scaleFactor * this._image.height;
        CanvasWrapper._xOffset = (this.width - scaledImageWidth) / 2;
        CanvasWrapper._yOffset = (this.height - scaledImageHeight) / 2;
    }

}