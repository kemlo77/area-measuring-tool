var moveDelInsDistance = 3; //TODO: Döp om denna
var minDistance = 8;
var useIntegerCoords = false;
var closePolygonMinimumDistance = 5;
let firstPolygon: Polygon;


function init(): void {
	firstPolygon = new Polygon();
}

function clearEntirely(): void {
	firstPolygon = new Polygon();
	CanvasPainter.getInstance().clearBothCanvas();
}

function handleClick(isLeftClick, theClickedPoint): void {
	if (isLeftClick) {
		firstPolygon.handleLeftClick(theClickedPoint);
	}
	else {
		firstPolygon.handleRightClick(theClickedPoint);
	}
	CanvasPainter.getInstance().drawPolygon(firstPolygon);
	CanvasPainter.getInstance().drawMovement(theClickedPoint, firstPolygon)
}



//checks if new point is too close to other points
//returning the nearest point or -1 if all points are outside minDistanceIn
//only checks with the first point in a segment. So when the polygon is not closed, the last point is not checked.
function checkIfCloseToPoint(segmentArrayIn: Segment[], nyPunkt: Point, minDistanceIn: number, skipPoint?: number): number {
	//TODO: skriv om denna så att den får in punkterna i Polygonen
	//skipPoint is an optional parameter referensing the segment containing p1 not to be checked
	if (typeof skipPoint === 'undefined') { skipPoint = -1; }
	let localMinDistance: number = minDistanceIn;
	let closestPointWithinMinDistance: number = -1;
	let pointDistance: number = 0;
	for (let i = 0; i < segmentArrayIn.length; i++) {
		if (i == skipPoint) { continue; }
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


function canvasLeftClicked(event: MouseEvent, canvasId: string): void {
	const rect: ClientRect = document.getElementById(canvasId).getBoundingClientRect();
	const clickedPositionX: number = event.clientX - rect.left;
	const clickedPositionY: number = event.clientY - rect.top;
	const leftClickedPoint: Point = new Point(clickedPositionX, clickedPositionY);
	handleClick(true, leftClickedPoint);
}

function canvasRightClicked(event: MouseEvent, canvasId: string): void {
	const rect: ClientRect = document.getElementById(canvasId).getBoundingClientRect();
	const clickedPositionX: number = event.clientX - rect.left;
	const clickedPositionY: number = event.clientY - rect.top;
	const rightClickedPoint: Point = new Point(clickedPositionX, clickedPositionY);
	handleClick(false, rightClickedPoint);
}
function getMousePos(event: MouseEvent, canvadId: string): void {
	var rect: ClientRect = document.getElementById(canvadId).getBoundingClientRect();
	const mousePositionX: number = event.clientX - rect.left;
	const mousePositionY: number = event.clientY - rect.top;
	var mousePosition = new Point(mousePositionX, mousePositionY);
	//TODO: borde nog inte specifikt ange vilken polygon här, kanske hämta aktuell?
	CanvasPainter.getInstance().drawMovement(mousePosition, firstPolygon);
}