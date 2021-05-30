//* * ** *** ***** ******** ************* *********************
// Project: Nakar
// Module:  Play of Words
// Layer:	Web front-end
// File:	longread.js                            (\_/)
// Func:	Publishing static HTML content         (^.^)
//* * ** *** ***** ******** ************* *********************

const BUR_TYPE_CODE_LONGREAD = "longread";


class Longread extends Bureaucrat {

	constructor(chief, id, url) {
		
		super(chief, id);
		
		this.setType(BUR_TYPE_CODE_LONGREAD);
		
		this.url = url;
	}
	
	getUrl() {
		return this.url;
	}
	
	assembleRequestUrl(langCode) {
		
		let splitter = new SubstFormalSplitter(this.getUrl());
		
		return splitter.split().substStr({"lang_code" : langCode});
	}
	
	getDomObject() {
		return document.getElementById(this.getId());
	}
	
	startUpdate() {
	
		let requestUrl = this.assembleRequestUrl(this.getUiLangCode());
		
		let containerDomObject = this.getDomObject();
		
		function updateContainerDomObject(html) {
			containerDomObject.innerHTML = html;
		}
		
		function processResponseBody(response) {			
			response.text().then(updateContainerDomObject);
		}
	
		fetch(requestUrl).then(processResponseBody);
	}


}