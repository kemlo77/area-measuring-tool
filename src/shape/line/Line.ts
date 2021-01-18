import { Coordinate } from '../Coordinate';
import { InteractiveShape } from '../InteractiveShape';
import { Point } from '../Point.js';
import { Segment } from '../Segment.js';
import { CompleteState } from './CompleteState.js';
import { InitialState } from './InitialState.js';
import { LineState } from './LineState.js';
import { MoveState } from './MoveState.js';
import { UnselectedState } from './UnselectedState.js';

export class Line implements InteractiveShape {

    private _p1: Point = null;
    private _p2: Point = null;
    private _movePoint: Point = null;
    private currentState: LineState;
    public static readonly minimumDistanceBetweenPoints: number = 8;
    public static readonly interactDistance: number = 5;

    //constructor()
    constructor(coordinate1?: Coordinate, coordinate2?: Coordinate) {
        if (this.isNullOrUndefined(coordinate1) && this.isNullOrUndefined(coordinate2)) {
            this.currentState = new InitialState(this);
        } else if (!this.isNullOrUndefined(coordinate1) && !this.isNullOrUndefined(coordinate2)) {
            const point1: Point = new Point(coordinate1);
            const point2: Point = new Point(coordinate2);
            if(point1.distanceToOtherPoint(point2) > Line.minimumDistanceBetweenPoints) {
                this._p1 = point1;
                this._p2 = point2;
                this.currentState = new CompleteState(this);
            } else {
                throw new Error('Invalid parameters - coordinates too close');    
            }
        } else {
            throw new Error('Invalid parameters');
        }

    }

    private isNullOrUndefined(object: any): boolean {
        return object === null || object === undefined;
    }

    setCurrentState(state: LineState): void {
        this.currentState = state;
    }

    get length(): number {
        if(this.currentState instanceof InitialState || this.currentState instanceof MoveState) {
            return 0;
        } else {
            return this.segment.length;
        }
    }

    get isSelected(): boolean {
        return !(this.currentState instanceof UnselectedState);
    }

    get isMoving(): boolean {
        return this.currentState instanceof MoveState;
    }

    get isComplete(): boolean {
        return this.currentState instanceof CompleteState;
    }

    get p1(): Point {
        return this._p1;
    }

    set p1(point: Point) {
        this._p1 = point;
    }

    get p2(): Point {
        return this._p2;
    }

    set p2(point: Point) {
        this._p2 = point;
    }

    get movePoint(): Point {
        return this._movePoint;
    }

    set movePoint(point: Point) {
        this._movePoint = point;
    }

    get segment(): Segment {
        return this.currentState.calculateSegment();
    }

    getStillSegment(): Segment {
        return this.currentState.calculateStillSegment();
    }

    getMovingSegment(mousePosition: Coordinate): Segment {
        return this.currentState.calculateMovingSegment(mousePosition);
    }


    handleLeftClick(position: Coordinate): void {
        const leftClickedPoint: Point = new Point(position);
        this.currentState.handleLeftClick(leftClickedPoint);
    }

    /* istanbul ignore next */
    handleRightClick(position: Coordinate): void {
        //
    }

    handleLeftMouseDown(position: Coordinate): void {
        const leftMouseDownPoint: Point = new Point(position);
        this.currentState.handleLeftMouseDown(leftMouseDownPoint);
    }

    handleLeftMouseUp(position: Coordinate): void {
        const leftMouseUpPoint: Point = new Point(position);
        this.currentState.handleLeftMouseUp(leftMouseUpPoint);
    }


}