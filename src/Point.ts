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

    //copying values from point to the current Point-object
    copyValues(copyFromThisPoint: Point): void {
        this.x = copyFromThisPoint.x;
        this.y = copyFromThisPoint.y;
    }

    //clone a point
    clonePoint(): Point {
        let copiedPoint: Point = new Point(this.x, this.y);
        return copiedPoint;
    }

    //rotate a point around the Origin
    rotate(angle: number): Point {
        let tempX: number = this.x
        let tempY: number = this.y;
        this.x = tempX * Math.cos(angle) + tempY * Math.sin(angle);
        this.y = -tempX * Math.sin(angle) + tempY * Math.cos(angle);
        return this;
    }

    //move a point
    translate(distX: number, distY: number): Point {
        this.x += distX;
        this.y += distY;
        return this;
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

//returning the nearest point or -1 if all points are outside minDistanceIn
//only checks with the first point in a segment. So when the polygon is not closed, the last point is not checked.
//TODO: Denna borde kunna returnera en Point istälelt för ett index?? Undersök
isCloseToPoints(points: Point[], minDistanceIn: number, skipPoint?: number): number {
	//skipPoint is an optional parameter referensing the segment containing p1 not to be checked
	if (typeof skipPoint === 'undefined') { skipPoint = -1; }
	let localMinDistance: number = minDistanceIn;
	let closestPointWithinMinDistance: number = -1;
	let pointDistance: number = 0;
	for (let i = 0; i < points.length; i++) {
		if (i == skipPoint) { continue; }
		//calculating distance between new point and all other points in polygon
		pointDistance = distBetweenPoints(points[i], this);
		if (pointDistance < localMinDistance) {
			//if it is closer than minDistanceIn, or nearer than any other previously saved, it is saved
			closestPointWithinMinDistance = i;
			localMinDistance = pointDistance;
		}
	}
	return closestPointWithinMinDistance;
}

}