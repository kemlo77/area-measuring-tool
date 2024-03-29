import { MeassuringShape } from '../../model/meassuringshape/MeassuringShape';
import { Model } from '../../model/Model';
import { Coordinate } from '../../model/meassuringshape/shape/Coordinate';
import { Observer } from '../Observer';
import { ViewScaler } from './ViewScaler';
import { Name } from '../../model/meassuringshape/Name';

export class DataView implements Observer {

    private dataDiv: HTMLElement = document.getElementById('data');
    private numberInputs: HTMLInputElement[] = [];
    private viewScaler: ViewScaler = new ViewScaler();
    private _model: Model;

    constructor(model: Model) {
        this._model = model;
    }

    updateBecauseModelHasChanged(): void {
        this.removeAllChildNodes(this.dataDiv);
        this.addAreaTotalParagraph(this._model);
        this.addAreaShapeDivs(this._model);
        this.addLenghtShapeDivs(this._model);
    }

    updateBecauseOfMovementInModel(mousePosition: Coordinate): void {
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

        const deleteButton: HTMLInputElement = this.createDeleteButton(lengthShape);
        div.appendChild(deleteButton);

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

        const deleteButton: HTMLInputElement = this.createDeleteButton(areaShape);
        div.appendChild(deleteButton);

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
        const createdNameInput: HTMLInputElement = this.createTextInput(shape.name.value);
        createdNameInput.addEventListener('input', (event) => {
            const currentValue: string = (<HTMLInputElement>event.target).value.trim();
            if (currentValue.length > 40) {
                alert('Max name length is 40 characters');
                return;
            }
            if (currentValue.length == 0) {
                shape.name = new Name('default name');
                return;
            }
            shape.name = new Name(currentValue);
        });
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

    private createDeleteButton(shape: MeassuringShape): HTMLInputElement {
        const createdDeleteButton: HTMLInputElement = document.createElement('input');
        createdDeleteButton.setAttribute('type', 'button');
        createdDeleteButton.setAttribute('value', 'X');
        createdDeleteButton.addEventListener('click', () => {
            this._model.removeShapeById(shape.id);
        });
        return createdDeleteButton;
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