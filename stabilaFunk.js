
//vänsterklick
function canvasVansterKlickad(event,rutans_id){
	var position_x=0;
	var position_y=0;
	position_x = clamp(event.pageX-document.getElementById(rutans_id).offsetLeft,0,IWIDTH);
	position_y = clamp(event.pageY-document.getElementById(rutans_id).offsetTop,0,IHEIGHT);
	var nyVansterKlickadPunkt=new point(position_x,position_y);
	handleClick(true,nyVansterKlickadPunkt);
}

//högerklick
function canvasHogerKlickad(event,rutans_id){
	var position_x=0;
	var position_y=0;
	position_x = clamp(event.pageX-document.getElementById(rutans_id).offsetLeft,0,IWIDTH);
	position_y = clamp(event.pageY-document.getElementById(rutans_id).offsetTop,0,IHEIGHT);
	var nyHogerKlickadPunkt=new point(position_x,position_y);
	handleClick(false,nyHogerKlickadPunkt);
}




//********************************************
//*****************matematik******************

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
	returArr.push(punktE);
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




//---------------------------------------------------------------------
//*************************
//********objekt***********

//---polygon---------------------------

//ändrar riktning på polygonen. (medurs/moturs)
function reversePolygon(){
	this.segments.reverse();
	//måste ändra riktning på alla segment som ingår i polygonen
	for(u=0;u<this.segments.length;u++){
		this.segments[u].reverseSegment();
	}
}


//sätter in en ny punkt (+segment) i en polygons segment-array, vid ett givet index
function insertPoint(newPointIn,insertAtThisIndex){
//Delar segmentet (A-B) som fått den nya punkten
//Nya segmentet går från nypunkt till punktB
//Det gamla segmentet ändras så att det går från PunktA till nya punkten
	//nytt segment startar vid brottspunkten, slutar där det delade segmentet slutade
	var tempSegmentToInsert = new segment(newPointIn,this.segments[insertAtThisIndex].p2);
	//läggs in efter brottet
	this.segments.splice(insertAtThisIndex+1,0,tempSegmentToInsert);
	//ändrar segmentet före brottet så slutpunkten är brottspunkten
	this.segments[insertAtThisIndex].p2=newPointIn;
}



//beräknar area och om polygonen är ritad medurs/moturs
function gShoeLace(){
	//tillämpar Gauss shoelace formula
	//http://en.wikipedia.org/wiki/Shoelace_formula
	if(this.closed){
		var theSum=0;
		for(b=0;b<this.segments.length;b++){
			theSum+=this.segments[b].p1.x*this.segments[b].p2.y-this.segments[b].p1.y*this.segments[b].p2.x;
		}
		this.area=theSum/2;
		//se även http://en.wikipedia.org/wiki/Curve_orientation
		if(this.area>0){
			this.clockWise=true;
		}
		else{
			this.clockWise=false;
		}
	}
}

//förflyttar startpunkten i en polygon
function revolFirstIndex(newFirstIndex){
	if(this.closed){
		//hanterar ifall newFirstIndex skulle råka vara större än antalet segment
		newFirstIndex=moduloInPolygon(newFirstIndex,this.segments.length);
		//plockar bort stumpen fram tills nytt
		var tempArray = this.segments.splice(0,newFirstIndex+1);
		//lägger den stumpen på slutet
		this.segments=this.segments.concat(tempArray);
		//ändrar polygonens seed till första punkten
		this.seed=this.segments[0].p1;
	}
}

//tar bort en punkt(+segment) ur en polygons segment-array, vid ett givet index
function ejectPoint(removeAtThisIndex){
	//punkten som ska bort ligger i första punkten i segmentet med removeAtThisIndex
	//index för segmentet innan segmentet som tas bort. Även om det som tas bort är segment 0.
	indexBeforeRemoveAtThisIndex=moduloInPolygon((removeAtThisIndex-1),this.segments.length);
	//ändrar slutpunkten i sista segmentet till slutpunkten i segmentet som ska bort
	this.segments[indexBeforeRemoveAtThisIndex].p2=this.segments[removeAtThisIndex].p2;
	//tar bort segmentet
	this.segments.splice(removeAtThisIndex,1);
}


