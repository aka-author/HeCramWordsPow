//* * ** *** ***** ******** ************* *********************
// Configuration of an application
//
//                                                   (\_/)
//                                                   (^.^) 
//* * ** *** ***** ******** ************* *********************

class UserConfig {
	
	constructor() {
		this.defaultSrcLang    = "es";
		this.defaultTargetLang = "he";
		this.defaultUiLang     = "es";
	}
	
	getDefaultSrcLang() {
		return this.defaultSrcLang;
	}
	
	getDefaultTargetLang() {
		return this.defaultTargetLang;
	}
	
	getDefaultUiLang() {
		return this.defaultUiLang;
	}
}