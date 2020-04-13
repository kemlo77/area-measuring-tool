class Polygon {
    public vertices: Point[];
    public movePointIndex: number;
    private currentState: PolygonState;
    private enforceNonComplex: boolean;
    private enforceClockWise: boolean;
    private closePolygonMinimumDistance: number = 5;
    private minDistBetweenPoints: number = 8;
    private moveDelInsDistance: number = 3; // Minimum distance when selecting for moving, deleting, or inserting
    private useIntegerCoords: boolean = false;

    constructor() {
        this.vertices = new Array();
        this.movePointIndex = -1; // TODO: går det skriva om det här så att det är en Point iställlet?
        this.currentState = OpenState.getInstance();
        this.enforceNonComplex = true;
        this.enforceClockWise = true;
    }

    get enforceNonComplexPolygon(): boolean {
        return this.enforceNonComplex;
    }

    get enforceClockWisePolygon(): boolean {
        return this.enforceClockWise;
    }

    get segments(): Segment[] {
        return this.currentState.calculateSegments(this);
    }

    get lastVertex(): Point {
        return this.vertices[this.vertices.length - 1];
    }

    get firstVertex(): Point {
        return this.vertices[0];
    }

    get minimumCloseDistance (): number {
        return this.closePolygonMinimumDistance;
    }

    get minimumDistanceBetweenPoints(): number {
        return this.minDistBetweenPoints;
    }

    get markForMoveDistance(): number {
        return this.moveDelInsDistance;
    }

    get insertNewPointDistance(): number {
        return this.moveDelInsDistance;
    }

    get deleteDistance(): number {
        return this.moveDelInsDistance;
    }

    get useIntegerCoordinates(): boolean {
        return this.useIntegerCoords;
    }

    setCurrentState(state: PolygonState): void {
        this.currentState = state;
        CanvasPainter.getInstance().clearTheBackCanvas();
    }

    handleLeftClick(point: Point): void {
        this.currentState.handleLeftClick(this, point);
    }

    handleRightClick(point: Point): void {
        this.currentState.handleRightClick(this, point);
    }

    drawSegments(): void {
        this.currentState.drawSegments(this);
    }

    drawMovement(mousePosition: Point): void {
        this.currentState.drawMovement(this, mousePosition);
    }

    // changing direction of polygon (clockwise <-> counter clockwise)
    reversePolygon(): void {
        this.vertices.reverse();
    }

    insertVertex(newPoint: Point, insertAtThisIndex: number): void {
        this.vertices.splice(insertAtThisIndex + 1, 0, newPoint);
    }

    get clockWise(): boolean {
        if (this.currentState instanceof ClosedState) {
            if (this.gaussShoelace() > 0) {
                return true;
            }
            else {
                return false;
            }
        } else {
            return null;
        }
    }

    get area(): number {
        if (this.currentState instanceof ClosedState) {
            return Math.abs(this.gaussShoelace());
        } else {
            return 0;
        }
    }

    gaussShoelace(): number {
        let theSum: number = 0;
        for (const segment of this.segments) {
            theSum += segment.p1.x * segment.p2.y - segment.p1.y * segment.p2.x;
        }
        const area: number = theSum / 2;
        return area;
    }

    get perimeterLength(): number {
        return this.segments.reduce((sum, it) => sum + it.length, 0);
    }


    rotateVertices(steps: number): void {
        this.vertices = arrayRotate(this.vertices, steps);
    }


    ejectVertex(removeAtThisIndex: number): void {
        this.vertices.splice(removeAtThisIndex, 1);
    }







}