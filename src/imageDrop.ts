

export function dropHandler(ev: DragEvent): void {
    ev.preventDefault();
    const file: File = ev.dataTransfer.files[0];
    const imageTypes: Array<string> = ['image/png', 'image/gif', 'image/bmp', 'image/jpeg'];
    const fileType: string = file.type;
    if (imageTypes.includes(fileType)) {
        const reader: FileReader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const image: HTMLImageElement = new Image();
            image.src = reader.result.toString();
            image.onload = () => {
                drawImageToCanvas(image);
            }
        }
    } else {
        console.log(fileType + ' is not supported');
        clearTheCanvas();
    }
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
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
}


function debounce<F extends Function>(func: F, wait: number): F {
    let timeoutID: number;
    console.log(timeoutID);
    return <any>function (this: any, ...args: any[]) {
        clearTimeout(timeoutID);
        const context = this;
        timeoutID = window.setTimeout(function () {
            func.apply(context, args);
        }, wait);
    };
}

export const delayedResizeCanvas = debounce(() => resizeCanvas(), 250)

export function resizeCanvas() {
    console.log('Resizing canvas');
    var theCanvas = document.querySelector('canvas');
    theCanvas.width = window.innerWidth * 0.9;
    theCanvas.height = window.innerHeight * 0.8;
}