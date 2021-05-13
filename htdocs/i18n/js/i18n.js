//* * ** *** ***** ******** ************* *********************
// Project: Nakar
// Module:  Play of Words
// Layer:	Web front-end
// File:	i18n.js                           (\_/)
// Func:	Internationalization              (^.^)
//* * ** *** ***** ******** ************* *********************

class I18n {
	
	constructor() {
		this.stringTable = null;
		this.defaultLangCode = "en";
	}
	
	setStringTable(stringTable) {
		this.stringTable = stringTable;
	}
	
	getStringTable() {
		return this.stringTable;
	}
	
	getDefaultLangCode() {
		return this.defaultLangCode;
	}
	
	setDefaultLangCode(lang) {
		this.defaultLangCode = lang;
	}
	
	getText(id, langCode=null) {
		let actualLangCode = langCode ? langCode : this.getDefaultLangCode();
		let stringTable = this.getStringTable();
		let stringTableRow = stringTable[id];
		return stringTableRow ? stringTableRow[actualLangCode] : undefined;
	}
	
	setText(id, langCode, wording) {
		if(!this.stringTable[id])
			this.stringTable[id] = new Array();
		this.stringTable[id][langCode] = wording;
	}
	
	loadLocalLabels(rootNode, langCode=undefined) {
	
		let actualLangCode = langCode ? langCode : this.getDefaultLangCode();
		
		if(isHtmlElement(rootNode)) {
			let id = rootNode.getAttribute("id");
			if(id) {
				let localText = this.getText(id, actualLangCode);
				if(localText) 
					rootNode.innerHTML = localText;
			}		
		}
		
		for(let childIdx in rootNode.children)
			this.loadLocalLabels(rootNode.children[childIdx], actualLangCode);
	}
}