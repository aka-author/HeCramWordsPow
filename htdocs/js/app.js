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
		this.i18n = new I18n();
		this.i18n.setStringTable(GLOBAL_UIStrings);
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
