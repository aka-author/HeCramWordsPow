//* * ** *** ***** ******** ************* *********************
// Establishing a Global Environment
//
//                                               (\_/)
//                                               (^.^) 
//* * ** *** ***** ******** ************* *********************

class Application {
	
	constructor() {		
		this.game = new Game();
		this.mainPage = new MainPage(this.game);
	}
}



//
// Playing a game
//

var GLOBAL_app = null;

function playGame() {
	GLOBAL_app = new Application();
}
