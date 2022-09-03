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
        this.resetScaleAndOffsets();
        this.clearCanvas();
    }

    private resetScaleAndOffsets(): void {
        CanvasWrapper._scaleFactor = 1;
        CanvasWrapper._xOffset = 0;
        CanvasWrapper._yOffset = 0;
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
            CanvasWrapper._xOffset,
            CanvasWrapper._yOffset,
            this._image.width * CanvasWrapper._scaleFactor,
            this._image.height * CanvasWrapper._scaleFactor
        );

    }

    private moveFocusPointToTheRight(): void { this._imageFocusPoint.moveCurrentFocusHorizontally(this.stepsize); };
    private moveFocusPointToTheLeft(): void { this._imageFocusPoint.moveCurrentFocusHorizontally(-this.stepsize); };
    private moveFocusPointUpwards(): void { this._imageFocusPoint.moveCurrentFocusVertically(-this.stepsize); };
    private moveFocusPointDownwards(): void { this._imageFocusPoint.moveCurrentFocusVertically(this.stepsize); };

    panRight(): void { this.adjustFocusCalculateOffsetAndRedrawImageAfter(() => this.moveFocusPointToTheRight()); }
    panLeft(): void { this.adjustFocusCalculateOffsetAndRedrawImageAfter(() => this.moveFocusPointToTheLeft()); }
    panUp(): void { this.adjustFocusCalculateOffsetAndRedrawImageAfter(() => this.moveFocusPointUpwards()); }
    panDown(): void { this.adjustFocusCalculateOffsetAndRedrawImageAfter(() => this.moveFocusPointDownwards()); }
    zoomActualSize(): void { this.adjustFocusCalculateOffsetAndRedrawImageAfter(() => this.setScalefactorToOne()); }
    zoomIn(): void { this.adjustFocusCalculateOffsetAndRedrawImageAfter(() => this.increaseScalefactorTwofold()); }
    zoomOut(): void { this.adjustFocusCalculateOffsetAndRedrawImageAfter(() => this.decreaseScalefactorByHalf()); }
    zoomToFit(): void {
        this.adjustFocusCalculateOffsetAndRedrawImageAfter(
            () => {
                this.adjustScalefactorForImageToFit();
                this._imageFocusPoint.focusCenterOfImage();
            }
        );

    }

    private adjustScalefactorForImageToFit(): void {
        if (this.thereIsNoImage()) {
            this.resetScaleAndOffsets();
            return;
        }

        if (this.theImageIsProportionallyWiderThanTheCanvas()) {
            CanvasWrapper._scaleFactor = this.width / this._image.width;
        } else {
            CanvasWrapper._scaleFactor = this.height / this._image.height;
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

    private setScalefactorToOne(): void {
        CanvasWrapper._scaleFactor = 1;
    }

    private increaseScalefactorTwofold(): void {
        if (CanvasWrapper._scaleFactor < 4) {
            CanvasWrapper._scaleFactor *= 2;
        }
        //TODO: om man försöker minska över, sätt till 4
    }

    private decreaseScalefactorByHalf(): void {
        if (CanvasWrapper._scaleFactor > 0.25) {
            CanvasWrapper._scaleFactor /= 2;
        }
        //TODO: om man försöker minska under 1/4, sätt till 1/4
    }

    private adjustFocusPointAndRecalculateOffsets(desiredNewImageFocusPoint?: Coordinate): void {
        if (this.thereIsNoImage()) {
            this.resetScaleAndOffsets();
            return;
        }

        this._imageFocusPoint.ifValidMoveFocusPointHere(desiredNewImageFocusPoint);

        this.adjustFocuspointHorizontally();
        this.adjustFocuspointVertically();

        this.calculateAndSetOffsets();
    }



    private calculateAndSetOffsets(): void {
        CanvasWrapper._xOffset = this.width / 2 - this._imageFocusPoint.x * CanvasWrapper._scaleFactor;
        CanvasWrapper._yOffset = this.height / 2 - this._imageFocusPoint.y * CanvasWrapper._scaleFactor;
    }


    private adjustFocuspointHorizontally(): void {
        if (this.scaledImageIsNarrowerThanCanvas()) {
            this._imageFocusPoint.alignHorizontalPartOfFocusToCenterOfImage();
            return;
        }

        if (this.whiteSpaceWidthBetweenImageRightEdgeAndCanvasBorder() > 0) {
            const whiteSpaceWidthInImageScale: number =
                this.whiteSpaceWidthBetweenImageRightEdgeAndCanvasBorder() / CanvasWrapper._scaleFactor;
            this._imageFocusPoint.moveCurrentFocusHorizontally(- whiteSpaceWidthInImageScale);
            return;
        }

        if (this.whiteSpaceWidthBetweenImageLeftEdgeAndCanvasBorder() > 0) {
            const whiteSpaceWidthInImageScale: number =
                this.whiteSpaceWidthBetweenImageLeftEdgeAndCanvasBorder() / CanvasWrapper._scaleFactor;
            this._imageFocusPoint.moveCurrentFocusHorizontally(whiteSpaceWidthInImageScale);
            return;
        }
    }

    private scaledImageIsNarrowerThanCanvas(): boolean {
        const scaledImageWidth: number = this._image.width * CanvasWrapper._scaleFactor;
        return scaledImageWidth <= this.width;
    }

    private whiteSpaceWidthBetweenImageRightEdgeAndCanvasBorder(): number {
        const distanceFromFocusPointToRightEdge: number = this._image.width - this._imageFocusPoint.x;
        const scaledRightDistance: number = distanceFromFocusPointToRightEdge * CanvasWrapper._scaleFactor;
        return this.width / 2 - scaledRightDistance;
    }

    private whiteSpaceWidthBetweenImageLeftEdgeAndCanvasBorder(): number {
        const distanceFromFocusPointToLeftEdge: number = this._imageFocusPoint.x;
        const scaledLeftDistance: number = distanceFromFocusPointToLeftEdge * CanvasWrapper._scaleFactor;
        return this.width / 2 - scaledLeftDistance;
    }



    private adjustFocuspointVertically(): void {
        if (this.scaledImageIsShorterThanCanvas()) {
            this._imageFocusPoint.alignVerticalPartOfFocusToCenterOfImage();
            return;
        }

        if (this.whiteSpaceHeightBetweenImageBottomEdgeAndCanvasBorder() > 0) {
            const whitespaceHeightInImageScale: number =
                this.whiteSpaceHeightBetweenImageBottomEdgeAndCanvasBorder() / CanvasWrapper._scaleFactor;
            this._imageFocusPoint.moveCurrentFocusVertically(- whitespaceHeightInImageScale);
            return;
        }

        if (this.whiteSpaceHeightBetweenImageTopEdgeAndCanvasBorder() > 0) {
            const whitespaceHeightInImageScale: number =
                this.whiteSpaceHeightBetweenImageTopEdgeAndCanvasBorder() / CanvasWrapper._scaleFactor;
            this._imageFocusPoint.moveCurrentFocusVertically(whitespaceHeightInImageScale);
            return;
        }
    }

    private scaledImageIsShorterThanCanvas(): boolean {
        const scaledImageHeight: number = this._image.height * CanvasWrapper._scaleFactor;
        return scaledImageHeight <= this.height;
    }

    private whiteSpaceHeightBetweenImageTopEdgeAndCanvasBorder(): number {
        const distanceFromFocusPointToUpperEdge: number = this._imageFocusPoint.y;
        const scaledUpperDistance: number = distanceFromFocusPointToUpperEdge * CanvasWrapper._scaleFactor;
        return this.height / 2 - scaledUpperDistance;
    }

    private whiteSpaceHeightBetweenImageBottomEdgeAndCanvasBorder(): number {
        const distanceFromFocusPointToLowerEdge: number = this._image.height - this._imageFocusPoint.y;
        const scaledLowerDistance: number = distanceFromFocusPointToLowerEdge * CanvasWrapper._scaleFactor;
        return this.height / 2 - scaledLowerDistance;
    }


}