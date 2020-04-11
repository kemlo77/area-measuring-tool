class CanvasPainter {
    private canvasBackground: HTMLCanvasElement = document.getElementById('background') as HTMLCanvasElement;
    private ctxBack2: CanvasRenderingContext2D = this.canvasBackground.getContext('2d');
    private canvasForeground: HTMLCanvasElement = document.getElementById('foreground') as HTMLCanvasElement;
    private ctxFront2: CanvasRenderingContext2D = this.canvasForeground.getContext('2d');
    private canvasWidth: number = this.canvasBackground.width;
    private canvasHeight: number = this.canvasBackground.height;
    private oldXMin: number = 0;
    private oldXMax: number = 1;
    private oldYMin: number = 0;
    private oldYMax: number = 1;

    private moveColor: string = '255,128,0';
    private defaultColor: string = '0,80,120';
    private redColor: string = '255,0,0';
    private greenColor: string = '0,255,0';
    private whiteColor: string = '255,255,255';

    private static instance: CanvasPainter;

    private constructor() { }

    public static getInstance(): CanvasPainter {
        if (!CanvasPainter.instance) {
            CanvasPainter.instance = new CanvasPainter();
        }
        return CanvasPainter.instance;
    }

    drawClosedStatePolygon(polygon: Polygon): void {
        this.clearTheFrontCanvas();
        // draw all segments
        polygon.segments.forEach((it) => this.drawOneSegment(it, this.defaultColor));
        // draw intermediary points, also the last one (white)
        polygon.vertices.forEach((it) => this.drawDoubleDot(it, this.defaultColor, this.whiteColor));
        // first point green
        this.drawDoubleDot(polygon.vertices[0], this.defaultColor, this.greenColor);
        // last point red
        this.drawDoubleDot(polygon.vertices[polygon.vertices.length - 1], this.defaultColor, this.redColor);
    }

    drawOpenStatePolygon(polygon: Polygon): void {
        this.clearTheFrontCanvas();
        // draw all segments
        polygon.segments.forEach((it) => this.drawOneSegment(it, this.defaultColor));
        // draw intermediary points, also the last one (white)
        polygon.vertices.forEach((it) => this.drawDoubleDot(it, this.defaultColor, this.whiteColor));
        // first point green
        if (polygon.vertices.length > 0) {
            this.drawDoubleDot(polygon.vertices[0], this.defaultColor, this.greenColor);
        }
    }

    drawMoveStatePolygon(polygon: Polygon): void {
        this.clearTheFrontCanvas();
        // draw all segments except the ones next to the dot being moved
        const tempSegments: Segment[] = arrayRotate(polygon.segments, polygon.movePointIndex + 1);
        tempSegments.pop();
        tempSegments.pop();
        tempSegments.forEach((it) => this.drawOneSegment(it, this.defaultColor));
        // draw intermediary points, skip the one being moved
        for (let z = 0; z < polygon.vertices.length; z++) {
            if (z === polygon.movePointIndex) { continue; }
            this.drawDoubleDot(polygon.vertices[z], this.defaultColor, this.whiteColor);
        }
        // first point green
        if (polygon.movePointIndex !== 0) {
            this.drawDoubleDot(polygon.vertices[0], this.defaultColor, this.greenColor);
        }
        // last point red
        if (polygon.movePointIndex !== (polygon.vertices.length - 1)) {
            this.drawDoubleDot(polygon.vertices[polygon.vertices.length - 1], this.defaultColor, this.redColor);
        }
    }

    drawMovementPolygonInOpenState(polygon: Polygon, mousePosition: Point): void {
        this.clearUsedCanvas();
        if (polygon.vertices.length > 0) {
            const lastPoint: Point = polygon.vertices[polygon.vertices.length - 1];
            this.drawLine(lastPoint, mousePosition, this.moveColor, this.ctxBack2);
            this.saveExtremes([lastPoint, mousePosition]);
        }
    }

    drawMovementPolygonInMoveState(polygon: Polygon, mousePosition: Point): void {
        this.clearUsedCanvas();

        const movingPointPlusOne: Point = polygon.vertices[moduloInPolygon(polygon.movePointIndex +1, polygon.vertices.length)];
        const movingPointMinusOne: Point = polygon.vertices[moduloInPolygon(polygon.movePointIndex - 1, polygon.vertices.length)];
        this.drawLine(movingPointPlusOne, mousePosition, this.moveColor, this.ctxBack2);
        this.drawLine(movingPointMinusOne, mousePosition, this.moveColor, this.ctxBack2);
        this.saveExtremes([movingPointPlusOne, movingPointMinusOne, mousePosition]);

    }

    // clear the canvas
    clearBothCanvas(): void {
        this.ctxFront2.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.ctxBack2.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    clearTheFrontCanvas(): void {
        this.ctxFront2.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    clearTheBackCanvas(): void {
        this.ctxBack2.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    // draw a point with inner and outer color
    drawDoubleDot(dot2paint: Point, outerColor: string, innerColor: string): void {
        // outer color (larger)
        this.drawDot(dot2paint, 4, outerColor);
        // inner color (smaler drawn on top of the other)
        this.drawDot(dot2paint, 2, innerColor);
    }

    drawDot(dot2paint: Point, diam: number, rgbIn: string): void {
        this.ctxFront2.fillStyle = 'rgba(' + rgbIn + ',1)';
        this.ctxFront2.beginPath();
        this.ctxFront2.arc(dot2paint.x, dot2paint.y, diam, 0, Math.PI * 2, true);
        this.ctxFront2.closePath();
        this.ctxFront2.fill();
    }

    drawOneSegment(segment2draw: Segment, lineColor: string): void {
        this.drawLine(segment2draw.p1, segment2draw.p2, lineColor, this.ctxFront2);
    }

    drawLine(startP: Point, endP: Point, lineColor: string, ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = 'rgba(' + lineColor + ',1)';
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(startP.x, startP.y);
        ctx.lineTo(endP.x, endP.y);
        ctx.closePath();
        ctx.stroke();
    }




    saveExtremes(arrayWithPoints: Point[]): void {
        this.oldXMin = arrayWithPoints[0].x;
        this.oldXMax = arrayWithPoints[0].x;
        this.oldYMin = arrayWithPoints[0].y;
        this.oldYMax = arrayWithPoints[0].y;
        for (let p = 1; p < arrayWithPoints.length; p++) {
            if (this.oldXMin > arrayWithPoints[p].x) { this.oldXMin = arrayWithPoints[p].x; }
            if (this.oldXMax < arrayWithPoints[p].x) { this.oldXMax = arrayWithPoints[p].x; }
            if (this.oldYMin > arrayWithPoints[p].y) { this.oldYMin = arrayWithPoints[p].y; }
            if (this.oldYMax < arrayWithPoints[p].y) { this.oldYMax = arrayWithPoints[p].y; }
        }
    }

    clearUsedCanvas(): void {
        this.ctxBack2.clearRect(this.oldXMin - 2, this.oldYMin - 2, this.oldXMax - this.oldXMin + 4, this.oldYMax - this.oldYMin + 4);
    }

}



