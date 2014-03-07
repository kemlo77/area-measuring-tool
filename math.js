//Checking if two segments AB and CD intersect
function calculateIntersect(segmentAB,segmentCD){
	// inspiration på http://alienryderflex.com/intersect/
	var punktA = segmentAB.p1.clonePoint();
	var punktB = segmentAB.p2.clonePoint();
	var punktC = segmentCD.p1.clonePoint();
	var punktD = segmentCD.p2.clonePoint();
	
	ax=punktA.x;
	ay=punktA.y;
	//assuming that there is no intersection
	var returArr = new Array();
	returArr.push(false);
	//Translation of the system so that A is in the Origin
	punktB.transponate(-ax,-ay);
	punktC.transponate(-ax,-ay);
	punktD.transponate(-ax,-ay);
	console.log("B: "+ punktB.x+","+punktB.y+" C: "+ punktC.x+","+punktC.y+" D: "+ punktD.x+","+punktD.y);
	//calculate the length of AB
	distAB=Math.sqrt(punktB.x*punktB.x+punktB.y*punktB.y);
	//the angle between the x-axis and AB
	theta1=punktB.getTheAngle();
	//Rotate the system so that point B is on the positive x-axis
	punktC.rotate(theta1);
	punktD.rotate(theta1);
	console.log("C: "+ punktC.x+","+punktC.y+" D: "+ punktD.x+","+punktD.y);
	//The case if CD is parallell with the x-axis
	if(punktC.y==punktD.y){//AP hantera småå tal
		console.info("retur at Alfred");
		return returArr;
		//AP: hantera om ab förlängs av cd längs x-axeln (b=c eller b=d)
	}
	//The case if CD does not intersect the x-asis (both C&D above x-axis) or (both C&D under x-axis)
	//calculating with 10^-6 as zero since calculating with sin and cos can generate "close to zero" zeroes
//	if((punktC.y<0&&punktD.y<0)||(punktC.y>0&&punktD.y>0)){
	if((punktC.y<-0.000001&&punktD.y<-0.000001)||(punktC.y>0.000001&&punktD.y>0.000001)){
		console.info("retur at Bertil");
		return returArr;
	}
	//calculate where CD intersects x-axis
	ABpos=punktD.x+(punktC.x-punktD.x)*punktD.y/(punktD.y-punktC.y);
	//create new point E where CD intersects x-axis
	var punktE = new point(ABpos,0);

	//The case if the point E is not between A and B on the x-axis
	if(ABpos<0||ABpos>distAB){ //AP hantera småå tal?
		console.info("retur at Caesar");
		return returArr;
	}
	//The case if the point E is not in segment CD
	if(punktC.x<punktD.x){
		//if(punktE.x<punktC.x||punktE.x>punktD.x){
		console.warn(punktE.x+" < "+punktC.x +" or "+ punktE.x+" > "+punktD.x);
		if((punktE.x-punktC.x)<-0.000001||(punktE.x-punktD.x)>0.000001){
			console.info("retur at David");		
			return returArr;
		}
	}
	else{
		console.warn(punktE.x+" > "+punktC.x+" or "+punktE.x+" < "+punktD.x);
		//if(punktE.x>punktC.x||punktE.x<punktD.x){		
		if((punktE.x-punktC.x)>0.000001||(punktE.x<punktD.x)<-0.000001){
			console.info("retur at Erik");
			return returArr;
		}
	}
	//Rotate and translate point E to the original coordinate system
	punktE.rotate(-theta1);
	punktE.transponate(ax,ay);
	//Arriving here if it is an intersect
	returArr[0]=true;
	returArr.push(punktE);//also returning the point of intersection E
	console.log("*******");
	return returArr;
}


//projecting the point C onto the segment AB. Returning the new point D on the segment and the distance CD
function project_vector(segmentAB,punktC){
	var punktA=segmentAB.p1.clonePoint();
	var punktB=segmentAB.p2.clonePoint();
	var temp_v =new Array();
	temp_v.push(-1);//the norm
	temp_v.push(0);//the point
	//create vectors
	vectorAB = new vector(punktA,punktB);
	vectorAC = new vector(punktA,punktC);
	//calculate dot product
	dotproduct_AB_AC=dotProduct(vectorAB,vectorAC);
	//if dotproduct_AB_AC is larger than zero the angle is acute and then C is an interesting point
	if(dotproduct_AB_AC>=0){
		//the norm (length of AB)
		normAB=vectorAB.vLength();
		//page 136 in "Elementary Linear Algebra" [Anton, Rorres], 7th edition
		//projecting AC on AB. The new vector is AD
		var vectorAD = new vector();
		vectorAD.x=dotproduct_AB_AC * vectorAB.x/Math.pow(normAB,2);
		vectorAD.y=dotproduct_AB_AC * vectorAB.y/Math.pow(normAB,2);
		normAD=vectorAD.vLength();
		var punktD = new point();
		punktD.x=punktA.x+vectorAD.x
		punktD.y=punktA.y+vectorAD.y;
		//kollar så inte det är längre från a->d än vad det är a->b
		//checking so that A->D is shorter than A->B
		if(normAD<=normAB){
			var vectorDC= new vector(punktD,punktC);
			normDC=vectorDC.vLength();
			//returning result
			temp_v[0]=normDC;
			temp_v[1]=punktD;
		}
	}
	return temp_v;
}


//Check if a value is within a given interval. Otherwise return the value of the nearest limit
function clamp(val, minval, maxval) {
	if(val<minval) return minval;
	if(val>maxval) return maxval;
	return val;
}


//Check the distance between two points
function distBetweenPoints(pointOne,pointTwo){
	theDist=Math.sqrt(Math.pow(pointOne.x-pointTwo.x,2)+Math.pow(pointOne.y-pointTwo.y,2));
	return theDist;
}


//function to translate negative indexes in a polygon.
//(e.g. index -2 in a polygon with 6 sides is 4)
function moduloInPolygon(indexIn,arrayLength){
	while(indexIn<0){
		indexIn+=arrayLength;
	}
	return (indexIn%arrayLength);
}

