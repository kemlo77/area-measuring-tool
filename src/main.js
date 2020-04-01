var moveDelInsDistance = 3;
var minDistance = 8;
var useIntegerCoords = false;
var closePolygonMinimumDistance = 5;


function init() {
	var canvasBackground = document.getElementById("background");
	if (canvasBackground.getContext) { ctxBack = canvasBackground.getContext("2d"); }
	var canvasForeground = document.getElementById("foreground");
	if (canvasForeground.getContext) { ctxFront = canvasForeground.getContext("2d"); }
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
	//calculate area and check if polygon is drawn clockwise or not
	firstPolygon.gShoeLace();
	//change to clockwise if checkbox is ticked
	if (!firstPolygon.clockWise && document.getElementById("checkboxEnforceClockwise").checked) {
		firstPolygon.reversePolygon();
	}
	drawPolygon(firstPolygon);
	//clearUsedCanvas();
	drawMovement(theClickedPoint, firstPolygon)
}

function leftClickClosed(handledPolygon, newlyClickedPoint) { }

function leftClickClosedMoveMode(handledPolygon, newlyClickedPoint) { }

function leftClickOpen(handledPolygon, newlyClickedPoint) { }

function rightClickOpen(handledPolygon) { }

function rightClickClosed(handledPolygon, newlyClickedPoint) { }

function rightClickClosedMoveMode(handledPolygon) { }

function checkIfRemovedPointCausesSegmentIntersect(segmentArrayIn, deleteAtIndex) {
	//needs only to be checked for polygons with 5 sides or more
	//i.e. a four sided polygon loosing a side becomes a triangle, that can have no sides intersecting.
	if (segmentArrayIn.length > 4) {
		//find index for the segment one step prior
		var indexBeforeDeleteAtIndex = moduloInPolygon(deleteAtIndex - 1, segmentArrayIn.length); //DAI-1
		//skapa ETT nya segment f�r valt index och det dessf�rrinnan
		//create ONE new Segment to replace chosen segment (at deleteAtIndex) and the segment prior
		var thePotentialNewSegment = new Segment(segmentArrayIn[indexBeforeDeleteAtIndex].p1, segmentArrayIn[deleteAtIndex].p2);
		//skipping the two segments to be replaced plus their neighbouring segments
		for (p = 0; p < segmentArrayIn.length - 4; p++) {
			//drawOneSegment(segmentArrayIn[moduloInPolygon((p+deleteAtIndex+2),segmentArrayIn.length)],"0,0,255");
			segmentArrayIn[moduloInPolygon((p + deleteAtIndex + 2), segmentArrayIn.length)]
			if (calculateIntersect(thePotentialNewSegment, segmentArrayIn[moduloInPolygon((p + deleteAtIndex + 2), segmentArrayIn.length)])[0]) {
				drawOneSegment(thePotentialNewSegment, "255,0,0");
				console.log("if that point is removed there will be an intersect");
				return true;
			}
		}
		//if coming this fara, there is no intersect found
		return false;
	}
	else {
		//if polygon had 4 sides or less, it is automatically OK
		return false;
	}
}

