import { Coordinate } from './meassuringshape/shape/Coordinate';
import { Observer } from '../view/Observer';

export interface Subject {
    subscribe(observer: Observer): void;
    unsubscribe(observer: Observer): void;
    notifyOfMouseMovement(mousePosition: Coordinate): void;
    notifyOfModelChange(mousePosition: Coordinate): void;
}