//---segment------------------------------
function segment(punkt1,punkt2){
	this.p1=punkt1;
	this.p2=punkt2;
	//AP isBorder (om det ligger på randen?)
	//AP randvärde
	//AP hantering om punkt1 och punkt2 ej anges (tomt argument)?
	this.cLength=0; //calculated length
	this.calculateLength=calculateLength;
	this.reverseSegment=reverseSegment;
}

//längden på ett segment
//AP kolla om den används
function calculateLength(){
	var segmentLength=Math.sqrt(Math.pow((this.p1.x-this.p2.x),2)+Math.pow((this.p1.y-this.p2.y),2));
	this.cLength=segmentLength; //save
	return segmentLength;
}

//ändrar riktning på segment
function reverseSegment(){
	var tempReversePoint=this.p1;
	this.p1=this.p2;
	this.p2=tempReversePoint;
}



//--vector-------------------------------------------------------
function vector(punkt1,punkt2){
	if(punkt1==undefined||punkt2==undefined){this.x=0;this.y=0;}
	else{this.x=punkt2.x-punkt1.x;this.y=punkt2.y-punkt1.y;}
	this.vLength=vLength;
}

//beräknar längden av en vektor
function vLength(){
	return Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2));
}

//beräknar dot product mellan två vektorer
function dotProduct(vector1,vector2){
	return (vector1.x*vector2.x+vector1.y*vector2.y);
}

//--point------------------------------------------------------
//skapa en punkt
function point(x,y){
	if(x==undefined||y==undefined){
		x=0;
		y=0
	}
	else{
		this.x=x;
		this.y=y;
	}
	this.rotate=rotate;
	this.transponate=transponate;
	this.getTheAngle=getTheAngle;
	this.clonePoint=clonePoint;
	this.copyValues=copyValues;
}

function copyValues(copyFromThisPoint){
	this.x=copyFromThisPoint.x;
	this.y=copyFromThisPoint.y;
}

//klonar en punkt
function clonePoint(){
	var copiedPoint = new point(this.x,this.y);
	return copiedPoint;
}

//roterar en punkt runt origo
function rotate(vinkel){
	var tempX=this.x
	var tempY=this.y;
	this.x= tempX*Math.cos(vinkel)+tempY*Math.sin(vinkel);
	this.y=-tempX*Math.sin(vinkel)+tempY*Math.cos(vinkel);
}

//flyttar en punkt
function transponate(distX,distY){
	this.x+=distX;
	this.y+=distY;
}

//Returnerar vinkeln mellan x-axeln och en vektor AB (A=origo, B=angiven punkt)
function getTheAngle(){
	arctanAngle=Math.atan(this.y/this.x);
	if(this.y>0){
		// om punkten ligger i q1
		if(this.x>=0){ 
			return arctanAngle;
		}
		// om punkten ligger i q2
		else{
			return (Math.PI+arctanAngle);
		}
	}
	else{
		// om punkten ligger i q3
		if(this.x<0){
			return (Math.PI+arctanAngle);
		}
		// om punkten ligger i q4
		else{
			return (2*Math.PI+arctanAngle);
		}
	}
}





//*******slut* objekt******
//*************************
//---------------------------------------------------------------------



//kollar om nya punkten är för nära andra punkter
//returnerar närmaste punkten eller -1 om alla är utom minDistanceIn
function checkIfCloseToPoint(segmentArrayIn,nyPunkt,minDistanceIn){
	var localMinDistance=minDistanceIn;
	var isTooClose = -1;
	var pointDistance=0;
	for(i=0;i<segmentArrayIn.length;i++){
		//beräknar avståndet mellan ny punkt och alla punkter i segmentet
		pointDistance=distBetweenPoints(segmentArrayIn[i].p1,nyPunkt);
		if(pointDistance<localMinDistance){
			//om den är närmar än minDistanceIn, eller mindre än nån tidigare sparad så sparas den
			isTooClose = i;
			localMinDistance=pointDistance;
		}
	}
	return isTooClose;
}


