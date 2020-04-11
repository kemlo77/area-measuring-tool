class Polygon {
    public vertices: Point[];
    public movePointIndex: number;
    private currentState: PolygonState;
    private enforceNonComplex: boolean;
    private enforceClockWise: boolean;

    constructor() {
        this.vertices = new Array();
        this.movePointIndex = -1; // TODO: går det skriva om koden så att MoveState får den här punkten från ClosedState?
        this.currentState = OpenState.getInstance();
        this.enforceNonComplex = true;
        this.enforceClockWise = true;
    }

    get enforceNonComplexPolygon() {
        return this.enforceNonComplex;
    }

    get enforceClockWisePolygon() {
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

    setCurrentState(state: PolygonState): void {
        this.currentState = state;
        CanvasPainter.getInstance().clearTheBackCanvas();
        console.log('Change state to: ' + state.stateName());
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