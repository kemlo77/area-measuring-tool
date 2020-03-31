class Point {
    public x: number;
    public y: number;


    constructor(x?: number, y?: number) {
        if (x === null || y === null) {
            x = 0;
            y = 0
        }
        else {
            this.x = x;
            this.y = y;
        }

    }

    //copying values from point so that the new point IS the same object
    copyValues(copyFromThisPoint) {
        this.x = copyFromThisPoint.x;
        this.y = copyFromThisPoint.y;
    }

    //clone a point
    clonePoint(): Point {
        var copiedPoint = new Point(this.x, this.y);
        return copiedPoint;
    }

    //rotate a point around the Origin
    rotate(angle: number): void {
        var tempX = this.x
        var tempY = this.y;
        this.x = tempX * Math.cos(angle) + tempY * Math.sin(angle);
        this.y = -tempX * Math.sin(angle) + tempY * Math.cos(angle);
    }

    //move a point
    translate(distX, distY): void {
        this.x += distX;
        this.y += distY;
    }

    //return the angle between the x-axis and a vector AB (where A is in the Origin and B is the point checked)
    getTheAngle(): number {
        const arctanAngle: number = Math.atan(this.y / this.x);
        if (this.y > 0) {
            //if the point is in q1
            if (this.x >= 0) { return arctanAngle }
            //if the point is in q2
            else { return (Math.PI + arctanAngle) }
        }
        else {
            //if the point is in q3
            if (this.x < 0) { return (Math.PI + arctanAngle) }
            //if the point is in q4
            else { return (2 * Math.PI + arctanAngle) }
        }
    }

}