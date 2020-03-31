class Segment {
    public p1: Point;
    public p2: Point;

    constructor(punkt1: Point, punkt2: Point) {
        this.p1 = punkt1;
        this.p2 = punkt2;
    }

    //TODO remove? it is unused
    calculateLength(): number {
        var segmentLength = Math.sqrt(Math.pow((this.p1.x - this.p2.x), 2) + Math.pow((this.p1.y - this.p2.y), 2));
        return segmentLength;
    }


    reverseSegment(): void {
        var tempReversePoint = this.p1;
        this.p1 = this.p2;
        this.p2 = tempReversePoint;
    }

}