//kollar om nya punkten är nära andra linjer
function checkIfCloseToLine(segmentArrayIn,nyPunkt,minDistanceIn){
	var distToLine=-1;
	var smallestDistance=minDistanceIn;
	var ppReturArray = new Array();
	var closeEnough=false;
	var firstPointIndex = 0;
	var closestPoint = new point();
	//kollar igenom varje segment
	for(j=0;j<segmentArrayIn.length;j++){
		//projicerar punkten på segmentet
		var proj_svar=project_vector(segmentArrayIn[j],nyPunkt);
		var distToLine=proj_svar[0]; //negativt om den är för långt bort
		var projPunkten = proj_svar[1];   //0 om den är för långt bort
		//om den var mellan 0 och minDistanceIn
		if(distToLine>=0&&distToLine<minDistanceIn){
			if(distToLine<smallestDistance){
				//om den är mindre än minDistanceIn och senaste sparade så sparas den
				smallestDistance=distToLine; 
				closestPoint=projPunkten;
				firstPointIndex=j;
			}
			closeEnough = true;
		}
	}
	ppReturArray.push(closeEnough); //true om det fanns nån nära nog
	ppReturArray.push(firstPointIndex); //index för första punkten på segmentet som klickades
	ppReturArray.push(closestPoint); //den projicerade punkten på segmentet
	return ppReturArray;
}


//kollar om nytt linjesegmentet skär med nåt befintligt segment i array
function checkIfIntersect(segmentArrayIn,nyttSegmentIn,skipFirstSegment){
	var intersects = false;
	var startSegm=0;
	if(skipFirstSegment){startSegm=1;}//skippar första segmentet i de fall då användaren klickat på polygonens första punkt
	//skippar näst sista linjen
	for(n=startSegm;n<segmentArrayIn.length-1;n++){
		result=calculateIntersect(segmentArrayIn[n],nyttSegmentIn);
		if(result[0]){
			//returnerar true om det finns nån intersect
			intersects=true;
		}
	}
	return intersects;
}

//kollar om de två segmenten som innehåller en punkt (som flyttas) skär med de andra segmenten i en polygon vid flytt
function checkIfMovedIntersects(segmentArrayIn,nyPunkt,movedAtIndex){
	//om polygonen har fler än tre segment, annars returnera falskt
	if(segmentArrayIn.length>3){
		//hitta index för segmenten tvåsteg före, ett steg före och ett steg efter valt index
		var indexBeforeMovedAtIndex=moduloInPolygon(movedAtIndex-1,segmentArrayIn.length); //MAI-1
		var indexBeforeBeforeMovedAtIndex=moduloInPolygon(indexBeforeMovedAtIndex-1,segmentArrayIn.length);//MAI-2
		var indexAfterMovedAtIndex=moduloInPolygon(movedAtIndex+1,segmentArrayIn.length);//MAI+1
		//skapa två nya segment för valt index och det dessförrinnan
		var firstCheckedSegment  = new segment(segmentArrayIn[indexBeforeMovedAtIndex].p1,nyPunkt);
		var secondCheckedSegment = new segment(nyPunkt,segmentArrayIn[movedAtIndex].p2);
		//loopa igenom alla segment i segment-arrayen
		//allmänt tänk: man behöver inte kolla om angränsande segment skär med aktuellt segment
		for(m=0;m<segmentArrayIn.length;m++){
			//hoppa över de två segment som är onödiga för båda jämförelserna, ligger intill båda segmenten
			if(m==movedAtIndex||m==indexBeforeMovedAtIndex){continue;} //MAI & MAI-1
			//hoppa över det segment som ligger före firstCheckedSegment
			if(m!==indexBeforeBeforeMovedAtIndex){ //MAI-2
				//kollar om firstCheckedSegment korsar nåt av de andra intressanta segmenten
				if(calculateIntersect(firstCheckedSegment,segmentArrayIn[m])[0]){return true}
			}
			//hoppa över det segment som ligger efter secondCheckedSegment
			if(m!==indexAfterMovedAtIndex){ //MAI+1
				//kollar om secondCheckedSegment korsar nåt av de andra intressanta segmenten
				if(calculateIntersect(secondCheckedSegment,segmentArrayIn[m])[0]){return true}
			}
		}
		//hittas inga intersections är det OK
		return false;
	}
	else{
		//om polygonen endast hade 3 segment är det automatiskt OK
		return false;
	}
}
