import { AbstractPolygonArea } from '../../model/AbstractPolygonArea.js';
import { Ruler } from '../../model/Ruler.js';
import { InteractiveShape } from '../../model/shape/InteractiveShape.js';

export class DataPresenter {

    private dataDiv: HTMLElement = document.getElementById('data') as HTMLElement;
    private static instance: DataPresenter;
    private scaleFactor = 0.1;
    private areaInputs: HTMLInputElement[] = [];
    private lengthInputs: HTMLInputElement[] = [];

    private constructor() {
        //
    }

    public static getInstance(): DataPresenter {
        if (!DataPresenter.instance) {
            DataPresenter.instance = new DataPresenter();
        }
        return DataPresenter.instance;
    }

    updatePresentation(shapes: InteractiveShape[]): void {
        this.removeAllChildNodes(this.dataDiv);
        this.addAreaTotalParagraph(shapes);
        this.addAreaDivs(shapes);
        this.addRulerDivs(shapes);
    }


    private removeAllChildNodes(parent: HTMLElement): void {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
        this.areaInputs = [];
        this.lengthInputs = [];
    }

    private addAreaTotalParagraph(shapes: InteractiveShape[]): void {
        const areaTotal: number = this.onlyPolygonAreas(shapes)
            .reduce((sum, it) => sum + it.area, 0);
        const scaledAndRoundedArea: string =
            this.convertToRoundedNumberString(areaTotal * this.scaleFactor * this.scaleFactor);
        this.dataDiv.appendChild(this.generateParagraph('Area total: ' + scaledAndRoundedArea));
        this.dataDiv.appendChild(this.generateParagraph('Scale factor: ' + this.scaleFactor));
    }

    private addAreaDivs(shapes: InteractiveShape[]): void {
        this.onlyPolygonAreas(shapes)
            .forEach((polygonArea) => {
                this.dataDiv.appendChild(this.generateAreaDiv(polygonArea));
            });
    }

    private addRulerDivs(shapes: InteractiveShape[]): void {
        this.onlyRulers(shapes)
            .forEach((ruler) => {
                this.dataDiv.appendChild(this.generateRulerDiv(ruler));
            });
    }

    private onlyPolygonAreas(shapes: InteractiveShape[]): AbstractPolygonArea[] {
        return shapes
            .filter((shape) => shape instanceof AbstractPolygonArea)
            .map((shape) => shape as AbstractPolygonArea);
    }

    private onlyRulers(shapes: InteractiveShape[]): Ruler[] {
        return shapes
            .filter((it) => it instanceof Ruler)
            .map((it) => it as Ruler);
    }

    private generateParagraph(paragraphtext: string): HTMLParagraphElement {
        const p: HTMLParagraphElement = document.createElement('p');
        p.textContent = paragraphtext;
        return p;
    }

    private generateRulerDiv(ruler: Ruler): HTMLDivElement {
        const div: HTMLDivElement = document.createElement('div');
        if (ruler.isSelected) {
            div.classList.add('selected');
        }

        const nameInput: HTMLInputElement = this.generateTextInput(ruler.name);
        nameInput.addEventListener('input', (event) => { ruler.name = (<HTMLInputElement>event.target).value; });
        div.appendChild(nameInput);

        const rulerLength: string = this.convertToRoundedNumberString(ruler.length * this.scaleFactor);
        const lengthInput: HTMLInputElement = this.generateNumberInput(rulerLength);
        lengthInput.setAttribute('data-pixellength', ruler.length.toString());
        lengthInput.addEventListener('input', (event) => {
            this.lengthInputChanged((<HTMLInputElement>event.target), ruler.length);
        });
        div.appendChild(lengthInput);
        this.lengthInputs.push(lengthInput);
        return div;
    }

