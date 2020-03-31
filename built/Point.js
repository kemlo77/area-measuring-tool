var Point = /** @class */ (function () {
    function Point(x, y) {
        if (x === null || y === null) {
            x = 0;
            y = 0;
        }
        else {
            this.x = x;
            this.y = y;
        }
    }
    //copying values from point so that the new point IS the same object
    Point.prototype.copyValues = function (copyFromThisPoint) {
        this.x = copyFromThisPoint.x;
        this.y = copyFromThisPoint.y;
    };
    //clone a point
    Point.prototype.clonePoint = function () {
        var copiedPoint = new Point(this.x, this.y);
        return copiedPoint;
    };
    //rotate a point around the Origin
    Point.prototype.rotate = function (angle) {
        var tempX = this.x;
        var tempY = this.y;
        this.x = tempX * Math.cos(angle) + tempY * Math.sin(angle);
        this.y = -tempX * Math.sin(angle) + tempY * Math.cos(angle);
    };
    //move a point
    Point.prototype.translate = function (distX, distY) {
        this.x += distX;
        this.y += distY;
    };
    //return the angle between the x-axis and a vector AB (where A is in the Origin and B is the point checked)
    Point.prototype.getTheAngle = function () {
        var arctanAngle = Math.atan(this.y / this.x);
        if (this.y > 0) {
            //if the point is in q1
            if (this.x >= 0) {
                return arctanAngle;
            }
            //if the point is in q2
            else {
                return (Math.PI + arctanAngle);
            }
        }
        else {
            //if the point is in q3
            if (this.x < 0) {
                return (Math.PI + arctanAngle);
            }
            //if the point is in q4
            else {
                return (2 * Math.PI + arctanAngle);
            }
        }
    };
    return Point;
}());
