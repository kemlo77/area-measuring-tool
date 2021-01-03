let imageFile: File;
const imageCanvas: HTMLCanvasElement = document.querySelector('canvas#imageLayer');
const filterCanvas: HTMLCanvasElement = document.querySelector('canvas#filterLayer');
const imageContext: CanvasRenderingContext2D = imageCanvas.getContext('2d');

export function dropHandler(ev: DragEvent): void {
    ev.preventDefault();
    const file: File = ev.dataTransfer.files[0];
    if (fileIsImageType(file)) {
        imageFile = file;
        readImageFileAndDrawToCanvas(file);
    } else {
        alert(file.type + ' is not supported');
        imageFile = null;   // TODO: Ok att rensa tidigare bild?
        clearImageCanvas(); // -- // --
    }
}

function fileIsImageType(file: File): boolean {
    const fileType: string = file.type;
    const imageTypes: Array<string> = ['image/png', 'image/gif', 'image/bmp', 'image/jpeg'];
    return imageTypes.includes(fileType);
}

function readImageFileAndDrawToCanvas(file: File): void {
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (): void => {
        const image: HTMLImageElement = new Image();
        console.log('image.width:    ' + image.width);
        console.log('image.height:   ' + image.height);
        image.src = reader.result.toString();
        image.onload = (): void => {
            drawImageToCanvas(image);
        };
    };
}

function clearImageCanvas(): void {
    imageContext.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
}

function drawImageToCanvas(image: HTMLImageElement): void {
    imageContext.drawImage(image, 0, 0, image.width, image.height,
         0, 0, imageCanvas.clientWidth, imageCanvas.clientHeight);
}

export function dragOverHandler(ev: DragEvent): void { ev.preventDefault(); }

export function adjustCanvas(): void {
    console.log('Resizing canvases');

    imageCanvas.width = window.innerWidth * 0.9;
    imageCanvas.height = window.innerHeight * 0.8;

    filterCanvas.width = window.innerWidth * 0.9;
    filterCanvas.height = window.innerHeight * 0.8;


    //console.log('canvas.width: ' + canvas.width);
    //console.log('canvas.clientWidth: ' + canvas.clientWidth);
    //console.log('canvas.height: ' + canvas.height);
    //console.log('canvas.clicentHeight: ' + canvas.clientHeight);


    //canvas.width = image.width;
    //canvas.height = image.height;
    
    if (imageFile !== null) {
        readImageFileAndDrawToCanvas(imageFile);
    }
}

export const delayedAdjustCanvas: any = debounce((): void => adjustCanvas(), 250);

function debounce<F extends Function>(func: F, wait: number): F {
    let timeoutID: number;
    return <any>function (this: any, ...args: any[]) {
        clearTimeout(timeoutID);
        const context: any = this;
        timeoutID = window.setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}