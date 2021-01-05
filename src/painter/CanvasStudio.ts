import { PaintingStrategy } from './PaintingStrategy.js';
import { Polygon } from '../polygon/Polygon.js';
import { CanvasPolygonPainter } from './CanvasPolygonPainter.js';
import { Coordinate } from '../polygon/Coordinate.js';

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


    private setStrategy(strategy: PaintingStrategy): void {
        this.strategy = strategy;
    }

    public paintStill(motifs: any[]): void {
        this.strategy.clearTheStillCanvas();
        for (const motif of motifs) {
            if (motif instanceof Polygon) {
                this.setStrategy(CanvasPolygonPainter.getInstance());

            } else {
                throw new Error('Unknown object to paint');
            }
            this.strategy.drawStill(motif, '0,80,120');
        }
    }

    public paintMovement(motif: any, mousePosition: Coordinate): void {
        if (motif instanceof Polygon) {
            this.setStrategy(CanvasPolygonPainter.getInstance());

        } else {
            throw new Error('Unknown object to paint');
        }
        this.strategy.drawMovement(motif, mousePosition, '0,80,120');
    }

    public clearTheMovementCanvas(): void {
        this.strategy.clearTheMovementCanvas();
    }
}