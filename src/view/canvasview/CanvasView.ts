import { Coordinate } from '../../model/shape/Coordinate';
import { Model } from '../../model/Model';
import { CanvasAssistant } from './CanvasAssistant';
import { MeassuringShape } from '../../model/MeassuringShape';
import { Observer } from '../Observer';
import { CanvasWraper } from './canvaswrapper';

export class CanvasView implements Observer {

    private filterCanvas: CanvasWraper = new CanvasWraper('filterLayer');
    private imageCanvas: CanvasWraper = new CanvasWraper('imageLayer');
    private canvasAssistant: CanvasAssistant = new CanvasAssistant();

    public updateBecauseModelHasChanged(model: Model): void {
        this.canvasAssistant.clearTheStillCanvas();
        this.canvasAssistant.clearTheMovementCanvas();
        for (const shape of model.allShapes) {
            shape.designatedPainterDrawStill();
        }
    }

    public updateBecauseOfMovementInModel(model: Model, mousePosition: Coordinate): void {
        const selectedShape: MeassuringShape = model.selectedShape;
        if (selectedShape) {
            selectedShape.designatedPainterDrawMovement(mousePosition);
        } else {
            this.canvasAssistant.clearTheMovementCanvas();
        }
    }

    public clearTheMovementCanvas(): void {
        this.canvasAssistant.clearTheMovementCanvas();

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
        const canvases: NodeListOf<HTMLCanvasElement> = document.querySelectorAll('div#viewport canvas');
        canvases.forEach((canvas) => {
            canvas.width = window.innerWidth * 0.9;
            canvas.height = window.innerHeight * 0.8;
        });

        this.imageCanvas.redrawImageToCanvas();

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