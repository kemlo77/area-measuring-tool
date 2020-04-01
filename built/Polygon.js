var Polygon = /** @class */ (function () {
    function Polygon() {
        this.segments = new Array();
        this.closed = false; //TODO: denna ska bort
        this.clockWise = false;
        this.area = 0;
        this.seed = null;
        this.moveMode = false;
        this.movePointIndex = -1;
        this.currentState = OpenState.getInstance();
    }
    Polygon.prototype.setCurrentState = function (state) {
        this.currentState = state;
    };
    Polygon.prototype.handleLeftClick = function (point) {
        this.currentState.handleLeftClick(this, point);
    };
    Polygon.prototype.handleRightClick = function (point) {
        this.currentState.handleRightClick(this, point);
    };
    //closing polygon
    Polygon.prototype.close = function () {
        this.closed = true;
    };
    //changing direction of polygon (clockwise <-> counter clockwise)
    Polygon.prototype.reversePolygon = function () {
        this.segments.reverse();
        //the direction of all segments in polygon must also be reversed
        for (var u = 0; u < this.segments.length; u++) {
            this.segments[u].reverseSegment();
        }
    };
    //inserting a new point (+segment) in a polygon segment array, at a given index
    Polygon.prototype.insertPoint = function (newPointIn, insertAtThisIndex) {
        //splitting a segment (A-B) that is given a new point
        //the new Segment goes from breakPoint to point B
        //the old segment is changed so that it goes from point A to the breakPoint
        //new Segment starts at the breaking point, ends where the divided segment ended (B)
        var tempSegmentToInsert = new Segment(newPointIn, this.segments[insertAtThisIndex].p2);
        //add new Segment after the break
        this.segments.splice(insertAtThisIndex + 1, 0, tempSegmentToInsert);
        //chagning segment before the break so that the end point is now the breakPoint
        this.segments[insertAtThisIndex].p2 = newPointIn;
    };
    //calculating area and checking if polygon is drawn clockwise or not
    Polygon.prototype.gShoeLace = function () {
        //using the Gauss shoelace formula
        //http://en.wikipedia.org/wiki/Shoelace_formula
        if (this.closed) {
            var theSum = 0;
            for (var b = 0; b < this.segments.length; b++) {
                theSum += this.segments[b].p1.x * this.segments[b].p2.y - this.segments[b].p1.y * this.segments[b].p2.x;
            }
            this.area = theSum / 2;
            //see also http://en.wikipedia.org/wiki/Curve_orientation
            if (this.area > 0) {
                this.clockWise = true;
            }
            else {
                this.clockWise = false;
            }
        }
    };
    //changing the starting point in the polygon (i.e. chaing what segment is the starting segment)
    Polygon.prototype.revolFirstIndex = function (newFirstIndex) {
        if (this.closed) {
            //handling if newFirstIndex is larger than the number of segments
            newFirstIndex = moduloInPolygon(newFirstIndex, this.segments.length);
            //removing the group of segments (up until newfirstindex)
            var tempArray = this.segments.splice(0, newFirstIndex + 1);
            //l�gger den stumpen p� slutet
            //adding the group of segments to the end of the other part
            this.segments = this.segments.concat(tempArray);
            //changing the polygon seed point to the first point
            this.seed = this.segments[0].p1;
        }
    };
    //removing a point (+segment) from a polygon segment-array, at a given index
    Polygon.prototype.ejectPoint = function (removeAtThisIndex) {
        //the point to be removed is the first point in the segment with index=removeAtThisIndex
        //the index for the segment prior to the segment removed (handled if removeAtThisIndex==0)
        var indexBeforeRemoveAtThisIndex = moduloInPolygon((removeAtThisIndex - 1), this.segments.length);
        //changing the "second point in the prior segment" to the second point in the segment to be removed
        this.segments[indexBeforeRemoveAtThisIndex].p2 = this.segments[removeAtThisIndex].p2;
        //removing the segment
        this.segments.splice(removeAtThisIndex, 1);
    };
    return Polygon;
}());
