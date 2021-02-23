//* * ** *** ***** ******** ************* *********************
// Internationalization
//
//                                                (\_/)
//                                                (^.^) 
//* * ** *** ***** ******** ************* *********************

class I18n {
	
	constructor() {
		this.stringTable = null;
		this.defaultLang = "en";
	}
	
	setStringTable(stringTable) {
		this.stringTable = stringTable;
	}
	
	getStringTable() {
		return this.stringTable;
	}
	
	getDefaultLang() {
		return this.defaultLang;
	}
	
	setDefaultLang(lang) {
		this.defaultLang = lang;
	}
	
	getText(id, lang=null) {
		let actualLang = lang ? lang : this.getDefaultLang();
		let stringTable = this.getStringTable();
		let stringTableRow = stringTable[id];
		return stringTableRow ? stringTableRow[actualLang] : undefined;
	}
	
	loadLocalLabels(rootNode, lang=null) {
	
		let actualLang = lang ? lang : this.getDefaultLang();
		
		try {
			if(rootNode.getAttribute) {
				let id = rootNode.getAttribute("id");
				if(id) {
					let localText = this.getText(id, actualLang);
					if(localText) 
						rootNode.innerHTML = localText;
				}	
				
			}
		}	
		catch(e) {}
		
		for(let childIdx in rootNode.children)
			this.loadLocalLabels(rootNode.children[childIdx], actualLang);
	}
}