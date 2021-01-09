import { PaintingStrategy } from './PaintingStrategy.js';
import { Polygon } from '../polygon/Polygon.js';
import { CanvasPolygonPainter } from './CanvasPolygonPainter.js';
import { Coordinate } from '../polygon/Coordinate.js';
import { PolygonArea } from '../PolygonArea.js';
import { CanvasPolygonAreaPainter } from './CanvasPolygonAreaPainter.js';

export class CanvasStudio {

    private static instance: CanvasStudio;
    private strategy: PaintingStrategy = CanvasPolygonPainter.getInstance();

    private constructor() { }

    public static getInstance(): CanvasStudio {
        if (!CanvasStudio.instance) {
            CanvasStudio.instance = new CanvasStudio();
        }
        return CanvasStudio.instance;
    }




    public paintStill(motifs: any[]): void {
        this.strategy.clearTheStillCanvas();
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
        if (object instanceof PolygonArea) {
            this.setStrategy(CanvasPolygonAreaPainter.getInstance());
        } else if (object instanceof Polygon) {
            this.setStrategy(CanvasPolygonPainter.getInstance());
        } else {
            throw new Error('Unknown object to paint');
        }
    }

    private setStrategy(strategy: PaintingStrategy): void {
        this.strategy = strategy;
    }
}