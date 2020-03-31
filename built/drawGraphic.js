function drawPolygon(polygonIn){
	var moveColor="255,128,0";//orange
	var defaultColor="0,80,120";//
	var redColor="255,0,0";
	var greenColor="0,255,0";
	var whiteColor="255,255,255";
	//clear the canvas
	clearTheCanvas(ctxFront);
	//draw a ring around the point chosen to be moved
	if(polygonIn.moveMode){
		//draw all segments except the ones next to the dot being moved
		for(r=0;r<polygonIn.segments.length-2;r++){
			drawOneSegment(polygonIn.segments[moduloInPolygon(r+polygonIn.movePointIndex+1,polygonIn.segments.length)],defaultColor);
		}
		//draw intermediary points, skip the one being moved
		for(z=1;z<polygonIn.segments.length;z++){
			if(z==polygonIn.movePointIndex){continue;}
			drawDubbelDot(polygonIn.segments[z].p1,defaultColor,whiteColor);
		}
		//since the polygon is closed
		//first point green
		if(polygonIn.movePointIndex!==0){
			drawDubbelDot(polygonIn.segments[0].p1,defaultColor,greenColor);
		}
		//last point red
		if(polygonIn.movePointIndex!==(polygonIn.segments.length-1)){
			drawDubbelDot(polygonIn.segments[polygonIn.segments.length-1].p1,defaultColor,redColor);
		}
	}
	else{
		//draw all segments
		for(r=0;r<polygonIn.segments.length;r++){
			drawOneSegment(polygonIn.segments[r],defaultColor);
		}
		//draw intermediary points, also the last one (white)
		for(z=1;z<polygonIn.segments.length;z++){
			drawDubbelDot(polygonIn.segments[z].p1,defaultColor,whiteColor);
		}
		//if the polygon is closed
		if(polygonIn.closed){
			//first point green
			drawDubbelDot(polygonIn.segments[0].p1,defaultColor,greenColor);
			//last point red
			drawDubbelDot(polygonIn.segments[polygonIn.segments.length-1].p1,defaultColor,redColor);
		}
		else{
			//draw first point green
			if(polygonIn.seed){
				drawDubbelDot(polygonIn.seed,defaultColor,greenColor);
			}
			//draw last point with white dot
			if(polygonIn.segments.length>0){
				drawDubbelDot(polygonIn.segments[polygonIn.segments.length-1].p2,defaultColor,whiteColor);
			}
		}
	}


}


//clear the canvas
function clearTheCanvas(ctxChosen){
	ctxChosen.clearRect(0, 0, IWIDTH, IHEIGHT);
}

//draw a point with inner and outer color
function drawDubbelDot(dot2paint,outerColor,innerColor){
	//outer color (larger)
	drawDot(dot2paint,4,outerColor);
	//inner color (smaler drawn on top of the other)
	drawDot(dot2paint,2,innerColor);
}

//draw a point
function drawDot(dot2paint,diam,rgbIN){
	ctxFront.fillStyle = "rgba("+rgbIN+",1)";
	ctxFront.beginPath();
	ctxFront.arc(dot2paint.x,dot2paint.y, diam, 0, Math.PI*2, true);
	ctxFront.closePath();
	ctxFront.fill();
}

//draw a segment (draws a line between two points)
function drawOneSegment(segment2draw,lineColor){
	drawLine(segment2draw.p1,segment2draw.p2,lineColor,ctxFront);
}

//draws line between 2 points
function drawLine(startP,endP,lineColor,theCanvas){
	theCanvas.strokeStyle = "rgba("+lineColor+",1)";
	theCanvas.beginPath();
	theCanvas.lineWidth=2;
	theCanvas.moveTo(startP.x, startP.y);
	theCanvas.lineTo(endP.x, endP.y);
	theCanvas.closePath();
	theCanvas.stroke();
}

// Inspiration from http://www.ibm.com/developerworks/library/wa-canvashtml5layering/
var oldXMin=0;
var oldXMax=1;
var oldYMin=0;
var oldYMax=1;
function drawMovement(mousePosPoint,thePolygon){
	clearUsedCanvas()
	if(!thePolygon.closed){
		if(thePolygon.segments.length==0){
			if(thePolygon.seed){
				drawLine(thePolygon.seed,mousePosPoint,"255,128,0",ctxBack);
				saveExtremes([thePolygon.seed,mousePosPoint]);
			}
		}
		else{
			lastPoint = thePolygon.segments[thePolygon.segments.length-1].p2;
			drawLine(lastPoint,mousePosPoint,"255,128,0",ctxBack);
			saveExtremes([lastPoint,mousePosPoint]);
		}
	}
	else{
		if(thePolygon.moveMode){
			movingPointPlusOne=thePolygon.segments[thePolygon.movePointIndex].p2;
			movingPointMinusOne=thePolygon.segments[moduloInPolygon(thePolygon.movePointIndex-1,thePolygon.segments.length)].p1;
			drawLine(movingPointPlusOne,mousePosPoint,"255,128,0",ctxBack);
			drawLine(movingPointMinusOne,mousePosPoint,"255,128,0",ctxBack);
			saveExtremes([movingPointPlusOne,movingPointMinusOne,mousePosPoint]);
			
		}
	}
}

function saveExtremes(arrayWithPoints){
	oldXMin=arrayWithPoints[0].x;
	oldXMax=arrayWithPoints[0].x;
	oldYMin=arrayWithPoints[0].y;
	oldYMax=arrayWithPoints[0].y;
	for(p=1;p<arrayWithPoints.length;p++){
		if(oldXMin>arrayWithPoints[p].x){oldXMin=arrayWithPoints[p].x}
		if(oldXMax<arrayWithPoints[p].x){oldXMax=arrayWithPoints[p].x}
		if(oldYMin>arrayWithPoints[p].y){oldYMin=arrayWithPoints[p].y}
		if(oldYMax<arrayWithPoints[p].y){oldYMax=arrayWithPoints[p].y}
	}
}

function clearUsedCanvas(){
	ctxBack.clearRect(oldXMin-2, oldYMin-2, oldXMax-oldXMin+4, oldYMax-oldYMin+4);
}