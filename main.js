
function init() {
	var canvas = document.getElementById("canvas");
	IWIDTH=canvas.width;
	IHEIGHT=canvas.height;
		if (canvas.getContext) {
		ctx = canvas.getContext("2d");
	}
}

function rensaHelt(){
	firstPolygon.segments=[];
	firstPolygon.closed=false;
	firstPolygon.seed=false;
	clearTheCanvas();
}



//*************************
//** Handle clicks       **
//*************************
function handleClick(isLeftClick,theClickedPoint){
	handledPolygon=firstPolygon;
	if(isLeftClick){
		if(handledPolygon.closed){
			if(handledPolygon.moveMode){leftClickClosedMoveMode(handledPolygon,theClickedPoint)}//LEFT - CLOSED - MOVEMODE
			else{leftClickClosed(handledPolygon,theClickedPoint)}//LEFT - CLOSED
		}
		else{leftClickOpen(handledPolygon,theClickedPoint)}//LEFT - OPEN
	}
	else{
		if(handledPolygon.closed){
			if(handledPolygon.moveMode){rightClickClosedMoveMode(handledPolygon)}//RIGHT - CLOSED - MOVEMODE
			else{rightClickClosed(handledPolygon,theClickedPoint)}//RIGHT - CLOSED
		}
		else{rightClickOpen(handledPolygon)}//RIGHT - OPEN
	}
		
	//beräknar arean och kollar om den är ritad medurs eller moturs
	handledPolygon.gShoeLace();
	//om den är moturs vänd till medurs om användaren kryssat i
	if(!handledPolygon.clockWise&&document.getElementById("checkboxEnforceClockwise").checked){
		handledPolygon.reversePolygon();
	}
	drawPolygon(handledPolygon);
//	console.log("antal segment"+handledPolygon.segments.length);
}

function leftClickClosed(hanteradPolygon,nyKlickadPunkt){
	var nearPointIndex=checkIfCloseToPoint(hanteradPolygon.segments,nyKlickadPunkt,minDistance);
	if(nearPointIndex>-1){
		hanteradPolygon.moveMode=true;
		hanteradPolygon.movePointIndex=nearPointIndex;
	}
	else{
		//om klickningen är nära linje, sätt in ny punkt
		var tempVar = checkIfCloseToLine(hanteradPolygon.segments,nyKlickadPunkt,minDistance);
		if(tempVar[0]){
			//avrundar ev koordinaterna för att få heltal
			if(useIntegerCoords){
				tempVar[2].x=Math.round(tempVar[2].x);
				tempVar[2].y=Math.round(tempVar[2].y);
			}
			//lägger till ny punkt inne i segment-arrayen
			hanteradPolygon.insertPoint(tempVar[2],tempVar[1]);//newPoint,index
		}
	}	
}

function leftClickClosedMoveMode(hanteradPolygon,nyKlickadPunkt){
	//om punkten inte är för nära nån annan
	if(checkIfCloseToPoint(hanteradPolygon.segments,nyKlickadPunkt,minDistance)<0){
		//om punktens närmaste linjesegment inte skär nåt annat segment
		if(!checkIfMovedIntersects(hanteradPolygon.segments,nyKlickadPunkt,hanteradPolygon.movePointIndex)){
			//flytta movePointIndex till nya punkten
			hanteradPolygon.segments[hanteradPolygon.movePointIndex].p1.copyValues(nyKlickadPunkt); //kopierar värdena för att det fortfarande ska vara samma objekt
			hanteradPolygon.moveMode=false;
		}
	}	
}

function leftClickOpen(hanteradPolygon,nyKlickadPunkt){
	//är det första segmentet eller?
	if(hanteradPolygon.segments.length>0){
		//klickar användaren nära första punkten?
		if(distBetweenPoints(nyKlickadPunkt,hanteradPolygon.segments[0].p1)<closePolygonMinimumDistance){
			//om polygonen har minst 2 segment redan
			if(hanteradPolygon.segments.length>=2){
				//kolla att segmentet mellan sista punkten och första punkten inte skär nån linje
				var nyttSegment = new segment(hanteradPolygon.segments[hanteradPolygon.segments.length-1].p2,hanteradPolygon.segments[0].p1);
				if(!checkIfIntersect(hanteradPolygon.segments,nyttSegment,true)){
					hanteradPolygon.segments.push(nyttSegment);
					hanteradPolygon.close();
				}
			}
		}
		else{
			//om linjen inte skär nån annan linje, eller är för nära nån punkt så lägg till punkten
			var nyttSegment = new segment(hanteradPolygon.segments[hanteradPolygon.segments.length-1].p2,nyKlickadPunkt);
			if(!checkIfIntersect(hanteradPolygon.segments,nyttSegment,false)){
				if(checkIfCloseToPoint(hanteradPolygon.segments,nyKlickadPunkt,minDistance)<0){
					hanteradPolygon.segments.push(nyttSegment);
				}
			}
		}
	}
	else{//om seed eller några segment ännu inte finns
		if(!hanteradPolygon.seed){
			console.log("första punkten");
			hanteradPolygon.seed=nyKlickadPunkt;
		}
		else{
			//om den inte är för nära första punkten
			if(checkIfCloseToPoint(hanteradPolygon.seed,nyKlickadPunkt,minDistance)<0){
				console.log("första segmentet");
				var nyttSegment = new segment(hanteradPolygon.seed,nyKlickadPunkt);
				hanteradPolygon.segments.push(nyttSegment);
			}
		}
	}	
}

