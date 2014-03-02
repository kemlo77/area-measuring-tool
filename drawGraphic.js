
	function drawPolygon(polygonIn){
	//AP plottningen hanterar om polygonen är öppen eller stängd
	//AP om polygonen är öppen ritas linje mellan sista punkten och muspekaren
	//AP speciell plottning om man flyttar en punkt
		var moveColor="255,128,0";
		var selectedColor="0,80,120";
		var redColor="255,0,0";
		var greenColor="0,255,0";
		var whiteColor="255,255,255";
		var blackColor="0,0,0";

		//rensar ytan
		clearTheCanvas();
		//om polygonen är vald ritas den i blått och med cirklar vid punkterna
		if(polygonIn.selected){
			//ritar ring rund vald punkt
			if(polygonIn.moveMode){
				drawDot(polygonIn.segments[polygonIn.movePointIndex].p1,4,moveColor);
			}
			//ritar alla segment
			for(r=0;r<polygonIn.segments.length;r++){
				drawSegmentsInArray(polygonIn.segments,selectedColor);
			}
			//rita mittenpunkter, även sista (vita)
			for(z=0;z<polygonIn.segments.length;z++){
				drawDubbelDot(polygonIn.segments[z].p2,selectedColor,whiteColor);
			}
			//om polygonen är stängd
			if(polygonIn.closed){
				//första punkten grön
				drawDubbelDot(polygonIn.segments[0].p1,selectedColor,greenColor);
				//sista punkten röd
				drawDubbelDot(polygonIn.segments[polygonIn.segments.length-1].p1,selectedColor,redColor);
			}
			else{
				//rita första punkten (grön)
				if(polygonIn.seed){
					drawDubbelDot(polygonIn.seed,selectedColor,greenColor);
				}	
			}
		}
		//om polygonen inte är vald ritas den bara enkelt i svart
		else{
			for(r=0;r<polygonIn.segments.length;r++){
				drawSegmentsInArray(polygonIn.segments,blackColor);
			}	
		}
	}
