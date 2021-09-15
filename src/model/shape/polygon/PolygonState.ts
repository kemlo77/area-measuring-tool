import { Point } from '../Point';
import { Segment } from '../Segment';
import { Coordinate } from '../Coordinate';

export interface PolygonState {

    handleLeftClick(pointClicked: Point): void;

    handleRightClick(pointClicked: Point): void;

    handleLeftMouseDown(pointClicked: Point): void;

    handleLeftMouseUp(pointClicked: Point): void;

    calculateSegments(): Segment[];

    calculateStillSegments(): Segment[];

    calculateMovingSegments(mousePosition: Coordinate): Segment[];

}