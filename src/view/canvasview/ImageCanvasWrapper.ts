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
        return this._image.width * 0.05 / CanvasWrapper.scaleAndOffset.scaleFactor;
    }

    private panScaleOrZoomStrategy: () => void = this.zoomToFit;
    private moveImageFocusStrategy: () => void = this.doNothing;
    private calculateOffsetStrategy: () => void =
        (): void => this.calculateImageOffsetToAlignImageFocusPointWith(this.canvasCenter);

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

    private moveFocusPointToTheRight(): void {
        this._imageFocusPoint.moveFocusPointHere(this.canvasToImage(this.canvasCenter));
        this._imageFocusPoint.moveHorizontally(this.stepsize);
    };
    private moveFocusPointToTheLeft(): void {
        this._imageFocusPoint.moveFocusPointHere(this.canvasToImage(this.canvasCenter));
        this._imageFocusPoint.moveHorizontally(-this.stepsize);
    };
    private moveFocusPointUpwards(): void {
        this._imageFocusPoint.moveFocusPointHere(this.canvasToImage(this.canvasCenter));
        this._imageFocusPoint.moveVertically(-this.stepsize);
    };
    private moveFocusPointDownwards(): void {
        this._imageFocusPoint.moveFocusPointHere(this.canvasToImage(this.canvasCenter));
        this._imageFocusPoint.moveVertically(this.stepsize);
    };

    private oneToOneScale(): void { CanvasWrapper.scaleAndOffset.oneToOneScale(); }
    private increaseScaleFactor(): void { CanvasWrapper.scaleAndOffset.increaseScaleFactor(); }
    private decreaseScaleFactor(): void { CanvasWrapper.scaleAndOffset.decreaseScaleFactor(); }
    private adjustScaleForImageToFit(): void { CanvasWrapper.scaleAndOffset.toFitScaleFactor(); }

    panRight(): void {
        this.panScaleOrZoomStrategy = this.moveFocusPointToTheRight;
        this.moveImageFocusStrategy = this.doNothing;
        this.calculateOffsetStrategy = this.alignImageFocusPointWithCanvasCenter;
        this.panScaleOrZoomThenRedrawImage();
    }

    panLeft(): void {
        this.panScaleOrZoomStrategy = this.moveFocusPointToTheLeft;
        this.moveImageFocusStrategy = this.doNothing;
        this.calculateOffsetStrategy = this.alignImageFocusPointWithCanvasCenter;
        this.panScaleOrZoomThenRedrawImage();
    }

    panUp(): void {
        this.panScaleOrZoomStrategy = this.moveFocusPointUpwards;
        this.moveImageFocusStrategy = this.doNothing;
        this.calculateOffsetStrategy = this.alignImageFocusPointWithCanvasCenter;
        this.panScaleOrZoomThenRedrawImage();
    }

    panDown(): void {
        this.panScaleOrZoomStrategy = this.moveFocusPointDownwards;
        this.moveImageFocusStrategy = this.doNothing;
        this.calculateOffsetStrategy = this.alignImageFocusPointWithCanvasCenter;
        this.panScaleOrZoomThenRedrawImage();
    }


    zoomIn(mouseCanvasPosition?: Coordinate): void {
        this.panScaleOrZoomStrategy = this.increaseScaleFactor;

        if (mouseCanvasPosition) {
            const mousePositionOnImage: Coordinate = this.canvasToImage(mouseCanvasPosition);
            this.moveImageFocusStrategy = (): void => this.thisCoordinateOnImageIsFocused(mousePositionOnImage);
            this.calculateOffsetStrategy = (): void => this.alignImageFocusPointWithCanvasCoord(mouseCanvasPosition);
        } else {
            const imageFocusPosition: Coordinate = this.canvasToImage(this.canvasCenter);
            this.moveImageFocusStrategy = (): void => this.thisCoordinateOnImageIsFocused(imageFocusPosition);
            this.calculateOffsetStrategy = this.alignImageFocusPointWithCanvasCenter;
        }
        this.panScaleOrZoomThenRedrawImage();
    }

    zoomOut(mouseCanvasPosition?: Coordinate): void {
        this.panScaleOrZoomStrategy = this.decreaseScaleFactor;

        if (mouseCanvasPosition) {
            const mousePositionOnImage: Coordinate = this.canvasToImage(mouseCanvasPosition);
            this.moveImageFocusStrategy = (): void => this.thisCoordinateOnImageIsFocused(mousePositionOnImage);
            this.calculateOffsetStrategy = (): void => this.alignImageFocusPointWithCanvasCoord(mouseCanvasPosition);
        } else {
            const imageFocusPosition: Coordinate = this.canvasToImage(this.canvasCenter);
            this.moveImageFocusStrategy = (): void => this.thisCoordinateOnImageIsFocused(imageFocusPosition);
            this.calculateOffsetStrategy = this.alignImageFocusPointWithCanvasCenter;
        }
        this.panScaleOrZoomThenRedrawImage();
    }

    zoomActualSize(): void {
        this.panScaleOrZoomStrategy = this.oneToOneScale;
        const imageFocusPosition: Coordinate = this.canvasToImage(this.canvasCenter);
        this.moveImageFocusStrategy = (): void => this.thisCoordinateOnImageIsFocused(imageFocusPosition);
        this.calculateOffsetStrategy = this.alignImageFocusPointWithCanvasCenter;
        this.panScaleOrZoomThenRedrawImage();
    }

    zoomToFit(): void {
        this.panScaleOrZoomStrategy = this.adjustScaleForImageToFit;
        this.moveImageFocusStrategy = this.imageCenterIsFocused;
        this.calculateOffsetStrategy = this.alignImageFocusPointWithCanvasCenter;
        this.panScaleOrZoomThenRedrawImage();
    }

    private doNothing(): void {
        //
    }

    private imageCenterIsFocused(): void {
        this._imageFocusPoint.focusCenterOfImage();
    }

    private thisCoordinateOnImageIsFocused(coordinate: Coordinate): void {
        this._imageFocusPoint.moveFocusPointHere(coordinate);
    }

    private alignImageFocusPointWithCanvasCenter(): void {
        this.calculateImageOffsetToAlignImageFocusPointWith(this.canvasCenter);
    }

    private alignImageFocusPointWithCanvasCoord(mousePosition: Coordinate): void {
        this.calculateImageOffsetToAlignImageFocusPointWith(mousePosition);
    }


    private panScaleOrZoomThenRedrawImage(): void {
        if (this.thereIsNoImage()) {
            return;
        }
        this.panScaleOrZoomStrategy();
        this.moveImageFocusStrategy();

        this.calculateOffsetStrategy();
        this.drawImageToCanvas();
    }


    private calculateImageOffsetToAlignImageFocusPointWith(pointOnCanvas: Coordinate): void {
        const scaledImageWidthLeftOfFocusPoint: number = this.toCanvasScale(this._imageFocusPoint.x);
        const scaledImageHeightAboveFocusPoint: number = this.toCanvasScale(this._imageFocusPoint.y);

        CanvasWrapper.scaleAndOffset.xOffset = pointOnCanvas.x - scaledImageWidthLeftOfFocusPoint;
        CanvasWrapper.scaleAndOffset.yOffset = pointOnCanvas.y - scaledImageHeightAboveFocusPoint;
    }

}