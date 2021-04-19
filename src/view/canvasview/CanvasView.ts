import { PaintingStrategy } from './PaintingStrategy.js';
import { PolygonPainter } from './PolygonPainter.js';
import { PolygonAreaPainter } from './PolygonAreaPainter.js';
import { LinePainter } from './LinePainter.js';
import { RulerPainter } from './RulerPainter.js';
import { AbstractPolygonArea } from '../../model/AbstractPolygonArea.js';
import { Ruler } from '../../model/Ruler.js';
import { Coordinate } from '../../model/shape/Coordinate.js';
import { Line } from '../../model/shape/line/Line.js';
import { Polygon } from '../../model/shape/polygon/Polygon.js';
import { Model } from '../../model/Model.js';
import { InteractiveShape } from '../../model/shape/InteractiveShape.js';
import { CanvasPainter } from './CanvasPainter.js';

export class CanvasView {

    private static instance: CanvasView;
    private strategy: PaintingStrategy = PolygonPainter.getInstance();
    private canvasPainter: CanvasPainter = new CanvasPainter();
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
        this.strategy.clearTheStillCanvas();
        this.strategy.clearTheMovementCanvas();
        for (const shape of this.model.listOfShapes) {
            this.setStrategyGivenThisObject(shape);
            this.strategy.drawStill(shape);
        }
    }

    public paintMovement(mousePosition: Coordinate): void {
        const selectedShape: InteractiveShape = this.model.getSelectedShape();
        if (selectedShape !== null) {
            this.setStrategyGivenThisObject(selectedShape);
            this.strategy.drawMovement(selectedShape, mousePosition);
        } else {
            this.canvasPainter.clearTheMovementCanvas();
        }
    }

    public clearTheMovementCanvas(): void {
        this.strategy.clearTheMovementCanvas();
    }

    private setStrategyGivenThisObject(object: any): void {
        if (object instanceof AbstractPolygonArea) {
            this.setStrategy(PolygonAreaPainter.getInstance());
        } else if (object instanceof Polygon) {
            this.setStrategy(PolygonPainter.getInstance());
        } else if (object instanceof Ruler) {
            this.setStrategy(RulerPainter.getInstance());
        } else if (object instanceof Line) {
            this.setStrategy(LinePainter.getInstance());
        } else {
            throw new Error('Unknown object to paint');
        }
    }

    private setStrategy(strategy: PaintingStrategy): void {
        this.strategy = strategy;
    }
}