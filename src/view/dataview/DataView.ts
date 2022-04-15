import { MeassuringShape } from '../../model/MeassuringShape';
import { Model } from '../../model/Model';
import { Coordinate } from '../../model/shape/Coordinate';
import { Observer } from '../Observer';
import { ViewScaler } from './ViewScaler';

export class DataView implements Observer {

    private dataDiv: HTMLElement = document.getElementById('data');
    private areaInputs: HTMLInputElement[] = [];
    private lengthInputs: HTMLInputElement[] = [];
    private viewScaler: ViewScaler;

    constructor() {
        this.viewScaler = new ViewScaler();
    }

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
        this.lengthInputs.push(lengthInput);
        return div;
    }

    private generateAreaShapeDiv(areaShape: MeassuringShape): HTMLDivElement {
        const div: HTMLDivElement = this.createDiv(areaShape.isSelected);

        const nameInput: HTMLInputElement = this.createNameInput(areaShape);
        div.appendChild(nameInput);

        const perimeterInput: HTMLInputElement = this.createLengthInput(areaShape);
        div.appendChild(perimeterInput);
        this.lengthInputs.push(perimeterInput);

        const areaInput: HTMLInputElement = this.createAreaInput(areaShape);
        div.appendChild(areaInput);
        this.areaInputs.push(areaInput);

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

    private createLengthInput(shape: MeassuringShape): HTMLInputElement {
        const length: string = this.viewScaler.adjustLengthAccordingToScale(shape.length);
        const createdLengthInput: HTMLInputElement = this.createNumberInput(length);
        createdLengthInput.setAttribute('data-pixellength', shape.length.toString());
        //createdLengthInput.classList.add('length');
        createdLengthInput.addEventListener('input', (event) => {
            this.lengthInputChanged((<HTMLInputElement>event.target), shape.length);
        });
        return createdLengthInput;
    }

    private createAreaInput(shape: MeassuringShape): HTMLInputElement {
        const area: string = this.viewScaler.adjustAreaAccordingToScale(shape.area);
        const createdAreaInput: HTMLInputElement = this.createNumberInput(area);
        createdAreaInput.setAttribute('data-pixelarea', shape.area.toString());
        //createdAreaInput.classList.add('area');
        createdAreaInput.addEventListener('input', (event) => {
            this.areaInputChanged((<HTMLInputElement>event.target), shape.area);
        });
        return createdAreaInput;
    }

    private createTextInput(value: string): HTMLInputElement {
        const inputElement: HTMLInputElement = document.createElement('input');
        inputElement.setAttribute('type', 'text');
        inputElement.setAttribute('value', value);
        return inputElement;
    }

    private createNumberInput(value: string): HTMLInputElement {
        const inputElement: HTMLInputElement = document.createElement('input');
        inputElement.setAttribute('type', 'number');
        inputElement.setAttribute('value', value);
        return inputElement;
    }


    private areaInputChanged(changedInputElement: HTMLInputElement, area: number): void {
        this.viewScaler.updateScaleGivenArea(Number(changedInputElement.value), area);
        this.updateAllNumberInputsAfterScaleChangeExceptGivenElement(changedInputElement);
    }

    private lengthInputChanged(changedInputElement: HTMLInputElement, length: number): void {
        this.viewScaler.updateScaleGivenLength(Number(changedInputElement.value), length);
        this.updateAllNumberInputsAfterScaleChangeExceptGivenElement(changedInputElement);
    }


    private updateAllNumberInputsAfterScaleChangeExceptGivenElement(elementNotToBeUpdated: HTMLInputElement): void {
        this.areaInputs
            .filter((input) => { return input !== elementNotToBeUpdated; })
            .forEach((input) => {
                this.recalculateDisplayedAreaValueAccordingToNewFactor(input);
            });

        this.lengthInputs
            .filter((input) => { return input !== elementNotToBeUpdated; })
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
        const scaledAndRoundedArea: string = this.viewScaler.adjustAreaAccordingToScale(pixelArea);
        input.value = scaledAndRoundedArea;
    }

    private recalculateDisplayedLengthValueAccordingToNewFactor(input: HTMLInputElement): void {
        const pixelArea: number = Number(input.getAttribute('data-pixellength'));
        const scaledAndRoundedLength: string = this.viewScaler.adjustLengthAccordingToScale(pixelArea);
        input.value = scaledAndRoundedLength;
    }

    //TODO: ta bort förekomster av data-pixellength och data-pixelarea sen när möjligt

}