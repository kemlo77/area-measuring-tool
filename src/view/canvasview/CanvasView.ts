import { SegmentsPainter } from './segmentPainters/SegmentsPainter';
import { RegularSegmentsPainter } from './segmentPainters/RegularSegmentsPainter';
import { StripedSegmentsPainter } from './segmentPainters/StripedSegmentsPainter';
import { AbstractPolygonArea } from '../../model/AbstractPolygonArea';
import { Ruler } from '../../model/Ruler';
import { Coordinate } from '../../model/shape/Coordinate';
import { Model } from '../../model/Model';
import { CanvasAssistant } from './CanvasAssistant';
import { InteractiveSegmentShape } from '../../model/shape/segmentShapes/InteractiveSegmentShape';
import { Line } from '../../model/shape/segmentShapes/line/Line';
import { Polygon } from '../../model/shape/segmentShapes/polygon/Polygon';

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
            this.setStrategyGivenThisObject(shape);
            this.painter.drawStill(shape);
        }
    }

    public paintMovement(mousePosition: Coordinate): void {
        const selectedShape: InteractiveSegmentShape = this.model.getSelectedShape();
        if (selectedShape !== null) {
            this.setStrategyGivenThisObject(selectedShape);
            this.painter.drawMovement(selectedShape, mousePosition);
        } else {
            this.canvasAssistant.clearTheMovementCanvas();
        }
    }

    public clearTheMovementCanvas(): void {
        this.canvasAssistant.clearTheMovementCanvas();

    }

    private setStrategyGivenThisObject(object: any): void {
        if (object instanceof AbstractPolygonArea) {
            this.setStrategy(RegularSegmentsPainter.getInstance());
        } else if (object instanceof Polygon) {
            this.setStrategy(RegularSegmentsPainter.getInstance());
        } else if (object instanceof Ruler) {
            this.setStrategy(StripedSegmentsPainter.getInstance());
        } else if (object instanceof Line) {
            this.setStrategy(RegularSegmentsPainter.getInstance());
        } else {
            throw new Error('Unknown object to paint');
        }
    }

    private setStrategy(painter: SegmentsPainter): void {
        this.painter = painter;
    }
}