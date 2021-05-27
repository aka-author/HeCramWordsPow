//* * ** *** ***** ******** ************* *********************
// Project: Nakar
// Module:  Play of Words
// Layer:	Web front-end
// File:	procrep.js                           (\_/)
// Func:	Displaying messages during a process (^.^)
//* * ** *** ***** ******** ************* *********************

class ProcessReporter {

	constructor(divId) {
		this.divId = divId;
		this.messages = {};
		this.messageClassName = "processInfo";
	}
	
	getApp() {
		return getGlobalApp();
	}
	
	getDivId() {
		return this.divId;
	}

	getDiv() {
		return document.getElementById(this.getDivId());
	}

	show() {		
		this.getDiv().style.display = "";
	}
	
	hide() {
		this.getDiv().style.display = "none";
	}
	
	generateMessageId() {
		return "msg" + String(Object.keys(this.messages).length);
	}
	
	getMessageClassName() {
		return this.messageClassName;
	}
	
	setMessageClassName(className) {
		this.messageClassName = className;
	}
	
	assembleMessage(content, id) {
		
		let p = document.createElement("p");
		
		p.setAttribute("id", id);
		p.setAttribute("class", this.getMessageClassName());
		p.setAttribute("style", "display:none");
		
		let messageInnerHtml = guarnteeDomObject(content);
		
		p.appendChild(messageInnerHtml);
		
		return p;
	}		
	
	appendMessage(content, _id=undefined) {
		
		let id = useful(_id, this.generateMessageId());
		let messageP = this.assembleMessage(content, id);
		
		this.messages[id] = messageP;
		
		this.getDiv().appendChild(messageP);
		
		return id;
	}
	
	appendMessageFromI18n(stringId, substs=null) {
		
		let app = this.getApp();
		let i18n = app.getI18n();
		let uiLangCode = app.getCurrUiLangCode();
		
		let content = "";
		
		let rawContent = i18n.getText(stringId, uiLangCode);
		
		if(substs) {
			let splitter = new SubstFormalSplitter(rawContent);
			content = splitter.split().substStr(substs);
		}
		else
			content = rawContent;	
		
		return this.appendMessage(content);
	}
	
	showMessage(msgId) {
		this.messages[msgId].style.display = "";
	}
	
	hideMessage(msgId) {
		this.messages.style.display = "none";
	}

}