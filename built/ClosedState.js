var ClosedState = /** @class */ (function () {
    function ClosedState() {
    }
    ClosedState.getInstance = function () {
        if (!ClosedState.instance) {
            ClosedState.instance = new ClosedState();
        }
        return ClosedState.instance;
    };
    ClosedState.prototype.handleLeftClick = function (polygon, pointClicked) {
        console.log("ClosedState - handleLeftClick");
        // empty space (nothing)
        // on point (mark for move) -> MoveState
        // on vertex (new point)
        polygon.setCurrentState(MoveState.getInstance());
    };
    ClosedState.prototype.handleRightClick = function (polygon, pointClicked) {
        console.log("ClosedState - handleRightClick");
        // empty space (nothing)
        // on point (removes point)
        // on vertex (removes vertex) -> OpenState
        polygon.setCurrentState(OpenState.getInstance());
    };
    return ClosedState;
}());
