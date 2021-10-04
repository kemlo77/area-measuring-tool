import { MeassuringShape } from '../../model/MeassuringShape';
import { Model } from '../../model/Model';
import { Coordinate } from '../../model/shape/Coordinate';
import { Observer } from '../canvasview/Observer';

export class DataView implements Observer {

    private dataDiv: HTMLElement = document.getElementById('data');
    private scaleFactor = 0.1;
    private areaInputs: HTMLInputElement[] = [];
    private lengthInputs: HTMLInputElement[] = [];

    updateBecauseModelHasChanged(model: Model): void {
        this.removeAllChildNodes(this.dataDiv);
        this.addAreaTotalParagraph(model);
        this.addAreaShapeDivs(model);
        this.addLenghtShapeDivs(model);
    }

    updateBecauseOfMovementInModel(model: Model, mousePosition: Coordinate): void {
        //
    }


    private removeAllChildNodes(parent: HTMLElement): void {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
        this.areaInputs = [];
        this.lengthInputs = [];
    }

    private addAreaTotalParagraph(model: Model): void {
        const areaTotal: number = model.onlyAreaShapes()
            .reduce((sum, it) => sum + it.area, 0);
        const scaledAndRoundedArea: string =
            this.convertToRoundedNumberString(areaTotal * this.scaleFactor * this.scaleFactor);
        this.dataDiv.appendChild(this.generateParagraph('Area total: ' + scaledAndRoundedArea));
        this.dataDiv.appendChild(this.generateParagraph('Scale factor: ' + this.scaleFactor));
    }

    private addAreaShapeDivs(model: Model): void {
        model.onlyAreaShapes()
            .forEach((areaShape) => {
                this.dataDiv.appendChild(this.generateAreaShapeDiv(areaShape));
            });
    }

    private addLenghtShapeDivs(model: Model): void {
        model.onlyLengthShapes()
            .forEach((lengthShape) => {
                this.dataDiv.appendChild(this.generateLengthShapeDiv(lengthShape));
            });
    }

    private generateParagraph(paragraphtext: string): HTMLParagraphElement {
        const p: HTMLParagraphElement = document.createElement('p');
        p.textContent = paragraphtext;
        return p;
    }

    private generateLengthShapeDiv(lengthShape: MeassuringShape): HTMLDivElement {
        const div: HTMLDivElement = document.createElement('div');
        if (lengthShape.isSelected) {
            div.classList.add('selected');
        }

        const nameInput: HTMLInputElement = this.generateTextInput(lengthShape.name);
        nameInput.addEventListener('input', (event) => { lengthShape.name = (<HTMLInputElement>event.target).value; });
        div.appendChild(nameInput);

        const shapeLength: string = this.convertToRoundedNumberString(lengthShape.length * this.scaleFactor);
        const lengthInput: HTMLInputElement = this.generateNumberInput(shapeLength);
        lengthInput.setAttribute('data-pixellength', lengthShape.length.toString());
        lengthInput.addEventListener('input', (event) => {
            this.lengthInputChanged((<HTMLInputElement>event.target), lengthShape.length);
        });
        div.appendChild(lengthInput);
        this.lengthInputs.push(lengthInput);
        return div;
    }

    private generateAreaShapeDiv(areaShape: MeassuringShape): HTMLDivElement {
        const div: HTMLDivElement = document.createElement('div');
        if (areaShape.isSelected) {
            div.classList.add('selected');
        }

        const nameInput: HTMLInputElement = this.generateTextInput(areaShape.name);
        nameInput.addEventListener('input', (event) => { areaShape.name = (<HTMLInputElement>event.target).value; });
        div.appendChild(nameInput);

        const area: string = this.convertToRoundedNumberString(areaShape.area * this.scaleFactor * this.scaleFactor);
        const areaInput: HTMLInputElement = this.generateNumberInput(area);
        areaInput.setAttribute('data-pixelarea', areaShape.area.toString());
        areaInput.classList.add('area');
        areaInput.addEventListener('input', (event) => {
            this.areaInputChanged((<HTMLInputElement>event.target), areaShape.area);
        });
        div.appendChild(areaInput);
        this.areaInputs.push(areaInput);

        const length: string =
            this.convertToRoundedNumberString(areaShape.length * this.scaleFactor);
        const perimeterInput: HTMLInputElement = this.generateNumberInput(length);
        perimeterInput.setAttribute('data-pixellength', areaShape.length.toString());
        perimeterInput.classList.add('length');
        perimeterInput.addEventListener('input', (event) => {
            this.lengthInputChanged((<HTMLInputElement>event.target), areaShape.length);
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