import { Coordinate } from '../../model/shape/Coordinate';
import { Model } from '../../model/Model';
import { MeassuringShape } from '../../model/MeassuringShape';
import { Observer } from '../Observer';
import { CanvasWraper } from './canvaswrapper';

export class CanvasView implements Observer {

    private filterCanvas: CanvasWraper = new CanvasWraper('filterLayer');
    private imageCanvas: CanvasWraper = new CanvasWraper('imageLayer');
    private movementCanvas: CanvasWraper = new CanvasWraper('movementLayer');
    private stillCanvas: CanvasWraper = new CanvasWraper('stillLayer');
    private theDivThatHoldsCanvases: HTMLDivElement = document.querySelector('div#viewport') as HTMLDivElement;

    public updateBecauseModelHasChanged(model: Model): void {
        this.stillCanvas.clearCanvas();
        this.movementCanvas.clearCanvas();
        for (const shape of model.allShapes) {
            shape.designatedPainterDrawStill();
        }
    }

    public updateBecauseOfMovementInModel(model: Model, mousePosition: Coordinate): void {
        const selectedShape: MeassuringShape = model.selectedShape;
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

    public adjustCanvas(): void {
        this.filterCanvas.updateCanvasWhenWindowSizeChanges();
        this.imageCanvas.updateCanvasWhenWindowSizeChanges();
        this.movementCanvas.updateCanvasWhenWindowSizeChanges();
        this.stillCanvas.updateCanvasWhenWindowSizeChanges();

        this.imageCanvas.redrawImageToCanvas();
        this.setTheHeightOfTheDiv(this.filterCanvas.height);
    }

    private setTheHeightOfTheDiv(newHeight: number): void {
        this.theDivThatHoldsCanvases.style.height = newHeight + 'px';
    }

    public delayedAdjustCanvas: any = this.debounce((): void => this.adjustCanvas(), 500);

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