import { Coordinate } from './Coordinate.js';
import { Segment } from './Segment.js';

export interface PaintableSegments{

    getStillSegments(): Segment[];
    getMovingSegments(mousePosition: Coordinate): Segment[]

}