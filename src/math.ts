//Checking if two segments AB and CD intersect
function calculateIntersect(segmentAB: Segment, segmentCD: Segment): Point {
	// inspiration på http://alienryderflex.com/intersect/
	const punktA: Point = segmentAB.p1.clonePoint();
	let punktB: Point = segmentAB.p2.clonePoint();
	const punktC: Point = segmentCD.p1.clonePoint();
	const punktD: Point = segmentCD.p2.clonePoint();

	const ax: number = punktA.x;
	const ay: number = punktA.y;
	//Translation of the system so that A is in the Origin
	punktB.translate(-ax, -ay);
	punktC.translate(-ax, -ay);
	punktD.translate(-ax, -ay);
	//calculate the length of AB
	const distAB: number = Math.sqrt(punktB.x * punktB.x + punktB.y * punktB.y);
	//the angle between the x-axis and AB
	const theta1: number = punktB.getTheAngle();
	//Rotate the system so that point B is on the positive x-axis
	punktB = new Point(distAB, 0);
	punktC.rotate(theta1);
	punktD.rotate(theta1);
	//The case if CD is parallell with the x-axis
	//if C.y is equal to D.y (or very close to it)
	if (Math.abs(punktC.y - punktD.y) < 0.000001) {
		//if C and thus also D are on the x-axis (or very close to it)
		if ((Math.abs(punktC.y) < 0.000001) || (Math.abs(punktD.y) < 0.000001)) {
			if ((0 <= punktC.x && punktC.x <= punktB.x)) {
				//Rotate and translate point E to the original coordinate system
				punktC.rotate(-theta1);
				punktC.translate(ax, ay);
				//return true + a point of intersection
				return punktC;
			}
			if ((0 <= punktD.x && punktD.x <= punktB.x)) {
				//Rotate and translate point E to the original coordinate system
				punktD.rotate(-theta1);
				punktD.translate(ax, ay);
				//return true + a point of intersection
				return punktD;
			}
		}
		return null;
	}
	//The case if CD does not intersect the x-asis (both C&D above x-axis) or (both C&D under x-axis)
	//calculating with 10^-6 as zero since calculating with sin and cos can generate "close to zero" zeroes
	//if((punktC.y<0&&punktD.y<0)||(punktC.y>0&&punktD.y>0)){
	if ((punktC.y < -0.000001 && punktD.y < -0.000001) || (punktC.y > 0.000001 && punktD.y > 0.000001)) {
		return null
	}
	//calculate where CD intersects x-axis
	const ABpos: number = punktD.x + (punktC.x - punktD.x) * punktD.y / (punktD.y - punktC.y);
	//create new point E where CD intersects x-axis
	var punktE = new Point(ABpos, 0);

	//The case if the point E is not between A and B on the x-axis
	//that is E.x less than zero or E.x larger than B.x
	//if(punktE.x<0||punktE.x>punktB.x){
	if (punktE.x < -0.000001 || (punktE.x - punktB.x) > 0.000001) {
		return null;
	}
	//The case if the point E is not in segment CD
	if (punktC.x < punktD.x) {
		//if(punktE.x<punktC.x||punktE.x>punktD.x){
		if ((punktE.x - punktC.x) < -0.000001 || (punktE.x - punktD.x) > 0.000001) {
			return null;
		}
	}
	else {
		//if(punktE.x>punktC.x||punktE.x<punktD.x){		
		if ((punktE.x - punktC.x) > 0.000001 || (punktE.x - punktD.x) < -0.000001) {
			return null;
		}
	}
	//Rotate and translate point E to the original coordinate system
	punktE.rotate(-theta1);
	punktE.translate(ax, ay);
	//Arriving here if it is an intersect
	return punktE;
}


//projecting the point C onto the segment AB. Returning the new point D on the segment and the distance CD
function project_vector(segmentAB: Segment, punktC: Point) {
	const punktA = segmentAB.p1.clonePoint();
	const punktB = segmentAB.p2.clonePoint();
	const temp_v = new Array();
	temp_v.push(-1);//the norm
	temp_v.push(0);//the point
	//create vectors
	const vectorAB: Vector = new Vector(punktA, punktB);
	const vectorAC: Vector = new Vector(punktA, punktC);
	//calculate dot product
	const dotproduct_AB_AC: number = dotProduct(vectorAB, vectorAC);
	//if dotproduct_AB_AC is larger than zero the angle is acute and then C is an interesting point
	if (dotproduct_AB_AC >= 0) {
		//the norm (length of AB)
		const normAB: number = vectorAB.vLength();
		//page 136 in "Elementary Linear Algebra" [Anton, Rorres], 7th edition
		//projecting AC on AB. The new vector is AD
		const vectorAD = new Vector(null, null);
		//TODO: skapa ytterligare konstruktor hos Vector där man anger x och y-komponent
		vectorAD.x = dotproduct_AB_AC * vectorAB.x / Math.pow(normAB, 2);
		vectorAD.y = dotproduct_AB_AC * vectorAB.y / Math.pow(normAB, 2);
		const normAD: number = vectorAD.vLength();
		const punktD = new Point();
		punktD.x = punktA.x + vectorAD.x
		punktD.y = punktA.y + vectorAD.y;
		//kollar så inte det är längre från a->d än vad det är a->b
		//checking so that A->D is shorter than A->B
		if (normAD <= normAB) {
			const vectorDC: Vector = new Vector(punktD, punktC);
			const normDC:number = vectorDC.vLength();
			//returning result
			temp_v[0] = normDC;
			temp_v[1] = punktD;
		}
	}
	return temp_v;
}


//Check if a value is within a given interval. Otherwise return the value of the nearest limit
function clamp(val, minval, maxval) {
	if (val < minval) return minval;
	if (val > maxval) return maxval;
	return val;
}


//Check the distance between two points
function distBetweenPoints(pointOne, pointTwo) {
	const theDist: number = Math.sqrt(Math.pow(pointOne.x - pointTwo.x, 2) + Math.pow(pointOne.y - pointTwo.y, 2));
	return theDist;
}


//function to translate negative indexes in a polygon.
//(e.g. index -2 in a polygon with 6 sides is 4)
function moduloInPolygon(indexIn, arrayLength) {
	while (indexIn < 0) {
		indexIn += arrayLength;
	}
	return (indexIn % arrayLength);
}

//calculate the dot product between to vectors
function dotProduct(vector1, vector2) {
	return (vector1.x * vector2.x + vector1.y * vector2.y);
}