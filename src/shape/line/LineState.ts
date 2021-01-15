import { Point } from '../Point.js';
import { Segment } from '../Segment.js';
import { PaintableSegment } from '../PaintableSegment.js';
import { Coordinate } from '../Coordinate.js';

export interface LineState {

    handleLeftClick(pointClicked: Point): void;

    handleLeftMouseDown(pointClicked: Point): void;

    handleLeftMouseUp(pointClicked: Point): void;

    calculateSegment(): Segment;

    calculatePaintableStillSegment(): PaintableSegment;

    calculatePaintableMovingSegment(mousePosition: Coordinate): PaintableSegment;

}