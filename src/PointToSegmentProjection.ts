import { Point } from './Point';
import { Segment } from './Segment';

export interface PointToSegmentProjection {
    withinMinimumDistance: boolean;
    segmentProjectedOn: Segment;
    projectionPointOnSegment: Point;
}