import { AbstractPolygonArea } from '../AbstractPolygonArea.js';
import { Ruler } from '../Ruler.js';
import { InteractiveShape } from '../shape/InteractiveShape.js';

export class DataPresenter {

    private dataDiv: HTMLElement = document.getElementById('data') as HTMLElement;
    private static instance: DataPresenter;

    private constructor() {
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
    }

    private addAreaTotalParagraph(shapes: InteractiveShape[]): void {
        const areaTotal: number = this.onlyPolygonAreas(shapes)
            .reduce((sum, it) => sum + it.area, 0);
        this.dataDiv.appendChild(this.generateAreaTotalParagraph(areaTotal));
    }

    private generateAreaTotalParagraph(area: number): HTMLParagraphElement {
        return this.generateParagraph('Area total: ' + area);
    }

    private generateParagraph(paragraphtext: string): HTMLParagraphElement {
        const p: HTMLParagraphElement = document.createElement('p');
        p.textContent = paragraphtext;
        return p;
    }

    private addAreaDivs(shapes: InteractiveShape[]): void {
        this.onlyPolygonAreas(shapes)
            .forEach((polygonArea) => {
                this.dataDiv.appendChild(this.generateAreaDiv(polygonArea));
            });
    }

    private onlyPolygonAreas(shapes: InteractiveShape[]): AbstractPolygonArea[] {
        return shapes
            .filter((shape) => shape instanceof AbstractPolygonArea)
            .map((shape) => shape as AbstractPolygonArea);
    }

    private addRulerDivs(shapes: InteractiveShape[]): void {
        this.onlyRulers(shapes)
            .forEach((ruler) => {
                this.dataDiv.appendChild(this.generateRulerDiv(ruler));
            });
    }

    private onlyRulers(shapes: InteractiveShape[]): Ruler[] {
        return shapes
            .filter((it) => it instanceof Ruler)
            .map((it) => it as Ruler);
    }

    private generateRulerDiv(ruler: Ruler): HTMLDivElement {
        const rulerLength: string = this.convertToRoundedNumberString(ruler.length);
        const div: HTMLDivElement = document.createElement('div');
        const nameInput: HTMLInputElement = this.generateTextInput(ruler.name);
        div.appendChild(nameInput);
        const areaInput: HTMLInputElement = this.generateNumberInput(rulerLength);
        div.appendChild(areaInput);
        return div;
    }

    private generateAreaDiv(polygonArea: AbstractPolygonArea): HTMLDivElement {
        const perimeterLength: string = this.convertToRoundedNumberString(polygonArea.perimeterLength);
        const area: string = this.convertToRoundedNumberString(polygonArea.area);
        const div: HTMLDivElement = document.createElement('div');
        if (polygonArea.isSelected) {
            div.style.backgroundColor = 'yellow';
        }
        const nameInput: HTMLInputElement = this.generateTextInput(polygonArea.name);
        nameInput.addEventListener('input', (event) => { polygonArea.name = (<HTMLInputElement>event.target).value; });
        div.appendChild(nameInput);
        const areaInput: HTMLInputElement = this.generateNumberInput(area);
        div.appendChild(areaInput);
        const perimeterInput: HTMLInputElement = this.generateNumberInput(perimeterLength);
        div.appendChild(perimeterInput);
        return div;
    }

    private generateTextInput(value: string): HTMLInputElement {
        const inputElement: HTMLInputElement = document.createElement('input');
        inputElement.setAttribute('type', 'text');
        inputElement.setAttribute('value', value);
        return inputElement;
    }

    private convertToRoundedNumberString(givenNumber: number): string {
        const roundedNumber: number = Math.round(givenNumber * 100) / 100;
        return roundedNumber.toString();
    }

    private generateNumberInput(value: string): HTMLInputElement {
        const inputElement: HTMLInputElement = document.createElement('input');
        inputElement.setAttribute('type', 'number');
        inputElement.setAttribute('value', value);
        return inputElement;
    }


}