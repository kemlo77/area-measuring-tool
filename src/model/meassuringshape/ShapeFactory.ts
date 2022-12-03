import { MeassuringShape } from './MeassuringShape';

export interface ShapeFactory {

    getShape(name: string): MeassuringShape;

}