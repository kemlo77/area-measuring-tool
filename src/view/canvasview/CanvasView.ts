import { Painter } from './Painter';
import { SegmentsPainter } from './SegmentsPainter';
import { StripedSegmentsPainter } from './StripedSegmentsPainter';
import { AbstractPolygonArea } from '../../model/AbstractPolygonArea';
import { Ruler } from '../../model/Ruler';
import { Coordinate } from '../../model/shape/Coordinate';
import { Line } from '../../model/shape/line/Line';
import { Polygon } from '../../model/shape/polygon/Polygon';
import { Model } from '../../model/Model';
import { InteractiveShape } from '../../model/shape/InteractiveShape';
import { CanvasAssistant } from './CanvasAssistant';

export class CanvasView {

    private static instance: CanvasView;
    private painter: Painter = SegmentsPainter.getInstance();
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
        //TODO: för dessa två rader borde man kunna byta painter mot
        // canvasAssistant. Men då blir det lite grafiska buggar, varför?
        this.painter.clearTheStillCanvas();
        this.painter.clearTheMovementCanvas();
        for (const shape of this.model.listOfShapes) {
            this.setStrategyGivenThisObject(shape);
            this.painter.drawStill(shape);
        }
    }

    public paintMovement(mousePosition: Coordinate): void {
        const selectedShape: InteractiveShape = this.model.getSelectedShape();
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
            this.setStrategy(SegmentsPainter.getInstance());
        } else if (object instanceof Polygon) {
            this.setStrategy(SegmentsPainter.getInstance());
        } else if (object instanceof Ruler) {
            this.setStrategy(StripedSegmentsPainter.getInstance());
        } else if (object instanceof Line) {
            this.setStrategy(SegmentsPainter.getInstance());
        } else {
            throw new Error('Unknown object to paint');
        }
    }

    private setStrategy(painter: Painter): void {
        this.painter = painter;
    }
}