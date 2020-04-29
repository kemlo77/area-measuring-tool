export class Point {
    public x: number;
    public y: number;


    constructor(point?: Point)
    constructor(x: number, y: number)
    constructor(xOrPoint?: Point | number, y?: number) {
        if (xOrPoint === undefined || xOrPoint === null) {
            this.x = 0;
            this.y = 0;
        } else if (xOrPoint instanceof Point) {
            this.x = xOrPoint.x;
            this.y = xOrPoint.y;
        } else if (typeof xOrPoint === 'number'){
            if(typeof y !== 'undefined'){
                this.x=xOrPoint;
                this.y=y;
            } else {
                throw new Error('Invalid parameters');
            }
        } else {
            throw new Error('Invalid parameters');
        }
    }

    copyValues(copyFromThisPoint: Point): void {
        this.x = copyFromThisPoint.x;
        this.y = copyFromThisPoint.y;
    }

    // rotate a point around the Origin
    rotateClockwise(angle: number): Point {
        const tempX: number = this.x;
        const tempY: number = this.y;
        this.x = tempX * Math.cos(angle) + tempY * Math.sin(angle);
        this.y = -tempX * Math.sin(angle) + tempY * Math.cos(angle);
        return this;
    }

    translate(distX: number, distY: number): Point {
        this.x += distX;
        this.y += distY;
        return this;
    }

    // return the angle between the x-axis and a vector AB (where A is in the Origin and B is the point checked)
    getTheAngle(): number {
        const arctanAngle: number = Math.atan(this.y / this.x);
        if (this.y >= 0) {
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

    nearestPointWithinDistance(points: Point[], distance: number, skipPoint?: Point): Point {
        let smallestObservedDistance: number = distance;
        let closestPointWithinDistance: Point = null;
        for (const point of points) {
            if (point === skipPoint) { continue; }
            const pointDistance: number = this.distanceToOtherPoint(point);
            if (pointDistance < smallestObservedDistance) {
                closestPointWithinDistance = point;
                smallestObservedDistance = pointDistance;
            }
        }
        return closestPointWithinDistance;
    }

    // Check the distance between two points
    distanceToOtherPoint(otherPoint: Point): number {
        return Math.sqrt(Math.pow(this.x - otherPoint.x, 2) + Math.pow(this.y - otherPoint.y, 2));
    }

    noneOfThesePointsTooClose(otherPoints: Point[], closenessLimit: number): boolean {
        for (const point of otherPoints) {
            if (this.distanceToOtherPoint(point) < closenessLimit) {
                return false;
            }
        }
        return true;
    }

    closeEnoughToPoint(otherPoint: Point, distanceLimit: number): boolean {
        return this.distanceToOtherPoint(otherPoint) < distanceLimit;
    }

    notTooCloseToPoint(otherPoint: Point, distanceLimit: number): boolean {
        return this.distanceToOtherPoint(otherPoint) > distanceLimit;
    }

}