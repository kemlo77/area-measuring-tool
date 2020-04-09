class MoveState implements PolygonState {

    private static instance: MoveState;

    private constructor() { }

    public static getInstance(): MoveState {
        if (!MoveState.instance) {
            MoveState.instance = new MoveState();
        }
        return MoveState.instance;
    }

    stateName(): string { return "MoveState" }; //TODO: ta bort senare

    handleLeftClick(polygon: Polygon, pointClicked: Point): void {
        console.log("MoveState - handleLeftClick");

        // empty space (moves to new point) -> ClosedState
        //if the clicked point is not too close to another point (not checking it self, there of the 4th argument in function call)
        if (checkIfCloseToPoint(polygon.oldSegments, pointClicked, minDistance, polygon.movePointIndex) < 0) {
            //if the points nearest segments do not intersect with other segments
            if (polygon.enforceNonComplexPolygon) {
                if (!this.checkIfMovedIntersects(polygon.oldSegments, pointClicked, polygon.movePointIndex)) {
                    //move the point at movePointIndex to the new point
                    polygon.oldSegments[polygon.movePointIndex].p1.copyValues(pointClicked); //copying values so that it is still the same object
                    polygon.vertices[polygon.movePointIndex] = pointClicked;
                    this.clearTheBackCanvas();
                    polygon.setCurrentState(ClosedState.getInstance());
                }
            }
            else {
                //move the point at movePointIndex to the new point
                polygon.oldSegments[polygon.movePointIndex].p1.copyValues(pointClicked); //copying values so that it is still the same object
                this.clearTheBackCanvas();
                polygon.setCurrentState(ClosedState.getInstance());
            }
        }

    }

    handleRightClick(polygon: Polygon, pointClicked: Point): void {
        console.log("MoveState - handleRightClick");
        // (aborts move) -> ClosedState

        //aborting move mode
        polygon.movePointIndex = -1;

        polygon.setCurrentState(ClosedState.getInstance());

    }

    //checking if the two segments containing a point (being moved) intersects with the other segments in a polygon (at move)
    checkIfMovedIntersects(segmentArrayIn: Segment[], nyPunkt: Point, movedAtIndex: number): boolean {
        // if polygon has more than 3 segments, otherwise return false
        if (segmentArrayIn.length > 3) {
            //find index for segments two steps before, one step before and one step after chosen index
            //MAI ~ Move At Index
            let indexBeforeMovedAtIndex: number = moduloInPolygon(movedAtIndex - 1, segmentArrayIn.length); //MAI-1
            let indexBeforeBeforeMovedAtIndex: number = moduloInPolygon(indexBeforeMovedAtIndex - 1, segmentArrayIn.length);//MAI-2
            let indexAfterMovedAtIndex: number = moduloInPolygon(movedAtIndex + 1, segmentArrayIn.length);//MAI+1
            //creating two new Segments for chosen index and the one prior
            let firstCheckedSegment: Segment = new Segment(segmentArrayIn[indexBeforeMovedAtIndex].p1, nyPunkt);
            let secondCheckedSegment: Segment = new Segment(nyPunkt, segmentArrayIn[movedAtIndex].p2);
            //loop through all segments in segment array
            //general idea: no need to check if neighbouring segments intersect with current segment (being checked)
            for (let m = 0; m < segmentArrayIn.length; m++) {
                //skip the two unnecessary segments for both comparisons (lying next to both segments)
                if (m == movedAtIndex || m == indexBeforeMovedAtIndex) { continue; } //MAI & MAI-1
                //skip the segment before firstCheckedSegment
                if (m !== indexBeforeBeforeMovedAtIndex) { //MAI-2
                    //checking if firstCheckedSegment intersects with any of the other interesting segments
                    if (calculateIntersect(firstCheckedSegment, segmentArrayIn[m])) { return true }
                }
                //skip the segment after secondCheckedSegment
                if (m !== indexAfterMovedAtIndex) { //MAI+1
                    //checking if secondCheckedSegment intersects with any of the other interesting segments
                    if (calculateIntersect(secondCheckedSegment, segmentArrayIn[m])) { return true }
                }
            }
            //if arriving here, there are no intersects
            return false;
        }
        else {
            //if the polygon had only 3 sides, it is automatically ok
            return false;
        }
    }

    drawSegments(polygon: Polygon){
        CanvasPainter.getInstance().drawMoveStatePolygon(polygon);       
    }

    drawMovement(polygon: Polygon, mousePosition: Point): void {
        CanvasPainter.getInstance().drawMovementPolygonInMoveState(polygon,mousePosition);
    }

    clearTheBackCanvas(): void{
        CanvasPainter.getInstance().clearTheBackCanvas();
    }

    calculateSegments(polygon: Polygon): Segment[] {
        const calculatedSegments: Segment[] = new Array();
        for (let index = 1; index <polygon.vertices.length; index++) {
            const pointA: Point =polygon.vertices[index-1];
            const pointB: Point =polygon.vertices[index];
            const currentSegment: Segment = new Segment(pointA, pointB);
            calculatedSegments.push(currentSegment);
        }
        const lastPoint: Point = polygon.vertices[polygon.vertices.length-1];
        const firstPoint: Point = polygon.vertices[0];
        const lastSegment: Segment = new Segment(lastPoint,firstPoint);
        calculatedSegments.push(lastSegment);
        return calculatedSegments;
    }
}