import { Model } from '../model/Model';
import { Coordinate } from '../model/shape/Coordinate';

export interface Observer {
    updateBecauseModelHasChanged(): void;
    updateBecauseOfMovementInModel(mousePosition: Coordinate): void;
}