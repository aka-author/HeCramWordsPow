//* * ** *** ***** ******** ************* *********************
// Project: Nakar
// Module:  Play of Words
// Layer:	Web front-end
// File:	comparator.js                            (\_/)
// Func:	Comparing items according a sort mode    (^.^)                                                 (^.^) 
//* * ** *** ***** ******** ************* *********************

const SORT_NONE       =  0;
const SORT_ASCENDING  =  1; 
const SORT_DESCENDING = -1; 

class Comparator {

	constructor(sortMode=SORT_NONE) {
		this.sortMode = sortMode;
	}
	
	getSortMode() {
		return this.sortMode;
	}
	
	setSortMode(sortMode) {
		this.sortMode = sortMode;
	}
	
	applySortMode(rawCompareResult) {
		
		let compareResult = 0;
		
		switch(this.getSortMode()) {
			case SORT_ASCENDING:
				compareResult = rawCompareResult;
				break;
			case SORT_DESCENDING:
				compareResult = -rawCompareResult;
				break;
			default:
				compareResult = 0;
		}			
		
		return compareResult; 
	}
	
	compareItems(item1, item2) {
		return String(item1).localeCompare(String(item2));
	}

}