//* * ** *** ***** ******** ************* *********************
// Establishing a Global Environment
//
//                                               (\_/)
//                                               (^.^) 
//* * ** *** ***** ******** ************* *********************

class Application extends Bureaucrat {
	
	constructor() {

		super(null, "APP");
		
		this.userConfig = new UserConfig();
	}
	
	getUserConfig() {
		return this.userConfig;
	}
	
	run() {
		this.i18n = new I18n();
		this.i18n.setStringTable(GLOBAL_UIStrings);
		this.game = new Game(this);
		this.mainPage = new MainPage(this);
		this.game.play();
	}
}



//
// Playing a game
//

var GLOBAL_app = null;

function playGame() {
	GLOBAL_app = new Application();
	GLOBAL_app.run();
}
