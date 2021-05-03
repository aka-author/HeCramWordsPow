//* * ** *** ***** ******** ************* *********************
// Project: Nakar
// Module:  Play of Words
// Layer:	Web front-end
// File:	wsfeature.js                    (\_/)
// Func:	Wordspace features              (^.^) 
//* * ** *** ***** ******** ************* *********************

class WordspaceFeature {
	
	constructor(code) {
		this.code = code;
		this.names = Array();
		this.setName(this.getCode(), this.getCode());
	}
	
	getCode() {
		return this.code;
	}
	
	getName(code) {
		return this.names[code];
	}		
	
	setName(code, name) {
		this.names[code] = name;
	}
	
	getOriginalName() {
		return this.getName(this.getCode());
	}
}