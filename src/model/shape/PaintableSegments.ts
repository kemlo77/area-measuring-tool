import { Coordinate } from './Coordinate';
import { Segment } from './Segment';

export interface PaintableSegments{

    getStillSegments(): Segment[];
    getMovingSegments(mousePosition: Coordinate): Segment[]
    readonly isSelected: boolean;

}