let moveDelInsDistance: number = 3; //TODO: Döp om denna
let minDistance: number = 8;
let closePolygonMinimumDistance: number = 5;
let useIntegerCoords: boolean = false;

let firstPolygon: Polygon;


function init(): void {
	firstPolygon = new Polygon();
}

function clearEntirely(): void {
	firstPolygon = new Polygon();
	CanvasPainter.getInstance().clearBothCanvas();
}

function handleClick(isLeftClick: boolean, mousePosition: Point): void {
	if (isLeftClick) {
		firstPolygon.handleLeftClick(mousePosition);
	}
	else {
		firstPolygon.handleRightClick(mousePosition);
	}
	firstPolygon.drawSegments();
	firstPolygon.drawMovement(mousePosition);
	console.log('number of vertices: ' + firstPolygon.vertices.length);
	//firstPolygon.vertices.forEach((punkt) => console.log(punkt.x + ',' + punkt.y + ' '));
	//console.log(firstPolygon.vertices.reduce((sum, it) => sum + '   ' + it.x + ',' + it.y, ''));
	console.log('number of segments: ' + firstPolygon.segments.length);
	//console.log(firstPolygon.segments.reduce((sum, it) => sum + ' ' + it.p1.x + ',' + it.p1.y + '--' + it.p2.x + ',' + it.p2.y, ''));
}


//checks if new point is too close to other points
//returning the nearest point or -1 if all points are outside minDistanceIn
//only checks with the first point in a segment. So when the polygon is not closed, the last point is not checked.
//TODO: Denna borde kunna returnera en Point istälelt för ett index?? Undersök
function checkIfCloseToPoint(points: Point[], candidatePoint: Point, minDistanceIn: number, skipPoint?: number): number {
	//skipPoint is an optional parameter referensing the segment containing p1 not to be checked
	if (typeof skipPoint === 'undefined') { skipPoint = -1; }
	let localMinDistance: number = minDistanceIn;
	let closestPointWithinMinDistance: number = -1;
	let pointDistance: number = 0;
	for (let i = 0; i < points.length; i++) {
		if (i == skipPoint) { continue; }
		//calculating distance between new point and all other points in polygon
		pointDistance = distBetweenPoints(points[i], candidatePoint);
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
function getMousePos(event: MouseEvent, canvasId: string): void {
	const rect: ClientRect = document.getElementById(canvasId).getBoundingClientRect();
	const mousePositionX: number = event.clientX - rect.left;
	const mousePositionY: number = event.clientY - rect.top;
	const mousePosition = new Point(mousePositionX, mousePositionY);
	//TODO: borde nog inte specifikt ange vilken polygon här, kanske hämta aktuell?
	firstPolygon.drawMovement(mousePosition);
}