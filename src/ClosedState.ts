class ClosedState implements PolygonState {

    private static instance: ClosedState;

    private constructor() { }

    public static getInstance(): ClosedState {
        if (!ClosedState.instance) {
            ClosedState.instance = new ClosedState();
        }
        return ClosedState.instance;
    }

    stateName(): string {return "ClosedState"}; //TODO: ta bort senare

    handleLeftClick(polygon: Polygon, pointClicked: Point): void {
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
            var tempVar = checkIfCloseToLine(polygon.segments, pointClicked, moveDelInsDistance);
            if (tempVar[0]) {
                //rounding coordinates to get integers
                if (useIntegerCoords) {
                    tempVar[2].x = Math.round(tempVar[2].x);
                    tempVar[2].y = Math.round(tempVar[2].y);
                }
                //calculating distance to both points on clicked segment
                //so that it is not possible to insert a point too close to another
                const segmPointDist1: number = distBetweenPoints(polygon.segments[tempVar[1]].p1, tempVar[2]);
                const segmPointDist2: number = distBetweenPoints(polygon.segments[tempVar[1]].p2, tempVar[2]);
                if (((segmPointDist1 > minDistance) && (segmPointDist2 > minDistance))) {
                    //inserting the point in the segment-array
                    polygon.insertPoint(tempVar[2], tempVar[1]);//newPoint,index
                }
            }
        }
    }

    handleRightClick(polygon: Polygon, pointClicked: Point): void {
        console.log("ClosedState - handleRightClick");
        const enforceNonComplexCheckBox: HTMLInputElement = <HTMLInputElement>document.getElementById("checkboxEnforceNonComplex");

        // on point (removes point)
        //if the user rightclicked a point, remove it if there are more than 3 sides to the polygon
        var nearPointIndex = checkIfCloseToPoint(polygon.segments, pointClicked, moveDelInsDistance);
        if (nearPointIndex > -1) {
            //if polygon has more than 3 sides it is ok to remove point (+segment)
            if (polygon.segments.length > 3) {
                //check that the segment created to fill the gap does not intersect with other segments
                if (enforceNonComplexCheckBox.checked) {
                    if (!checkIfRemovedPointCausesSegmentIntersect(polygon.segments, nearPointIndex)) {
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
            var tempVar = checkIfCloseToLine(polygon.segments, pointClicked, moveDelInsDistance);
            if (tempVar[0]) {//true if user clicked close enough to segment
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
}