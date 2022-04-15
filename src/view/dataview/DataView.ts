import { MeassuringShape } from '../../model/MeassuringShape';
import { Model } from '../../model/Model';
import { Coordinate } from '../../model/shape/Coordinate';
import { Observer } from '../Observer';
import { ViewScaler } from './ViewScaler';

export class DataView implements Observer {

    private dataDiv: HTMLElement = document.getElementById('data');
    private numberInputs: HTMLInputElement[] = [];
    private viewScaler: ViewScaler = new ViewScaler();

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
        this.numberInputs = [];
    }


    private addAreaTotalParagraph(model: Model): void {
        const areaTotal: number = model.areaShapes
            .reduce((sum, it) => sum + it.area, 0);
        const scaledAndRoundedArea: string = this.viewScaler.adjustAreaAccordingToScale(areaTotal);
        this.dataDiv.appendChild(this.generateParagraph('Area total: ' + scaledAndRoundedArea));
        this.dataDiv.appendChild(this.generateParagraph('Scale factor: ' + this.viewScaler.scaleFactor));
    }

    private generateParagraph(paragraphtext: string): HTMLParagraphElement {
        const p: HTMLParagraphElement = document.createElement('p');
        p.textContent = paragraphtext;
        return p;
    }


    private addAreaShapeDivs(model: Model): void {
        model.areaShapes
            .forEach((areaShape) => {
                this.dataDiv.appendChild(this.generateAreaShapeDiv(areaShape));
            });
    }

    private addLenghtShapeDivs(model: Model): void {
        model.lengthShapes
            .forEach((lengthShape) => {
                this.dataDiv.appendChild(this.generateLengthShapeDiv(lengthShape));
            });
    }



    private generateLengthShapeDiv(lengthShape: MeassuringShape): HTMLDivElement {
        const div: HTMLDivElement = this.createDiv(lengthShape.isSelected);

        const nameInput: HTMLInputElement = this.createNameInput(lengthShape);
        div.appendChild(nameInput);

        const lengthInput: HTMLInputElement = this.createLengthInput(lengthShape);
        div.appendChild(lengthInput);
        this.numberInputs.push(lengthInput);
        return div;
    }

    private generateAreaShapeDiv(areaShape: MeassuringShape): HTMLDivElement {
        const div: HTMLDivElement = this.createDiv(areaShape.isSelected);

        const nameInput: HTMLInputElement = this.createNameInput(areaShape);
        div.appendChild(nameInput);

        const perimeterInput: HTMLInputElement = this.createLengthInput(areaShape);
        div.appendChild(perimeterInput);
        this.numberInputs.push(perimeterInput);

        const areaInput: HTMLInputElement = this.createAreaInput(areaShape);
        div.appendChild(areaInput);
        this.numberInputs.push(areaInput);

        return div;
    }


    private createDiv(isSelected: boolean): HTMLDivElement {
        const createdDiv: HTMLDivElement = document.createElement('div');
        if (isSelected) {
            createdDiv.classList.add('selected');
        }
        return createdDiv;
    }

    private createNameInput(shape: MeassuringShape): HTMLInputElement {
        const createdNameInput: HTMLInputElement = this.createTextInput(shape.name);
        createdNameInput.addEventListener('input', (event) => { shape.name = (<HTMLInputElement>event.target).value; });
        return createdNameInput;
    }

    private createTextInput(value: string): HTMLInputElement {
        const inputElement: HTMLInputElement = document.createElement('input');
        inputElement.setAttribute('type', 'text');
        inputElement.setAttribute('value', value);
        return inputElement;
    }

    private createLengthInput(shape: MeassuringShape): HTMLInputElement {
        const length: string = this.viewScaler.adjustLengthAccordingToScale(shape.length);
        const createdLengthInput: HTMLInputElement = this.createNumberInput(length);
        createdLengthInput.addEventListener('input', (event) => {
            const changedInputElement: HTMLInputElement = <HTMLInputElement>event.target;
            const enteredLength: number = Number(changedInputElement.value);
            this.viewScaler.updateScaleGivenLength(enteredLength, shape.length);
            this.updateAllNumberInputsAfterScaleChangeExceptGivenElement(changedInputElement);
        });
        createdLengthInput.addEventListener('scalechange', (event: CustomEvent) => {
            createdLengthInput.value = this.viewScaler.adjustLengthAccordingToScale(shape.length);
        });
        return createdLengthInput;
    }

    private createAreaInput(shape: MeassuringShape): HTMLInputElement {
        const area: string = this.viewScaler.adjustAreaAccordingToScale(shape.area);
        const createdAreaInput: HTMLInputElement = this.createNumberInput(area);
        createdAreaInput.addEventListener('input', (event) => {
            const changedInputElement: HTMLInputElement = <HTMLInputElement>event.target;
            const enteredArea: number = Number(changedInputElement.value);
            this.viewScaler.updateScaleGivenArea(enteredArea, shape.area);
            this.updateAllNumberInputsAfterScaleChangeExceptGivenElement(changedInputElement);
        });
        createdAreaInput.addEventListener('scalechange', (event: CustomEvent) => {
            createdAreaInput.value = this.viewScaler.adjustAreaAccordingToScale(shape.area);
        });
        return createdAreaInput;
    }



    private createNumberInput(value: string): HTMLInputElement {
        const inputElement: HTMLInputElement = document.createElement('input');
        inputElement.setAttribute('type', 'number');
        inputElement.setAttribute('value', value);
        return inputElement;
    }

    private updateAllNumberInputsAfterScaleChangeExceptGivenElement(elementNotToBeUpdated: HTMLInputElement): void {
        this.numberInputs
            .filter((input) => { return input !== elementNotToBeUpdated; })
            .forEach((input) => {
                input.dispatchEvent(new CustomEvent('scalechange'));
            });
    }

}