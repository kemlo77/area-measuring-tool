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
        this.addAreaParagraphs(shapes);
        this.addRulerParagraphs(shapes);
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
        const p: HTMLParagraphElement = document.createElement('p');
        p.textContent = 'Area total: ' + area;
        return p;
    }

    private addAreaParagraphs(shapes: InteractiveShape[]): void {
        this.onlyPolygonAreas(shapes)
            .forEach((polygonArea) => {
                this.dataDiv.appendChild(this.generateAreaParagraph(polygonArea));
            });
    }

    private generateAreaParagraph(polygonArea: AbstractPolygonArea): HTMLParagraphElement {
        const perimeterLength: number = Math.round(polygonArea.perimeterLength * 100) / 100;
        const area: number = Math.round(polygonArea.area * 100) / 100;
        const p: HTMLParagraphElement = document.createElement('p');
        p.textContent = polygonArea.name + ': ' + area + ' in area ' + perimeterLength + ' in perimeter';
        return p;
    }

    private onlyPolygonAreas(shapes: InteractiveShape[]): AbstractPolygonArea[] {
        return shapes
            .filter((shape) => shape instanceof AbstractPolygonArea)
            .map((shape) => shape as AbstractPolygonArea);
    }

    private addRulerParagraphs(shapes: InteractiveShape[]): void {
        this.onlyRulers(shapes)
            .forEach((ruler) => {
                this.dataDiv.appendChild(this.generateRulerParagraph(ruler));
            });
    }

    private onlyRulers(shapes: InteractiveShape[]): Ruler[] {
        return shapes
            .filter((it) => it instanceof Ruler)
            .map((it) => it as Ruler);
    }

    private generateRulerParagraph(ruler: Ruler): HTMLParagraphElement {
        const rulerLength: number = Math.round(ruler.length * 100) / 100;
        const p: HTMLParagraphElement = document.createElement('p');
        p.textContent = ruler.name + ': ' + rulerLength + ' length';
        return p;
    }
}