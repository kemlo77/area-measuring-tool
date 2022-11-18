export class Color {

    private redValue: number;
    private greenValue: number;
    private blueValue: number;
    private alphaValue: number = 1;

    constructor(red: number, green: number, blue: number) {
        if (this.notInInterval0To255(red) || this.notInInterval0To255(green) || this.notInInterval0To255(blue)) {
            throw new Error('The given rgb values are not valid.');
        }
        this.redValue = red;
        this.greenValue = green;
        this.blueValue = blue;
    }

    private notInInterval0To255(value: number): boolean {
        return value < 0 || value > 255;
    }

    static get black(): Color {
        return new Color(0, 0, 0);
    }

    static get white(): Color {
        return new Color(255, 255, 255);
    }

    static get yellow(): Color {
        return new Color(255, 255, 0);
    }

    get red(): number {
        return this.redValue;
    }

    get green(): number {
        return this.greenValue;
    }

    get blue(): number {
        return this.blueValue;
    }


    public toRgbString(): string {
        return `rgb(${this.redValue},${this.greenValue},${this.blueValue})`;
    }

    public toRgbaString(): string {
        return `rgba(${this.redValue},${this.greenValue},${this.blueValue},${this.alphaValue})`;
    }


}