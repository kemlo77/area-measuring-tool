import { Coordinate } from '../../model/shape/Coordinate';
import { CanvasWrapper } from './CanvasWrapper';

export class ImageCanvasWrapper extends CanvasWrapper {

    private _image: HTMLImageElement;
    private _currentImageFocusPoint: Coordinate;

    public setImageInCanvas(image: HTMLImageElement): void {
        this._image = image;
        this.focusCenterOfImage();
        this.zoomToFit();
    }

    private focusCenterOfImage(): void {
        if (this.thereIsNoImage()) {
            return;
        }
        this._currentImageFocusPoint = { x: this._image.width / 2, y: this._image.height / 2 };
    }

    private alignHorizontalPartOfFocusToCenterOfImage(): void {
        if (this.thereIsNoImage()) {
            return;
        }
        this._currentImageFocusPoint = { x: this._image.width / 2, y: this._currentImageFocusPoint.y };
    }

    private alignVerticalPartOfFocusToCenterOfImage(): void {
        if (this.thereIsNoImage()) {
            return;
        }
        this._currentImageFocusPoint = { x: this._currentImageFocusPoint.x, y: this._image.height / 2 };
    }



    private moveCurrentFocusHorizontally(distance: number): void {
        if (distance == 0) {
            return;
        }
        this._currentImageFocusPoint =
        {
            x: this._currentImageFocusPoint.x + distance,
            y: this._currentImageFocusPoint.y
        };
    }

    private moveCurrentFocusVertically(distance: number): void {
        if (distance == 0) {
            return;
        }
        this._currentImageFocusPoint =
        {
            x: this._currentImageFocusPoint.x,
            y: this._currentImageFocusPoint.y + distance
        };
    }

    public resetImage(): void {
        this._image = null;
        this._currentImageFocusPoint = null;
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
        this.adjustFocusPointAndRecalculateOffsets();
        this.drawImageToCanvas();
    }

    zoomToFit(): void {
        this.adjustScalefactorForImageToFit();
        this.focusCenterOfImage();
        this.adjustFocusPointAndRecalculateOffsets();
        this.drawImageToCanvas();
    }

    zoomActualSize(): void {
        this.setScalefactorToOne();
        this.adjustFocusPointAndRecalculateOffsets();
        this.drawImageToCanvas();
    }

    zoomIn(): void {
        this.increaseScalefactorTwofold();
        this.adjustFocusPointAndRecalculateOffsets();
        this.drawImageToCanvas();
    }

    zoomOut(): void {
        this.decreaseScalefactorByHalf();
        this.adjustFocusPointAndRecalculateOffsets();
        this.drawImageToCanvas();
    }

    panRight(): void {
        if (this.thereIsNoImage()) {
            return;
        }
        this.moveCurrentFocusHorizontally(this._image.width * 0.1);
        this.adjustFocusPointAndRecalculateOffsets();
        this.drawImageToCanvas();
    }

    panLeft(): void {
        if (this.thereIsNoImage()) {
            return;
        }
        this.moveCurrentFocusHorizontally(-this._image.width * 0.1);
        this.adjustFocusPointAndRecalculateOffsets();
        this.drawImageToCanvas();
    }

    panUp(): void {
        if (this.thereIsNoImage()) {
            return;
        }
        this.moveCurrentFocusVertically(-this._image.height * 0.1);
        this.adjustFocusPointAndRecalculateOffsets();
        this.drawImageToCanvas();
    }

    panDown(): void {
        if (this.thereIsNoImage()) {
            return;
        }
        this.moveCurrentFocusVertically(this._image.height * 0.1);
        this.adjustFocusPointAndRecalculateOffsets();
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
        if (this.newImageFocusPointIsValid(desiredNewImageFocusPoint)) {
            this._currentImageFocusPoint = desiredNewImageFocusPoint;
        }

        this.adjustFocuspointHorizontally();
        this.adjustFocuspointVertically();

        this.calculateAndSetOffsets();
    }

    private newImageFocusPointIsValid(newImageFocusPoint?: Coordinate): boolean {
        if (!newImageFocusPoint) {
            return false;
        }

        const xInRange: boolean = newImageFocusPoint.x >= 0 && newImageFocusPoint.x <= this._image.width;
        const yInRange: boolean = newImageFocusPoint.y >= 0 && newImageFocusPoint.y <= this._image.height;
        return (xInRange && yInRange);
    }

