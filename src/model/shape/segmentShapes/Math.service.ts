import { Point } from '../Point';
import { Segment } from './Segment';
import { Vector } from '../Vector';

export module MathService {
	// Checking if two segments AB and CD intersect
	export function calculateIntersect(segmentAB: Segment, segmentCD: Segment): Point {
		// inspiration på http://alienryderflex.com/intersect/
		let pointA: Point = new Point(segmentAB.p1);
		let pointB: Point = new Point(segmentAB.p2);
		let pointC: Point = new Point(segmentCD.p1);
		let pointD: Point = new Point(segmentCD.p2);
		let translatedX: number = 0;
		let translatedY: number = 0;
		let rotatedByAngle: number = 0;

		translatePointsSoThatPointAIsInTheOrigin();
		rotateAroundOriginSoThatPointBIsOnPositiveXAxis();

		if (segmentCDIsParallelToXAxis()) {
			if (pointIsOnXAxis(pointC)) { // if C and thus also D are on the x-axis
				if (pointIsBetweenAAndBOnXAxis(pointC)) {
					return rotateAndTranslatePointBackToOriginalSystem(pointC);
				}
				if (pointIsBetweenAAndBOnXAxis(pointD)) {
					return rotateAndTranslatePointBackToOriginalSystem(pointD);
				}
			}
			return null;
		}

		if (segmentCDDoesNotIntersectXAxis()) { return null; }

		const pointE: Point = pointWhereCDIntersectsXAxis();

		if (pointIsBetweenAAndBOnXAxis(pointE)) {
			return rotateAndTranslatePointBackToOriginalSystem(pointE);
		}

		return null;


		function translatePointsSoThatPointAIsInTheOrigin(): void {
			translatedX = -pointA.x;
			translatedY = -pointA.y;
			pointA = pointA.translate(translatedX, translatedY);
			pointB = pointB.translate(translatedX, translatedY);
			pointC = pointC.translate(translatedX, translatedY);
			pointD = pointD.translate(translatedX, translatedY);
		}

		function rotateAroundOriginSoThatPointBIsOnPositiveXAxis(): void {
			rotatedByAngle = angleBetweenXAxisAndAB();
			//pointA is in the origin, so there is no meaning in rotating it
			pointB = pointB.rotateClockwise(rotatedByAngle);
			pointC = pointC.rotateClockwise(rotatedByAngle);
			pointD = pointD.rotateClockwise(rotatedByAngle);
		}

		function angleBetweenXAxisAndAB(): number {
			return pointB.getTheAngle();
		}

		function segmentCDIsParallelToXAxis(): boolean {
			return Math.abs(pointC.y - pointD.y) < 0.000001;
		}

		function pointIsOnXAxis(point: Point): boolean {
			return (Math.abs(point.y) < 0.000001);
		}

		function pointIsBetweenAAndBOnXAxis(point: Point): boolean {
			return (pointA.x - 0.000001) <= point.x && point.x <= (pointB.x + 0.000001);
		}

		function rotateAndTranslatePointBackToOriginalSystem(point: Point): Point {
			return point.rotateClockwise(-rotatedByAngle)
				.translate(-translatedX, -translatedY);
		}

		function segmentCDDoesNotIntersectXAxis(): boolean {
			return pointCAndDAreBelowXAxis() || pointCAndDAreAboveXAxis();
		}

		function pointCAndDAreAboveXAxis(): boolean {
			return pointIsAboveXAxis(pointC) && pointIsAboveXAxis(pointD);
		}

		function pointIsAboveXAxis(point: Point): boolean {
			return point.y > 0.000001;
		}

		function pointCAndDAreBelowXAxis(): boolean {
			return pointIsBelowXAxis(pointC) && pointIsBelowXAxis(pointD);
		}

		function pointIsBelowXAxis(point: Point): boolean {
			return point.y < -0.000001;
		}

		function pointWhereCDIntersectsXAxis(): Point {
			const positionOnXAxis: number = pointD.x + (pointC.x - pointD.x) * pointD.y / (pointD.y - pointC.y);
			return new Point(positionOnXAxis, 0);
		}
	}


	export function projectPointOntoSegment(segmentAB: Segment, pointC: Point): Point {
		const pointA: Point = new Point(segmentAB.p1);
		const pointB: Point = new Point(segmentAB.p2);

		const vectorAB: Vector = new Vector(pointA, pointB);
		const vectorAC: Vector = new Vector(pointA, pointC);

		// if angle between AB and AC is acute, then point C can be projected on segment AB
		if (angleIsObtuse()) { return null; }

		const vectorAD: Vector = projectVectorACOnVectorAB();

		// checking so that A->D is shorter than A->B
		if (vectorAD.norm > vectorAB.norm) { return null; }

		return calculatePointD();


		function angleIsObtuse(): boolean {
			return dotProductABAC() < 0;
		}

		function dotProductABAC(): number {
			return Vector.dotProduct(vectorAB, vectorAC);
		}

		function projectVectorACOnVectorAB(): Vector {
			const dotProduct: number = dotProductABAC();
			const vectorADcomponentX: number = dotProduct * vectorAB.x / Math.pow(vectorAB.norm, 2);
			const vectorADcomponentY: number = dotProduct * vectorAB.y / Math.pow(vectorAB.norm, 2);
			const vectorAD: Vector = new Vector(vectorADcomponentX, vectorADcomponentY);
			return vectorAD;
		}

		function calculatePointD(): Point {
			return new Point(pointA.x + vectorAD.x, pointA.y + vectorAD.y);
		}
	}


	export function distanceBetweenPointAndPointProjectedOnSegment(segmentAB: Segment, pointC: Point): number {
		const projectedPoint: Point = projectPointOntoSegment(segmentAB, pointC);
		if (!projectedPoint) { return Infinity; }
		return projectedPoint.distanceToOtherPoint(pointC);
	}

}
