import { Coordinate } from '../../model/shape/Coordinate';
import { Model } from '../../model/Model';
import { CanvasAssistant } from './CanvasAssistant';
import { MeassuringShape } from '../../model/MeassuringShape';
import { Observer } from '../Observer';

export class CanvasView implements Observer {

    private canvasAssistant: CanvasAssistant = new CanvasAssistant();

    public updateBecauseModelHasChanged(model: Model): void {
        this.canvasAssistant.clearTheStillCanvas();
        this.canvasAssistant.clearTheMovementCanvas();
        for (const shape of model.listOfShapes) {
            shape.designatedPainterDrawStill();
        }
    }

    public updateBecauseOfMovementInModel(model: Model, mousePosition: Coordinate): void {
        const selectedShape: MeassuringShape = model.getSelectedShape();
        if (selectedShape !== null) {
            selectedShape.designatedPainterDrawMovement(mousePosition);
        } else {
            this.canvasAssistant.clearTheMovementCanvas();
        }
    }

    public clearTheMovementCanvas(): void {
        this.canvasAssistant.clearTheMovementCanvas();

    }
}