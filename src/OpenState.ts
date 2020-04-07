class OpenState implements PolygonState {

    private static instance: OpenState;

    private constructor() { }

    public static getInstance(): OpenState {
        if (!OpenState.instance) {
            OpenState.instance = new OpenState();
        }
        return OpenState.instance;
    }

    stateName(): string { return "OpenState" }; //TODO: ta bort senare

    handleLeftClick(polygon: Polygon, pointClicked: Point): void {
        console.log("OpenState - handleLeftClick");

        const enforceNonComplexCheckBox: HTMLInputElement = <HTMLInputElement>document.getElementById("checkboxEnforceNonComplex");

        //check if this is the first segment
        if (polygon.segments.length > 0) {
            //check if user clicks near the first point (wanting to close the polygon)
            if (distBetweenPoints(pointClicked, polygon.segments[0].p1) < closePolygonMinimumDistance) {
                //if the plygon already has at least 2 segments
                if (polygon.segments.length >= 2) {
                    //check that the segment between the last point and first point does not intersect with other segments
                    const nyttSegment: Segment = new Segment(polygon.segments[polygon.segments.length - 1].p2, polygon.segments[0].p1);
                    if (enforceNonComplexCheckBox.checked) {
                        if (!this.checkIfIntersect(polygon.segments, nyttSegment, true)) {
                            polygon.segments.push(nyttSegment);
                            polygon.close();
                        }
                    }
                    else {
                        polygon.segments.push(nyttSegment);
                        polygon.close();
                    }
                    CanvasPainter.getInstance().clearTheBackCanvas();
                    polygon.setCurrentState(ClosedState.getInstance());
                }
            }
            else {
                //if the new Segment does not intersect with other segments or the new point to close to other points, the add the point (+segment)
                const nyttSegment: Segment = new Segment(polygon.segments[polygon.segments.length - 1].p2, pointClicked);
                if (checkIfCloseToPoint(polygon.segments, pointClicked, minDistance) < 0) {//checking p1 in all segments
                    if (distBetweenPoints(polygon.segments[polygon.segments.length - 1].p2, pointClicked) > minDistance) {//checking p2 in the last segment
                        if (enforceNonComplexCheckBox.checked) {
                            if (!this.checkIfIntersect(polygon.segments, nyttSegment, false)) {
                                polygon.segments.push(nyttSegment);
                            }
                        }
                        else {
                            polygon.segments.push(nyttSegment);
                        }
                    }
                }
            }
        }
        else {//if seed does not exist (nor any other elements) Add the first point.
            if (polygon.seed == null) {
                //console.log("first point");
                polygon.seed = pointClicked;
            }
            else {
                //if it is not to close to the fist point, add the second point
                if (distBetweenPoints(polygon.seed, pointClicked) > minDistance) {
                    //console.log("first segment");
                    let nyttSegment: Segment = new Segment(polygon.seed, pointClicked);
                    polygon.segments.push(nyttSegment);
                }
            }
        }
    }

    handleRightClick(polygon: Polygon, pointClicked: Point): void {
        console.log("OpenState - handleRightClick");
        //removes last added point (+segment)
        if (polygon.segments.length == 0) {
            polygon.seed = null;
            //console.log("removed seed point");
        }
        polygon.segments.pop();
    }


    //checking if new Segment intersects with other segment in array
    checkIfIntersect(segmentArrayIn: Segment[], nyttSegmentIn: Segment, skipFirstSegment: boolean): boolean {
        let startSegm = 0;
        if (skipFirstSegment) { startSegm = 1; }//skipping first segment in case user clicks the polygons first point
        //skipping the second to last (penultimate segment)
        for (let n = startSegm; n < segmentArrayIn.length - 1; n++) {

            if (calculateIntersect(segmentArrayIn[n], nyttSegmentIn)) {
                //returning true if there is a intersect
                return true;
            }
        }
        //arriving here, there is no intersect
        return false;
    }

    drawSegments(polygon: Polygon){
        CanvasPainter.getInstance().drawOpenPolygon(polygon);
    }

    drawMovement(polygon: Polygon, mousePosition: Point): void {
        CanvasPainter.getInstance().drawMovementPolygonInOpenState(polygon,mousePosition);

    }
}