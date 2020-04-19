import { OpenState } from './OpenState.js';
import { Point } from './Point.js';
import { PolygonState } from './PolygonState.js';
import { Segment } from './Segment.js';
import { ClosedState } from './ClosedState.js';
import { MathUtil } from './MathUtil.js';
import { Coordinate } from './Coordinate.js';
import { PaintableSegment } from './PaintableSegment.js';
import { UnselectedState } from './UnselectedState.js';

export class Polygon {
    public vertices: Point[];
    public movePoint: Point;
    private currentState: PolygonState;
    private enforceNonComplex: boolean;
    private readonly enforceClockwise: boolean;
    public static readonly minimumDistanceBetweenPoints: number = 8;
    public static readonly interactDistance: number = 5;
    public static readonly useIntegerCoords: boolean = false;

    constructor() {
        this.vertices = new Array();
        this.movePoint = null;
        this.currentState = new OpenState(this);
        this.enforceNonComplex = true;
        this.enforceClockwise = false;
    }

    get enforceNonComplexPolygon(): boolean {
        return this.enforceNonComplex;
    }

    get segments(): Segment[] {
        return this.currentState.calculateSegments(this);
    }

    get numberOfVertices(): number {
        return this.vertices.length;
    }

    get numberOfSegments(): number {
        if (this.numberOfVertices >= 1) {
            if (this.isClosed) {
                return this.numberOfVertices;
            } else {
                return this.numberOfVertices - 1;
            }
        } else {
            return 0;
        }
    }

    get lastVertex(): Point {
        return this.vertices[this.vertices.length - 1];
    }

    get firstVertex(): Point {
        return this.vertices[0];
    }

    get verticesExceptMovePoint(): Point[] {
        if (this.movePoint === null) {
            return this.vertices;
        } else {
            const verticesWithoutMovePoint: Point[] = new Array();
            for ( const vertex of this.vertices) {
                if ( vertex !== this.movePoint) {
                    verticesWithoutMovePoint.push(vertex);
                }
            }
            return verticesWithoutMovePoint;
        }
    }

    get isClosed(): boolean {
        return this.currentState instanceof ClosedState;
    }

    get isSelected(): boolean {
        return !(this.currentState instanceof UnselectedState);
    }

    getPaintableStillSegments(): PaintableSegment[] {
        return this.currentState.calculatePaintableStillSegments(this);
    }

    getPaintableMovingSegments(mousePosition: Coordinate): PaintableSegment[] {
        return this.currentState.calculatePaintableMovingSegments(this, mousePosition);
    }

    setCurrentState(state: PolygonState): void {
        this.currentState = state;
        if (this.enforceClockwise) {
            this.makeDirectionClockWise();
        }
    }

    handleLeftClick(position: Coordinate): void {
        const leftClickedPoint: Point = new Point(position.x, position.y);
        this.currentState.handleLeftClick(this, leftClickedPoint);
    }

    handleRightClick(position: Coordinate): void {
        const rightClickedPoint: Point = new Point(position.x, position.y);
        this.currentState.handleRightClick(this, rightClickedPoint);
    }

    reversePolygonDirection(): void {
        this.vertices.reverse();
    }

    makeDirectionClockWise(): void {
        if (this.isClosed && this.isCounterclockwise) {
            this.reversePolygonDirection();
        }
    }

    makeDirectionCounterclockWise(): void {
        if (this.isClosed && !this.isCounterclockwise) {
            this.reversePolygonDirection();
        }
    }

    insertVertex(newVertex: Point, insertAfterThisVertex: Point): void {
        const oldPointIndex = this.vertices.indexOf(insertAfterThisVertex);
        this.vertices.splice(oldPointIndex + 1, 0, newVertex);
    }

    get isCounterclockwise(): boolean {
        if (this.isClosed) {
            if (this.gaussShoelace() > 0) {
                return false;
            }
            else {
                return true;
            }
        } else {
            return null;
        }
    }

    get area(): number {
        if (this.isClosed) {
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
        this.vertices = MathUtil.arrayRotate(this.vertices, steps);
    }

    makeThisVertexFirst(vertex: Point): void {
        while (vertex !== this.vertices[0]) {
            this.rotateVertices(1);
        }
    }

    ejectVertex(vertexToRemove: Point): void {
        const index: number = this.vertices.indexOf(vertexToRemove);
        this.vertices.splice(index, 1);
    }

    getPrecedingVertex(vertex: Point): Point {
        const index: number = this.vertices.indexOf(vertex);
        const indexOfPreceding: number = MathUtil.moduloInPolygon(index - 1, this.vertices.length);
        return this.vertices[indexOfPreceding];
    }

    getFollowingVertex(vertex: Point): Point {
        const index: number = this.vertices.indexOf(vertex);
        const indexOfFollowing: number = MathUtil.moduloInPolygon(index + 1, this.vertices.length);
        return this.vertices[indexOfFollowing];
    }


}