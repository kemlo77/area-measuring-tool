export class Point {
    public x: number;
    public y: number;


    constructor(x?: number, y?: number) {
        if (x === null || y === null) {
            x = 0;
            y = 0;
        }
        else {
            this.x = x;
            this.y = y;
        }

    }

    // copying values from point to the current Point-object
    copyValues(copyFromThisPoint: Point): void {
        this.x = copyFromThisPoint.x;
        this.y = copyFromThisPoint.y;
    }

    // clone a point
    clonePoint(): Point {
        const copiedPoint: Point = new Point(this.x, this.y);
        return copiedPoint;
    }

    // rotate a point around the Origin
    rotate(angle: number): Point {
        const tempX: number = this.x;
        const tempY: number = this.y;
        this.x = tempX * Math.cos(angle) + tempY * Math.sin(angle);
        this.y = -tempX * Math.sin(angle) + tempY * Math.cos(angle);
        return this;
    }

    // move a point
    translate(distX: number, distY: number): Point {
        this.x += distX;
        this.y += distY;
        return this;
    }

    // return the angle between the x-axis and a vector AB (where A is in the Origin and B is the point checked)
    getTheAngle(): number {
        const arctanAngle: number = Math.atan(this.y / this.x);
        if (this.y > 0) {
            // if the point is in q1
            if (this.x >= 0) { return arctanAngle; }
            // if the point is in q2
            else { return (Math.PI + arctanAngle); }
        }
        else {
            // if the point is in q3
            if (this.x < 0) { return (Math.PI + arctanAngle); }
            // if the point is in q4
            else { return (2 * Math.PI + arctanAngle); }
        }
    }

    // returning the nearest point or null if all points are outside minDistanceIn
    isCloseToPoints(points: Point[], minDistanceIn: number, skipPoint?: Point): Point {
        if (typeof skipPoint === 'undefined') { skipPoint = null; }
        let localMinDistance: number = minDistanceIn;
        let closestPointWithinMinDistance: Point = null;
        for (const point of points) {
            if (point === skipPoint) { continue; }
            const pointDistance: number = this.distanceToOtherPoint(point);
            if (pointDistance < localMinDistance) {
                // if it is closer than minDistanceIn, or nearer than any other previously saved, it is saved
                closestPointWithinMinDistance = point;
                localMinDistance = pointDistance;
            }
        }
        return closestPointWithinMinDistance;
    }

    // Check the distance between two points
    distanceToOtherPoint(otherPoint: Point): number {
        return Math.sqrt(Math.pow(this.x - otherPoint.x, 2) + Math.pow(this.y - otherPoint.y, 2));
    }

}