import { Coordinate } from '../model/shape/Coordinate';
import { Observer } from '../view/canvasview/Observer';

export interface Subject {
    attach(observer: Observer): void;
    detach(observer: Observer): void;
    notifyOfMouseMovement(mousePosition: Coordinate): void;
    notifyOfModelChange(mousePosition: Coordinate): void;
}