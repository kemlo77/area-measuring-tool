function init() {
	var canvasBackground = document.getElementById("background");
	if (canvasBackground.getContext) {ctxBack = canvasBackground.getContext("2d");}
	var canvasForeground = document.getElementById("foreground");
	if (canvasForeground.getContext) {ctxFront = canvasForeground.getContext("2d");}
	IWIDTH=canvasBackground.width;
	IHEIGHT=canvasBackground.height;
}

function clearEntirely(){
	firstPolygon.segments=[];
	firstPolygon.closed=false;
	firstPolygon.seed=null;
	clearTheCanvas(ctxFront);
	clearTheCanvas(ctxBack);
}

//*************************
//** Handle clicks       **
//*************************
function handleClick(isLeftClick,theClickedPoint){
	if(isLeftClick){
		firstPolygon.handleLeftClick(theClickedPoint);
		if(firstPolygon.closed){
			if(firstPolygon.moveMode){ //LEFT - CLOSED - MOVEMODE
				leftClickClosedMoveMode(firstPolygon,theClickedPoint)
			}
			else{leftClickClosed(firstPolygon,theClickedPoint)}//LEFT - CLOSED
		}
		else{leftClickOpen(firstPolygon,theClickedPoint)}//LEFT - OPEN
	}
	else{
		firstPolygon.handleRightClick(theClickedPoint);
		if(firstPolygon.closed){
			if(firstPolygon.moveMode){ //RIGHT - CLOSED - MOVEMODE
				rightClickClosedMoveMode(firstPolygon)
			}
			else{rightClickClosed(firstPolygon,theClickedPoint)}//RIGHT - CLOSED
		}
		else{rightClickOpen(firstPolygon)}//RIGHT - OPEN
	}
	//calculate area and check if polygon is drawn clockwise or not
	firstPolygon.gShoeLace();
	//change to clockwise if checkbox is ticked
	if(!firstPolygon.clockWise&&document.getElementById("checkboxEnforceClockwise").checked){
		firstPolygon.reversePolygon();
	}
	drawPolygon(firstPolygon);
	//clearUsedCanvas();
	drawMovement(theClickedPoint,firstPolygon)
}

function leftClickClosed(handledPolygon,newlyClickedPoint){
	var nearPointIndex=checkIfCloseToPoint(handledPolygon.segments,newlyClickedPoint,moveDelInsDistance);
	if(nearPointIndex>-1){
		handledPolygon.moveMode=true;
		handledPolygon.movePointIndex=nearPointIndex;
	}
	else{
		//if the click occured near a segment, insert a new point
		var tempVar = checkIfCloseToLine(handledPolygon.segments,newlyClickedPoint,moveDelInsDistance);
		if(tempVar[0]){
			//rounding coordinates to get integers
			if(useIntegerCoords){
				tempVar[2].x=Math.round(tempVar[2].x);
				tempVar[2].y=Math.round(tempVar[2].y);
			}
			//calculating distance to both points on clicked segment
			//so that it is not possible to insert a point too close to another
			segmPointDist1=distBetweenPoints(handledPolygon.segments[tempVar[1]].p1,tempVar[2]);
			segmPointDist2=distBetweenPoints(handledPolygon.segments[tempVar[1]].p2,tempVar[2]);
			if(((segmPointDist1>minDistance)&&(segmPointDist2>minDistance))){
			//inserting the point in the segment-array
				handledPolygon.insertPoint(tempVar[2],tempVar[1]);//newPoint,index
			}
		}
	}	
}

