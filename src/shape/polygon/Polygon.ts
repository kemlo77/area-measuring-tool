import { OpenState } from './OpenState.js';
import { Point } from '../Point.js';
import { PolygonState } from './PolygonState.js';
import { Segment } from '../Segment.js';
import { Coordinate } from '../Coordinate.js';
import { SimpleSegment } from '../SimpleSegment.js';
import { UnselectedState } from './UnselectedState.js';
import { MoveState } from './MoveState.js';
import { InteractiveShape } from '../InteractiveShape.js';

export class Polygon implements InteractiveShape {
    public vertices: Point[];
    public movePoint: Point;
    public mousePositionAtMoveStart: Point;
    private currentState: PolygonState;
    public static readonly minimumDistanceBetweenPoints: number = 8;
    public static readonly interactDistance: number = 5;

    constructor(vertices?: Array<Coordinate>) {
        this.vertices = new Array();
        this.movePoint = null;
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
        const leftClickedPoint: Point = new Point(position.x, position.y);
        this.currentState.handleLeftClick(leftClickedPoint);
    }

    handleRightClick(position: Coordinate): void {
        const rightClickedPoint: Point = new Point(position.x, position.y);
        this.currentState.handleRightClick(rightClickedPoint);
    }

    handleLeftMouseDown(position: Coordinate): void {
        const leftMouseDownPoint: Point = new Point(position.x, position.y);
        this.currentState.handleLeftMouseDown(leftMouseDownPoint);
    }

    handleLeftMouseUp(position: Coordinate): void {
        const leftMouseUpPoint: Point = new Point(position.x, position.y);
        this.currentState.handleLeftMouseUp(leftMouseUpPoint);
    }

    getPaintableStillSegments(): SimpleSegment[] {
        return this.currentState.calculatePaintableStillSegments();
    }

    getPaintableMovingSegments(mousePosition: Coordinate): SimpleSegment[] {
        return this.currentState.calculatePaintableMovingSegments(mousePosition);
    }

    setCurrentState(state: PolygonState): void {
        this.currentState = state;
    }

    reversePolygonDirection(): void {
        this.vertices.reverse();
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
        while (this.vertices[0] !== vertex) {
            this.rotateVertices(1);
        }
    }

    rotateVertices(steps: number): void {
        this.vertices = Polygon.arrayRotate(this.vertices, steps);
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
        this.vertices.push(newVertex);
    }

    removeLastVertex(): void {
        this.vertices.pop();
    }

    insertVertex(newVertex: Point, segment: Segment): void {
        const pointBeforeIndex: number = this.vertices.indexOf(segment.p1);
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