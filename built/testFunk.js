function testFunk8(){
	var testPunkt1 = new Point(200,100);
	handleClick(true,testPunkt1);
	var testPunkt2 = new Point(170,150);
	handleClick(true,testPunkt2);
	var testPunkt3 = new Point(200,180);
	handleClick(true,testPunkt3);
	var testPunkt4 = new Point(250,170);
	handleClick(true,testPunkt4);
	var testPunkt5 = new Point(240,130);
	handleClick(true,testPunkt5);
	var testPunkt6 = new Point(260,130);
	handleClick(true,testPunkt6);
	var testPunkt7 = new Point(280,130);
	handleClick(true,testPunkt7);
	var testPunkt8 = new Point(300,150);
	handleClick(true,testPunkt8);
	var testPunkt9 = new Point(300,200);
	handleClick(true,testPunkt9);
	var testPunkt10 = new Point(300,250);
	handleClick(true,testPunkt10);
	var testPunkt11 = new Point(250,250);
	handleClick(true,testPunkt11);
	var testPunkt12 = new Point(200,250);
	handleClick(true,testPunkt12);
	var testPunkt13 = new Point(200,225);
	handleClick(true,testPunkt13);
	var testPunkt14 = new Point(200,200);
	handleClick(true,testPunkt14);
	var testPunkt15 = new Point(150,250);
	handleClick(true,testPunkt15);
	var testPunkt16 = new Point(100,300);
	handleClick(true,testPunkt16);
	var testPunkt17 = new Point(150,325);
	handleClick(true,testPunkt17);
	var testPunkt18 = new Point(200,350);
	handleClick(true,testPunkt18);
	var testPunkt19 = new Point(300,325);
	handleClick(true,testPunkt19);
	var testPunkt20 = new Point(400,300);
	handleClick(true,testPunkt20);
	var testPunkt21 = new Point(380,280);
	handleClick(true,testPunkt21);
	var testPunkt22 = new Point(360,260);
	handleClick(true,testPunkt22);
	}

function testFunk(){
	var testPunkt1 = new Point(200,100);
	handleClick(true,testPunkt1);
	var testPunkt2 = new Point(170,150);
	handleClick(true,testPunkt2);
	var testPunkt2b = new Point(300,100); //h�gerklick f�r att �ngra
	handleClick(false,testPunkt2b);
	var testPunkt2c = new Point(170,180);
	handleClick(true,testPunkt2c);
	var testPunkt3 = new Point(200,180);
	handleClick(true,testPunkt3);
	var testPunkt3a = new Point(250,170);
	handleClick(true,testPunkt3a);
	var testPunkt3b = new Point(240,130);
	handleClick(true,testPunkt3b);
	var testPunkt4 = new Point(170,130); //sk�r annan linje
	handleClick(true,testPunkt4);
	var testPunkt5 = new Point(172,152); //f�r n�ra punkt2
	handleClick(true,testPunkt5);
	var testPunkt6 = new Point(200,100); //st�nger
	handleClick(true,testPunkt6);
	var testPunkt7 = new Point(251,172); //flyttar
	handleClick(true,testPunkt7);
	var testPunkt8 = new Point(240,180); //flyttar forts
	handleClick(true,testPunkt8);
	var testPunkt9 = new Point(201,181); //raderar
	handleClick(false,testPunkt9);
	var testPunkt10 = new Point(185,137); //s�tter ny punkt
	handleClick(true,testPunkt10);
	var testPunkt9 = new Point(201,99); //raderar
	handleClick(false,testPunkt9);
	//testa att det inte blir close om sista segmentet korsar ett annat
	//AP test av flyttad punkt, segment korsar ej
	//AP test s� attpunkter kring nyinmatat punkt g�r att flytta
	//AP g�ra om den h�r testfunktionen s� den blir tydligare
	//AP test f�r n�r segment raderas och polygonen �ppnas
}

function testFunk2(){
	console.log("hejpa");
	console.log(firstPolygon.segments.length);
	console.log(firstPolygon.closed);
	alert("antalet segment i firstPolygon "+firstPolygon.segments.length);
}

function testFunk4(){
	if(firstPolygon.closed){
		firstPolygon.gShoeLace();
		alert("Area: "+firstPolygon.area+'\n'+(firstPolygon.clockWise?"Clockwise":"Counter clockwise"));
	}
	else{alert("the polygon is not closed")}
}


//testk�r project_vector
function testFunk3(){
	var testpunktA = new Point(100,100);
	var testpunktB = new Point(200,200);
	var testpunktC = new Point(75,125);
	var ritpunkt= new Point(50,50);
	var segmentetAB = new Segment(testpunktA,testpunktB);
	
	drawOneSegment(segmentetAB,"0,0,0");
	drawDot(testpunktC,2,"0,0,0");
	tempvar=(project_vector(segmentetAB,testpunktC)); // norm och punkt (-1 och 0 ifall inget)
	if(tempvar[0]>=0){
		drawDot(ritpunkt,3,"0,200,0");
		var tempsegment= new Segment(testpunktC,tempvar[1]);
		drawOneSegment(tempsegment,"255,128,0");
	}
	else{
		drawDot(ritpunkt,3,"200,0,0");
	}
}



//---------------------------
//not used any more
//-------------------------------
//ritar linje mellan 2 punkter
function drawLine(startP,endP,lineColor){
	ctxFront.strokeStyle = "rgba("+lineColor+",1)";
	ctxFront.beginPath();
	ctxFront.moveTo(startP.x, startP.y);
	ctxFront.lineTo(endP.x, endP.y);
	ctxFront.closePath();
	ctxFront.stroke();
}

//ritar linje f�r varje segment i en segment-array
function drawSegmentsInArray(segmentArrayIn,lineColor){
	ctxFront.strokeStyle = "rgba("+lineColor+",1)";
	ctxFront.beginPath();
	//s�tter startpunkten
	ctxFront.moveTo(segmentArrayIn[0].p1.x, segmentArrayIn[0].p1.y);
	//ritar linje f�r varje segment
	for(h=0;h<segmentArrayIn.length;h++){
		ctxFront.lineTo(segmentArrayIn[h].p2.x, segmentArrayIn[h].p2.y);
		console.log("pip");
	}
	ctxFront.stroke();
}

function checkIfComplex(polygonChecked){
	console.log("antal segment: "+polygonChecked.segments.length);
	for(i=0;i<polygonChecked.segments.length;i++){
		for(j=i+1;j<polygonChecked.segments.length;j++){
			if(i==j-1){
				console.log("***Starting****");
				console.log(i+" "+j);
				resultat=calculateIntersect(polygonChecked.segments[i],polygonChecked.segments[j])
				if(resultat[0]){drawDot(resultat[1],5,"123,12,12")}
				//console.log(resultat[0]);
			}
		}
	}
}