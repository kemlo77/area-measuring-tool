import { Point } from '../polygon/Point.js';
import { Segment } from '../polygon/Segment.js';
import { PaintableSegment } from '../polygon/PaintableSegment.js';
import { Coordinate } from '../polygon/Coordinate.js';

export interface LineState {

    handleLeftClick(pointClicked: Point): void;

    handleLeftMouseDown(pointClicked: Point): void;

    handleLeftMouseUp(pointClicked: Point): void;

    calculateSegment(): Segment;

    calculatePaintableStillSegment(): PaintableSegment;

    calculatePaintableMovingSegment(mousePosition: Coordinate): PaintableSegment;

}