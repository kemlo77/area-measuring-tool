import { Coordinate } from './Coordinate';
import { Segment } from './Segment';

export interface SegmentShape {

    getStillSegments(): Segment[];
    getMovingSegments(mousePosition: Coordinate): Segment[]
    readonly isSelected: boolean;

}