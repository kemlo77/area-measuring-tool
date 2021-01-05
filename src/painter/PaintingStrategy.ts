import { Coordinate } from '../polygon/Coordinate';

export interface PaintingStrategy {
    drawStill(motif: any, color: string): void;
    drawMovement(modif: any, mousePosition: Coordinate, color: string): void;
    clearTheStillCanvas(): void;
    clearTheMovementCanvas(): void;
}