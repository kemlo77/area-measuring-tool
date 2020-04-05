//Checking if two segments AB and CD intersect
function calculateIntersect(segmentAB: Segment, segmentCD: Segment): Point {
	// inspiration på http://alienryderflex.com/intersect/
	const pointA: Point = segmentAB.p1.clonePoint();
	let pointB: Point = segmentAB.p2.clonePoint();
	const pointC: Point = segmentCD.p1.clonePoint();
	const pointD: Point = segmentCD.p2.clonePoint();

	const ax: number = pointA.x;
	const ay: number = pointA.y;
	//Translation of the system so that A is in the Origin
	pointB.translate(-ax, -ay);
	pointC.translate(-ax, -ay);
	pointD.translate(-ax, -ay);
	//calculate the length of AB
	const distAB: number = Math.sqrt(pointB.x * pointB.x + pointB.y * pointB.y);
	//the angle between the x-axis and AB
	const theta1: number = pointB.getTheAngle();
	//Rotate the system so that point B is on the positive x-axis
	pointB = new Point(distAB, 0);
	pointC.rotate(theta1);
	pointD.rotate(theta1);
	//The case if CD is parallell with the x-axis
	//if C.y is equal to D.y (or very close to it)
	if (Math.abs(pointC.y - pointD.y) < 0.000001) {
		//if C and thus also D are on the x-axis (or very close to it)
		if ((Math.abs(pointC.y) < 0.000001) || (Math.abs(pointD.y) < 0.000001)) {
			if ((0 <= pointC.x && pointC.x <= pointB.x)) {
				//Rotate and translate point C to the original coordinate system
				pointC.rotate(-theta1);
				pointC.translate(ax, ay);
				//return point of intersection
				return pointC;
			}
			if ((0 <= pointD.x && pointD.x <= pointB.x)) {
				//Rotate and translate point D to the original coordinate system
				pointD.rotate(-theta1);
				pointD.translate(ax, ay);
				//return point of intersection
				return pointD;
			}
		}
		return null;
	}
	//The case if CD does not intersect the x-asis (both C&D above x-axis) or (both C&D under x-axis)
	//calculating with 10^-6 as zero since calculating with sin and cos can generate "close to zero" zeroes
	if ((pointC.y < -0.000001 && pointD.y < -0.000001) || (pointC.y > 0.000001 && pointD.y > 0.000001)) {
		return null
	}
	//calculate where CD intersects x-axis
	const ABpos: number = pointD.x + (pointC.x - pointD.x) * pointD.y / (pointD.y - pointC.y);
	//create new point E where CD intersects x-axis
	let pointE = new Point(ABpos, 0);

	//The case if the point E is not between A and B on the x-axis
	//that is E.x less than zero or E.x larger than B.x
	if (pointE.x < -0.000001 || (pointE.x - pointB.x) > 0.000001) {
		return null;
	}
	//The case if the point E is not in segment CD
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
	//Rotate and translate point E to the original coordinate system
	pointE.rotate(-theta1);
	pointE.translate(ax, ay);
	//Arriving here if it is an intersect
	return pointE;
}


//projecting the point C onto the segment AB. Returning the new point D on the segment and the distance CD
function projectVector(segmentAB: Segment, pointC: Point): ProjectionResult {
	const pointA: Point = segmentAB.p1.clonePoint();
	const pointB: Point = segmentAB.p2.clonePoint();
	//create vectors
	const vectorAB: Vector = new Vector(pointA, pointB);
	const vectorAC: Vector = new Vector(pointA, pointC);
	//calculate dot product
	const dotproduct_AB_AC: number = dotProduct(vectorAB, vectorAC);
	//if dotproduct_AB_AC is larger than zero the angle is acute and then C is an interesting point
	if (dotproduct_AB_AC >= 0) {
		//the norm (length of AB)
		const normAB: number = vectorAB.vLength();
		//page 136 in "Elementary Linear Algebra" [Anton, Rorres], 7th edition
		//projecting AC on AB. The new vector is AD
		const vectorAD: Vector = new Vector(null, null); //TODO: skapa ytterligare konstruktor hos Vector där man anger x och y-komponent
		vectorAD.x = dotproduct_AB_AC * vectorAB.x / Math.pow(normAB, 2);
		vectorAD.y = dotproduct_AB_AC * vectorAB.y / Math.pow(normAB, 2);
		const normAD: number = vectorAD.vLength();
		const pointD: Point = new Point(pointA.x + vectorAD.x, pointA.y + vectorAD.y);
		//kollar så inte det är längre från a->d än vad det är a->b
		//checking so that A->D is shorter than A->B
		if (normAD <= normAB) {
			const vectorDC: Vector = new Vector(pointD, pointC);
			const normDC: number = vectorDC.vLength();
			return {successful: true, norm: normDC, point: pointD };
		}
	}
	return { successful:false, norm: null, point: null }
}


//Check the distance between two points
function distBetweenPoints(pointOne: Point, pointTwo: Point): number {
	return Math.sqrt(Math.pow(pointOne.x - pointTwo.x, 2) + Math.pow(pointOne.y - pointTwo.y, 2));
}


//function to translate negative indexes in a polygon.
//(e.g. index -2 in a polygon with 6 sides is 4)
function moduloInPolygon(indexIn: number, arrayLength: number): number {
	while (indexIn < 0) {
		indexIn += arrayLength;
	}
	return (indexIn % arrayLength);
}

//calculate the dot product between to vectors
function dotProduct(vector1: Vector, vector2: Vector): number {
	return (vector1.x * vector2.x + vector1.y * vector2.y);
}