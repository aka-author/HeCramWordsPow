//* * ** *** ***** ******** ************* *********************
// Internationalization
//
//                                                (\_/)
//                                                (^.^) 
//* * ** *** ***** ******** ************* *********************

class I18n {
	
	constructor() {
		this.defaultLang = "en";
	}
	
	getDefaultLang() {
		return this.defaultLang;
	}
	
	setDefaultLang(lang) {
		this.defaultLang = lang;
	}
	
	getText(id, lang=null) {
		let actualLang = lang ? lang : this.getDefaultLang();
	}
	
	loadLocalLabels(rootNode, lang=null) {
		
		let actualLang = lang ? lang : this.getDefaultLang();
		
		if(rootNode.getAttribute) {
			
			let id = rootNode.getAttribute("id");
			
			if(id) {
				let localText = this.getText(id, actualLang);
				if(localText) 
					rootNode.innerHTML = localText;
				else
					for(let childIdx in rootNode.children)
						this.loadLocalLabels(rootNode.children[childIdx]);
			}	
		}	
	}
}