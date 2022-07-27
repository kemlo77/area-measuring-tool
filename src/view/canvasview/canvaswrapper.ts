export class CanvasWraper {

    private _canvasElement: HTMLCanvasElement;
    private _canvasCtx: CanvasRenderingContext2D;

    constructor(canvasId: string) {
        this._canvasElement = document.getElementById(canvasId) as HTMLCanvasElement;
        this._canvasCtx = this._canvasElement.getContext('2d');
    }


    public adjustOpacity(value: number): void {
        const percentage: number = 1 - value / 100;
        this._canvasElement.style.opacity = percentage.toString();
    }
}