import { Coordinate } from '../../model/shape/Coordinate.js';


export interface Painter {
    drawStill(motif: any): void;
    drawMovement(modif: any, mousePosition: Coordinate): void;
    clearTheStillCanvas(): void;
    clearTheMovementCanvas(): void;
}