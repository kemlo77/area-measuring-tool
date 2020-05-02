import { OpenState } from './OpenState.js';
import { Point } from './Point.js';
import { PolygonState } from './PolygonState.js';
import { Segment } from './Segment.js';
import { ClosedState } from './ClosedState.js';
import { Coordinate } from './Coordinate.js';
import { PaintableSegment } from './PaintableSegment.js';
import { UnselectedState } from './UnselectedState.js';
import { MoveState } from './MoveState.js';

export class Polygon {
    public vertices: Point[];
    public movePoint: Point;
    private currentState: PolygonState;
    private enforceNonComplex: boolean;
    public static readonly minimumDistanceBetweenPoints: number = 8;
    public static readonly interactDistance: number = 5;

    constructor() {
        this.vertices = new Array();
        this.movePoint = null;
        this.currentState = new OpenState(this);
        this.enforceNonComplex = true;
    }

    get enforceNonComplexPolygon(): boolean {
        return this.enforceNonComplex;
    }



    get segments(): Segment[] {
        return this.currentState.calculateSegments();
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



    get isClosed(): boolean {
        return this.currentState instanceof ClosedState;
    }

    get isSelected(): boolean {
        return !(this.currentState instanceof UnselectedState);
    }

    get isMoving(): boolean {
        return this.currentState instanceof MoveState;
    }

    get isOpen(): boolean {
        return this.currentState instanceof OpenState;
    }


    handleLeftClick(position: Coordinate): void {
        const leftClickedPoint: Point = new Point(position.x, position.y);
        this.currentState.handleLeftClick(leftClickedPoint);
    }

    handleRightClick(position: Coordinate): void {
        const rightClickedPoint: Point = new Point(position.x, position.y);
        this.currentState.handleRightClick(rightClickedPoint);
    }

    handleLeftMouseDown(position: Coordinate): void {
        const rightClickedPoint: Point = new Point(position.x, position.y);
        this.currentState.handleLeftMouseDown(rightClickedPoint);
    }

    handleLeftMouseUp(position: Coordinate): void {
        const rightClickedPoint: Point = new Point(position.x, position.y);
        this.currentState.handleLeftMouseUp(rightClickedPoint);
    }

    getPaintableStillSegments(): PaintableSegment[] {
        return this.currentState.calculatePaintableStillSegments();
    }

    getPaintableMovingSegments(mousePosition: Coordinate): PaintableSegment[] {
        return this.currentState.calculatePaintableMovingSegments(mousePosition);
    }

    setCurrentState(state: PolygonState): void {
        this.currentState = state;
    }



    reversePolygonDirection(): void {
        this.vertices.reverse();
    }


    makeDirectionClockWise(): void {
        if (!this.isOpen && this.isCounterclockwise) {
            this.reversePolygonDirection();
        }
    }

    makeDirectionCounterClockwise(): void {
        if (!this.isOpen && !this.isCounterclockwise) {
            this.reversePolygonDirection();
        }
    }



    get isCounterclockwise(): boolean {
        if (!this.isOpen) {
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
        if (!this.isOpen) {
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




    get firstVertex(): Point {
        return this.vertices[0];
    }

    get lastVertex(): Point {
        return this.vertices[this.vertices.length - 1];
    }

    get verticesExceptMovePoint(): Point[] {
        if (this.movePoint === null) {
            return this.vertices;
        } else {
            const verticesWithoutMovePoint: Point[] = new Array();
            for (const vertex of this.vertices) {
                if (vertex !== this.movePoint) {
                    verticesWithoutMovePoint.push(vertex);
                }
            }
            return verticesWithoutMovePoint;
        }
    }

    get numberOfVertices(): number {
        return this.vertices.length;
    }

    makeThisVertexFirst(vertex: Point): void {
        while (this.vertices[0]!== vertex) {
            this.rotateVertices(1);
        }
    }

    addVertex(newVertex: Point): void {
        this.vertices.push(newVertex);
    }

    removeLastVertex(): void {
        this.vertices.pop();
    }

    insertVertex(newVertex: Point, segment: Segment): void {
        const pointBeforeIndex = this.vertices.indexOf(segment.p1);
        this.vertices.splice(pointBeforeIndex + 1, 0, newVertex);
    }

    ejectVertex(vertexToRemove: Point): void {
        const index: number = this.vertices.indexOf(vertexToRemove);
        this.vertices.splice(index, 1);
    }

    getPrecedingVertex(vertex: Point): Point {
        const index: number = this.vertices.indexOf(vertex);
        const indexOfPreceding: number = Polygon.moduloInPolygon(index - 1, this.vertices.length);
        return this.vertices[indexOfPreceding];
    }

    getFollowingVertex(vertex: Point): Point {
        const index: number = this.vertices.indexOf(vertex);
        const indexOfFollowing: number = Polygon.moduloInPolygon(index + 1, this.vertices.length);
        return this.vertices[indexOfFollowing];
    }

    rotateVertices(steps: number): void {
        this.vertices = Polygon.arrayRotate(this.vertices, steps);
    }

    static arrayRotate(arr: any[], steps: number): any[] {
        if (steps > 0) {
            for (let step = 0; step < steps; step++) {
                arr.push(arr.shift());
            }
        } else {
            for (let step = 0; step < Math.abs(steps); step++) {
                arr.unshift(arr.pop());
            }
        }
        return arr;
    }

    // function to translate negative indexes in a polygon.
    // (e.g. index -2 in a polygon with 6 sides is 4)
    // also if index is larger. For example input 7 will return 
    // TODO: skriv om denna så att man anger sitt orena index och sin array, så plockar man ut array.length i denna metoden.
    static moduloInPolygon(indexIn: number, arrayLength: number): number {
        while (indexIn < 0) {
            indexIn += arrayLength;
        }
        return (indexIn % arrayLength);
    }





}