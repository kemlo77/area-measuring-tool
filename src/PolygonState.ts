interface PolygonState {

    stateName(): string;

    handleLeftClick(polygon: Polygon, pointClicked: Point): void;

    handleRightClick(polygon: Polygon, pointClicked: Point): void;

    drawSegments(polygon: Polygon): void;

    drawMovement(polygon: Polygon, mousePosition: Point): void;

    calculateSegments(polygon: Polygon): Segment[];

}