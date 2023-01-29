import { AreaValueSign } from './AreaValueSign';
import { Color } from './Color';
import { Name } from './Name';
import { Coordinate } from './shape/Coordinate';

export abstract class MeassuringShape {

    private _name: Name;
    private _color: Color;
    private _areaValueSign: AreaValueSign;
    private _id: number;

    constructor() {
        this._name = new Name('Shape');
        this._color = new Color(0, 0, 0);
        this._areaValueSign = AreaValueSign.POSITIVE;
        this._id = Date.now();
    }

    get id(): number {
        return this._id;
    }

    get name(): Name {
        return this._name;
    }

    set name(newName: Name) {
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
