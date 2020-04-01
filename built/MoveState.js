var MoveState = /** @class */ (function () {
    function MoveState() {
    }
    MoveState.getInstance = function () {
        if (!MoveState.instance) {
            MoveState.instance = new MoveState();
        }
        return MoveState.instance;
    };
    MoveState.prototype.handleLeftClick = function (polygon, pointClicked) {
        console.log("MoveState - handleLeftClick");
        // empty space (moves to new point) -> ClosedState
        // on point (nothing)
        // on vertex (nothing)
        polygon.setCurrentState(OpenState.getInstance());
    };
    MoveState.prototype.handleRightClick = function (polygon, pointClicked) {
        console.log("MoveState - handleRightClick");
        // (aborts move) -> ClosedState
        polygon.setCurrentState(ClosedState.getInstance());
    };
    return MoveState;
}());
