import { AreaValueSign } from './AreaValueSign';
import { Color } from './Color';
import { Coordinate } from './shape/Coordinate';

export abstract class MeassuringShape {

    private static initializedObjects: number = 0;
    private _name: string;
    private _color: Color = new Color(0, 0, 0);
    private _areaValueSign: AreaValueSign = AreaValueSign.POSITIVE;

    constructor() {
        this._name = 'Shape_' + MeassuringShape.initializedObjects++;
    }

    get name(): string {
        return this._name;
    }

    set name(newName: string) {
        this._name = newName;
    }

    get color(): Color {
        return this._color;
    }

    set color(color: Color) {
        this._color = color;
    }

    get areaValueSign(): AreaValueSign {
        return this._areaValueSign;
    }

    set areaValueSign(areaValueSign: AreaValueSign) {
        this._areaValueSign = areaValueSign;
    }

    abstract isSelected: boolean;
    abstract hasArea: boolean;
    abstract length: number;
    abstract area: number;

    abstract designatedPainterDrawStill(): void;

    abstract designatedPainterDrawMovement(mousePosition: Coordinate): void;

    abstract handleLeftClick(coordinate: Coordinate): void;

    abstract handleRightClick(coordinate: Coordinate): void;

    abstract handleLeftMouseDown(coordinate: Coordinate): void;

    abstract handleLeftMouseUp(coordinate: Coordinate): void;

}