function leftClickClosedMoveMode(handledPolygon,newlyClickedPoint){
	//if the clicked point is not to close to another point (not checking it self, there of the 4th argument in function call)
	if(checkIfCloseToPoint(handledPolygon.segments,newlyClickedPoint,minDistance,handledPolygon.movePointIndex)<0){
		//if the points nearest segments do not intersect with other segments
		if(document.getElementById("checkboxEnforceNonComplex").checked){
			if(!checkIfMovedIntersects(handledPolygon.segments,newlyClickedPoint,handledPolygon.movePointIndex)){
				//move the point at movePointIndex to the new point
				handledPolygon.segments[handledPolygon.movePointIndex].p1.copyValues(newlyClickedPoint); //copying values so that it is still the same object
				handledPolygon.moveMode=false;
			}
		}
		else{
			//move the point at movePointIndex to the new point
			handledPolygon.segments[handledPolygon.movePointIndex].p1.copyValues(newlyClickedPoint); //copying values so that it is still the same object
			handledPolygon.moveMode=false;		
		}
	}	
}

function leftClickOpen(handledPolygon,newlyClickedPoint){
	//check if this is the first segment
	if(handledPolygon.segments.length>0){
		//check if user clicks near the first point (wanting to close the polygon)
		if(distBetweenPoints(newlyClickedPoint,handledPolygon.segments[0].p1)<closePolygonMinimumDistance){
			//if the plygon already has at least 2 segments
			if(handledPolygon.segments.length>=2){
				//check that the segment between the last point and first point does not intersect with other segments
				var nyttSegment = new Segment(handledPolygon.segments[handledPolygon.segments.length-1].p2,handledPolygon.segments[0].p1);
				if(document.getElementById("checkboxEnforceNonComplex").checked){
					if(!checkIfIntersect(handledPolygon.segments,nyttSegment,true)){
						handledPolygon.segments.push(nyttSegment);
						handledPolygon.close();
					}
				}
				else{
					handledPolygon.segments.push(nyttSegment);
					handledPolygon.close();				
				}
			}
		}
		else{
			//if the new Segment does not intersect with other segments or the new point to close to other points, the add the point (+segment)
			var nyttSegment = new Segment(handledPolygon.segments[handledPolygon.segments.length-1].p2,newlyClickedPoint);
			if(checkIfCloseToPoint(handledPolygon.segments,newlyClickedPoint,minDistance)<0){//checking p1 in all segments
				if(distBetweenPoints(handledPolygon.segments[handledPolygon.segments.length-1].p2,newlyClickedPoint)>minDistance){//checking p2 in the last segment
					if(document.getElementById("checkboxEnforceNonComplex").checked){
						if(!checkIfIntersect(handledPolygon.segments,nyttSegment,false)){
							handledPolygon.segments.push(nyttSegment);
						}
					}
					else{
						handledPolygon.segments.push(nyttSegment);				
					}
				}
			}
		}
	}
	else{//if seed does not exist (nor any other elements) Add the first point.
		if(handledPolygon.seed==null){
			//console.log("first point");
			handledPolygon.seed=newlyClickedPoint;
		}
		else{
			//if it is not to close to the fist point, add the second point
			if(distBetweenPoints(handledPolygon.seed,newlyClickedPoint)>minDistance){
				//console.log("first segment");
				var nyttSegment = new Segment(handledPolygon.seed,newlyClickedPoint);
				handledPolygon.segments.push(nyttSegment);
			}
		}
	}	
}

function rightClickOpen(handledPolygon){
	//removes last added point (+segment)
	if(handledPolygon.segments.length==0){
		handledPolygon.seed=null;
		//console.log("removed seed point");
	}
	handledPolygon.segments.pop();
}

