class ClosedState implements PolygonState {

    private static instance: ClosedState;

    private constructor() { }

    public static getInstance(): ClosedState {
        if (!ClosedState.instance) {
            ClosedState.instance = new ClosedState();
        }
        return ClosedState.instance;
    }

    handleLeftClick(polygon: Polygon, pointClicked: Point): void {
        console.log("ClosedState - handleLeftClick");
        // empty space (nothing)

        // on point (mark for move) -> MoveState

        // on vertex (new point)

        polygon.setCurrentState(MoveState.getInstance());

    }

    handleRightClick(polygon: Polygon, pointClicked: Point): void {
        console.log("ClosedState - handleRightClick");
        // empty space (nothing)

        // on point (removes point)

        // on vertex (removes vertex) -> OpenState

        polygon.setCurrentState(OpenState.getInstance());

    }
}