import { Point } from './Point';

export interface PointToSegmentProjection {
    withinMinimumDistance: boolean;
    // TODO: Jag kanske skulle kunna returnera det aktuella segmentet istället?
    // Beror lite på när jag tänker gå över till att Polygon bygger på Point istället för Segment.
    segmentIndex: number;
    projectionPointOnSegment: Point;
}