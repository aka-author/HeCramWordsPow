//* * ** *** ***** ******** ************* *********************
// Configuration of an application
//
//                                                   (\_/)
//                                                   (^.^) 
//* * ** *** ***** ******** ************* *********************

class UserConfig {
	
	constructor() {
		this.defaultWordspace      = null;
		this.defaultCurrLevelNo    = "alef";
		this.defaultCurrLessonNo   = "all";
		this.defaultRiddleLangCode = "en";
		this.defaultGuessLangCode  = "he";
		this.defaultUiLangCode     = "en";
	}
	
	getDefaultCurrWordspace(wordspace=null) {
		return this.defaultCurrWirdspace;
	}
	
	getDefaultCurrLevelNo(wordspace=null) {
		return this.defaultCurrLevelNo;
	}
	
	getDefaultCurrLessonNo(wordspace=null) {
		return this.defaultCurrLessonNo;
	}
	
	getDefaultRiddleLangCode(wordspace=null) {
		return this.defaultRiddleLangCode;
	}
	
	getDefaultGuessLangCode(wordspace=null) {
		return this.defaultGuessLangCode;
	}
	
	getDefaultUiLangCode(wordspace=null) {
		return this.defaultUiLangCode;
	}
}