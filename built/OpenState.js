var OpenState = /** @class */ (function () {
    function OpenState() {
    }
    OpenState.getInstance = function () {
        if (!OpenState.instance) {
            OpenState.instance = new OpenState();
        }
        return OpenState.instance;
    };
    OpenState.prototype.stateName = function () { return "OpenState"; };
    ; //TODO: ta bort senare
    OpenState.prototype.handleLeftClick = function (polygon, pointClicked) {
        console.log("OpenState - handleLeftClick");
        var enforceNonComplexCheckBox = document.getElementById("checkboxEnforceNonComplex");
        //check if this is the first segment
        if (polygon.segments.length > 0) {
            //check if user clicks near the first point (wanting to close the polygon)
            if (distBetweenPoints(pointClicked, polygon.segments[0].p1) < closePolygonMinimumDistance) {
                //if the plygon already has at least 2 segments
                if (polygon.segments.length >= 2) {
                    //check that the segment between the last point and first point does not intersect with other segments
                    var nyttSegment = new Segment(polygon.segments[polygon.segments.length - 1].p2, polygon.segments[0].p1);
                    if (enforceNonComplexCheckBox.checked) {
                        if (!this.checkIfIntersect(polygon.segments, nyttSegment, true)) {
                            polygon.segments.push(nyttSegment); // TODO: kolla dubbel kod
                            polygon.close(); // TODO: kolla dubbel kod
                        }
                    }
                    else {
                        polygon.segments.push(nyttSegment); // TODO: kolla dubbel kod
                        polygon.close(); // TODO: kolla dubbel kod
                    }
                    polygon.setCurrentState(ClosedState.getInstance());
                }
            }
            else {
                //if the new Segment does not intersect with other segments or the new point to close to other points, the add the point (+segment)
                var nyttSegment = new Segment(polygon.segments[polygon.segments.length - 1].p2, pointClicked);
                if (checkIfCloseToPoint(polygon.segments, pointClicked, minDistance) < 0) { //checking p1 in all segments
                    if (distBetweenPoints(polygon.segments[polygon.segments.length - 1].p2, pointClicked) > minDistance) { //checking p2 in the last segment
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
        else { //if seed does not exist (nor any other elements) Add the first point.
            if (polygon.seed == null) {
                //console.log("first point");
                polygon.seed = pointClicked;
            }
            else {
                //if it is not to close to the fist point, add the second point
                if (distBetweenPoints(polygon.seed, pointClicked) > minDistance) {
                    //console.log("first segment");
                    var nyttSegment = new Segment(polygon.seed, pointClicked);
                    polygon.segments.push(nyttSegment);
                }
            }
        }
        // empty space (new point)
        // on point if on endpoint (closes)-> ClosedState
        // on point if on other point (nothing)
        // on vertex (nothing)
    };
    OpenState.prototype.handleRightClick = function (polygon, pointClicked) {
        console.log("OpenState - handleRightClick");
        //removes last added point (+segment)
        if (polygon.segments.length == 0) {
            polygon.seed = null;
            //console.log("removed seed point");
        }
        polygon.segments.pop();
    };
    //checking if new Segment intersects with other segment in array
    OpenState.prototype.checkIfIntersect = function (segmentArrayIn, nyttSegmentIn, skipFirstSegment) {
        var startSegm = 0;
        if (skipFirstSegment) {
            startSegm = 1;
        } //skipping first segment in case user clicks the polygons first point
        //skipping the second to last (penultimate segment)
        for (var n = startSegm; n < segmentArrayIn.length - 1; n++) {
            var result = calculateIntersect(segmentArrayIn[n], nyttSegmentIn);
            if (result[0]) {
                //returning true if there is a intersect
                return true;
            }
        }
        //arriving here, there is no intersect
        return false;
    };
    return OpenState;
}());
