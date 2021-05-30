//* * ** *** ***** ******** ************* *********************
// Project: Nakar
// Module:  Play of Words
// Layer:	Web front-end
// File:	bureaucracy.js                            (\_/)
// Func:	Abstract object-to-object interaction     (^.^)
//* * ** *** ***** ******** ************* *********************

const BUR_TYPE_CODE_GENERIC = "generic";


class Bureaucrat {
	
	constructor(chief, id=undefined) {
		
		this.chief = chief;
		
		this.id = id;
		
		this.setType();
		
		this.userConfig = null;
		this.i18n = null;
		this.reporter = null;
		this.mainPage = null;
		this.game = null;
		this.app = null;
		
		this.subordinates = new Array();
		this.subordinatesById = new Array();
		
		if(chief)
			chief.registerSubordinate(this);
	}
	
	getChief() {
		return this.chief ? this.chief : null;
	}
	
	getId() {
		return this.id;
	}
	
	getType() {
		return this.typeCode;
	}
	
	setType(typeCode=undefined) {
		this.typeCode = useful(typeCode, BUR_TYPE_CODE_GENERIC);
	}
	
	registerSubordinate(subordinate) {
		
		let id = subordinate.getId();
		
		let regRec = {"id": id, "subordinate" : subordinate};
		
		this.subordinates.push(regRec);
		
		if(id)
			this.subordinatesById[id] = subordinate;
		
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
	
	countSubordinates() {
		return this.subordinates.length;
	}
	
	getSubordinateByNo(idx) {
		return this.subordinates[idx].subordinate;
	}
	
	getSubordinateById(id) {
		return this.subordinatesById[id] ? 
					this.subordinatesById[id] : 
					null;
	}
	
	isDirectSubordinate(bureaucrat) {
		return bureaucrat.getChief().getId() == this.getId();
	}
	
	getDirectSubordinates() {
		
		let directSubordinates = [];
		
		for(let i = 0; i < this.countSubordinates(); i++) {
			
			let subordinate = this.getSubordinateByNo(i);
			
			if(this.isDirectSubordinate(subordinate))
						directSubordinates.push(subordinate);
		}	
			
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