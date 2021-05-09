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
		if(relatedLangCode)
			this.setName(relatedLangCode, this.getCode());
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
	
	getNames() {
		return this.names;
	}
	
	getName(langCode=undefined) {
		return langCode ? this.getNames()[langCode] : this.getOriginalName();
	}

	getOriginalName() {
		return this.getName(this.getRelatedLangCode());
	}	
	
	setName(langCode, name) {
		this.names[langCode] = name;
	}
}