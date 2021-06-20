//* * ** *** ***** ******** ************* *********************
// Project: Nakar
// Module:  Play of Words
// Layer:	Web front-end
// File:	wsfeature.js                    (\_/)
// Func:	Factors                         (^.^) 
//* * ** *** ***** ******** ************* *********************

class FactorValue {
	
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
	
	getName(langCode=undefined) {
		return langCode ? this.getNames()[langCode] : 
						  this.getNames()[this.getRelatedLangCode()];
	}

	getOriginalName() {
		return this.getName(this.getRelatedLangCode());
	}	
	
	getNames() {
		return this.names;
	}
	
	setName(langCode, name) {
		this.names[langCode] = name;
	}
}


class Factor extends Comparator {

	constructor() {
		
		super();
		
		this.values = [];
		this.valuesByCode = {};
	
		for(let argIdx in arguments) 
			this.appendValue(arguments[argIdx]);	
	}
	
	appendValue(value) {
		this.values.push(value);
		this.valuesByCode[value.getCode()] = value;
	}
	
	getValue(valueCode) {
		return this.valuesByCode[valueCode];
	}
	
	getValues() {
		return this.values;
	}
	
	getValueCodes() {
		return Object.keys(this.valuesByCode);
	}
	
	getValueNames() {
		
		let names = {};
		
		let codes = this.getValueCodes();
				
		for(let codeIdx in codes) {
			let value = this.getValue(codes[codeIdx]);
			names[codes[codeIdx]] = value.getNames();
		}
		
		return names;
	}
	
	exists(valueCode) {
		return Boolean(this.valuesByCode[valueCode]);
	}		
}