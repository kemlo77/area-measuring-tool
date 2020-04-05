class ClosedState {
    constructor() { }
    static getInstance() {
        if (!ClosedState.instance) {
            ClosedState.instance = new ClosedState();
        }
        return ClosedState.instance;
    }
    stateName() { return "ClosedState"; }
    ; //TODO: ta bort senare
    handleLeftClick(polygon, pointClicked) {
        console.log("ClosedState - handleLeftClick");
        var nearPointIndex = checkIfCloseToPoint(polygon.segments, pointClicked, moveDelInsDistance);
        if (nearPointIndex > -1) {
            // on point (mark for move) -> MoveState
            polygon.movePointIndex = nearPointIndex;
            polygon.moveMode = true; //TODO: denna ska bort
            polygon.setCurrentState(MoveState.getInstance());
        }
        else {
            // on vertex (new point)
            //if the click occured near a segment, insert a new point
            var tempVar = this.checkIfCloseToLine(polygon.segments, pointClicked, moveDelInsDistance);
            if (tempVar[0]) {
                //rounding coordinates to get integers
                if (useIntegerCoords) {
                    tempVar[2].x = Math.round(tempVar[2].x);
                    tempVar[2].y = Math.round(tempVar[2].y);
                }
                //calculating distance to both points on clicked segment
                //so that it is not possible to insert a point too close to another
                const segmPointDist1 = distBetweenPoints(polygon.segments[tempVar[1]].p1, tempVar[2]);
                const segmPointDist2 = distBetweenPoints(polygon.segments[tempVar[1]].p2, tempVar[2]);
                if (((segmPointDist1 > minDistance) && (segmPointDist2 > minDistance))) {
                    //inserting the point in the segment-array
                    polygon.insertPoint(tempVar[2], tempVar[1]); //newPoint,index
                }
            }
        }
    }
    handleRightClick(polygon, pointClicked) {
        console.log("ClosedState - handleRightClick");
        const enforceNonComplexCheckBox = document.getElementById("checkboxEnforceNonComplex");
        // on point (removes point)
        //if the user rightclicked a point, remove it if there are more than 3 sides to the polygon
        var nearPointIndex = checkIfCloseToPoint(polygon.segments, pointClicked, moveDelInsDistance);
        if (nearPointIndex > -1) {
            //if polygon has more than 3 sides it is ok to remove point (+segment)
            if (polygon.segments.length > 3) {
                //check that the segment created to fill the gap does not intersect with other segments
                if (enforceNonComplexCheckBox.checked) {
                    if (!this.checkIfRemovedPointCausesSegmentIntersect(polygon.segments, nearPointIndex)) {
                        //no intersects found
                        polygon.ejectPoint(nearPointIndex);
                    }
                }
                else {
                    polygon.ejectPoint(nearPointIndex);
                }
            }
        }
        //erase segment if user right clicked "on" segment
        else {
            //check if click was near segment
            var tempVar = this.checkIfCloseToLine(polygon.segments, pointClicked, moveDelInsDistance);
            if (tempVar[0]) { //true if user clicked close enough to segment
                // on vertex (removes vertex) -> OpenState
                //tempVar[1] holds what segment
                //Changing start segment so that the one to be removed is the last one
                polygon.revolFirstIndex(tempVar[1]);
                //opening polygon and removing last segment
                polygon.segments.pop();
                polygon.setCurrentState(OpenState.getInstance());
                polygon.closed = false; //TODO: ta bort denna
            }
        }
    }
    checkIfRemovedPointCausesSegmentIntersect(segmentArrayIn, deleteAtIndex) {
        //needs only to be checked for polygons with 5 sides or more
        //i.e. a four sided polygon loosing a side becomes a triangle, that can have no sides intersecting.
        if (segmentArrayIn.length > 4) {
            //find index for the segment one step prior
            var indexBeforeDeleteAtIndex = moduloInPolygon(deleteAtIndex - 1, segmentArrayIn.length); //DAI-1
            //skapa ETT nya segment f�r valt index och det dessf�rrinnan
            //create ONE new Segment to replace chosen segment (at deleteAtIndex) and the segment prior
            var thePotentialNewSegment = new Segment(segmentArrayIn[indexBeforeDeleteAtIndex].p1, segmentArrayIn[deleteAtIndex].p2);
            //skipping the two segments to be replaced plus their neighbouring segments
            for (let p = 0; p < segmentArrayIn.length - 4; p++) {
                segmentArrayIn[moduloInPolygon((p + deleteAtIndex + 2), segmentArrayIn.length)];
                if (calculateIntersect(thePotentialNewSegment, segmentArrayIn[moduloInPolygon((p + deleteAtIndex + 2), segmentArrayIn.length)])) {
                    console.log("if that point is removed there will be an intersect");
                    return true;
                }
            }
            //if coming this far, there is no intersect found
            return false;
        }
        else {
            //if polygon had 4 sides or less, it is automatically OK
            return false;
        }
    }
    //checking if new point is near other polygon segments
    checkIfCloseToLine(segmentArrayIn, nyPunkt, minDistanceIn) {
        var distToLine = -1;
        var smallestDistance = minDistanceIn;
        var ppReturArray = new Array();
        var closeEnough = false;
        var firstPointIndex = 0;
        var closestPoint = new Point();
        //checking with every segment
        for (let j = 0; j < segmentArrayIn.length; j++) {
            //projecting point on segment
            const projectionResult = projectVector(segmentArrayIn[j], nyPunkt);
            //if it was between 0 and minDistanceIn
            if (projectionResult.successful && projectionResult.norm < minDistanceIn) {
                if (projectionResult.norm < smallestDistance) {
                    //if it is closer than minDistanceIn and closer than last saved, it is saved
                    smallestDistance = projectionResult.norm;
                    closestPoint = projectionResult.point;
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
}
