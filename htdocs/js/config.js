//* * ** *** ***** ******** ************* *********************
// Configuration of an application
//
//                                                   (\_/)
//                                                   (^.^) 
//* * ** *** ***** ******** ************* *********************

class UserConfig {
	
	constructor() {
		this.defaultWordspace      = null;
		this.defaultLevelNo        = "alef";
		this.defaultLessonNo       = "all";
		this.defaultTargetLangCode = "he";
		this.defaultBaseLangCode   = "en";
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
	
	getDefaultTargetLangCode(wordspace=null) {
		return this.defaultTargetLangCode;
	}
	
	getDefaultBaseLangCode(wordspace=null) {
		return this.defaultBaseLangCode;
	}
	
	getDefaultUiLangCode(wordspace=null) {
		return this.defaultUiLangCode;
	}
}