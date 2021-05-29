//* * ** *** ***** ******** ************* *********************
// Project: Nakar
// Module:  Play of Words
// Layer:	Web front-end
// File:	bureaucracy.js                            (\_/)
// Func:	Abstract object-to-object interaction     (^.^)
//* * ** *** ***** ******** ************* *********************

class Bureaucrat {
	
	constructor(chief, id=undefined) {
		
		this.chief = chief;
		
		this.id = id;
		
		this.userConfig = null;
		this.i18n = null;
		this.reporter = null;
		this.mainPage = null;
		this.game = null;
		this.app = null;
		
		this.subordinates = new Array();
		this.subordinatesByIds = new Array();
		
		if(chief)
			chief.registerSubordinate(this);
	}
	
	getChief() {
		return this.chief ? this.chief : null;
	}
	
	getId() {
		return this.id;
	}
	
	registerSubordinate(subordinate) {
		
		let id = subordinate.getId();
		
		let regRec = {"id": id, "subordinate" : subordinate};
		
		this.subordinates.push(regRec);
		
		if(id)
			this.subordinatesByIds[id] = subordinate;
		
		let chief = this.getChief();
		if(chief)
			chief.registerSubordinate(subordinate);
	}
	
	getProperty(propName) {
		return this[propName] ? this[propName] :
					(this.chief ? this.chief.getProperty(propName) : null);
	}
	
	getUserConfig() {
		return this.getProperty("userConfig");
	}
	
	getI18n() {
		return this.getProperty("i18n");
	}
	
	getTargetLangCode() {
		return this.targetLangCode ? this.targetLangCode : 
									 this.getChief().getTargetLangCode();
	}
	
	getWordspace() {
		return this.ws ? this.ws : this.getChief().getWordspace();
	}
	
	getUiLangCode() {
		return this.currUiLangCode ? this.currUiLangCode :
                          		     this.getChief().getUiLangCode();
	}
	
	getMainPage() {
		return this.mainPage ? this.mainPage : this.getChief().getMainPage();
	}
	
	getCurrBaseLangCode() {
		return this.currBaseLangCode ? this.currBaseLangCode : 
									   this.getChief().getCurrBaseLangCode();
	}
	
	setProcessReporter(processReporter) {
		this.reporter = processReporter;
	}
	
	getGame() {
		return this.game ? this.game : this.getChief().getGame();
	}
	
	getApp() {
		return this.app ? this.app : this.getChief().getApp();
	}
	
	getSubordinateById(id) {
		return this.subordinatesByIds[id] ? 
					this.subordinatesByIds[id] : 
					null;
	}
	
	isDirectSubordinate(bureaucrat) {
		return bureaucrat.getChief().getId() == this.getId();
	}
	
	getDirectSubordinates() {
		
		let directSubordinates = [];
		
		for(let subIdx in this.subordinates) 
			if(this.isDirectSubordinate(this.subordinates[subIdx].subordinate))
				directSubordinates.push(this.subordinates[subIdx].subordinate);
			
		return directSubordinates;	
	}
	
	doMyself(methodName, argsObject) {
		return argsObject ?
					this[methodName](argsObject) :
					this[methodName]();
	}
	
	lower(id, methodName, argsObject=null) {
		
		let subordinate = this.getSubordinateById(id);
		
		return subordinate ? 
					subordinate.process(id, methodName, argsObject) : 
					null;
	}
	
	escalate(id, methodName, argsObject=null) {
		
		let chief = this.getChief();
		
		return chief ? 
					chief.process(id, methodName, argsObject) : 
					null;
	}
	
	process(id, methodName, argsObject=null) {
		
		let result = null;
		
		if(this.getId() == id)
			result = this.doMyself(methodName, argsObject);
		else {
			result = this.lower(id, methodName, argsObject);
			if(result === null)
				result = this.escalate(id, methodName, argsObject);
		}
		
		return result;
	}
	
	checkUpdateAgenda(agenda, stuff) {
		return true;
	}
	
	createUpdateStuff() {
		return {};
	}
	
	startUpdate(agenda, stuff) {
	}
	
	finishUpdate(agenda, stuff) {	
	}

	update(agenda, _stuff=null) {
		
		let stuff = useful(_stuff, this.createUpdateStuff());
		
		if(this.checkUpdateAgenda(agenda, stuff)) {
		
			this.startUpdate(agenda, stuff);

			let directSubordinates = this.getDirectSubordinates();
			
			for(let subIdx in directSubordinates)
				directSubordinates[subIdx].update(agenda, stuff);

			this.finishUpdate(agenda, stuff);
		}
	}
	
	getProcessReporter() {
		return this.reporter ? this.reporter : 
		                       this.getChief().getProcessReporter();
	}
	
	reportFromI18n(strId, substs=null) {
		let reporter = this.getProcessReporter();		
		let msgId = reporter.appendMessageFromI18n(strId, substs);
		reporter.showMessage(msgId);
		return msgId;
	}
}