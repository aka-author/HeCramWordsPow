//* * ** *** ***** ******** ************* *********************
// Establishing a Global Environment
//
//                                               (\_/)
//                                               (^.^) 
//* * ** *** ***** ******** ************* *********************

class Application {
	
	constructor() {		
		this.i18n = new I18n();
		this.i18n.setStringTable(GLOBAL_UIStrings);
		this.game = new Game();
		this.mainPage = new MainPage(this.game, this.i18n);
	}
}



//
// Playing a game
//

var GLOBAL_app = null;

function playGame() {
	GLOBAL_app = new Application();
}
