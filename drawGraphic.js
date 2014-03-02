function drawPolygon(polygonIn){
	var moveColor="255,128,0";
	var defaultColor="0,80,120";
	var redColor="255,0,0";
	var greenColor="0,255,0";
	var whiteColor="255,255,255";
	//rensar ytan
	clearTheCanvas();
	//ritar ring rund vald punkt
	if(polygonIn.moveMode){
		drawDot(polygonIn.segments[polygonIn.movePointIndex].p1,4,moveColor);
	}
	//ritar alla segment
	for(r=0;r<polygonIn.segments.length;r++){
		drawOneSegment(polygonIn.segments[r],defaultColor);
	}
	//rita mittenpunkter, även sista (vita)
	for(z=0;z<polygonIn.segments.length;z++){
		drawDubbelDot(polygonIn.segments[z].p2,defaultColor,whiteColor);
	}
	//om polygonen är stängd
	if(polygonIn.closed){
		//första punkten grön
		drawDubbelDot(polygonIn.segments[0].p1,defaultColor,greenColor);
		//sista punkten röd
		drawDubbelDot(polygonIn.segments[polygonIn.segments.length-1].p1,defaultColor,redColor);
	}
	else{
		//rita första punkten (grön)
		if(polygonIn.seed){
			drawDubbelDot(polygonIn.seed,defaultColor,greenColor);
		}	
	}
}


//tömmer canvas
function clearTheCanvas(){
	ctx.clearRect(0, 0, IWIDTH, IHEIGHT);
}

//ritar ifylld punkt
function drawDubbelDot(dot2paint,outerColor,innerColor){
	//yttre prick
	drawDot(dot2paint,2,outerColor);
	//inre prick
	drawDot(dot2paint,1,innerColor);
}

//ritar en punkt
function drawDot(dot2paint,diam,rgbIN){
	ctx.fillStyle = "rgba("+rgbIN+",1)";
	ctx.beginPath();
	ctx.arc(dot2paint.x,dot2paint.y, diam, 0, Math.PI*2, true);
	ctx.closePath();
	ctx.fill();
}

//ritar ut ett segment (ritar linje mellan 2 punkter)
function drawOneSegment(segment2draw,lineColor){
	ctx.strokeStyle = "rgba("+lineColor+",1)";
	ctx.beginPath();
	ctx.moveTo(segment2draw.p1.x, segment2draw.p1.y);
	ctx.lineTo(segment2draw.p2.x, segment2draw.p2.y);
	ctx.closePath();
	ctx.stroke();
}