    private generateAreaDiv(polygonArea: AbstractPolygonArea): HTMLDivElement {
        const div: HTMLDivElement = document.createElement('div');
        if (polygonArea.isSelected) {
            div.classList.add('selected');
        }

        const nameInput: HTMLInputElement = this.generateTextInput(polygonArea.name);
        nameInput.addEventListener('input', (event) => { polygonArea.name = (<HTMLInputElement>event.target).value; });
        div.appendChild(nameInput);

        const area: string = this.convertToRoundedNumberString(polygonArea.area * this.scaleFactor * this.scaleFactor);
        const areaInput: HTMLInputElement = this.generateNumberInput(area);
        areaInput.setAttribute('data-pixelarea', polygonArea.area.toString());
        areaInput.classList.add('area');
        areaInput.addEventListener('input', (event) => {
            this.areaInputChanged((<HTMLInputElement>event.target), polygonArea.area);
        });
        div.appendChild(areaInput);
        this.areaInputs.push(areaInput);

        const perimeterLength: string =
            this.convertToRoundedNumberString(polygonArea.perimeterLength * this.scaleFactor);
        const perimeterInput: HTMLInputElement = this.generateNumberInput(perimeterLength);
        perimeterInput.setAttribute('data-pixellength', polygonArea.perimeterLength.toString());
        perimeterInput.classList.add('length');
        perimeterInput.addEventListener('input', (event) => {
            this.lengthInputChanged((<HTMLInputElement>event.target), polygonArea.perimeterLength);
        });
        div.appendChild(perimeterInput);
        this.lengthInputs.push(perimeterInput);

        return div;
    }

    private generateTextInput(value: string): HTMLInputElement {
        const inputElement: HTMLInputElement = document.createElement('input');
        inputElement.setAttribute('type', 'text');
        inputElement.setAttribute('value', value);
        return inputElement;
    }

    private generateNumberInput(value: string): HTMLInputElement {
        const inputElement: HTMLInputElement = document.createElement('input');
        inputElement.setAttribute('type', 'number');
        inputElement.setAttribute('value', value);
        return inputElement;
    }

    private convertToRoundedNumberString(givenNumber: number): string {
        const roundedNumber: number = Math.round(givenNumber * 1000) / 1000;
        return roundedNumber.toString();
    }

    private areaInputChanged(inputElement: HTMLInputElement, area: number): void {
        this.updateScaleGivenArea(Number(inputElement.value), area);
        this.updateAllNumberInputsAfterScaleChangeExceptGivenElement(inputElement);
    }

    private lengthInputChanged(inputElement: HTMLInputElement, length: number): void {
        this.updateScaleGivenLength(Number(inputElement.value), length);
        this.updateAllNumberInputsAfterScaleChangeExceptGivenElement(inputElement);
    }

    private updateScaleGivenLength(givenLength: number, length: number): void {
        this.scaleFactor = Math.abs(givenLength / length);
    }

    private updateScaleGivenArea(givenArea: number, shapeArea: number): void {
        this.scaleFactor = Math.sqrt(Math.abs(givenArea / shapeArea));
    }

    private updateAllNumberInputsAfterScaleChangeExceptGivenElement(inputNotUpdated: HTMLInputElement): void {
        this.areaInputs
            .filter((input) => { return input !== inputNotUpdated; })
            .forEach((input) => {
                this.recalculateDisplayedAreaValueAccordingToNewFactor(input);
            });

        this.lengthInputs
            .filter((input) => { return input !== inputNotUpdated; })
            .forEach((input) => {
                this.recalculateDisplayedLengthValueAccordingToNewFactor(input);
            });

        //TODO
        //det valda elementet borde få en svart ram
        //ta bort svarta ramar på alla andra.
        // eller ändra klass och ta bort den klassen på andra.
    }

    private recalculateDisplayedAreaValueAccordingToNewFactor(input: HTMLInputElement): void {
        const pixelArea: number = Number(input.getAttribute('data-pixelarea'));
        const scaledAndRoundedArea: string =
            this.convertToRoundedNumberString(pixelArea * this.scaleFactor * this.scaleFactor);
        input.value = scaledAndRoundedArea;
    }

    private recalculateDisplayedLengthValueAccordingToNewFactor(input: HTMLInputElement): void {
        const pixelArea: number = Number(input.getAttribute('data-pixellength'));
        const scaledAndRoundedLength: string =
            this.convertToRoundedNumberString(pixelArea * this.scaleFactor);
        input.value = scaledAndRoundedLength;
    }


}