function rightClickClosed(handledPolygon,newlyClickedPoint){
	//if the user rightclicked a point, remove it if there are more than 3 sides to the polygon
	var nearPointIndex=checkIfCloseToPoint(handledPolygon.segments,newlyClickedPoint,moveDelInsDistance);
	if(nearPointIndex>-1){
		//if polygon has more than 3 sides it is ok to remove point (+segment)
		if(handledPolygon.segments.length>3){
				//check that the segment created to fill the gap does not intersect with other segments
				if(document.getElementById("checkboxEnforceNonComplex").checked){
					if(!checkIfRemovedPointCausesSegmentIntersect(handledPolygon.segments,nearPointIndex)){
						//no intersects found
						handledPolygon.ejectPoint(nearPointIndex);
					}
				}
				else{
					handledPolygon.ejectPoint(nearPointIndex);				
				}
		}
	}
	//erase segment if user right clicked "on" segment
	else{
		//check if click was near segment
		var tempVar = checkIfCloseToLine(handledPolygon.segments,newlyClickedPoint,moveDelInsDistance);
		if(tempVar[0]){//true if user clicked close enough to segment
			//tempVar[1] holds what segment
			//Changing start segment so that the one to be removed is the last one
			handledPolygon.revolFirstIndex(tempVar[1]);
			//opening polygon and removing last segment
			handledPolygon.closed=false;
			handledPolygon.segments.pop();
		}
	}	
}

function rightClickClosedMoveMode(handledPolygon){
	//aborting move mode
	handledPolygon.moveMode=false;
	handledPolygon.movePointIndex=-1;
}

function checkIfRemovedPointCausesSegmentIntersect(segmentArrayIn,deleteAtIndex){
	//needs only to be checked for polygons with 5 sides or more
	//i.e. a four sided polygon loosing a side becomes a triangle, that can have no sides intersecting.
	if(segmentArrayIn.length>4){
		//find index for the segment one step prior
		var indexBeforeDeleteAtIndex=moduloInPolygon(deleteAtIndex-1,segmentArrayIn.length); //DAI-1
		//skapa ETT nya segment f�r valt index och det dessf�rrinnan
		//create ONE new Segment to replace chosen segment (at deleteAtIndex) and the segment prior
		var thePotentialNewSegment = new Segment(segmentArrayIn[indexBeforeDeleteAtIndex].p1,segmentArrayIn[deleteAtIndex].p2);
		//skipping the two segments to be replaced plus their neighbouring segments
		for(p=0;p<segmentArrayIn.length-4;p++){
			//drawOneSegment(segmentArrayIn[moduloInPolygon((p+deleteAtIndex+2),segmentArrayIn.length)],"0,0,255");
			segmentArrayIn[moduloInPolygon((p+deleteAtIndex+2),segmentArrayIn.length)]
			if(calculateIntersect(thePotentialNewSegment,segmentArrayIn[moduloInPolygon((p+deleteAtIndex+2),segmentArrayIn.length)])[0]){
				drawOneSegment(thePotentialNewSegment,"255,0,0");
				console.log("if that point is removed there will be an intersect");
				return true;
			}
		}
		//if coming this fara, there is no intersect found
		return false;
	}
	else{
		//if polygon had 4 sides or less, it is automatically OK
		return false;
	}
}

//checks if new point is too close to other points
//returning the nearest point or -1 if all points are outside minDistanceIn
//only checks with the first point in a segment. So when the polygon is not closed, the last point is not checked.
function checkIfCloseToPoint(segmentArrayIn,nyPunkt,minDistanceIn,skipPoint){
	//skipPoint is an optional parameter referensing the segment containing p1 not to be checked
	if (typeof skipPoint === 'undefined') { skipPoint = -1; }
	var localMinDistance=minDistanceIn;
	var isTooClose = -1;
	var pointDistance=0;
	for(i=0;i<segmentArrayIn.length;i++){
		if(i==skipPoint){continue;}
		//calculating distance between new point and all other points in polygon
		pointDistance=distBetweenPoints(segmentArrayIn[i].p1,nyPunkt);
		if(pointDistance<localMinDistance){
			//if it is closer than minDistanceIn, or nearer than any other previously saved, it is saved
			isTooClose = i;
			localMinDistance=pointDistance;
		}
	}
	return isTooClose;
}

