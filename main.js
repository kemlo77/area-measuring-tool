

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
		
		//AP radera alla polygoner
	}

	function handleClick(isLeftClick,nyKlickadPunkt){
		hanteradPolygon=firstPolygon;
		if(isLeftClick){
			if(hanteradPolygon.closed){
				if(hanteradPolygon.moveMode){leftClickClosedMoveMode(hanteradPolygon,nyKlickadPunkt)}//LEFT - CLOSED - MOVEMODE
				else{leftClickClosed(hanteradPolygon,nyKlickadPunkt)}//LEFT - CLOSED
			}
			else{leftClickOpen(hanteradPolygon,nyKlickadPunkt)}//LEFT - OPEN
		}
		else{
			if(hanteradPolygon.closed){
				if(hanteradPolygon.moveMode){rightClickClosedMoveMode(hanteradPolygon)}//RIGHT - CLOSED - MOVEMODE
				else{rightClickClosed(hanteradPolygon,nyKlickadPunkt)}//RIGHT - CLOSED
			}
			else{rightClickOpen(hanteradPolygon)}//RIGHT - OPEN
		}
		
		hanteradPolygon.gShoeLace();
		drawPolygon(hanteradPolygon);
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
				console.log("antal segment"+hanteradPolygon.segments.length);
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
	
	
	

	//---------------------------------------------------------------------
	//*************************
	//********objekt***********

	//---polygon---------------------------
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
		//beräknar arean och kollar om den är ritad medurs eller moturs
		this.gShoeLace();
		//om den är moturs 
		if(!this.clockWise&&document.getElementById("checkboxEnforceClockwise").checked){
			this.reversePolygon();
		}
	}
