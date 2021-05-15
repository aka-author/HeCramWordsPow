//* * ** *** ***** ******** ************* *********************
// Configuration of an application
//
//                                                   (\_/)
//                                                   (^.^) 
//* * ** *** ***** ******** ************* *********************

class UserConfig {
	
	constructor() {
		this.defaultWordspace        = null;
		this.defaultCurrLevelCode    = "all";
		this.defaultCurrLessonNo     = "all";
		this.defaultRiddleLangCode   = navigator.language.substring(0,2);
		this.defaultGuessLangCode    = "he";
		this.defaultPartOfSpeachCode = "all";
		this.defaultUiLangCode       = navigator.language.substring(0,2);
	}
	
	getDefaultCurrWordspace(wordspace=null) {
		return this.defaultCurrWirdspace;
	}
	
	getDefaultCurrLevelCode(wordspace=null) {
		return this.defaultCurrLevelCode;
	}
	
	getDefaultCurrLessonNo(wordspace=null) {
		return this.defaultCurrLessonNo;
	}
	
	getDefaultRiddleLangCode(wordspace=null) {
		return this.defaultRiddleLangCode;
	}
	
	setDefaultRiddleLangCode(langCode) {
		this.defaultRiddleLangCode = langCode;
	}
	
	getDefaultGuessLangCode(wordspace=null) {
		return this.defaultGuessLangCode;
	}
	
	setDefaultGuessLangCode(langCode) {
		this.defaultGuessLangCode = langCode;
	}
	
	getDefaultPartOfSpeachCode() {
		return this.defaultPartOfSpeachCode;
	}
	
	setDefaultPartOfSpeach(partOfSpeachCode) {
		this.defaultPartOfSpeachCode = partOfSpeachCode;
	}
	
	getDefaultUiLangCode(wordspace=null) {
		return this.defaultUiLangCode;
	}
	
	setDefaultUiLangCode(langCode) {
		this.defaultUiLangCode = langCode;
	}
}