
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
	alert("antalet segment i firstPolygon "+firstPolygon.segments.length+"\nclosed: "+firstPolygon.closed);
}



//testkör project_vector
function testFunk3(){
	var testpunktA = new point(100,100);
	var testpunktB = new point(200,200);
	var testpunktC = new point(75,125);
	var ritpunkt= new point(50,50);
	var segmentetAB = new segment(testpunktA,testpunktB);
	
	drawSegment(segmentetAB,"0,0,0");
	drawDot(testpunktC,2,"0,0,0");
	tempvar=(project_vector(segmentetAB,testpunktC)); // norm och punkt (-1 och 0 ifall inget)
	if(tempvar[0]>=0){
		drawDot(ritpunkt,3,"0,200,0");
		var tempsegment= new segment(testpunktC,tempvar[1]);
		drawSegment(tempsegment,"255,128,0");
	}
	else{
		drawDot(ritpunkt,3,"200,0,0");
	}
}