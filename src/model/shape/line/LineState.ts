import { Point } from '../Point';
import { Segment } from '../Segment';
import { Coordinate } from '../Coordinate';

export interface LineState {

    handleLeftClick(pointClicked: Point): void;

    handleLeftMouseDown(pointClicked: Point): void;

    handleLeftMouseUp(pointClicked: Point): void;

    calculateSegment(): Segment;

    calculateStillSegment(): Segment;

    calculateMovingSegment(mousePosition: Coordinate): Segment;

}