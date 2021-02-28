//* * ** *** ***** ******** ************* *********************
// Establishing a Global Environment
//
//                                               (\_/)
//                                               (^.^) 
//* * ** *** ***** ******** ************* *********************

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

function playGame() {
	GLOBAL_app = new Application();
	GLOBAL_app.run();
}
