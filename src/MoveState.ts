class MoveState implements PolygonState {

    private static instance: MoveState;

    private constructor() { }

    public static getInstance(): MoveState {
        if (!MoveState.instance) {
            MoveState.instance = new MoveState();
        }
        return MoveState.instance;
    }

    stateName(): string {return "MoveState"}; //TODO: ta bort senare

    handleLeftClick(polygon: Polygon, pointClicked: Point): void {
        console.log("MoveState - handleLeftClick");

        const enforceNonComplexCheckBox: HTMLInputElement = <HTMLInputElement>document.getElementById("checkboxEnforceNonComplex");

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

    }

    handleRightClick(polygon: Polygon, pointClicked: Point): void {
        console.log("MoveState - handleRightClick");
        // (aborts move) -> ClosedState

        //aborting move mode
        polygon.moveMode = false;
        polygon.movePointIndex = -1;

        polygon.setCurrentState(ClosedState.getInstance());

    }
}