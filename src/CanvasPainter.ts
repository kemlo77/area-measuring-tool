class CanvasPainter {
    canvasBackground: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("background");
    ctxBack2: CanvasRenderingContext2D = this.canvasBackground.getContext("2d");
    canvasForeground: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("foreground");
    ctxFront2: CanvasRenderingContext2D = this.canvasForeground.getContext("2d");
    canvasWidth: number = this.canvasBackground.width;
    canvasHeight: number = this.canvasBackground.height;
    oldXMin: number = 0;
    oldXMax: number = 1;
    oldYMin: number = 0;
    oldYMax: number = 1;

    private static instance: CanvasPainter;

    private constructor() { }

    public static getInstance(): CanvasPainter {
        if (!CanvasPainter.instance) {
            CanvasPainter.instance = new CanvasPainter();
        }
        return CanvasPainter.instance;
    }

    drawPolygon(polygonIn: Polygon): void {
        var moveColor = "255,128,0";//orange
        var defaultColor = "0,80,120";//
        var redColor = "255,0,0";
        var greenColor = "0,255,0";
        var whiteColor = "255,255,255";
        //clear the canvas
        this.clearTheFrontCanvas();
        //draw a ring around the point chosen to be moved
        if (polygonIn.moveMode) {
            //draw all segments except the ones next to the dot being moved
            for (let r = 0; r < polygonIn.segments.length - 2; r++) {
                this.drawOneSegment(polygonIn.segments[moduloInPolygon(r + polygonIn.movePointIndex + 1, polygonIn.segments.length)], defaultColor);
            }
            //draw intermediary points, skip the one being moved
            for (let z = 1; z < polygonIn.segments.length; z++) {
                if (z == polygonIn.movePointIndex) { continue; }
                this.drawDoubleDot(polygonIn.segments[z].p1, defaultColor, whiteColor);
            }
            //since the polygon is closed
            //first point green
            if (polygonIn.movePointIndex !== 0) {
                this.drawDoubleDot(polygonIn.segments[0].p1, defaultColor, greenColor);
            }
            //last point red
            if (polygonIn.movePointIndex !== (polygonIn.segments.length - 1)) {
                this.drawDoubleDot(polygonIn.segments[polygonIn.segments.length - 1].p1, defaultColor, redColor);
            }
        }
        else {
            //draw all segments
            for (let r = 0; r < polygonIn.segments.length; r++) {
                this.drawOneSegment(polygonIn.segments[r], defaultColor);
            }
            //draw intermediary points, also the last one (white)
            for (let z = 1; z < polygonIn.segments.length; z++) {
                this.drawDoubleDot(polygonIn.segments[z].p1, defaultColor, whiteColor);
            }
            //if the polygon is closed
            if (polygonIn.closed) {
                //first point green
                this.drawDoubleDot(polygonIn.segments[0].p1, defaultColor, greenColor);
                //last point red
                this.drawDoubleDot(polygonIn.segments[polygonIn.segments.length - 1].p1, defaultColor, redColor);
            }
            else {
                //draw first point green
                if (polygonIn.seed != null) {
                    this.drawDoubleDot(polygonIn.seed, defaultColor, greenColor);
                }
                //draw last point with white dot
                if (polygonIn.segments.length > 0) {
                    this.drawDoubleDot(polygonIn.segments[polygonIn.segments.length - 1].p2, defaultColor, whiteColor);
                }
            }
        }


    }


    //clear the canvas
    clearBothCanvas(): void {
        this.ctxFront2.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.ctxBack2.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    clearTheFrontCanvas(): void {
        this.ctxFront2.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    //draw a point with inner and outer color
    drawDoubleDot(dot2paint: Point, outerColor: string, innerColor: string): void {
        //outer color (larger)
        this.drawDot(dot2paint, 4, outerColor);
        //inner color (smaler drawn on top of the other)
        this.drawDot(dot2paint, 2, innerColor);
    }

    //draw a point
    drawDot(dot2paint: Point, diam: number, rgbIn: string): void {
        this.ctxFront2.fillStyle = "rgba(" + rgbIn + ",1)";
        this.ctxFront2.beginPath();
        this.ctxFront2.arc(dot2paint.x, dot2paint.y, diam, 0, Math.PI * 2, true);
        this.ctxFront2.closePath();
        this.ctxFront2.fill();
    }

    //draw a segment (draws a line between two points)
    drawOneSegment(segment2draw: Segment, lineColor: string): void {
        this.drawLine(segment2draw.p1, segment2draw.p2, lineColor, this.ctxFront2);
    }

    //draws line between 2 points
    drawLine(startP: Point, endP: Point, lineColor: string, ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = "rgba(" + lineColor + ",1)";
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(startP.x, startP.y);
        ctx.lineTo(endP.x, endP.y);
        ctx.closePath();
        ctx.stroke();
    }


    drawMovement(mousePosPoint: Point, thePolygon: Polygon): void {
        this.clearUsedCanvas()
        if (!thePolygon.closed) {
            if (thePolygon.segments.length == 0) {
                if (thePolygon.seed != null) {
                    this.drawLine(thePolygon.seed, mousePosPoint, "255,128,0", this.ctxBack2);
                    this.saveExtremes([thePolygon.seed, mousePosPoint]);
                }
            }
            else {
                const lastPoint: Point = thePolygon.segments[thePolygon.segments.length - 1].p2;
                this.drawLine(lastPoint, mousePosPoint, "255,128,0", this.ctxBack2);
                this.saveExtremes([lastPoint, mousePosPoint]);
            }
        }
        else {
            if (thePolygon.moveMode) {
                const movingPointPlusOne: Point = thePolygon.segments[thePolygon.movePointIndex].p2;
                const movingPointMinusOne: Point = thePolygon.segments[moduloInPolygon(thePolygon.movePointIndex - 1, thePolygon.segments.length)].p1;
                this.drawLine(movingPointPlusOne, mousePosPoint, "255,128,0", this.ctxBack2);
                this.drawLine(movingPointMinusOne, mousePosPoint, "255,128,0", this.ctxBack2);
                this.saveExtremes([movingPointPlusOne, movingPointMinusOne, mousePosPoint]);

            }
        }
    }

    saveExtremes(arrayWithPoints: Point[]): void {
        this.oldXMin = arrayWithPoints[0].x;
        this.oldXMax = arrayWithPoints[0].x;
        this.oldYMin = arrayWithPoints[0].y;
        this.oldYMax = arrayWithPoints[0].y;
        for (let p = 1; p < arrayWithPoints.length; p++) {
            if (this.oldXMin > arrayWithPoints[p].x) { this.oldXMin = arrayWithPoints[p].x }
            if (this.oldXMax < arrayWithPoints[p].x) { this.oldXMax = arrayWithPoints[p].x }
            if (this.oldYMin > arrayWithPoints[p].y) { this.oldYMin = arrayWithPoints[p].y }
            if (this.oldYMax < arrayWithPoints[p].y) { this.oldYMax = arrayWithPoints[p].y }
        }
    }

    clearUsedCanvas(): void {
        this.ctxBack2.clearRect(this.oldXMin - 2, this.oldYMin - 2, this.oldXMax - this.oldXMin + 4, this.oldYMax - this.oldYMin + 4);
    }

}



