export class ImageDrop {

    private imageFile: File = null;
    private imageCanvas: HTMLCanvasElement = document.querySelector('canvas#imageLayer');
    private filterCanvas: HTMLCanvasElement = document.querySelector('canvas#filterLayer');
    private imageContext: CanvasRenderingContext2D = this.imageCanvas.getContext('2d');

    public dropHandler(ev: DragEvent): void {
        ev.preventDefault();
        const file: File = ev.dataTransfer.files[0];
        if (this.fileIsImageType(file)) {
            this.imageFile = file;
            this.readImageFileAndDrawToCanvas(file);
        } else {
            alert(file.type + ' is not supported');
            this.imageFile = null;   // TODO: Ok att rensa tidigare bild?
            this.clearImageCanvas(); // -- // --
        }
    }

    private fileIsImageType(file: File): boolean {
        const fileType: string = file.type;
        const imageTypes: Array<string> = ['image/png', 'image/gif', 'image/bmp', 'image/jpeg'];
        return imageTypes.includes(fileType);
    }

    private readImageFileAndDrawToCanvas(file: File): void {
        const reader: FileReader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (): void => {
            const image: HTMLImageElement = new Image();
            console.log('image.width:    ' + image.width);
            console.log('image.height:   ' + image.height);
            image.src = reader.result.toString();
            image.onload = (): void => {
                this.drawImageToCanvas(image);
            };
        };
    }

    private clearImageCanvas(): void {
        this.imageContext.clearRect(0, 0, this.imageCanvas.width, this.imageCanvas.height);
    }

    private drawImageToCanvas(image: HTMLImageElement): void {
        this.imageContext.drawImage(image, 0, 0, image.width, image.height,
            0, 0, this.imageCanvas.clientWidth, this.imageCanvas.clientHeight);
    }

    public dragOverHandler(ev: DragEvent): void {
        ev.preventDefault();
    }

    public adjustCanvas(): void {
        console.log('Resizing canvases');

        const canvases: NodeListOf<HTMLCanvasElement> = document.querySelectorAll('div#viewport canvas');
        canvases.forEach((canvas) => {
            canvas.width = window.innerWidth * 0.9;
            canvas.height = window.innerHeight * 0.8;
        });

        if (this.imageFile) {
            this.readImageFileAndDrawToCanvas(this.imageFile);
        }
    }

    public delayedAdjustCanvas: any = this.debounce((): void => this.adjustCanvas(), 500);

    private debounce<F extends Function>(func: F, wait: number): F {
        let timeoutID: number;
        return <any>function (this: any, ...args: any[]) {
            clearTimeout(timeoutID);
            const context: any = this;
            timeoutID = window.setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }

    public adjustOpacity(value: number): void {
        const percentage: number = 1 - value / 100;
        this.filterCanvas.style.opacity = percentage.toString();
    }
}






















