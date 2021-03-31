//* * ** *** ***** ******** ************* *********************
// Project:	Nakar
// Module:	Play of words
// Layer:	Web front-end
// File:	setops.js                                 (\_/)
// Func:	Performing set operations on JS sets      (^.^)                                                 
//* * ** *** ***** ******** ************* *********************

function uniteSets() {

    let union = new Set();
	
	for(let setIdx in arguments)
		for(let elem of arguments[setIdx]) 
			union.add(elem);
		
	return union;
}


function intersectSets() {
	
	let intersection = uniteSets(...arguments); 
	
	for(let elem of intersection)
		for(let setIdx in arguments)
			if(!arguments[setIdx].has(elem)) {
				intersection.delete(elem);
				break;
			}	
			
	return intersection;		
}