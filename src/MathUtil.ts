import { Point } from './Point.js';
import { Segment } from './Segment.js';
import { Vector } from './Vector.js';
import { ProjectionResult } from './ProjectionResult.js';

export class MathUtil {
	// Checking if two segments AB and CD intersect
	static calculateIntersect(segmentAB: Segment, segmentCD: Segment): Point {
		// inspiration på http://alienryderflex.com/intersect/
		const pointA: Point = new Point(segmentAB.p1);
		let pointB: Point = new Point(segmentAB.p2);
		const pointC: Point = new Point(segmentCD.p1);
		const pointD: Point = new Point(segmentCD.p2);

		const ax: number = pointA.x;
		const ay: number = pointA.y;
		// Translation of the system so that A is in the Origin
		pointB.translate(-ax, -ay);
		pointC.translate(-ax, -ay);
		pointD.translate(-ax, -ay);
		// calculate the length of AB
		const distAB: number = Math.sqrt(pointB.x * pointB.x + pointB.y * pointB.y);
		// the angle between the x-axis and AB
		const theta: number = pointB.getTheAngle();
		// Rotate the system so that point B is on the positive x-axis
		pointB = new Point(distAB, 0);
		pointC.rotateClockwise(theta);
		pointD.rotateClockwise(theta);
		// The case if CD is parallell with the x-axis
		// if C.y is equal to D.y (or very close to it)
		if (Math.abs(pointC.y - pointD.y) < 0.000001) {
			// if C and thus also D are on the x-axis (or very close to it)
			if ((Math.abs(pointC.y) < 0.000001)) {
				if ((0 <= pointC.x && pointC.x <= pointB.x)) {
					// Rotate and translate point C to the original coordinate system
					pointC.rotateClockwise(-theta)
						.translate(ax, ay);
					// return point of intersection
					return pointC;
				}
				if ((0 <= pointD.x && pointD.x <= pointB.x)) {
					// Rotate and translate point D to the original coordinate system
					pointD.rotateClockwise(-theta)
						.translate(ax, ay);
					// return point of intersection
					return pointD;
				}
			}
			return null;
		}
		// The case if CD does not intersect the x-asis (both C&D above x-axis) or (both C&D under x-axis)
		// calculating with 10^-6 as zero since calculating with sin and cos can generate "close to zero" zeroes
		if ((pointC.y < -0.000001 && pointD.y < -0.000001) || (pointC.y > 0.000001 && pointD.y > 0.000001)) {
			return null;
		}
		// calculate where CD intersects x-axis
		const ABpos: number = pointD.x + (pointC.x - pointD.x) * pointD.y / (pointD.y - pointC.y);
		// create new point E where CD intersects x-axis
		const pointE: Point = new Point(ABpos, 0);
		// The case if the point E is not between A and B on the x-axis
		// that is E.x less than zero or E.x larger than B.x
		if (pointE.x < -0.000001 || (pointE.x - pointB.x) > 0.000001) {
			return null;
		}
		// Rotate and translate point E to the original coordinate system
		pointE.rotateClockwise(-theta)
			.translate(ax, ay);
		// Arriving here if it is an intersect
		return pointE;
	}


	static projectPointOntoSegment(segmentAB: Segment, pointC: Point): ProjectionResult {
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
				const vectorDC: Vector = new Vector(pointD, pointC);
				return { successful: true, norm: vectorDC.norm, point: pointD };
			}
		}
		return { successful: false, norm: null, point: null };
	}

}
