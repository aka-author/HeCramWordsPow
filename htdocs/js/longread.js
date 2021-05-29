//* * ** *** ***** ******** ************* *********************
// Project: Nakar
// Module:  Play of Words
// Layer:	Web front-end
// File:	longread.js                            (\_/)
// Func:	Publishing static HTML content         (^.^)
//* * ** *** ***** ******** ************* *********************

class Longread extends Bureaucrat {

	constructor(chief, id, url) {
		
		super(chief, id);
		
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
			
			console.log("--- ", containerDomObject);
			console.log(html);
		}
		
		function processResponseBody(response) {
			response.text().then(function(html) {updateContainerDomObject(html)});
		}
	
		fetch(requestUrl).then(processResponseBody);
	}


}