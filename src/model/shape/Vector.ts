import { Point } from './Point';

export class Vector {
    private _x: number;
    private _y: number;

    constructor(xComponent: number, yComponent: number)
    constructor(point1: Point, point2: Point)
    constructor(pointOrXComponent: Point | number, pointOrYComponent: Point | number) {
        if (pointOrXComponent instanceof Point && pointOrYComponent instanceof Point) {
            this._x = pointOrYComponent.x - pointOrXComponent.x;
            this._y = pointOrYComponent.y - pointOrXComponent.y;
        } else if (typeof pointOrXComponent === 'number' && typeof pointOrYComponent === 'number') {
            this._x = pointOrXComponent;
            this._y = pointOrYComponent;
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

    get norm(): number {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    generateUnitVector(): Vector {
        return new Vector(this.x / this.norm, this.y / this.norm);
    }

    generatePerpendicularUnitVector(): Vector {
        return new Vector(this.y / this.norm, -this.x / this.norm);
    }

    static dotProduct(vector1: Vector, vector2: Vector): number {
        return (vector1.x * vector2.x + vector1.y * vector2.y);
    }

}

