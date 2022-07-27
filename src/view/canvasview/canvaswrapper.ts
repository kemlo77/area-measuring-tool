export class CanvasWraper {

    private _canvasElement: HTMLCanvasElement;
    private _canvasCtx: CanvasRenderingContext2D;
    private _image: HTMLImageElement;

    constructor(canvasId: string) {
        this._canvasElement = document.getElementById(canvasId) as HTMLCanvasElement;
        this._canvasCtx = this._canvasElement.getContext('2d');
    }


    public adjustOpacity(value: number): void {
        const percentage: number = 1 - value / 100;
        this._canvasElement.style.opacity = percentage.toString();
    }

    public clearCanvas(): void {
        this._canvasCtx.clearRect(0, 0, this._canvasElement.width, this._canvasElement.height);
    }

    public setImageInCanvas(image: HTMLImageElement): void {
        this._image = image;
        this.drawImageToCanvas();
    }

    public resetImage(): void {
        this._image = null;
        this.clearCanvas();
    }

    public redrawImageToCanvas(): void {
        this.drawImageToCanvas();
    }

    private drawImageToCanvas(): void {
        if (this._image) {
            console.log('image.width x height:    ' + this._image.width + ' x ' + this._image.height);
            this._canvasCtx.drawImage(this._image, 0, 0, this._image.width, this._image.height,
                0, 0, this._canvasElement.clientWidth, this._canvasElement.clientHeight);
        }
    }
}