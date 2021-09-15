import { Coordinate } from '../../model/shape/Coordinate';


export interface Painter {
    drawStill(motif: any): void;
    drawMovement(modif: any, mousePosition: Coordinate): void;
    clearTheStillCanvas(): void;
    clearTheMovementCanvas(): void;
}