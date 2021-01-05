import { PaintingStrategy } from './PaintingStrategy.js';
import { Coordinate } from '../polygon/Coordinate.js';

export abstract class CanvasPainter implements PaintingStrategy {
    private canvasBackground: HTMLCanvasElement = document.getElementById('background') as HTMLCanvasElement;
    movementCanvasCtx: CanvasRenderingContext2D = this.canvasBackground.getContext('2d');
    private canvasForeground: HTMLCanvasElement = document.getElementById('foreground') as HTMLCanvasElement;
    stillCanvasCtx: CanvasRenderingContext2D = this.canvasForeground.getContext('2d');
    private canvasWidth: number = this.canvasBackground.width;
    private canvasHeight: number = this.canvasBackground.height;


    abstract drawStill(motif: any, color: string): void;
    abstract drawMovement(modif: any, mousePosition: Coordinate, color: string): void;

    // clear the canvas
    clearBothCanvas(): void {
        this.stillCanvasCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.movementCanvasCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    clearTheStillCanvas(): void {
        this.stillCanvasCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    clearTheMovementCanvas(): void {
        this.movementCanvasCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

}