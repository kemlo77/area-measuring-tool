import { SegmentsPainter } from './segmentPainters/SegmentsPainter';
import { RegularSegmentsPainter } from './segmentPainters/RegularSegmentsPainter';
import { Coordinate } from '../../model/shape/Coordinate';
import { Model } from '../../model/Model';
import { CanvasAssistant } from './CanvasAssistant';
import { BubbelGum } from '../../model/BubbelGum';

export class CanvasView {

    private static instance: CanvasView;
    private painter: SegmentsPainter = RegularSegmentsPainter.getInstance();
    private canvasAssistant: CanvasAssistant = new CanvasAssistant();
    private model: Model;

    private constructor() {
        //
    }

    public static getInstance(): CanvasView {
        if (!CanvasView.instance) {
            CanvasView.instance = new CanvasView();
        }
        return CanvasView.instance;
    }

    setModel(model: Model): void {
        this.model = model;
    }

    public paintStill(): void {
        this.canvasAssistant.clearTheStillCanvas();
        this.canvasAssistant.clearTheMovementCanvas();
        for (const shape of this.model.listOfShapes) {
            this.setStrategy(shape.paintingStrategy);
            this.painter.drawStill(shape);
        }
    }

    public paintMovement(mousePosition: Coordinate): void {
        const selectedShape: BubbelGum = this.model.getSelectedShape();
        if (selectedShape !== null) {
            this.setStrategy(selectedShape.paintingStrategy);
            this.painter.drawMovement(selectedShape, mousePosition);
        } else {
            this.canvasAssistant.clearTheMovementCanvas();
        }
    }

    public clearTheMovementCanvas(): void {
        this.canvasAssistant.clearTheMovementCanvas();

    }

    private setStrategy(painter: SegmentsPainter): void {
        this.painter = painter;
    }
}