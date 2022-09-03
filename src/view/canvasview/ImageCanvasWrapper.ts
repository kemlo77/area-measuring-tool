import { Coordinate } from '../../model/shape/Coordinate';
import { CanvasWrapper } from './CanvasWrapper';
import { ImageFocusPoint } from './ImageFocusPoint';

export class ImageCanvasWrapper extends CanvasWrapper {

    private _image: HTMLImageElement;
    private _imageFocusPoint: ImageFocusPoint;

    private thereIsNoImage(): boolean {
        return !this._image;
    }

    private get stepsize(): number {
        return this._image.width * 0.1;
    }

    //overriding super class method
    adaptCanvasToWindowResize(): void {
        super.adaptCanvasToWindowResize();
        this.adjustFocusPointAndRecalculateOffsets();
        this.drawImageToCanvas();
    }

    public setImageInCanvas(image: HTMLImageElement): void {
        this._image = image;
        this._imageFocusPoint = new ImageFocusPoint(image);
        this.zoomToFit();
    }

    public resetImage(): void {
        this._image = null;
        this._imageFocusPoint = null;
        CanvasWrapper.scaleAndOffset.resetScaleAndOffsets();
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
    private doubleScaleFactor(): void { CanvasWrapper.scaleAndOffset.doubleScaleFactor(); }
    private halfScaleFactor(): void { CanvasWrapper.scaleAndOffset.halfScaleFactor() }

    panRight(): void { this.adjustFocusCalculateOffsetAndRedrawImageAfter(() => this.moveFocusPointToTheRight()); }
    panLeft(): void { this.adjustFocusCalculateOffsetAndRedrawImageAfter(() => this.moveFocusPointToTheLeft()); }
    panUp(): void { this.adjustFocusCalculateOffsetAndRedrawImageAfter(() => this.moveFocusPointUpwards()); }
    panDown(): void { this.adjustFocusCalculateOffsetAndRedrawImageAfter(() => this.moveFocusPointDownwards()); }
    zoomActualSize(): void { this.adjustFocusCalculateOffsetAndRedrawImageAfter(() => this.oneToOneScale()); }
    zoomIn(): void { this.adjustFocusCalculateOffsetAndRedrawImageAfter(() => this.doubleScaleFactor()); }
    zoomOut(): void { this.adjustFocusCalculateOffsetAndRedrawImageAfter(() => this.halfScaleFactor()); }
    zoomToFit(): void {
        this.adjustFocusCalculateOffsetAndRedrawImageAfter(
            () => {
                this.adjustScalefactorForImageToFit();
                this._imageFocusPoint.focusCenterOfImage();
            }
        );
    }

    private adjustScalefactorForImageToFit(): void {
        if (this.theImageIsProportionallyWiderThanTheCanvas()) {
            CanvasWrapper.scaleAndOffset.calculateNewScaleFactor(this.width,this._image.width);
        } else {
            CanvasWrapper.scaleAndOffset.calculateNewScaleFactor(this.height,this._image.height);
        }
    }

    private theImageIsProportionallyWiderThanTheCanvas(): boolean {
        const imageRatio: number = this._image.width / this._image.height;
        const canvasRatio: number = this.width / this.height;
        return imageRatio > canvasRatio;
    }

    private adjustFocusCalculateOffsetAndRedrawImageAfter(panOrZoomAction: any): void {
        if (this.thereIsNoImage()) {
            return;
        }
        panOrZoomAction();
        this.adjustFocusPointAndRecalculateOffsets();
        this.drawImageToCanvas();
    }



    private adjustFocusPointAndRecalculateOffsets(desiredNewImageFocusPoint?: Coordinate): void {
        if (this.thereIsNoImage()) {
            CanvasWrapper.scaleAndOffset.resetScaleAndOffsets();
            return;
        }

        this._imageFocusPoint.ifValidMoveFocusPointHere(desiredNewImageFocusPoint);

        this.adjustFocuspointHorizontally();
        this.adjustFocuspointVertically();

        this.calculateAndSetOffsets();
    }



    private calculateAndSetOffsets(): void {
        const scaledImageWidthLeftOfFocusPoint: number = this.toCanvasScale(this._imageFocusPoint.x);
        const scaledImageHeightAboveFocusPoint: number = this.toCanvasScale(this._imageFocusPoint.y);
        const canvasWidthLeftOfCenter: number = this.width / 2;
        const canvasHeightAboveCenter: number = this.height / 2;
        CanvasWrapper.scaleAndOffset.xOffset = canvasWidthLeftOfCenter - scaledImageWidthLeftOfFocusPoint;
        CanvasWrapper.scaleAndOffset.yOffset = canvasHeightAboveCenter - scaledImageHeightAboveFocusPoint;
    }

    private adjustFocuspointHorizontally(): void {
        if (this.scaledImageIsNarrowerThanCanvas()) {
            this._imageFocusPoint.centerHorizontally();
            return;
        }

        if (this.distanceBetweenImageAndRightEdge() > 0) {
            const adjustmentNeeded: number = this.toImageScale(this.distanceBetweenImageAndRightEdge());
            this._imageFocusPoint.moveHorizontally(- adjustmentNeeded);
            return;
        }

        if (this.distanceBetweenImageAndLeftEdge() > 0) {
            const adjustmentNeeded: number = this.toImageScale(this.distanceBetweenImageAndLeftEdge());
            this._imageFocusPoint.moveHorizontally(adjustmentNeeded);
            return;
        }
    }

    private scaledImageIsNarrowerThanCanvas(): boolean {
        const scaledImageWidth: number = this.toCanvasScale(this._image.width);
        return scaledImageWidth <= this.width;
    }

    private distanceBetweenImageAndRightEdge(): number {
        const imageWidthRightOfFocusPoint: number = this._image.width - this._imageFocusPoint.x;
        const scaledRightDistance: number =this.toCanvasScale(imageWidthRightOfFocusPoint);
        return this.width / 2 - scaledRightDistance;
    }

    private distanceBetweenImageAndLeftEdge(): number {
        const imageWidthLeftOfFocusPoint: number = this._imageFocusPoint.x;
        const scaledLeftDistance: number = this.toCanvasScale(imageWidthLeftOfFocusPoint);
        return this.width / 2 - scaledLeftDistance;
    }

    private adjustFocuspointVertically(): void {
        if (this.scaledImageIsShorterThanCanvas()) {
            this._imageFocusPoint.centerVertically();
            return;
        }

        if (this.distanceBetweenImageAndBottomEdge() > 0) {
            const adjustmentNeeded: number = this.toImageScale(this.distanceBetweenImageAndBottomEdge());
            this._imageFocusPoint.moveVertically(- adjustmentNeeded);
            return;
        }

        if (this.distanceBetweenImageAndTopEdge() > 0) {
            const adjustmentNeeded: number = this.toImageScale(this.distanceBetweenImageAndTopEdge());
            this._imageFocusPoint.moveVertically(adjustmentNeeded);
            return;
        }
    }

    private scaledImageIsShorterThanCanvas(): boolean {
        const scaledImageHeight: number = this.toCanvasScale(this._image.height);
        return scaledImageHeight <= this.height;
    }

    private distanceBetweenImageAndTopEdge(): number {
        const imageHeightAboveFocusPoint: number = this._imageFocusPoint.y;
        const scaledUpperDistance: number = this.toCanvasScale(imageHeightAboveFocusPoint);
        return this.height / 2 - scaledUpperDistance;
    }

    private distanceBetweenImageAndBottomEdge(): number {
        const imageHeightBelowFocusPoint: number = this._image.height - this._imageFocusPoint.y;
        const scaledLowerDistance: number = this.toCanvasScale(imageHeightBelowFocusPoint);
        return this.height / 2 - scaledLowerDistance;
    }

}