import { OpenState } from './OpenState.js';
import { Point } from '../Point.js';
import { PolygonState } from './PolygonState.js';
import { Segment } from '../Segment.js';
import { Coordinate } from '../Coordinate.js';
import { UnselectedState } from './UnselectedState.js';
import { MoveState } from './MoveState.js';
import { InteractiveShape } from '../InteractiveShape.js';
import { PaintableSegments } from '../PaintableSegments.js';

export class Polygon implements InteractiveShape, PaintableSegments {
    private _vertices: Point[];
    private _movePoint: Point;
    private _mousePositionAtMoveStart: Point;
    private currentState: PolygonState;
    public static readonly minimumDistanceBetweenPoints: number = 8;
    public static readonly interactDistance: number = 5;

    constructor(vertices?: Array<Coordinate>) {
        this._vertices = [];
        this._movePoint = null;
        this.currentState = new OpenState(this);

        const verticesGiven: boolean = (vertices !== undefined && vertices !== null);
        if (verticesGiven) {
            vertices.forEach((coordinate) => this.handleLeftClick(coordinate));
            this.handleLeftClick(vertices[0]);
        }
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

    get vertices(): Point[] {
        return this._vertices.slice();
    }

    get nonMovingVertices(): Point[] {
        return this._vertices.filter((it) => it !== this._movePoint);
    }

    get movePoint(): Point {
        return this._movePoint;
    }

    set movePoint(point: Point) {
        this._movePoint = point;
    }

    resetMovePoint(): void {
        this._movePoint = null;
    }

    replacePointSelectedForMoveWithNewPoint(newPoint: Point): void {
        for (let index: number = 0; index < this._vertices.length; index++) {
            if (this._vertices[index] == this._movePoint) {
                this._vertices[index] = newPoint;
                this.resetMovePoint();
                break;
            }
        }
    }

    get mousePositionAtMoveStart(): Point {
        return this._mousePositionAtMoveStart;
    }

    set mousePositionAtMoveStart(point: Point) {
        this._mousePositionAtMoveStart = point;
    }

    get isClosed(): boolean {
        return !(this.currentState instanceof OpenState);
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
        this.currentState.handleLeftClick(new Point(position));
    }

    handleRightClick(position: Coordinate): void {
        this.currentState.handleRightClick(new Point(position));
    }

    handleLeftMouseDown(position: Coordinate): void {
        this.currentState.handleLeftMouseDown(new Point(position));
    }

    handleLeftMouseUp(position: Coordinate): void {
        this.currentState.handleLeftMouseUp(new Point(position));
    }

    getStillSegments(): Segment[] {
        return this.currentState.calculateStillSegments();
    }

    getMovingSegments(mousePosition: Coordinate): Segment[] {
        return this.currentState.calculateMovingSegments(mousePosition);
    }

    setCurrentState(state: PolygonState): void {
        this.currentState = state;
    }

    reversePolygonDirection(): void {
        this._vertices.reverse();
    }

    get firstVertex(): Point {
        return this._vertices[0];
    }

    get lastVertex(): Point {
        return this._vertices[this._vertices.length - 1];
    }

    get verticesExceptMovePoint(): Point[] {
        if (this.movePoint === null) {
            return this._vertices;
        } else {
            return this._vertices
                .filter((vertex) => vertex !== this.movePoint);
        }
    }

    get numberOfVertices(): number {
        return this._vertices.length;
    }

    get perimeterLength(): number {
        return this.segments.reduce((sum, it) => sum + it.length, 0);
    }

    get area(): number {
        if (!this.isOpen) {
            return Math.abs(this.gaussShoelace());
        } else {
            return 0;
        }
    }

    get isClockwise(): boolean {
        if (!this.isOpen) {
            return (this.gaussShoelace() > 0);
        } else {
            return null;
        }
    }

    private gaussShoelace(): number {
        let theSum: number = 0;
        for (const segment of this.segments) {
            theSum += segment.p1.x * segment.p2.y - segment.p1.y * segment.p2.x;
        }
        const area: number = theSum / 2;
        return area;
    }

    makeThisVertexFirst(vertex: Point): void {
        while (this._vertices[0] !== vertex) {
            this.rotateVertices(1);
        }
    }

    rotateVertices(steps: number): void {
        this._vertices = Polygon.arrayRotate(this._vertices, steps);
    }

    static arrayRotate(arr: any[], steps: number): any[] {
        if (steps > 0) {
            for (let step: number = 0; step < steps; step++) {
                arr.push(arr.shift());
            }
        } else {
            for (let step: number = 0; step < Math.abs(steps); step++) {
                arr.unshift(arr.pop());
            }
        }
        return arr;
    }

    addVertex(newVertex: Point): void {
        this._vertices.push(newVertex);
    }

    removeLastVertex(): void {
        this._vertices.pop();
    }

    insertVertex(newVertex: Point, segment: Segment): void {
        const pointBeforeIndex: number = this._vertices.indexOf(segment.p1);
        this._vertices.splice(pointBeforeIndex + 1, 0, newVertex);
    }

    ejectVertex(vertexToRemove: Point): void {
        const index: number = this._vertices.indexOf(vertexToRemove);
        this._vertices.splice(index, 1);
    }

    get verticesNextToTheVerticeMoving(): Point[] {
        const neighbouringPoints: Point[] = [];
        if (this.isMoving) {
            neighbouringPoints.push(this.getPrecedingVertex(this._movePoint));
            neighbouringPoints.push(this.getFollowingVertex(this._movePoint));
        }
        return neighbouringPoints;
    }

    getPrecedingVertex(vertex: Point): Point {
        const index: number = this._vertices.indexOf(vertex);
        const indexOfPreceding: number = Polygon.moduloInPolygon(index - 1, this._vertices.length);
        return this._vertices[indexOfPreceding];
    }

    getFollowingVertex(vertex: Point): Point {
        const index: number = this._vertices.indexOf(vertex);
        const indexOfFollowing: number = Polygon.moduloInPolygon(index + 1, this._vertices.length);
        return this._vertices[indexOfFollowing];
    }

    // function to translate negative indexes in a polygon.
    // (e.g. index -2 in a polygon with 6 sides is 4)
    // also if index is larger. For example input 7 will return 0
    // TODO: skriv om denna så att man anger sitt orena index och sin array,
    // så plockar man ut array.length i denna metoden.
    private static moduloInPolygon(indexIn: number, arrayLength: number): number {
        while (indexIn < 0) {
            indexIn += arrayLength;
        }
        return (indexIn % arrayLength);
    }

}