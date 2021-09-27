import { Coordinate } from '../../model/shape/Coordinate';
import { Model } from '../../model/Model';
import { CanvasAssistant } from './CanvasAssistant';
import { BubbelGum } from '../../model/BubbelGum';

export class CanvasView {

    private canvasAssistant: CanvasAssistant = new CanvasAssistant();
    private model: Model;

    constructor(model: Model) {
        this.model = model;
    }

    public paintStill(): void {
        this.canvasAssistant.clearTheStillCanvas();
        this.canvasAssistant.clearTheMovementCanvas();
        for (const shape of this.model.listOfShapes) {
            shape.designatedPainterDrawStill();
        }
    }

    public paintMovement(mousePosition: Coordinate): void {
        const selectedShape: BubbelGum = this.model.getSelectedShape();
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