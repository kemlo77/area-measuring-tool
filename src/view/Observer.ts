import { Model } from '../model/Model';
import { Coordinate } from '../model/shape/Coordinate';

export interface Observer {
    updateBecauseModelHasChanged(model: Model): void;
    updateBecauseOfMovementInModel(model: Model, mousePosition: Coordinate): void;
}