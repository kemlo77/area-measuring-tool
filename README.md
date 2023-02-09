A small project on how to add and modify a non complex polygon using the canvas in html5....

Check it out at:
https://kemlo77.github.io/createPolygon/index.html



# Patterns used or explored in this project so far

* Builder Pattern (SegmentedMeassuringShapeBuilder)

* Factory Method Pattern (ShapeFactory and ConcreteShapeFactory)

* Model View Controller Pattern

* Observer Pattern (Controller is Subject, CanvasView and DataView are Observers)

* State pattern (used inLine and Polygon)

* Strategy Pattern (SegmentedMeassuringShape has a designated painter)

* Singleton Pattern, no longer used

* Template Method Pattern used in painters

# Interesting techniques

Using 4 canvas layers:
* Image layer for displaying background image
* Filter layer for toning down the image
* Background layer for non moving shapes. May contain a lot of elements that are not redrawn so often.
* Foreground layer for moving shapes. Few elements that are redrawn the most.

Using Gauss shoelace formula to calculate area of non complex polygons.

