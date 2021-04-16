import {
    addShape, removeSelectedShape, canvasMouseMovement, canvasLeftClicked,
    canvasRightClicked, canvasMouseDown, canvasMouseUp
} from './built/router.js';
import {
    dropHandler, dragOverHandler, adjustCanvas, delayedAdjustCanvas, adjustOpacity
} from './built/imageDrop.js';

document.getElementById('foreground')
    .addEventListener('click', (event) => canvasLeftClicked(event, event.target.id));
document.getElementById('foreground')
    .addEventListener('mousemove', (event) => canvasMouseMovement(event, event.target.id));
document.getElementById('foreground')
    .addEventListener('mousedown', (event) => canvasMouseDown(event, event.target.id));
document.getElementById('foreground')
    .addEventListener('mouseup', (event) => canvasMouseUp(event, event.target.id));
document.getElementById('foreground')
    .addEventListener('contextmenu', (event) => canvasRightClicked(event, event.target.id));
document.getElementById('addPositivePolygon')
    .addEventListener('click', () => addShape('PositivePolygonArea'));
document.getElementById('addNegativePolygon')
    .addEventListener('click', () => addShape('NegativePolygonArea'));
document.getElementById('addRuler')
    .addEventListener('click', () => addShape('Ruler'));
document.getElementById('removeSelectedShape')
    .addEventListener('click', () => removeSelectedShape());


addEventListener('load', () => adjustCanvas());
addEventListener('resize', () => delayedAdjustCanvas());
document.getElementById('viewport')
    .addEventListener('drop', (event) => dropHandler(event));
document.getElementById('viewport')
    .addEventListener('dragover', (event) => dragOverHandler(event));
document.getElementById('opacitySlider')
    .addEventListener('change', (event) => adjustOpacity(event.target.value));
