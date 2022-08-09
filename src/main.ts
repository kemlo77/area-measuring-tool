import './style.css';
import { ImageDrop } from './ImageDrop';
import { Model } from './model/Model';
import { Controller } from './controller/Controller';
import { CanvasView } from './view/canvasview/CanvasView';
import { DataView } from './view/dataview/DataView';
import { Router } from './Router';

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
document.getElementById('addPositivePolygon')
    .addEventListener('click', () => router.addShape('PositivePolygonArea'));
document.getElementById('addNegativePolygon')
    .addEventListener('click', () => router.addShape('NegativePolygonArea'));
document.getElementById('addRuler')
    .addEventListener('click', () => router.addShape('Ruler'));
document.getElementById('removeSelectedShape')
    .addEventListener('click', () => router.removeSelectedShape());
document.getElementById('addSymmetryLine')
    .addEventListener('click', () => router.addShape('SymmetryLine'));
document.getElementById('toggleZoomSetting')
    .addEventListener('click', () => canvasView.toggleZoomSetting());


addEventListener('load', () => canvasView.updateBecauseWindowIsResized());
addEventListener('resize', () => canvasView.delayedUpdateBecauseWindowIsResized());
document.getElementById('viewport')
    .addEventListener('drop', (event) => imageDrop.dropHandler(event));
document.getElementById('viewport')
    .addEventListener('dragover', (event) => imageDrop.dragOverHandler(event));
document.getElementById('opacitySlider')
    .addEventListener('change', (event) => {
        canvasView.adjustFilterOpacity(Number((event.target as HTMLInputElement).value));
    });
