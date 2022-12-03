import './style.css';
import { ImageDrop } from './ImageDrop';
import { Model } from './model/Model';
import { Controller } from './controller/Controller';
import { CanvasView } from './view/canvasview/CanvasView';
import { DataView } from './view/dataview/DataView';
import { Router } from './Router';
import { Coordinate } from './model/meassuringshape/shape/Coordinate';

const model: Model = new Model();
const canvasView: CanvasView = new CanvasView(model);
model.subscribe(canvasView);
model.subscribe(new DataView(model));
const controller: Controller = new Controller(model, canvasView);
const router: Router = new Router(controller);
const imageDrop: ImageDrop = new ImageDrop(canvasView);

document.getElementById('movementLayer')
    .addEventListener('click', (event) => router.canvasLeftClicked(event, (event.target as Element).id));
document.getElementById('movementLayer')
    .addEventListener('mousemove', (event) => router.canvasMouseMovement(event, (event.target as Element).id));
document.getElementById('movementLayer')
    .addEventListener('mousedown', (event) => router.canvasMouseDown(event, (event.target as Element).id));
document.getElementById('movementLayer')
    .addEventListener('mouseup', (event) => router.canvasMouseUp(event, (event.target as Element).id));
document.getElementById('movementLayer')
    .addEventListener('contextmenu', (event) => router.canvasRightClicked(event, (event.target as Element).id));
document.getElementById('movementLayer')
    .addEventListener('wheel', (event) => wheelMovement(event, (event.target as Element).id));

document.getElementById('addPositivePolygon').addEventListener('click', () => router.addShape('PositivePolygonArea'));
document.getElementById('addNegativePolygon').addEventListener('click', () => router.addShape('NegativePolygonArea'));
document.getElementById('addRuler').addEventListener('click', () => router.addShape('Ruler'));
document.getElementById('addSymmetryLine').addEventListener('click', () => router.addShape('SymmetryLine'));
document.getElementById('removeSelectedShape').addEventListener('click', () => router.removeSelectedShape());


document.getElementById('zoomToFit').addEventListener('click', () => canvasView.zoomToFit());
document.getElementById('zoomActualSize').addEventListener('click', () => canvasView.zoomActualSize());
document.getElementById('zoomIn').addEventListener('click', () => canvasView.zoomIn());
document.getElementById('zoomOut').addEventListener('click', () => canvasView.zoomOut());
document.getElementById('panRight').addEventListener('click', () => canvasView.panRight());
document.getElementById('panLeft').addEventListener('click', () => canvasView.panLeft());
document.getElementById('panUp').addEventListener('click', () => canvasView.panUp());
document.getElementById('panDown').addEventListener('click', () => canvasView.panDown());


addEventListener('load', () => canvasView.updateBecauseWindowIsResized());
addEventListener('resize', () => canvasView.delayedUpdateBecauseWindowIsResized());
document.getElementById('viewport').addEventListener('drop', (event) => imageDrop.dropHandler(event));
document.getElementById('viewport').addEventListener('dragover', (event) => imageDrop.dragOverHandler(event));
document.getElementById('opacitySlider').addEventListener('change', (event) => {
    canvasView.adjustFilterOpacity(Number((event.target as HTMLInputElement).value));
});

//TODO: den här metoden kanske borde vara i router, eller en ny router?
function wheelMovement(event: WheelEvent, canvasId: string): void {
    event.preventDefault();
    const mousePosition: Coordinate = router.getMouseCoordinate(event, canvasId);
    if (event.deltaY < 0) {
        canvasView.zoomIn(mousePosition);
    }
    if (event.deltaY > 0) {
        canvasView.zoomOut();
    }
}