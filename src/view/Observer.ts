import { Coordinate } from '../model/meassuringshape/shape/Coordinate';

export interface Observer {
    updateBecauseModelHasChanged(): void;
    updateBecauseOfMovementInModel(mousePosition: Coordinate): void;
}