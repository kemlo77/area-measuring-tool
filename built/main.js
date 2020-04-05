let moveDelInsDistance = 3; //TODO: Döp om denna
let minDistance = 8;
let closePolygonMinimumDistance = 5;
let useIntegerCoords = false;
let firstPolygon;
function init() {
    firstPolygon = new Polygon();
}
function clearEntirely() {
    firstPolygon = new Polygon();
    CanvasPainter.getInstance().clearBothCanvas();
}
function handleClick(isLeftClick, theClickedPoint) {
    if (isLeftClick) {
        firstPolygon.handleLeftClick(theClickedPoint);
    }
    else {
        firstPolygon.handleRightClick(theClickedPoint);
    }
    CanvasPainter.getInstance().drawPolygon(firstPolygon);
    CanvasPainter.getInstance().drawMovement(theClickedPoint, firstPolygon);
}
//checks if new point is too close to other points
//returning the nearest point or -1 if all points are outside minDistanceIn
//only checks with the first point in a segment. So when the polygon is not closed, the last point is not checked.
function checkIfCloseToPoint(segmentArrayIn, nyPunkt, minDistanceIn, skipPoint) {
    //TODO: skriv om denna så att den får in punkterna i Polygonen
    //skipPoint is an optional parameter referensing the segment containing p1 not to be checked
    if (typeof skipPoint === 'undefined') {
        skipPoint = -1;
    }
    let localMinDistance = minDistanceIn;
    let closestPointWithinMinDistance = -1;
    let pointDistance = 0;
    for (let i = 0; i < segmentArrayIn.length; i++) {
        if (i == skipPoint) {
            continue;
        }
        //calculating distance between new point and all other points in polygon
        pointDistance = distBetweenPoints(segmentArrayIn[i].p1, nyPunkt);
        if (pointDistance < localMinDistance) {
            //if it is closer than minDistanceIn, or nearer than any other previously saved, it is saved
            closestPointWithinMinDistance = i;
            localMinDistance = pointDistance;
        }
    }
    return closestPointWithinMinDistance;
}
function canvasLeftClicked(event, canvasId) {
    const rect = document.getElementById(canvasId).getBoundingClientRect();
    const clickedPositionX = event.clientX - rect.left;
    const clickedPositionY = event.clientY - rect.top;
    const leftClickedPoint = new Point(clickedPositionX, clickedPositionY);
    handleClick(true, leftClickedPoint);
}
function canvasRightClicked(event, canvasId) {
    const rect = document.getElementById(canvasId).getBoundingClientRect();
    const clickedPositionX = event.clientX - rect.left;
    const clickedPositionY = event.clientY - rect.top;
    const rightClickedPoint = new Point(clickedPositionX, clickedPositionY);
    handleClick(false, rightClickedPoint);
}
function getMousePos(event, canvasId) {
    const rect = document.getElementById(canvasId).getBoundingClientRect();
    const mousePositionX = event.clientX - rect.left;
    const mousePositionY = event.clientY - rect.top;
    const mousePosition = new Point(mousePositionX, mousePositionY);
    //TODO: borde nog inte specifikt ange vilken polygon här, kanske hämta aktuell?
    CanvasPainter.getInstance().drawMovement(mousePosition, firstPolygon);
}