function rightClickOpen(hanteradPolygon){
	//ta bort senaste inmatade punkten
	if(hanteradPolygon.segments.length==0){
		hanteradPolygon.seed=false;
		console.log("tog bort seed");
	}
	hanteradPolygon.segments.pop();
	console.log("segment kvar"+hanteradPolygon.segments.length);		
}

function rightClickClosed(hanteradPolygon,nyKlickadPunkt){
	//Om det är på en punkt, ta bort den om det är fler än tre punkter totalt
	var nearPointIndex=checkIfCloseToPoint(hanteradPolygon.segments,nyKlickadPunkt,minDistance);
	if(nearPointIndex>-1){
		//om polygonen har fler än tre sidor går det ta bort en punkt
		if(hanteradPolygon.segments.length>3){
			//plocka ut den valda punkten
			hanteradPolygon.ejectPoint(nearPointIndex);
		}
	}
	//radera element om högerklicka på på segment
	else{
		//om klickningen är nära linje, sätt in ny punkt
		var tempVar = checkIfCloseToLine(hanteradPolygon.segments,nyKlickadPunkt,minDistance);
		if(tempVar[0]){//true om det klickades tillräckligt nära ett segment
			//tempVar[1] berättar vilket segment
			//flyttar startpunkten
			hanteradPolygon.revolFirstIndex(tempVar[1]);
			//öppnar polygonen och tar bort sista elementet
			hanteradPolygon.closed=false;
			hanteradPolygon.segments.pop();
		}
	}	
}

function rightClickClosedMoveMode(hanteradPolygon){
	//Avbryter "flyttläge"
	hanteradPolygon.moveMode=false;
	hanteradPolygon.movePointIndex=-1;
}








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
	var startSegm=0;
	if(skipFirstSegment){startSegm=1;}//skippar första segmentet i de fall då användaren klickat på polygonens första punkt
	//skippar näst sista linjen
	for(n=startSegm;n<segmentArrayIn.length-1;n++){
		result=calculateIntersect(segmentArrayIn[n],nyttSegmentIn);
		if(result[0]){
			//returnerar true om det finns nån intersect
			return true;
		}
	}
	//kom vi hit hittades ingen intersect
	return false;
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








//*************************
//** Objects             **
//*************************

//----------------------------------------------------------------
//---POLYGON------------------------------------------------------
function polygon(){
	this.segments = new Array();
	this.closed = false;
	this.clockWise = false;
	this.area = 0;
	this.seed=false;
	this.moveMode=false;
	this.movePointIndex=-1;
	
	//angränsar till vilka grannar, vid vilket segment
	//metod för att stänga polygon
	//metod för att flytta punkt?
	
	//metoder
	this.close=close;
	this.insertPoint=insertPoint;
	this.ejectPoint=ejectPoint;
	this.reversePolygon=reversePolygon;
	this.gShoeLace=gShoeLace;
	this.revolFirstIndex=revolFirstIndex;
}

//stänger polygonen
function close(){
	this.closed=true;
}

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
		console.log("Area: "+this.area);
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

//----------------------------------------------------------------
//---SEGMENT------------------------------------------------------
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
//AP kolla om den används (skulle kunna användas om man vill ha omkrets/längd)
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

//----------------------------------------------------------------
//---VECTOR-------------------------------------------------------
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

//----------------------------------------------------------------
//--POINT---------------------------------------------------------
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

//copying values from point so that the new point IS the same object
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
		if(this.x>=0){return arctanAngle}
		// om punkten ligger i q2
		else{return (Math.PI+arctanAngle)}
	}
	else{
		// om punkten ligger i q3
		if(this.x<0){return (Math.PI+arctanAngle)}
		// om punkten ligger i q4
		else{return (2*Math.PI+arctanAngle)}
	}
}

