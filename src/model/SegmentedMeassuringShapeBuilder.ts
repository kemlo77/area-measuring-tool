import { RegularSegmentsPainter } from '../view/canvasview/segmentPainters/RegularSegmentsPainter';
import { SegmentsPainter } from '../view/canvasview/segmentPainters/SegmentsPainter';
import { AreaValueSign } from './AreaValueSign';
import { SegmentedMeassuringShape } from './SegmentedMeassuringShape';
import { InteractiveSegmentShape } from './shape/segmentShapes/InteractiveSegmentShape';

export class SegmentedMeassuringShapeBuilder {
    private readonly _segmentMeassuringShape: SegmentedMeassuringShape;

    constructor(shape: InteractiveSegmentShape, hasArea: boolean) {
        this._segmentMeassuringShape = new SegmentedMeassuringShape(shape, hasArea);
    }

    designatedPainter(painter: SegmentsPainter): SegmentedMeassuringShapeBuilder {
        this._segmentMeassuringShape.designatedPainter = painter;
        return this;
    }

    color(color: string): SegmentedMeassuringShapeBuilder {
        this._segmentMeassuringShape.color = color;
        return this;
    }

    areaValueSign(areaValueSign: AreaValueSign): SegmentedMeassuringShapeBuilder {
        this._segmentMeassuringShape.areaValueSign = areaValueSign;
        return this;
    }

    build(): SegmentedMeassuringShape {
        return this._segmentMeassuringShape;
    }
}