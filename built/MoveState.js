var MoveState = /** @class */ (function () {
    function MoveState() {
    }
    MoveState.getInstance = function () {
        if (!MoveState.instance) {
            MoveState.instance = new MoveState();
        }
        return MoveState.instance;
    };
    MoveState.prototype.stateName = function () { return "MoveState"; };
    ; //TODO: ta bort senare
    MoveState.prototype.handleLeftClick = function (polygon, pointClicked) {
        console.log("MoveState - handleLeftClick");
        var enforceNonComplexCheckBox = document.getElementById("checkboxEnforceNonComplex");
        // empty space (moves to new point) -> ClosedState
        //if the clicked point is not to close to another point (not checking it self, there of the 4th argument in function call)
        if (checkIfCloseToPoint(polygon.segments, pointClicked, minDistance, polygon.movePointIndex) < 0) {
            //if the points nearest segments do not intersect with other segments
            if (enforceNonComplexCheckBox.checked) {
                if (!this.checkIfMovedIntersects(polygon.segments, pointClicked, polygon.movePointIndex)) {
                    //move the point at movePointIndex to the new point
                    polygon.segments[polygon.movePointIndex].p1.copyValues(pointClicked); //copying values so that it is still the same object
                    polygon.moveMode = false;
                    polygon.setCurrentState(ClosedState.getInstance());
                }
            }
            else {
                //move the point at movePointIndex to the new point
                polygon.segments[polygon.movePointIndex].p1.copyValues(pointClicked); //copying values so that it is still the same object
                polygon.moveMode = false;
                polygon.setCurrentState(ClosedState.getInstance());
            }
        }
    };
    MoveState.prototype.handleRightClick = function (polygon, pointClicked) {
        console.log("MoveState - handleRightClick");
        // (aborts move) -> ClosedState
        //aborting move mode
        polygon.moveMode = false;
        polygon.movePointIndex = -1;
        polygon.setCurrentState(ClosedState.getInstance());
    };
    //checking if the two segments containing a point (being moved) intersects with the other segments in a polygon (at move)
    MoveState.prototype.checkIfMovedIntersects = function (segmentArrayIn, nyPunkt, movedAtIndex) {
        // if polygon has more than 3 segments, otherwise return false
        if (segmentArrayIn.length > 3) {
            //find index for segments two steps before, one step before and one step after chosen index
            //MAI ~ Move At Index
            var indexBeforeMovedAtIndex = moduloInPolygon(movedAtIndex - 1, segmentArrayIn.length); //MAI-1
            var indexBeforeBeforeMovedAtIndex = moduloInPolygon(indexBeforeMovedAtIndex - 1, segmentArrayIn.length); //MAI-2
            var indexAfterMovedAtIndex = moduloInPolygon(movedAtIndex + 1, segmentArrayIn.length); //MAI+1
            //creating two new Segments for chosen index and the one prior
            var firstCheckedSegment = new Segment(segmentArrayIn[indexBeforeMovedAtIndex].p1, nyPunkt);
            var secondCheckedSegment = new Segment(nyPunkt, segmentArrayIn[movedAtIndex].p2);
            //loop through all segments in segment array
            //general idea: no need to check if neighbouring segments intersect with current segment (being checked)
            for (var m = 0; m < segmentArrayIn.length; m++) {
                //skip the two unnecessary segments for both comparisons (lying next to both segments)
                if (m == movedAtIndex || m == indexBeforeMovedAtIndex) {
                    continue;
                } //MAI & MAI-1
                //skip the segment before firstCheckedSegment
                if (m !== indexBeforeBeforeMovedAtIndex) { //MAI-2
                    //checking if firstCheckedSegment intersects with any of the other interesting segments
                    if (calculateIntersect(firstCheckedSegment, segmentArrayIn[m])[0]) {
                        return true;
                    }
                }
                //skip the segment after secondCheckedSegment
                if (m !== indexAfterMovedAtIndex) { //MAI+1
                    //checking if secondCheckedSegment intersects with any of the other interesting segments
                    if (calculateIntersect(secondCheckedSegment, segmentArrayIn[m])[0]) {
                        return true;
                    }
                }
            }
            //if arriving here, there are no intersects
            return false;
        }
        else {
            //if the polygon had only 3 sides, it is automatically ok
            return false;
        }
    };
    return MoveState;
}());