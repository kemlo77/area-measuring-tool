let imageFile: File;

export function dropHandler(ev: DragEvent): void {
    ev.preventDefault();
    const file: File = ev.dataTransfer.files[0];
    if (fileIsImageType(file)) {
        imageFile = file;
        readImageFileAndDrawToCanvas(file);
    } else {
        alert(file.type + ' is not supported');
        imageFile = null; // TODO: Ok att rensa tidigare bild?
        clearTheCanvas(); // -- // --
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
        image.src = reader.result.toString();
        image.onload = (): void => {
            drawImageToCanvas(image);
        };
    };
}

function clearTheCanvas(): void {
    const canvas: HTMLCanvasElement = document.querySelector('canvas');
    const context: CanvasRenderingContext2D = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function drawImageToCanvas(image: HTMLImageElement): void {
    const canvas: HTMLCanvasElement = document.querySelector('canvas');
    console.log('canvas.width: ' + canvas.width);
    console.log('canvas.clientWidth: ' + canvas.clientWidth);
    console.log('canvas.height: ' + canvas.height);
    console.log('canvas.clicentHeight: ' + canvas.clientHeight);
    console.log('image.width:    ' + image.width);
    console.log('image.height:   ' + image.height);

    //canvas.width = image.width;
    //canvas.height = image.height;
    const context: CanvasRenderingContext2D = canvas.getContext('2d');
    //context.filter = 'blur(10px)';
    context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.clientWidth, canvas.clientHeight);
}

export function dragOverHandler(ev: DragEvent): void {
    console.log('File(s) in drop zone');
    ev.preventDefault();
}


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

export const delayedResizeCanvas: any = debounce((): void => resizeCanvas(), 250);

export function resizeCanvas(): void {
    console.log('Resizing canvas');
    const theCanvas: HTMLCanvasElement = document.querySelector('canvas');
    theCanvas.width = window.innerWidth * 0.9;
    theCanvas.height = window.innerHeight * 0.8;
    if (imageFile !== null) {
        readImageFileAndDrawToCanvas(imageFile);
    }
}