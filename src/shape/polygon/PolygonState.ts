import { Point } from '../Point.js';
import { Segment } from '../Segment.js';
import { PaintableSegment } from '../PaintableSegment.js';
import { Coordinate } from '../Coordinate.js';

export interface PolygonState {

    handleLeftClick(pointClicked: Point): void;

    handleRightClick(pointClicked: Point): void;

    handleLeftMouseDown(pointClicked: Point): void;

    handleLeftMouseUp(pointClicked: Point): void;

    calculateSegments(): Segment[];

    calculatePaintableStillSegments(): PaintableSegment[];

    calculatePaintableMovingSegments(mousePosition: Coordinate): PaintableSegment[];

}