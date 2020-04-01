class MoveState implements PolygonState {

    private static instance: MoveState;

    private constructor() { }

    public static getInstance(): MoveState {
        if (!MoveState.instance) {
            MoveState.instance = new MoveState();
        }
        return MoveState.instance;
    }

    handleLeftClick(polygon: Polygon, pointClicked: Point): void {
        console.log("MoveState - handleLeftClick");
        // empty space (moves to new point) -> ClosedState

        // on point (nothing)

        // on vertex (nothing)

        polygon.setCurrentState(OpenState.getInstance());

    }

    handleRightClick(polygon: Polygon, pointClicked: Point): void {
        console.log("MoveState - handleRightClick");
        // (aborts move) -> ClosedState

        polygon.setCurrentState(ClosedState.getInstance());

    }
}