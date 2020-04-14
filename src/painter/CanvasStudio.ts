import { PaintingStrategy } from './PaintingStrategy.js';
import { Polygon } from '../Polygon.js';
import { CanvasPolygonPainter } from './CanvasPolygonPainter.js';
import { Coordinate } from '../Coordinate.js';

export class CanvasStudio {

    private static instance: CanvasStudio;
    private strategy: PaintingStrategy;

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

    public paintStill(motif: any): void {
        if(motif instanceof Polygon) {
            this.setStrategy(CanvasPolygonPainter.getInstance());

        } else {
            throw new Error('Unknown object to paint');
        }
        this.strategy.drawStill(motif);
    }

    public paintMovement(motif: any, mousePosition: Coordinate): void {
        if(motif instanceof Polygon) {
            this.setStrategy(CanvasPolygonPainter.getInstance());

        } else {
            throw new Error('Unknown object to paint');
        }
        this.strategy.drawMovement(motif, mousePosition);
    }
}