//checks if new point is too close to other points
//returning the nearest point or -1 if all points are outside minDistanceIn
//only checks with the first point in a segment. So when the polygon is not closed, the last point is not checked.
function checkIfCloseToPoint(segmentArrayIn, nyPunkt, minDistanceIn, skipPoint) {
	//skipPoint is an optional parameter referensing the segment containing p1 not to be checked
	if (typeof skipPoint === 'undefined') { skipPoint = -1; }
	var localMinDistance = minDistanceIn;
	var isTooClose = -1;
	var pointDistance = 0;
	for (i = 0; i < segmentArrayIn.length; i++) {
		if (i == skipPoint) { continue; }
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

//checking if new point is near other polygon segments
function checkIfCloseToLine(segmentArrayIn, nyPunkt, minDistanceIn) {
	var distToLine = -1;
	var smallestDistance = minDistanceIn;
	var ppReturArray = new Array();
	var closeEnough = false;
	var firstPointIndex = 0;
	var closestPoint = new Point();
	//checking with every segment
	for (j = 0; j < segmentArrayIn.length; j++) {
		//projecting point on segment
		var proj_svar = project_vector(segmentArrayIn[j], nyPunkt);
		var distToLine = proj_svar[0]; //negative if it is too far away
		var projPunkten = proj_svar[1];   //0 if it is too far away
		//if it was between 0 and minDistanceIn
		if (distToLine >= 0 && distToLine < minDistanceIn) {
			if (distToLine < smallestDistance) {
				//if it is closer than minDistanceIn and closer than last saved, it is saved
				smallestDistance = distToLine;
				closestPoint = projPunkten;
				firstPointIndex = j;
			}
			closeEnough = true;
		}
	}
	ppReturArray.push(closeEnough); //true, if there was anything close enough
	ppReturArray.push(firstPointIndex); //index for the first point on segment clicked (index for the segment clicked?)
	ppReturArray.push(closestPoint); //the point projected on the segment
	return ppReturArray;
}

//checking if new Segment intersects with other segment in array
function checkIfIntersect(segmentArrayIn, nyttSegmentIn, skipFirstSegment) {
	var startSegm = 0;
	if (skipFirstSegment) { startSegm = 1; }//skipping first segment in case user clicks the polygons first point
	//skipping the second to last (penultimate segment)
	for (n = startSegm; n < segmentArrayIn.length - 1; n++) {
		result = calculateIntersect(segmentArrayIn[n], nyttSegmentIn);
		if (result[0]) {
			//returning true if there is a intersect
			return true;
		}
	}
	//arriving here, there is no intersect
	return false;
}

//checking if the two segments containing a point (being moved) intersects with the other segments in a polygon (at move)
function checkIfMovedIntersects(segmentArrayIn, nyPunkt, movedAtIndex) {
	// if polygon has more than 3 segments, otherwise return false
	if (segmentArrayIn.length > 3) {
		//find index for segments two steps before, one step before and one step after chosen index
		//MAI ~ Move At Index
		var indexBeforeMovedAtIndex = moduloInPolygon(movedAtIndex - 1, segmentArrayIn.length); //MAI-1
		var indexBeforeBeforeMovedAtIndex = moduloInPolygon(indexBeforeMovedAtIndex - 1, segmentArrayIn.length);//MAI-2
		var indexAfterMovedAtIndex = moduloInPolygon(movedAtIndex + 1, segmentArrayIn.length);//MAI+1
		//creating two new Segments for chosen index and the one prior
		var firstCheckedSegment = new Segment(segmentArrayIn[indexBeforeMovedAtIndex].p1, nyPunkt);
		var secondCheckedSegment = new Segment(nyPunkt, segmentArrayIn[movedAtIndex].p2);
		//loop through all segments in segment array
		//general idea: no need to check if neighbouring segments intersect with current segment (being checked)
		for (m = 0; m < segmentArrayIn.length; m++) {
			//skip the two unnecessary segments for both comparisons (lying next to both segments)
			if (m == movedAtIndex || m == indexBeforeMovedAtIndex) { continue; } //MAI & MAI-1
			//skip the segment before firstCheckedSegment
			if (m !== indexBeforeBeforeMovedAtIndex) { //MAI-2
				//checking if firstCheckedSegment intersects with any of the other interesting segments
				if (calculateIntersect(firstCheckedSegment, segmentArrayIn[m])[0]) { return true }
			}
			//skip the segment after secondCheckedSegment
			if (m !== indexAfterMovedAtIndex) { //MAI+1
				//checking if secondCheckedSegment intersects with any of the other interesting segments
				if (calculateIntersect(secondCheckedSegment, segmentArrayIn[m])[0]) { return true }
			}
		}
		//if arriving here, there are no intersects
		return false;
	}
	else {
		//if the polygon had only 3 sides, it is automatically ok
		return false;
	}
}
