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
		
		this.i18n = new I18n();
		this.i18n.setStringTable(GLOBAL_UIStrings);
		
		this.processReporter = new ProcessReporter("processReporterDiv");
	}
	
	getLocalUserConfig() {
		return this.userConfig;
	}
	
	saveLocalUserConfig() {
		let configJson = this.getUserConfig().assembleJson();
		document.cookie = configJson;
	}
	
	loadLocalUserConfig() {
		
		let configJson = document.cookie;
		
		console.log("config: ", configJson);
		
		this.getUserConfig().unpackFromJson(configJson);
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
		return this.getBaseServUrl() + "/" + servUrlPath;
	}
	
	getGdocsServUrl() {
		return this.assembleServUrl("wordspace");
	}
	
	getApp() {
		return this;
	}
	
	getI18n() {
		return this.i18n;
	}
	
	setI18nText(id, langCode, wording) {
		this.getI18n().setText(id, langCode, wording);
	}
	
	getPageUrlParams() {
		let params = parseUrlParams(String(window.location));
		return camelizeParams(params);
	}
	
	validateSrcId(srcId) {
		return srcId == SRC_SIMPLE_GDOC;
	}
	
	validateWordspaceAccessParams(params) {
		return this.validateSrcId(params.srcId) && Boolean(params.wspId); 
	}
	
	getWordspaceAccessParams() {
		
		let config = this.getUserConfig();
		
		let params = this.getPageUrlParams(); 
				
		if(!this.validateWordspaceAccessParams(params)) {
		
			params = config.getWordspaceAccessParams();
			
			if(!this.validateWordspaceAccessParams(params))
				params = config.getDemoWordspaceAccessParams();
		}
		else
			config.setWordspaceAccessParams(params);
		
		return params;
	}
	
	setWordspaceAccessParams(params) {
		this.getConfig().setWordspaceAccessParams(params);
	}
	
	getTargetLangCode() {
		return this.getWordspace().getTargetLangCode();
	}
	
	getWordspace() {
		return this.getGame().getWordspace();
	}
	
	getCurrBaseLangCode() {
		return this.getGame().getCurrBaseLangCode();
	}
	
	getGame() {
		return this.game;
	}
	
	getCurrUiLangCode() {
	
		let mainPage = this.getMainPage();
	
		return mainPage ? mainPage.getCurrUiLangCode() : 
						  this.getLocalUserConfig().getUiLangCode();  	
	}
	
	getMainPage() {
		return this.mainPage;
	}
	
	
	getProcessReporter() {
		return this.processReporter;
	}
	
	run() {	
	
		this.loadLocalUserConfig();
		
		this.game = new Game(this);
		this.game.getReady();
		//setTimeout(waitForWorkbookGotLoaded, 1000);
		
		//this.game.play();
	}
	
	setupMainPage() {
		this.mainPage = new MainPage(this);
	}
	
	quit() {
		this.saveLocalUserConfig();
	}
	
}



//
// Playing the game
//

var GLOBAL_app = null;


function getGlobalApp() {
	return GLOBAL_app;
}	


function proceed() {

	console.log("We proceed");

	let game = getGlobalApp().getGame();
	game.finishSetup();
	getGlobalApp().setupMainPage();
	game.play();

	
	/*
	if(game.isReady()) { 
		console.log("1111111");
		game.finishSetup();
		game.play();
	}	
	else
		setTimeout(waitForWorkbookGotLoaded, 1000);
	*/
}


function playGame() {
	
	GLOBAL_app = new Application();
	
	let reporter = GLOBAL_app.getProcessReporter();		
	let msgId = reporter.appendMessageFromI18n("loadingWordspace");
	reporter.showMessage(msgId);
	
	setTimeout(function() {GLOBAL_app.run();}, 1000);	
}


function quitGame() {
	GLOBAL_app.quit();
}

