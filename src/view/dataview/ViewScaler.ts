export class ViewScaler {

    private _scaleFactor = 0.1;

    get scaleFactor(): string {
        return this.convertToRoundedNumberString(this._scaleFactor);
    }

    public updateScaleGivenLength(givenLength: number, actualLength: number): void {
        this._scaleFactor = Math.abs(givenLength / actualLength);
    }

    public updateScaleGivenArea(givenArea: number, actualArea: number): void {
        this._scaleFactor = Math.sqrt(Math.abs(givenArea / actualArea));
    }

    public adjustLengthAccordingToScale(length: number): string {
        return this.convertToRoundedNumberString(length * this._scaleFactor);
    }

    public adjustAreaAccordingToScale(area: number): string {
        return this.convertToRoundedNumberString(area * this._scaleFactor * this._scaleFactor);
    }

    private convertToRoundedNumberString(givenNumber: number): string {
        const roundedNumber: number = Math.round(givenNumber * 1000) / 1000;
        return roundedNumber.toString();
    }
}