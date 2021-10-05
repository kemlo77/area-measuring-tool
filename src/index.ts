import './style.css';
import {
    dropHandler, dragOverHandler, adjustCanvas, delayedAdjustCanvas, adjustOpacity
} from './imageDrop';
import { Model } from './model/Model';
import { Controller } from './controller/Controller';
import { CanvasView } from './view/canvasview/CanvasView';
import { DataView } from './view/dataview/DataView';
import { Router } from './Router';

const model: Model = new Model();
const controller: Controller = new Controller(model);
controller.attach(new CanvasView());
controller.attach(new DataView());
const router: Router = new Router(controller);

document.getElementById('foreground')
    .addEventListener('click', (event) => router.canvasLeftClicked(event, (event.target as Element).id));
document.getElementById('foreground')
    .addEventListener('mousemove', (event) => router.canvasMouseMovement(event, (event.target as Element).id));
document.getElementById('foreground')
    .addEventListener('mousedown', (event) => router.canvasMouseDown(event, (event.target as Element).id));
document.getElementById('foreground')
    .addEventListener('mouseup', (event) => router.canvasMouseUp(event, (event.target as Element).id));
document.getElementById('foreground')
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


addEventListener('load', () => adjustCanvas());
addEventListener('resize', () => delayedAdjustCanvas());
document.getElementById('viewport')
    .addEventListener('drop', (event) => dropHandler(event));
document.getElementById('viewport')
    .addEventListener('dragover', (event) => dragOverHandler(event));
document.getElementById('opacitySlider')
    .addEventListener('change', (event) => adjustOpacity(Number((event.target as HTMLInputElement).value)));
