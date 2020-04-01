var OpenState = /** @class */ (function () {
    function OpenState() {
    }
    OpenState.getInstance = function () {
        if (!OpenState.instance) {
            OpenState.instance = new OpenState();
        }
        return OpenState.instance;
    };
    OpenState.prototype.handleLeftClick = function (polygon, pointClicked) {
        console.log("OpenState - handleLeftClick");
        // empty space (new point)
        // on point if on endpoint (closes)-> ClosedState
        // on point if on other point (nothing)
        // on vertex (nothing)
        polygon.setCurrentState(ClosedState.getInstance());
    };
    OpenState.prototype.handleRightClick = function (polygon, pointClicked) {
        console.log("OpenState - handleRightClick");
        // remove last point
        polygon.setCurrentState(MoveState.getInstance());
    };
    return OpenState;
}());
