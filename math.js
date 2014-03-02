
//kollar om två linjesegment AB och CD skär varandra
function calculateIntersect(segmentAB,segmentCD){
	// inspiration på http://alienryderflex.com/intersect/
	var punktA = segmentAB.p1.clonePoint();
	var punktB = segmentAB.p2.clonePoint();
	var punktC = segmentCD.p1.clonePoint();
	var punktD = segmentCD.p2.clonePoint();
	
	ax=punktA.x;
	ay=punktA.y;
	//utgår från att det inte finns nån intersect
	var returArr = new Array();
	returArr.push(false);
	//Translation av punkterna så att A ligger i Origo
	punktB.transponate(-ax,-ay);
	punktC.transponate(-ax,-ay);
	punktD.transponate(-ax,-ay);
	//räkna ut längden av AB
	distAB=Math.sqrt(punktB.x*punktB.x+punktB.y*punktB.y);
	//vinkeln mellan x-axeln och AB
	theta1=punktB.getTheAngle();
	//Rotera systemet så att punkt b ligger på positiva x-axeln
	punktC.rotate(theta1);
	punktD.rotate(theta1);
	//om CD är parallell med x-axeln
	if(punktC.y==punktD.y){
		return returArr;
	}
	//om CD inte skär x-axeln (både c&d över x-axeln) eller (både c&d under x-axeln)
	if((punktC.y<0&&punktD.y<0)||(punktC.y>0&&punktD.y>0)){
		return returArr;
	}
	//var skär CD x-axeln
	ABpos=punktD.x+(punktC.x-punktD.x)*punktD.y/(punktD.y-punktC.y);
	//skapa ny punktE där CB skär x-axeln
	var punktE = new point(ABpos,0);
	//om punkten inte ligger längs AB
	if(ABpos<0||ABpos>distAB){
		return returArr;
	}
	//om punkten inte ligger längs CD
	if(punktC.x<punktD.x){
		if(punktE.x<punktC.x||punktE.x>punktD.x){
			return returArr;
		}
	}
	else{
		if(punktE.x>punktC.x||punktE.x<punktD.x){
			return returArr;
		}
	}
	//omvandla punktE ursprungskoordinater (rotering + translation)
	punktE.rotate(-theta1);
	punktE.transponate(ax,ay);
	//hit kommer man om det är en intersect
	returArr[0]=true;
	returArr.push(punktE);//returnerar även skärningspunkten
	return returArr;
}


//projicerar punkten C på linjesegment AB. Returnerar nya punkten D på linjen. och avståndet CD
function project_vector(segmentAB,punktC){
	var punktA=segmentAB.p1.clonePoint();
	var punktB=segmentAB.p2.clonePoint();
	var temp_v =new Array();
	temp_v.push(-1);//normen
	temp_v.push(0);//punkten
	//skapa vektorer
	vectorAB = new vector(punktA,punktB);
	vectorAC = new vector(punktA,punktC);
	//beräkna dot product
	dotproduct_AB_AC=dotProduct(vectorAB,vectorAC);
	//om dotproduct_AB_AC är större än noll är vinkeln spetsig då är det en intressant punkt
	if(dotproduct_AB_AC>=0){
		//normen (längden av AB
		normAB=vectorAB.vLength();
		//sid 136 i Anton_Rorres Elementary Linear Algebra, 7th edition
		//projicerar AC på AB. Nya vektorn blir AD
		var vectorAD = new vector();
		vectorAD.x=dotproduct_AB_AC * vectorAB.x/Math.pow(normAB,2);
		vectorAD.y=dotproduct_AB_AC * vectorAB.y/Math.pow(normAB,2);
		normAD=vectorAD.vLength();
		var punktD = new point();
		punktD.x=punktA.x+vectorAD.x
		punktD.y=punktA.y+vectorAD.y;
		//kollar så inte det är längre från a->d än vad det är a->b
		if(normAD<=normAB){
			var vectorDC= new vector(punktD,punktC);
			normDC=vectorDC.vLength();
			//returnerar resultatet
			temp_v[0]=normDC;
			temp_v[1]=punktD;
		}
	}
	return temp_v;
}


//kollar om ett värde finns inom ett givet intervall. Annars returnera värdet på närmaste begränsning
function clamp(val, minval, maxval) {
	if(val<minval) return minval;
	if(val>maxval) return maxval;
	return val;
}


//kollar avstånd mellan punkter
function distBetweenPoints(pointOne,pointTwo){
	theDist=Math.sqrt(Math.pow(pointOne.x-pointTwo.x,2)+Math.pow(pointOne.y-pointTwo.y,2));
	return theDist;
}

//funktion för att undvika negativa index i en polygon. ex om man vill använda index 0 -1 (=sista punkten)
function moduloInPolygon(indexIn,arrayLength){
	while(indexIn<0){
		indexIn+=arrayLength;
	}
	return (indexIn%arrayLength);
}

