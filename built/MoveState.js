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
                if (!checkIfMovedIntersects(polygon.segments, pointClicked, polygon.movePointIndex)) {
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
    return MoveState;
}());
