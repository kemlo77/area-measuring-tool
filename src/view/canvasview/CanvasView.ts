import { Coordinate } from '../../model/shape/Coordinate';
import { Model } from '../../model/Model';
import { MeassuringShape } from '../../model/MeassuringShape';
import { Observer } from '../Observer';
import { CanvasWrapper } from './CanvasWrapper';
import { ImageCanvasWrapper } from './ImageCanvsaWrapper';

export class CanvasView implements Observer {

    private movementCanvas: CanvasWrapper = new CanvasWrapper('movementLayer');
    private stillCanvas: CanvasWrapper = new CanvasWrapper('stillLayer');
    private filterCanvas: CanvasWrapper = new CanvasWrapper('filterLayer');
    private imageCanvas: ImageCanvasWrapper = new ImageCanvasWrapper('imageLayer');
    private theDivThatHoldsCanvases: HTMLDivElement = document.querySelector('div#viewport') as HTMLDivElement;
    private _model: Model;

    constructor(model: Model) {
        this._model = model;
    }

    public updateBecauseModelHasChanged(): void {
        this.redrawModel();
    }

    private redrawModel(): void {
        this.stillCanvas.clearCanvas();
        this.movementCanvas.clearCanvas();
        for (const shape of this._model.allShapes) {
            shape.designatedPainterDrawStill();
        }
    }

    public updateBecauseOfMovementInModel(mousePosition: Coordinate): void {
        const selectedShape: MeassuringShape = this._model.selectedShape;
        if (selectedShape) {
            selectedShape.designatedPainterDrawMovement(mousePosition);
        } else {
            this.movementCanvas.clearCanvas();
        }
    }

    public clearTheMovementCanvas(): void {
        this.movementCanvas.clearCanvas();
    }

    public adjustFilterOpacity(percentage: number): void {
        this.filterCanvas.adjustOpacity(percentage);
    }

    public setImage(image: HTMLImageElement): void {
        this.imageCanvas.setImageInCanvas(image);
    }

    public resetImage(): void {
        this.imageCanvas.resetImage();
    }

    public convertCanvasCoordinateToImageCoordinate(coordinate: Coordinate): Coordinate {
        return this.imageCanvas.canvasToImage(coordinate);
    }

    public zoomToFit(): void {
        this.imageCanvas.zoomToFit();
        this.redrawModel();
    }

    public zoomActualSize(): void {
        this.imageCanvas.zoomActualSize();
        this.redrawModel();
    }

    public zoomIn(): void {
        this.imageCanvas.zoomIn();
        this.redrawModel();
    }

    public zoomOut(): void {
        this.imageCanvas.zoomOut();
        this.redrawModel();
    }

    public updateBecauseWindowIsResized(): void {
        this.movementCanvas.adaptCanvasToWindowResize();
        this.stillCanvas.adaptCanvasToWindowResize();
        this.filterCanvas.adaptCanvasToWindowResize();
        this.imageCanvas.adaptCanvasToWindowResize();
        this.setTheHeightOfTheDiv(this.filterCanvas.height);

        this.redrawModel();
    }

    private setTheHeightOfTheDiv(newHeight: number): void {
        this.theDivThatHoldsCanvases.style.height = newHeight + 'px';
    }

    public delayedUpdateBecauseWindowIsResized: any =
        this.debounce((): void => this.updateBecauseWindowIsResized(), 500);

    private debounce<F extends Function>(func: F, wait: number): F {
        let timeoutID: number;
        return <any>function (this: any, ...args: any[]) {
            clearTimeout(timeoutID);
            const context: any = this;
            timeoutID = window.setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }
}