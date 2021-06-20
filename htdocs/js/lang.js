//* * ** *** ***** ******** ************* *********************
// Project: Nakar
// Module:  Play of Words
// Layer:	Web front-end
// File:	lang.js                           (\_/)
// Func:	Managing language metadata        (^.^) 
//* * ** *** ***** ******** ************* *********************

class Lang extends FactorValue {
	
	constructor(langCode, originalName=undefined) {
		
		super(langCode, langCode);
		
		if(originalName) 
			this.setName(langCode, originalName);
	}
	
}