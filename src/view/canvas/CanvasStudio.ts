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

export class CanvasStudio {

    private static instance: CanvasStudio;
    private strategy: PaintingStrategy = PolygonPainter.getInstance();

    private constructor() {
        //
    }

    public static getInstance(): CanvasStudio {
        if (!CanvasStudio.instance) {
            CanvasStudio.instance = new CanvasStudio();
        }
        return CanvasStudio.instance;
    }

    public paintStill(motifs: any[]): void {
        this.strategy.clearTheStillCanvas();
        this.strategy.clearTheMovementCanvas();
        for (const motif of motifs) {
            this.setStrategyGivenThisObject(motif);
            this.strategy.drawStill(motif);
        }
    }

    public paintMovement(motif: any, mousePosition: Coordinate): void {
        this.setStrategyGivenThisObject(motif);
        this.strategy.drawMovement(motif, mousePosition);
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