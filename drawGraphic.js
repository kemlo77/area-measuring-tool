function drawPolygon(polygonIn){
	var moveColor="255,128,0";//orange
	var defaultColor="0,80,120";//
	var redColor="255,0,0";
	var greenColor="0,255,0";
	var whiteColor="255,255,255";
	//clear the canvas
	clearTheCanvas();
	//draw a ring around the point chosen to be moved
	if(polygonIn.moveMode){
		drawDot(polygonIn.segments[polygonIn.movePointIndex].p1,6,moveColor);
	}
	//draw all segments
	for(r=0;r<polygonIn.segments.length;r++){
		drawOneSegment(polygonIn.segments[r],defaultColor);
	}
	//draw intermediary points, also the last one (white)
	for(z=0;z<polygonIn.segments.length;z++){
		drawDubbelDot(polygonIn.segments[z].p2,defaultColor,whiteColor);
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
	}
}


//clear the canvas
function clearTheCanvas(){
	ctx.clearRect(0, 0, IWIDTH, IHEIGHT);
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
	ctx.fillStyle = "rgba("+rgbIN+",1)";
	ctx.beginPath();
	ctx.arc(dot2paint.x,dot2paint.y, diam, 0, Math.PI*2, true);
	ctx.closePath();
	ctx.fill();
}

//draw a segment (draws a line between two points)
function drawOneSegment(segment2draw,lineColor){
	ctx.strokeStyle = "rgba("+lineColor+",1)";
	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.moveTo(segment2draw.p1.x, segment2draw.p1.y);
	ctx.lineTo(segment2draw.p2.x, segment2draw.p2.y);
	ctx.closePath();
	ctx.stroke();
}

