
import { Coordinate } from '../Coordinate';
import { Segment } from './Segment';

export interface SegmentShape {

    getStillSegments(): Segment[];
    getMovingSegments(mousePosition: Coordinate): Segment[];
    readonly length: number;
    readonly area: number;
    readonly isSelected: boolean;
    readonly isMoving: boolean;
    readonly isClosed: boolean;

}