import { Coordinate } from './Coordinate.js';

export class Point implements Coordinate {
    private _x: number;
    private _y: number;

    constructor(point?: Coordinate)
    constructor(x: number, y: number)
    constructor(xOrCoordinate?: Coordinate | number, y?: number) {
        if (xOrCoordinate === undefined || xOrCoordinate === null) {
            this._x = 0;
            this._y = 0;
        } else if (typeof xOrCoordinate === 'number') {
            if (typeof y !== 'undefined') {
                this._x = xOrCoordinate;
                this._y = y;
            } else {
                throw new Error('Invalid parameters');
            }
        } else if (typeof xOrCoordinate === 'string') {
            throw new Error('Invalid parameters');
        } else if (this.instanceOfCoordinate(xOrCoordinate)) {
            this._x = xOrCoordinate.x;
            this._y = xOrCoordinate.y;
        } else {
            throw new Error('Invalid parameters');
        }
    }

    get x(): number {
        return this._x;
    }
    get y(): number {
        return this._y;
    }


    private instanceOfCoordinate(object: any): object is Coordinate {
        const hasExpectedFields: boolean = 'x' in object && 'y' in object;
        const xIsNumber: boolean = (typeof object.x === 'number');
        const yIsNumber: boolean = (typeof object.y === 'number');
        return hasExpectedFields && xIsNumber && yIsNumber;

    }

    hasSameCoordinateAs(otherPoint: Point): boolean {
        return (this._x === otherPoint._x && this._y === otherPoint._y);
    }

    copyValues(copyFromThisPoint: Point): void {
        this._x = copyFromThisPoint._x;
        this._y = copyFromThisPoint._y;
    }

    // rotate a point around the Origin
    rotateClockwise(angle: number): Point {
        const tempX: number = this._x;
        const tempY: number = this._y;
        const newX: number = tempX * Math.cos(angle) + tempY * Math.sin(angle);
        const newY: number = -tempX * Math.sin(angle) + tempY * Math.cos(angle);
        return new Point(newX, newY);
    }

    translate(distX: number, distY: number): Point {
        const newX: number = this._x + distX;
        const newY: number = this._y + distY;
        return new Point(newX, newY);
    }

    // return the angle between the x-axis and a vector AB (where A is in the Origin and B is the point checked)
    getTheAngle(): number {
        const arctanAngle: number = Math.atan(this._y / this._x);
        if (this._y >= 0) {
            // if the point is in q1
            if (this._x >= 0) { return arctanAngle; }
            // if the point is in q2
            else { return (Math.PI + arctanAngle); }
        }
        else {
            // if the point is in q3
            if (this._x < 0) { return (Math.PI + arctanAngle); }
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
        return Math.sqrt(Math.pow(this._x - otherPoint._x, 2) + Math.pow(this._y - otherPoint._y, 2));
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