class OpenState implements PolygonState {

    private static instance: OpenState;

    private constructor() { }

    public static getInstance(): OpenState {
        if (!OpenState.instance) {
            OpenState.instance = new OpenState();
        }
        return OpenState.instance;
    }

    handleLeftClick(polygon: Polygon, pointClicked: Point): void {
        console.log("OpenState - handleLeftClick");

        // empty space (new point)

        // on point if on endpoint (closes)-> ClosedState
        // on point if on other point (nothing)

        // on vertex (nothing)
        polygon.setCurrentState(ClosedState.getInstance());

    }

    handleRightClick(polygon: Polygon, pointClicked: Point): void {
        console.log("OpenState - handleRightClick");
        // remove last point

        polygon.setCurrentState(MoveState.getInstance());
    }
}