//checking if new point is near other polygon segments
function checkIfCloseToLine(segmentArrayIn,nyPunkt,minDistanceIn){
	var distToLine=-1;
	var smallestDistance=minDistanceIn;
	var ppReturArray = new Array();
	var closeEnough=false;
	var firstPointIndex = 0;
	var closestPoint = new Point();
	//checking with every segment
	for(j=0;j<segmentArrayIn.length;j++){
		//projecting point on segment
		var proj_svar=project_vector(segmentArrayIn[j],nyPunkt);
		var distToLine=proj_svar[0]; //negative if it is too far away
		var projPunkten = proj_svar[1];   //0 if it is too far away
		//if it was between 0 and minDistanceIn
		if(distToLine>=0&&distToLine<minDistanceIn){
			if(distToLine<smallestDistance){
				//if it is closer than minDistanceIn and closer than last saved, it is saved
				smallestDistance=distToLine; 
				closestPoint=projPunkten;
				firstPointIndex=j;
			}
			closeEnough = true;
		}
	}
	ppReturArray.push(closeEnough); //true, if there was anything close enough
	ppReturArray.push(firstPointIndex); //index for the first point on segment clicked (index for the segment clicked?)
	ppReturArray.push(closestPoint); //the point projected on the segment
	return ppReturArray;
}

//checking if new Segment intersects with other segment in array
function checkIfIntersect(segmentArrayIn,nyttSegmentIn,skipFirstSegment){
	var startSegm=0;
	if(skipFirstSegment){startSegm=1;}//skipping first segment in case user clicks the polygons first point
	//skipping the second to last (penultimate segment)
	for(n=startSegm;n<segmentArrayIn.length-1;n++){
		result=calculateIntersect(segmentArrayIn[n],nyttSegmentIn);
		if(result[0]){
			//returning true if there is a intersect
			return true;
		}
	}
	//arriving here, there is no intersect
	return false;
}

//checking if the two segments containing a point (being moved) intersects with the other segments in a polygon (at move)
function checkIfMovedIntersects(segmentArrayIn,nyPunkt,movedAtIndex){
	// if polygon has more than 3 segments, otherwise return false
	if(segmentArrayIn.length>3){
		//find index for segments two steps before, one step before and one step after chosen index
		//MAI ~ Move At Index
		var indexBeforeMovedAtIndex=moduloInPolygon(movedAtIndex-1,segmentArrayIn.length); //MAI-1
		var indexBeforeBeforeMovedAtIndex=moduloInPolygon(indexBeforeMovedAtIndex-1,segmentArrayIn.length);//MAI-2
		var indexAfterMovedAtIndex=moduloInPolygon(movedAtIndex+1,segmentArrayIn.length);//MAI+1
		//creating two new Segments for chosen index and the one prior
		var firstCheckedSegment  = new Segment(segmentArrayIn[indexBeforeMovedAtIndex].p1,nyPunkt);
		var secondCheckedSegment = new Segment(nyPunkt,segmentArrayIn[movedAtIndex].p2);
		//loop through all segments in segment array
		//general idea: no need to check if neighbouring segments intersect with current segment (being checked)
		for(m=0;m<segmentArrayIn.length;m++){
			//skip the two unnecessary segments for both comparisons (lying next to both segments)
			if(m==movedAtIndex||m==indexBeforeMovedAtIndex){continue;} //MAI & MAI-1
			//skip the segment before firstCheckedSegment
			if(m!==indexBeforeBeforeMovedAtIndex){ //MAI-2
				//checking if firstCheckedSegment intersects with any of the other interesting segments
				if(calculateIntersect(firstCheckedSegment,segmentArrayIn[m])[0]){return true}
			}
			//skip the segment after secondCheckedSegment
			if(m!==indexAfterMovedAtIndex){ //MAI+1
				//checking if secondCheckedSegment intersects with any of the other interesting segments
				if(calculateIntersect(secondCheckedSegment,segmentArrayIn[m])[0]){return true}
			}
		}
		//if arriving here, there are no intersects
		return false;
	}
	else{
		//if the polygon had only 3 sides, it is automatically ok
		return false;
	}
}
