import { Coordinate } from '../Coordinate';

export interface PaintingStrategy {
    drawStill(motif: any): void;
    drawMovement(modif: any, mousePosition: Coordinate): void;
    clearTheStillCanvas(): void;
}