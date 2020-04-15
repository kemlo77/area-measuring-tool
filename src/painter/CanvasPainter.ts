import { PaintingStrategy } from './PaintingStrategy.js';
import { Coordinate } from '../Coordinate.js';

export abstract class CanvasPainter implements PaintingStrategy {
    private canvasBackground: HTMLCanvasElement = document.getElementById('background') as HTMLCanvasElement;
    movementCanvasCtx: CanvasRenderingContext2D = this.canvasBackground.getContext('2d');
    private canvasForeground: HTMLCanvasElement = document.getElementById('foreground') as HTMLCanvasElement;
    stillCanvasCtx: CanvasRenderingContext2D = this.canvasForeground.getContext('2d');
    private canvasWidth: number = this.canvasBackground.width;
    private canvasHeight: number = this.canvasBackground.height;

    moveColor: string = '255,128,0';
    defaultColor: string = '0,80,120';
    redColor: string = '255,0,0';
    greenColor: string = '0,255,0';
    whiteColor: string = '255,255,255';


    abstract drawStill(motif: any): void;
    abstract drawMovement(modif: any, mousePosition: Coordinate): void;

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