import { CanvasView } from './view/canvasview/CanvasView';

export class ImageDrop {

    private _canvasView: CanvasView;

    constructor(canvasView: CanvasView) {
        this._canvasView = canvasView;
    }

    public dropHandler(event: DragEvent): void {
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
        const files: FileList = event.dataTransfer.files;
        //console.log('number of files: ' + files.length);
        const file: File = files[0];
        if (this.fileIsImageType(file)) {
            this.readImageFileAndDrawToCanvas(file);
        } else {
            alert(file.type + ' is not supported');
            this._canvasView.resetImage();
        }
    }

    private fileIsImageType(file: File): boolean {
        const fileType: string = file.type;
        const imageTypes: Array<string> = ['image/png', 'image/gif', 'image/bmp', 'image/jpeg'];
        return imageTypes.includes(fileType);
    }

    private readImageFileAndDrawToCanvas(file: File): void {
        const reader: FileReader = new FileReader();

        reader.onload = (): void => {
            const image: HTMLImageElement = new Image();
            image.src = reader.result.toString();
            image.onload = (): void => {
                this._canvasView.setImage(image);
            };
        };
        reader.readAsDataURL(file);
    }

    public dragOverHandler(event: DragEvent): void {
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    }

}






















