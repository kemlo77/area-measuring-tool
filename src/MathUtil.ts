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
			if ((Math.abs(pointC.y) < 0.000001) || (Math.abs(pointD.y) < 0.000001)) {
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
		// The case if the point E is not in segment CD
		if (pointC.x < pointD.x) {
			if ((pointE.x - pointC.x) < -0.000001 || (pointE.x - pointD.x) > 0.000001) {
				return null;
			}
		}
		else {
			if ((pointE.x - pointC.x) > 0.000001 || (pointE.x - pointD.x) < -0.000001) {
				return null;
			}
		}
		// Rotate and translate point E to the original coordinate system
		pointE.rotateClockwise(-theta)
			.translate(ax, ay);
		// Arriving here if it is an intersect
		return pointE;
	}


	// projecting the point C onto the segment AB. Returning the new point D on the segment and the distance CD
	static projectVector(segmentAB: Segment, pointC: Point): ProjectionResult {
		const pointA: Point = new Point(segmentAB.p1);
		const pointB: Point = new Point(segmentAB.p2);
		// create vectors
		const vectorAB: Vector = new Vector(pointA, pointB);
		const vectorAC: Vector = new Vector(pointA, pointC);
		// calculate dot product
		const dotproductABAC: number = MathUtil.dotProduct(vectorAB, vectorAC);
		// if dotproduct_AB_AC is larger than zero the angle is acute and then C is an interesting point
		if (dotproductABAC >= 0) {
			// the norm (length of AB)
			const normAB: number = vectorAB.length;
			// page 136 in "Elementary Linear Algebra" [Anton, Rorres], 7th edition
			// projecting AC on AB. The new vector is AD
			const vectorADcomponentX: number = dotproductABAC * vectorAB.x / Math.pow(normAB, 2);
			const vectorADcomponentY: number = dotproductABAC * vectorAB.y / Math.pow(normAB, 2);
			const vectorAD: Vector = new Vector(vectorADcomponentX,vectorADcomponentY);
			const normAD: number = vectorAD.length;
			const pointD: Point = new Point(pointA.x + vectorAD.x, pointA.y + vectorAD.y);
			// kollar så inte det är längre från a->d än vad det är a->b
			// checking so that A->D is shorter than A->B
			if (normAD <= normAB) {
				const vectorDC: Vector = new Vector(pointD, pointC);
				const normDC: number = vectorDC.length;
				return { successful: true, norm: normDC, point: pointD };
			}
		}
		return { successful: false, norm: null, point: null };
	}

	// function to translate negative indexes in a polygon.
	// (e.g. index -2 in a polygon with 6 sides is 4)
	// also if index is larger. For example input 7 will return
	// TODO: skriv om denna så att man anger sitt orena index och sin array, så plockar man ut array.length i denna metoden.
	static moduloInPolygon(indexIn: number, arrayLength: number): number {
		while (indexIn < 0) {
			indexIn += arrayLength;
		}
		return (indexIn % arrayLength);
	}

	// calculate the dot product between to vectors
	static dotProduct(vector1: Vector, vector2: Vector): number {
		return (vector1.x * vector2.x + vector1.y * vector2.y);
	}

	static arrayRotate(arr: any[], steps: number): any[] {
		if (steps > 0) {
			for (let step = 0; step < steps; step++) {
				arr.push(arr.shift());
			}
		} else {
			for (let step = 0; step < Math.abs(steps); step++) {
				arr.unshift(arr.pop());
			}
		}
		return arr;
	}

}
