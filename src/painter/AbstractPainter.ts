import { PaintingStrategy } from './PaintingStrategy.js';
import { Coordinate } from '../shape/Coordinate.js';

export abstract class AbstractPainter implements PaintingStrategy {
    private canvasBackground: HTMLCanvasElement = document.getElementById('background') as HTMLCanvasElement;
    stillCanvasCtx: CanvasRenderingContext2D = this.canvasBackground.getContext('2d');
    private canvasForeground: HTMLCanvasElement = document.getElementById('foreground') as HTMLCanvasElement;
    movementCanvasCtx: CanvasRenderingContext2D = this.canvasForeground.getContext('2d');
    private canvasWidth: number = this.canvasBackground.width;
    private canvasHeight: number = this.canvasBackground.height;


    abstract drawStill(motif: any): void;
    abstract drawMovement(modif: any, mousePosition: Coordinate): void;

    clearTheStillCanvas(): void {
        this.stillCanvasCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    clearTheMovementCanvas(): void {
        this.movementCanvasCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    drawLine(p1: Coordinate, p2: Coordinate, width: number, lineColor: string, ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = 'rgba(' + lineColor + ',1)';
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
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