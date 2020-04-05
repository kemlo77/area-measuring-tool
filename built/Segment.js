class Segment {
    constructor(punkt1, punkt2) {
        this.p1 = punkt1;
        this.p2 = punkt2;
    }
    //TODO remove? it is unused
    calculateLength() {
        var segmentLength = Math.sqrt(Math.pow((this.p1.x - this.p2.x), 2) + Math.pow((this.p1.y - this.p2.y), 2));
        return segmentLength;
    }
    reverseSegment() {
        var tempReversePoint = this.p1;
        this.p1 = this.p2;
        this.p2 = tempReversePoint;
    }
}
