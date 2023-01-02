import { Coordinate } from '../../model/meassuringshape/shape/Coordinate';
import { CanvasWrapper } from './CanvasWrapper';
import { ImageFocusPoint } from './ImageFocusPoint';
import { ScaleFactorAndOffset } from './ScaleFactorAndOffset';

export class ImageCanvasWrapper extends CanvasWrapper {

    private _image: HTMLImageElement;
    private _imageFocusPoint: ImageFocusPoint;

    private thereIsNoImage(): boolean {
        return !this._image;
    }

    private get stepsize(): number {
        return this._image.width * 0.1 / CanvasWrapper.scaleAndOffset.scaleFactor;
    }

    //overriding super class method
    adaptCanvasToWindowResize(): void {
        super.adaptCanvasToWindowResize();
        CanvasWrapper.scaleAndOffset.canvasHasBeenResized();
        if (this._image) {
            this.calculateImageOffsetToAlignImageFocusPointWith(this.canvasCenter);
            this.drawImageToCanvas();
        }
    }

    public setImageInCanvas(image: HTMLImageElement): void {
        this._image = image;
        this._imageFocusPoint = new ImageFocusPoint(image);
        CanvasWrapper.scaleAndOffset = new ScaleFactorAndOffset(image, this);
        if (this.imageIsNarrowerThanCanvas() && this.imageIsShorterThanCanvas()) {
            this.zoomActualSize();
            return;
        }
        this.zoomToFit();
    }

    private imageIsNarrowerThanCanvas(): boolean {
        return this.width > this._image.width;
    }

    private imageIsShorterThanCanvas(): boolean {
        return this.height > this._image.height;
    }

    public resetImage(): void {
        this._image = null;
        this._imageFocusPoint = null;
        CanvasWrapper.scaleAndOffset = new ScaleFactorAndOffset();
        this.clearCanvas();
    }

    private drawImageToCanvas(): void {
        this.clearCanvas();
        if (this.thereIsNoImage()) {
            return;
        }
        this._canvasCtx.drawImage(
            this._image,
            0,
            0,
            this._image.width,
            this._image.height,
            CanvasWrapper.scaleAndOffset.xOffset,
            CanvasWrapper.scaleAndOffset.yOffset,
            this.toCanvasScale(this._image.width),
            this.toCanvasScale(this._image.height)
        );

    }

    private moveFocusPointToTheRight(): void { this._imageFocusPoint.moveHorizontally(this.stepsize); };
    private moveFocusPointToTheLeft(): void { this._imageFocusPoint.moveHorizontally(-this.stepsize); };
    private moveFocusPointUpwards(): void { this._imageFocusPoint.moveVertically(-this.stepsize); };
    private moveFocusPointDownwards(): void { this._imageFocusPoint.moveVertically(this.stepsize); };
    private oneToOneScale(): void { CanvasWrapper.scaleAndOffset.oneToOneScale(); }
    private increaseScaleFactor(): void { CanvasWrapper.scaleAndOffset.increaseScaleFactor(); }
    private decreaseScaleFactor(): void { CanvasWrapper.scaleAndOffset.decreaseScaleFactor(); }
    private adjustScaleForImageToFit(): void { CanvasWrapper.scaleAndOffset.toFitScaleFactor(); }

    panRight(): void { this.calculateOffsetAndRedrawImageAfter(() => this.moveFocusPointToTheRight()); }
    panLeft(): void { this.calculateOffsetAndRedrawImageAfter(() => this.moveFocusPointToTheLeft()); }
    panUp(): void { this.calculateOffsetAndRedrawImageAfter(() => this.moveFocusPointUpwards()); }
    panDown(): void { this.calculateOffsetAndRedrawImageAfter(() => this.moveFocusPointDownwards()); }


    zoomIn(mousePositionOnCanvas?: Coordinate): void {
        this.adjustFocusCalculateOffsetAndRedrawImageAfter(() => this.increaseScaleFactor(), mousePositionOnCanvas);
    }
    zoomOut(mousePositionOnCanvas?: Coordinate): void {
        this.adjustFocusCalculateOffsetAndRedrawImageAfter(() => this.decreaseScaleFactor(), mousePositionOnCanvas);
    }

    zoomActualSize(): void { this.centerImageFocusCalculateOffsetAndRedrawImageAfter(() => this.oneToOneScale()); }
    zoomToFit(): void {
        this.centerImageFocusCalculateOffsetAndRedrawImageAfter(() => this.adjustScaleForImageToFit());
    }


    private adjustFocusCalculateOffsetAndRedrawImageAfter(
        panOrZoomAction: any,
        mouseCanvasPosition?: Coordinate
    ): void {
        if (this.thereIsNoImage()) {
            return;
        }
        let canvasFocusPosition: Coordinate = this.canvasCenter;

        if (mouseCanvasPosition) {
            canvasFocusPosition = mouseCanvasPosition;
        }

        const imageFocusPosition: Coordinate = this.canvasToImage(canvasFocusPosition);
        panOrZoomAction();
        this._imageFocusPoint.moveFocusPointHere(imageFocusPosition);
        this.calculateImageOffsetToAlignImageFocusPointWith(canvasFocusPosition);
        this.drawImageToCanvas();
    }

    private centerImageFocusCalculateOffsetAndRedrawImageAfter(
        panOrZoomAction: any
    ): void {
        if (this.thereIsNoImage()) {
            return;
        }
        panOrZoomAction();
        this._imageFocusPoint.focusCenterOfImage();
        this.calculateImageOffsetToAlignImageFocusPointWith(this.canvasCenter);
        this.drawImageToCanvas();
    }

    private calculateOffsetAndRedrawImageAfter(
        panOrZoomAction: any
    ): void {
        if (this.thereIsNoImage()) {
            return;
        }
        panOrZoomAction();
        this.calculateImageOffsetToAlignImageFocusPointWith(this.canvasCenter);
        this.drawImageToCanvas();
    }


    private calculateImageOffsetToAlignImageFocusPointWith(pointOnCanvas: Coordinate): void {
        const scaledImageWidthLeftOfFocusPoint: number = this.toCanvasScale(this._imageFocusPoint.x);
        const scaledImageHeightAboveFocusPoint: number = this.toCanvasScale(this._imageFocusPoint.y);

        CanvasWrapper.scaleAndOffset.xOffset = pointOnCanvas.x - scaledImageWidthLeftOfFocusPoint;
        CanvasWrapper.scaleAndOffset.yOffset = pointOnCanvas.y - scaledImageHeightAboveFocusPoint;
    }

}