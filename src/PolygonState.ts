import { Polygon } from './Polygon.js';
import { Point } from './Point.js';
import { Segment } from './Segment.js';

export interface PolygonState {

    stateName(): string;

    handleLeftClick(polygon: Polygon, pointClicked: Point): void;

    handleRightClick(polygon: Polygon, pointClicked: Point): void;

    drawSegments(polygon: Polygon): void;

    drawMovement(polygon: Polygon, mousePosition: Point): void;

    calculateSegments(polygon: Polygon): Segment[];

}