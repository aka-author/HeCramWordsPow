//* * ** *** ***** ******** ************* *********************
// Project: Nakar
// Module:  Play of Words
// Layer:	Web front-end
// File:	lang.js                           (\_/)
// Func:	Managing language metadata        (^.^) 
//* * ** *** ***** ******** ************* *********************

class Lang {
	
	constructor(langCode) {
		this.langCode = langCode;
		this.names = Array();
		this.setName(this.getCode(), this.getCode());
	}
	
	getCode() {
		return this.langCode;
	}
	
	getName(langCode) {
		return this.names[langCode];
	}		
	
	setName(langCode, name) {
		this.names[langCode] = name;
	}
	
	getOriginalName() {
		return this.getName(this.getCode());
	}
}