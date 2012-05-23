//testkör project_vector
function testFunk2(){
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