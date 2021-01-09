import { PaintingStrategy } from './PaintingStrategy.js';
import { Coordinate } from '../polygon/Coordinate.js';

export abstract class AbstractPainter implements PaintingStrategy {
    private canvasBackground: HTMLCanvasElement = document.getElementById('background') as HTMLCanvasElement;
    movementCanvasCtx: CanvasRenderingContext2D = this.canvasBackground.getContext('2d');
    private canvasForeground: HTMLCanvasElement = document.getElementById('foreground') as HTMLCanvasElement;
    stillCanvasCtx: CanvasRenderingContext2D = this.canvasForeground.getContext('2d');
    private canvasWidth: number = this.canvasBackground.width;
    private canvasHeight: number = this.canvasBackground.height;


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

    drawLine(startP: Coordinate, endP: Coordinate, lineColor: string, ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = 'rgba(' + lineColor + ',1)';
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.moveTo(startP.x, startP.y);
        ctx.lineTo(endP.x, endP.y);
        ctx.closePath();
        ctx.stroke();
    }

    drawDot(dot2paint: Coordinate, diam: number, rgbIn: string,ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = 'rgba(' + rgbIn + ',1)';
        ctx.beginPath();
        ctx.arc(dot2paint.x, dot2paint.y, diam, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }

    drawHollowDot(dot2paint: Coordinate, outerColor: string, ctx: CanvasRenderingContext2D): void {
        this.drawDot(dot2paint, 4, outerColor, ctx);
        this.drawDot(dot2paint, 2, '255,255,255', ctx);
    }

}