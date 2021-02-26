//* * ** *** ***** ******** ************* *********************
// Essential abstract classes
//
//                                                   (\_/)
//                                                   (^.^) 
//* * ** *** ***** ******** ************* *********************

class Bureaucrat {
	
	constructor(chief, id=undefined) {
		
		this.chief = chief;
		
		this.id = id;
		
		this.subordinates = new Array();
		this.subordinatesByIds = new Array();
		
		this.userConfig = null;
		this.i18n = null;
		this.mainPage = null;
		this.game = null;
		this.app = null;
		
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
		
		let id = subordinate.getId()
		
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
	
	getMainPage() {
		return this.getProperty("mainPage");
	}
	
	getGame() {
		return this.getProperty("game");
	}
	
	getApp() {
		return this.getProperty("app");
	}
	
	getSubordinateById(id) {
		return this.subordinatesByIds[id] ? this.subordinatesByIds[id] : null;
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

}