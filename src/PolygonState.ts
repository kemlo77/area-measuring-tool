import { Polygon } from './Polygon.js';
import { Point } from './Point.js';
import { Segment } from './Segment.js';
import { PaintableSegment } from './PaintableSegment.js';
import { Coordinate } from './Coordinate.js';

export interface PolygonState {

    handleLeftClick(polygon: Polygon, pointClicked: Point): void;

    handleRightClick(polygon: Polygon, pointClicked: Point): void;

    calculateSegments(polygon: Polygon): Segment[];

    calculatePaintableStillSegments(polygon:Polygon): PaintableSegment[];

    calculatePaintableMovingSegments(polygon:Polygon, mousePosition: Coordinate): PaintableSegment[];

}