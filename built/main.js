var moveDelInsDistance = 3;
var minDistance = 8;
var useIntegerCoords = false;
var closePolygonMinimumDistance = 5;
function init() {
    var canvasBackground = document.getElementById("background");
    if (canvasBackground.getContext) {
        ctxBack = canvasBackground.getContext("2d");
    }
    var canvasForeground = document.getElementById("foreground");
    if (canvasForeground.getContext) {
        ctxFront = canvasForeground.getContext("2d");
    }
    IWIDTH = canvasBackground.width;
    IHEIGHT = canvasBackground.height;
}
function clearEntirely() {
    firstPolygon.segments = [];
    firstPolygon.closed = false;
    firstPolygon.seed = null;
    clearTheCanvas(ctxFront);
    clearTheCanvas(ctxBack);
}
//*************************
//** Handle clicks       **
//*************************
function handleClick(isLeftClick, theClickedPoint) {
    if (isLeftClick) {
        firstPolygon.handleLeftClick(theClickedPoint);
    }
    else {
        firstPolygon.handleRightClick(theClickedPoint);
    }
    drawPolygon(firstPolygon);
    //clearUsedCanvas();
    drawMovement(theClickedPoint, firstPolygon);
}
//checks if new point is too close to other points
//returning the nearest point or -1 if all points are outside minDistanceIn
//only checks with the first point in a segment. So when the polygon is not closed, the last point is not checked.
function checkIfCloseToPoint(segmentArrayIn, nyPunkt, minDistanceIn, skipPoint) {
    //skipPoint is an optional parameter referensing the segment containing p1 not to be checked
    if (typeof skipPoint === 'undefined') {
        skipPoint = -1;
    }
    var localMinDistance = minDistanceIn;
    var isTooClose = -1;
    var pointDistance = 0;
    for (i = 0; i < segmentArrayIn.length; i++) {
        if (i == skipPoint) {
            continue;
        }
        //calculating distance between new point and all other points in polygon
        pointDistance = distBetweenPoints(segmentArrayIn[i].p1, nyPunkt);
        if (pointDistance < localMinDistance) {
            //if it is closer than minDistanceIn, or nearer than any other previously saved, it is saved
            isTooClose = i;
            localMinDistance = pointDistance;
        }
    }
    return isTooClose;
}
//Left click
function canvasLeftClicked(evt, canvas_id) {
    var rect = document.getElementById(canvas_id).getBoundingClientRect();
    var position_x = evt.clientX - rect.left;
    var position_y = evt.clientY - rect.top;
    var nyVansterKlickadPunkt = new Point(position_x, position_y);
    handleClick(true, nyVansterKlickadPunkt);
}
//Right click
function canvasRightClicked(evt, canvas_id) {
    var rect = document.getElementById(canvas_id).getBoundingClientRect();
    var position_x = evt.clientX - rect.left;
    var position_y = evt.clientY - rect.top;
    var nyHogerKlickadPunkt = new Point(position_x, position_y);
    handleClick(false, nyHogerKlickadPunkt);
}
function getMousePos(evt, canvas_id) {
    var rect = document.getElementById(canvas_id).getBoundingClientRect();
    x_pos = evt.clientX - rect.left;
    y_pos = evt.clientY - rect.top;
    var mousePosPoint = new Point(x_pos, y_pos);
    drawMovement(mousePosPoint, firstPolygon);
}
