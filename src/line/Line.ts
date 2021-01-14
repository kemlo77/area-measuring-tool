import { Coordinate } from '../polygon/Coordinate';
import { InteractiveShape } from '../polygon/InteractiveShape';
import { Point } from '../polygon/Point.js';
import { Segment } from '../polygon/Segment.js';
import { InitialState } from './InitialState.js';
import { LineState } from './LineState.js';
import { UnselectedState } from './UnselectedState.js';

export class Line implements InteractiveShape {

    private _p1: Point;
    private _p2: Point;
    private _movePoint: Point;
    private currentState: LineState;
    public static readonly minimumDistanceBetweenPoints: number = 8;
    public static readonly interactDistance: number = 5;

    constructor() {
        this._movePoint = null;
        this.currentState = new InitialState(this);
        //
    }

    setCurrentState(state: LineState): void {
        this.currentState = state;
    }

    get length(): number {
        return this._p1.distanceToOtherPoint(this._p2);
    }

    get isSelected(): boolean {
        return !(this.currentState instanceof UnselectedState);
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


    handleLeftClick(position: Coordinate): void {
        const leftClickedPoint: Point = new Point(position.x, position.y);
        this.currentState.handleLeftClick(leftClickedPoint);
    }

    /* istanbul ignore next */
    handleRightClick(position: Coordinate): void {
        // Not used
    }

    handleLeftMouseDown(position: Coordinate): void {
        const leftMouseDownPoint: Point = new Point(position.x, position.y);
        this.currentState.handleLeftMouseDown(leftMouseDownPoint);
    }

    handleLeftMouseUp(position: Coordinate): void {
        const leftMouseUpPoint: Point = new Point(position.x, position.y);
        this.currentState.handleLeftMouseUp(leftMouseUpPoint);
    }


}