import { Point } from './Point.js';

export interface ProjectionResult {
    successful: boolean;
    norm: number;
    point: Point;
}