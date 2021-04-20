//* * ** *** ***** ******** ************* *********************
// Project: Nakar
// Module:  Play of Words
// Layer:	Web front-end
// File:	app.js                                (\_/)
// Func:	Establishing a global environment     (^.^) 
//* * ** *** ***** ******** ************* *********************

//
// Handling application errors
// 

// Total success
const ERR_OK = 0; 

// An object is not initialized as expected
const ERR_OBJECT_IMMATURE = 1; 

// Authorization failed or is missing
const ERR_AUTH_FAILURE = 2;

// Required data is missing or not available
const ERR_ACCESS_FAILURE = 3;

// Failed to parse some raw data
const ERR_PARSE_FAILURE = 4;

// Technically data is correct but inconsistent
const ERR_DATA_INCONSISTENT = 5;


class AppError {

	constructor(code=ERR_OK, info=null) {
		this.code = code;
		this.info = info;
	}

	getCode() {
		return this.code;
	}
	
	setCode(code) {
		this.code = code;
	}
	
	getInfo() {
		return this.info;
	}
	
	setInfo(info) {
		this.info = info;
	}
}


//
// Application class
//

class Application extends Bureaucrat {
	
	constructor() {

		super(null, "APP");
		
		this.userConfig = new UserConfig();
		let userLangCode = this.detectUserLang();
		this.userConfig.setDefaultRiddleLangCode(userLangCode);
		this.userConfig.setDefaultUiLangCode(userLangCode);
		this.i18n = new I18n();
		this.i18n.setStringTable(GLOBAL_UIStrings);
	}
	
	detectUserLang() {
		let tag = "userlang="
		let langCode = "en";
		let loc = String(location);
		if(loc.includes(tag)) 
			langCode = loc.substring(loc.indexOf(tag)+tag.length)
		else 
			langCode = navigator.language.substring(0,2);
		return langCode;
	}
	
	getBaseServUrl() {
		return "http://cramwords.com/cgi-bin";
	}
	
	assembleServUrl(servUrlPath) {
		return this.getBaseServUrl() + "/" + "servUrlPath";
	}
	
	getGdocsServUrl() {
		return this.assembleServUrl("wordspace");
	}
	
	run() {	
		this.game = new Game(this);
		this.mainPage = new MainPage(this);
		this.game.play();
	}
}



//
// Playing the game
//

var GLOBAL_app = null;


function getGlobalApp() {
	return GLOBAL_app;
}	


function playGame() {
	GLOBAL_app = new Application();
	GLOBAL_app.run();
}