    private calculateAndSetOffsets(): void {
        CanvasWrapper._xOffset = this.width / 2 - this._currentImageFocusPoint.x * CanvasWrapper._scaleFactor;
        CanvasWrapper._yOffset = this.height / 2 - this._currentImageFocusPoint.y * CanvasWrapper._scaleFactor;
    }


    private adjustFocuspointHorizontally(): void {
        if (this.scaledImageIsNarrowerThanCanvas()) {
            this.alignHorizontalPartOfFocusToCenterOfImage();
            return;
        }

        if (this.whiteSpaceWidthBetweenImageRightEdgeAndCanvasBorder() > 0) {
            const whiteSpaceWidthInImageScale: number =
                this.whiteSpaceWidthBetweenImageRightEdgeAndCanvasBorder() / CanvasWrapper._scaleFactor;
            this.moveCurrentFocusHorizontally(- whiteSpaceWidthInImageScale);
            return;
        }

        if (this.whiteSpaceWidthBetweenImageLeftEdgeAndCanvasBorder() > 0) {
            const whiteSpaceWidthInImageScale: number =
                this.whiteSpaceWidthBetweenImageLeftEdgeAndCanvasBorder() / CanvasWrapper._scaleFactor;
            this.moveCurrentFocusHorizontally(whiteSpaceWidthInImageScale);
            return;
        }
    }

    private scaledImageIsNarrowerThanCanvas(): boolean {
        const scaledImageWidth: number = this._image.width * CanvasWrapper._scaleFactor;
        return scaledImageWidth <= this.width;
    }

    private whiteSpaceWidthBetweenImageRightEdgeAndCanvasBorder(): number {
        const distanceFromFocusPointToRightEdge: number = this._image.width - this._currentImageFocusPoint.x;
        const scaledRightDistance: number = distanceFromFocusPointToRightEdge * CanvasWrapper._scaleFactor;
        return this.width / 2 - scaledRightDistance;
    }

    private whiteSpaceWidthBetweenImageLeftEdgeAndCanvasBorder(): number {
        const distanceFromFocusPointToLeftEdge: number = this._currentImageFocusPoint.x;
        const scaledLeftDistance: number = distanceFromFocusPointToLeftEdge * CanvasWrapper._scaleFactor;
        return this.width / 2 - scaledLeftDistance;
    }



    private adjustFocuspointVertically(): void {
        if (this.scaledImageIsShorterThanCanvas()) {
            this.alignVerticalPartOfFocusToCenterOfImage();
            return;
        }

        if (this.whiteSpaceHeightBetweenImageBottomEdgeAndCanvasBorder() > 0) {
            const whitespaceHeightInImageScale: number =
                this.whiteSpaceHeightBetweenImageBottomEdgeAndCanvasBorder() / CanvasWrapper._scaleFactor;
            this.moveCurrentFocusVertically(- whitespaceHeightInImageScale);
            return;
        }

        if (this.whiteSpaceHeightBetweenImageTopEdgeAndCanvasBorder() > 0) {
            const whitespaceHeightInImageScale: number =
                this.whiteSpaceHeightBetweenImageTopEdgeAndCanvasBorder() / CanvasWrapper._scaleFactor;
            this.moveCurrentFocusVertically(whitespaceHeightInImageScale);
            return;
        }
    }

    private scaledImageIsShorterThanCanvas(): boolean {
        const scaledImageHeight: number = this._image.height * CanvasWrapper._scaleFactor;
        return scaledImageHeight <= this.height;
    }

    private whiteSpaceHeightBetweenImageTopEdgeAndCanvasBorder(): number {
        const distanceFromFocusPointToUpperEdge: number = this._currentImageFocusPoint.y;
        const scaledUpperDistance: number = distanceFromFocusPointToUpperEdge * CanvasWrapper._scaleFactor;
        return this.height / 2 - scaledUpperDistance;
    }

    private whiteSpaceHeightBetweenImageBottomEdgeAndCanvasBorder(): number {
        const distanceFromFocusPointToLowerEdge: number = this._image.height - this._currentImageFocusPoint.y;
        const scaledLowerDistance: number = distanceFromFocusPointToLowerEdge * CanvasWrapper._scaleFactor;
        return this.height / 2 - scaledLowerDistance;
    }


}