import './style.css';
import {
    addShape, removeSelectedShape, canvasMouseMovement, canvasLeftClicked,
    canvasRightClicked, canvasMouseDown, canvasMouseUp
} from './router';
import {
    dropHandler, dragOverHandler, adjustCanvas, delayedAdjustCanvas, adjustOpacity
} from './imageDrop';

document.getElementById('foreground')
    .addEventListener('click', (event) => canvasLeftClicked(event, (event.target as Element).id));
document.getElementById('foreground')
    .addEventListener('mousemove', (event) => canvasMouseMovement(event, (event.target as Element).id));
document.getElementById('foreground')
    .addEventListener('mousedown', (event) => canvasMouseDown(event, (event.target as Element).id));
document.getElementById('foreground')
    .addEventListener('mouseup', (event) => canvasMouseUp(event, (event.target as Element).id));
document.getElementById('foreground')
    .addEventListener('contextmenu', (event) => canvasRightClicked(event, (event.target as Element).id));
document.getElementById('addPositivePolygon')
    .addEventListener('click', () => addShape('PositivePolygonArea'));
document.getElementById('addNegativePolygon')
    .addEventListener('click', () => addShape('NegativePolygonArea'));
document.getElementById('addRuler')
    .addEventListener('click', () => addShape('Ruler'));
document.getElementById('removeSelectedShape')
    .addEventListener('click', () => removeSelectedShape());
document.getElementById('addPolygon')
    .addEventListener('click', () => addShape('Polygon'));
document.getElementById('addSymmetryLine')
    .addEventListener('click', () => addShape('SymmetryLine'));


addEventListener('load', () => adjustCanvas());
addEventListener('resize', () => delayedAdjustCanvas());
document.getElementById('viewport')
    .addEventListener('drop', (event) => dropHandler(event));
document.getElementById('viewport')
    .addEventListener('dragover', (event) => dragOverHandler(event));
document.getElementById('opacitySlider')
    .addEventListener('change', (event) => adjustOpacity(Number((event.target as HTMLInputElement).value)));
