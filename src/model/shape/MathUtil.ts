import { Point } from './Point.js';
import { Segment } from './Segment.js';
import { Vector } from './Vector.js';

export module MathUtil {
	// Checking if two segments AB and CD intersect
	export function calculateIntersect(segmentAB: Segment, segmentCD: Segment): Point {
		// inspiration på http://alienryderflex.com/intersect/
		const pointA: Point = new Point(segmentAB.p1);
		const pointB: Point = new Point(segmentAB.p2);
		const pointC: Point = new Point(segmentCD.p1);
		const pointD: Point = new Point(segmentCD.p2);
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
			pointA.translate(translatedX, translatedY);
			pointB.translate(translatedX, translatedY);
			pointC.translate(translatedX, translatedY);
			pointD.translate(translatedX, translatedY);
		}

		function rotateAroundOriginSoThatPointBIsOnPositiveXAxis(): void {
			rotatedByAngle = angleBetweenXAxisAndAB();
			pointB.rotateClockwise(rotatedByAngle);
			pointC.rotateClockwise(rotatedByAngle);
			pointD.rotateClockwise(rotatedByAngle);
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

	// returns a vector from the point being projected to the projection point on the segment
	export function projectPointOntoSegment(segmentAB: Segment, pointC: Point): Vector {
		const pointA: Point = new Point(segmentAB.p1);
		const pointB: Point = new Point(segmentAB.p2);

		const vectorAB: Vector = new Vector(pointA, pointB);
		const vectorAC: Vector = new Vector(pointA, pointC);

		const dotproductABAC: number = Vector.dotProduct(vectorAB, vectorAC);
		// if dotproduct_AB_AC is larger than zero the angle is acute and then C can be projected on segment
		if (dotproductABAC >= 0) {

			// page 136 in "Elementary Linear Algebra" [Anton, Rorres], 7th edition
			// projecting AC on AB. The new vector is AD
			const vectorADcomponentX: number = dotproductABAC * vectorAB.x / Math.pow(vectorAB.norm, 2);
			const vectorADcomponentY: number = dotproductABAC * vectorAB.y / Math.pow(vectorAB.norm, 2);
			const vectorAD: Vector = new Vector(vectorADcomponentX, vectorADcomponentY);
			const pointD: Point = new Point(pointA.x + vectorAD.x, pointA.y + vectorAD.y);
			// checking so that A->D is shorter than A->B
			if (vectorAD.norm <= vectorAB.norm) {
				const vectorCD: Vector = new Vector(pointC, pointD);
				return vectorCD;
			}
		}
		return null;
	}

}
