import { Coordinate } from './Coordinate.js';

export interface InteractiveShape{
    readonly isSelected: boolean;
    handleLeftClick(coordinate: Coordinate):void;
    handleRightClick(coordinate: Coordinate):void;
    handleLeftMouseDown(coordinate: Coordinate):void;
    handleLeftMouseUp(coordinate: Coordinate):void;
}