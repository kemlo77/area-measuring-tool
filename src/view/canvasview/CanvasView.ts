import { Coordinate } from '../../model/shape/Coordinate';
import { Model } from '../../model/Model';
import { MeassuringShape } from '../../model/MeassuringShape';
import { Observer } from '../Observer';
import { CanvasWrapper } from './CanvasWrapper';

export class CanvasView implements Observer {

    private movementCanvas: CanvasWrapper = new CanvasWrapper('movementLayer');
    private stillCanvas: CanvasWrapper = new CanvasWrapper('stillLayer');
    private filterCanvas: CanvasWrapper = new CanvasWrapper('filterLayer');
    private imageCanvas: CanvasWrapper = new CanvasWrapper('imageLayer');
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
        return this.imageCanvas.convertCoordinateInCanvasToCoordinateInImage(coordinate);
    }

    public toggleZoomSetting(): void {
        this.imageCanvas.toogleZoomSetting();
        this.redrawModel();
    }

    public updateBecauseWindowIsResized(): void {
        this.filterCanvas.adaptCanvasSizeToWindowSize();
        this.imageCanvas.adaptCanvasSizeToWindowSize();
        this.movementCanvas.adaptCanvasSizeToWindowSize();
        this.stillCanvas.adaptCanvasSizeToWindowSize();
        this.setTheHeightOfTheDiv(this.filterCanvas.height);

        this.imageCanvas.setScaleAndOffsets();
        this.imageCanvas.redrawImageToCanvas();
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