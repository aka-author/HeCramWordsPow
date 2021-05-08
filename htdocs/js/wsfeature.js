//* * ** *** ***** ******** ************* *********************
// Project: Nakar
// Module:  Play of Words
// Layer:	Web front-end
// File:	wsfeature.js                    (\_/)
// Func:	Wordspace features              (^.^) 
//* * ** *** ***** ******** ************* *********************

class WordspaceFeature {
	
	constructor(code, relatedLangCode=undefined) {
		this.code = code;
		this.relatedLangCode = relatedLangCode;
		this.names = Array();
		this.setName(this.getCode(), this.getCode());
	}
	
	getCode() {
		return this.code;
	}
	
	getRelatedLangCode() {
		return this.relatedLangCode;
	}
	
	setRelatedLangCode(langCode) {
		this.relatedLangCode = langCode;
	}
	
	getName(langCode=undefined) {
		return langCode ? this.names[langCode] : this.getOriginalName();
	}

	getOriginalName() {
		return this.getName(this.getRelatedLangCode());
	}	
	
	setName(langCode, name) {
		this.names[langCode] = name;
	}
}