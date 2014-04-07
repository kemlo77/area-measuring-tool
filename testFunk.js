function testFunk8(){
	var testPunkt1 = new point(200,100);
	handleClick(true,testPunkt1);
	var testPunkt2 = new point(170,150);
	handleClick(true,testPunkt2);
	var testPunkt3 = new point(200,180);
	handleClick(true,testPunkt3);
	var testPunkt4 = new point(250,170);
	handleClick(true,testPunkt4);
	var testPunkt5 = new point(240,130);
	handleClick(true,testPunkt5);
	var testPunkt6 = new point(260,130);
	handleClick(true,testPunkt6);
	var testPunkt7 = new point(280,130);
	handleClick(true,testPunkt7);
	var testPunkt8 = new point(300,150);
	handleClick(true,testPunkt8);
	var testPunkt9 = new point(300,200);
	handleClick(true,testPunkt9);
	var testPunkt10 = new point(300,250);
	handleClick(true,testPunkt10);
	var testPunkt11 = new point(250,250);
	handleClick(true,testPunkt11);
	var testPunkt12 = new point(200,250);
	handleClick(true,testPunkt12);
	var testPunkt13 = new point(200,225);
	handleClick(true,testPunkt13);
	var testPunkt14 = new point(200,200);
	handleClick(true,testPunkt14);
	var testPunkt15 = new point(150,250);
	handleClick(true,testPunkt15);
	var testPunkt16 = new point(100,300);
	handleClick(true,testPunkt16);
	var testPunkt17 = new point(150,325);
	handleClick(true,testPunkt17);
	var testPunkt18 = new point(200,350);
	handleClick(true,testPunkt18);
	var testPunkt19 = new point(300,325);
	handleClick(true,testPunkt19);
	var testPunkt20 = new point(400,300);
	handleClick(true,testPunkt20);
	var testPunkt21 = new point(380,280);
	handleClick(true,testPunkt21);
	var testPunkt22 = new point(360,260);
	handleClick(true,testPunkt22);
	}

function testFunk(){
	var testPunkt1 = new point(200,100);
	handleClick(true,testPunkt1);
	var testPunkt2 = new point(170,150);
	handleClick(true,testPunkt2);
	var testPunkt2b = new point(300,100); //högerklick för att ångra
	handleClick(false,testPunkt2b);
	var testPunkt2c = new point(170,180);
	handleClick(true,testPunkt2c);
	var testPunkt3 = new point(200,180);
	handleClick(true,testPunkt3);
	var testPunkt3a = new point(250,170);
	handleClick(true,testPunkt3a);
	var testPunkt3b = new point(240,130);
	handleClick(true,testPunkt3b);
	var testPunkt4 = new point(170,130); //skär annan linje
	handleClick(true,testPunkt4);
	var testPunkt5 = new point(172,152); //för nära punkt2
	handleClick(true,testPunkt5);
	var testPunkt6 = new point(200,100); //stänger
	handleClick(true,testPunkt6);
	var testPunkt7 = new point(251,172); //flyttar
	handleClick(true,testPunkt7);
	var testPunkt8 = new point(240,180); //flyttar forts
	handleClick(true,testPunkt8);
	var testPunkt9 = new point(201,181); //raderar
	handleClick(false,testPunkt9);
	var testPunkt10 = new point(185,137); //sätter ny punkt
	handleClick(true,testPunkt10);
	var testPunkt9 = new point(201,99); //raderar
	handleClick(false,testPunkt9);
	//testa att det inte blir close om sista segmentet korsar ett annat
	//AP test av flyttad punkt, segment korsar ej
	//AP test så attpunkter kring nyinmatat punkt går att flytta
	//AP göra om den här testfunktionen så den blir tydligare
	//AP test för när segment raderas och polygonen öppnas
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


//testkör project_vector
function testFunk3(){
	var testpunktA = new point(100,100);
	var testpunktB = new point(200,200);
	var testpunktC = new point(75,125);
	var ritpunkt= new point(50,50);
	var segmentetAB = new segment(testpunktA,testpunktB);
	
	drawOneSegment(segmentetAB,"0,0,0");
	drawDot(testpunktC,2,"0,0,0");
	tempvar=(project_vector(segmentetAB,testpunktC)); // norm och punkt (-1 och 0 ifall inget)
	if(tempvar[0]>=0){
		drawDot(ritpunkt,3,"0,200,0");
		var tempsegment= new segment(testpunktC,tempvar[1]);
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
	ctx.strokeStyle = "rgba("+lineColor+",1)";
	ctx.beginPath();
	ctx.moveTo(startP.x, startP.y);
	ctx.lineTo(endP.x, endP.y);
	ctx.closePath();
	ctx.stroke();
}

//ritar linje för varje segment i en segment-array
function drawSegmentsInArray(segmentArrayIn,lineColor){
	ctx.strokeStyle = "rgba("+lineColor+",1)";
	ctx.beginPath();
	//sätter startpunkten
	ctx.moveTo(segmentArrayIn[0].p1.x, segmentArrayIn[0].p1.y);
	//ritar linje för varje segment
	for(h=0;h<segmentArrayIn.length;h++){
		ctx.lineTo(segmentArrayIn[h].p2.x, segmentArrayIn[h].p2.y);
		console.log("pip");
	}
	ctx.stroke();
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