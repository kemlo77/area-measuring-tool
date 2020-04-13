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
	// TODO: borde nog inte specifikt ange vilken polygon här, kanske hämta aktuell?
	firstPolygon.drawMovement(mousePosition);
}