import { Coordinate } from '../../model/shape/Coordinate.js';


export interface PaintingStrategy {
    drawStill(motif: any): void;
    drawMovement(modif: any, mousePosition: Coordinate): void;
    clearTheStillCanvas(): void;
    clearTheMovementCanvas(): void;
}