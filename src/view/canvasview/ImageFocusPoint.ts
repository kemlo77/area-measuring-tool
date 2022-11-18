import { Coordinate } from '../../model/shape/Coordinate';

export class ImageFocusPoint {

    private _x: number;
    private _y: number;
    private _image: HTMLImageElement;

    constructor(image: HTMLImageElement) {
        this._image = image;
        this.focusCenterOfImage();
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    public focusCenterOfImage(): void {
        this._x = this._image.width / 2;
        this._y = this._image.height / 2;
    }

    public centerHorizontally(): void {
        this._x = this._image.width / 2;
    }

    public centerVertically(): void {
        this._y = this._image.height / 2;
    }

    public moveHorizontally(distance: number): void {
        this._x += distance;
        if (this._x < 0) {
            this._x = 0;
        }
        if (this._x > this._image.width) {
            this._x = this._image.width;
        }
    }

    public moveVertically(distance: number): void {
        this._y += distance;
        if (this._y < 0) {
            this._y = 0;
        }
        if (this._y > this._image.height) {
            this._y = this._image.height;
        }
    }

    public ifValidMoveFocusPointHere(coordinate: Coordinate): void {
        if (this.coordinateIsWithinImageBounds(coordinate)) {
            this._x = coordinate.x;
            this._y = coordinate.y;
        }
    }

    private coordinateIsWithinImageBounds(coordinate?: Coordinate): boolean {
        if (!coordinate) {
            return false;
        }

        const xInRange: boolean = coordinate.x >= 0 && coordinate.x <= this._image.width;
        const yInRange: boolean = coordinate.y >= 0 && coordinate.y <= this._image.height;
        return (xInRange && yInRange);
    }


}