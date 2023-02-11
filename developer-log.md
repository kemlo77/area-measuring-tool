# Developer Log

This project started with idea to create a polygon by clicking in a canvas element. In the beginning it was a simple HTML page and some JavaScript. Curiosity and the desire to try new ideas has made it grow into something bigger.

## Techniques learned along the way

* TypeScript
* Webpack (build and develop)
* ESLint
* Mocha (unit testing)
* Cypress (e2e testing)
* Istanbul and nyc (test coverage)
* SonarQube (inspecting code quality)
* GitHub Actions (CI/CD)

## Some books read that were of influence

* Clean Code by Robert C. Martin
* Refactoring by Martin Fowler
* Domain Driven Design by Eric Evans
* Head First Design Patterns by Eric Freeman & Elisabeth Robson

## Patterns used or explored in this project so far

* Builder Pattern (SegmentedMeassuringShapeBuilder)
* Factory Method Pattern (ShapeFactory and ConcreteShapeFactory)
* Model View Controller Pattern
* Observer Pattern (Controller is Subject, CanvasView and DataView are Observers)
* State pattern (used inLine and Polygon)
* Strategy Pattern (SegmentedMeassuringShape has a designated painter)
* Singleton Pattern, no longer used
* Template Method Pattern used in painters

## Interesting solutions

Using 4 canvas layers:
* __Image layer__ for displaying background image
* __Filter layer__ for toning down the image
* __Background layer__ for non moving shapes. May contain a lot of elements that are not redrawn so often.
* __Foreground layer__ for moving shapes. Few elements that are redrawn the most.

Using Gauss shoelace formula to calculate area of non complex polygons.


