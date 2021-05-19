//* * ** *** ***** ******** ************* *********************
// Project: Nakar
// Module:  Play of Words
// Layer:	Web front-end
// File:	utils.js                              (\_/)
// Func:	Configuration of an application       (^.^) 
//* * ** *** ***** ******** ************* *********************


const LANG_TARGET_CODE = "t";

const LANG_BASE_DEFAULT_CODE = "b";


class UserConfig {
	
	constructor() {
		this.params = {"sys" : {}, "ws" : {}};
		this.setDefaults();
	}
	
	setDefaults() {
		this.setLevelCode("default", "all");
		this.setLessonNo("default", "all");
		this.setRiddleLangCode("default", LANG_BASE_DEFAULT_CODE);
		this.setGuessLangCode("default", LANG_TARGET_CODE);
		this.setPosCode("default", "all");
	}
	
	getSystemConfigParam(paramName) {
		return this.params.sys[paramName];
	}
	
	setSystemConfigParam(paramName, paramValue) {
		this.params.sys[paramName] = paramValue;
	}
	
	assembleWordspaceAccessParams(srcId, wspId) {
		return {"srcId" : srcId, "wspId" : wspId};
	}
	
	getSrcId() {
		return this.getSystemConfigParam("srcId");
	}
	
	getWspId() {
		return this.getSystemConfigParam("wspId");
	}
	
	getWordspaceAccessParams() {
		return this.assembleWordspaceAccessParams(
						this.getSrcId(), 
		                this.getWspId());
	}
	
	setWordspaceAccessParams(params) {
		this.setSystemConfigParam("srcId", params.srcId);
		this.setSystemConfigParam("wspId", params.wspId);
	}
	
	getDemoWordspaceAccessParams() {
		return this.assembleWordspaceAccessParams(
						SRC_SIMPLE_GDOC, 
		                "1w9Pq-b-98yrtg9lfIkCGtl1iSjcas4sBH3pFKJ07lhw");
	}
	
	getWordspaceConfigParam(_wordspaceId, paramName) {
		
		let paramValue = undefined;
		
		let wordspaceId = this.params.ws[_wordspaceId] ? _wordspaceId : "default";
				
		if(wordspaceId != "default")
			paramValue = this.params.ws[wordspaceId][paramName] ?
		                 this.params.ws[wordspaceId][paramName] :
		                 this.params.ws["default"][paramName];
		else
			paramValue = this.params.ws["default"][paramName];	
		
		return paramValue;
	}
	
	checkWordspace(wordspaceId) {
		if(!this.params.ws[wordspaceId]) this.params.ws[wordspaceId] = {};
	}
	
	setWordspaceConfigParam(wordspaceId, paramName, paramValue) {
		this.checkWordspace(wordspaceId);
		this.params.ws[wordspaceId][paramName] = paramValue;
	}
	
	getBrowserLangCode() {
		return navigator.language.substring(0,2);
	}
	
	getUiLangCode() {
		return this.getSystemConfigParam("uiLangCode") ? 
		          this.getSystemConfigParam("uiLangCode") : this.getBrowserLangCode();
	}
	
	setUiLangCode(langCode) {
		this.setSystemConfigParam("uiLangCode", langCode);
	}
	
	getLevelCode(wordspaceId=undefined) {
		return this.getWordspaceConfigParam(wordspaceId, "levelCode");
	}
	
	setLevelCode(wordspaceId, levelCode) {
		this.setWordspaceConfigParam(wordspaceId, "levelCode", levelCode);
	}
	
	getLessonNo(wordspaceId=undefined) {
		return this.getWordspaceConfigParam(wordspaceId, "lessonNo");
	}
	
	setLessonNo(wordspaceId, lessonNo) {
		this.setWordspaceConfigParam(wordspaceId, "lessonNo", lessonNo);
	}
	
	getRiddleLangCode(wordspaceId=undefined) {
		return this.getWordspaceConfigParam(wordspaceId, "riddleLangCode"); 
	}
	
	setRiddleLangCode(wordspaceId, langCode) {
		this.setWordspaceConfigParam(wordspaceId, "riddleLangCode", langCode);
	}
	
	getGuessLangCode(wordspaceId=undefined) {
		return this.getWordspaceConfigParam(wordspaceId, "guessLangCode");
	}
	
	setGuessLangCode(wordspaceId, langCode) {
		this.setWordspaceConfigParam(wordspaceId, "guessLangCode", langCode);
	}
	
	getPosCode(wordspaceId=undefined) {
		return this.getWordspaceConfigParam(wordspaceId, "posCode");
	}
	
	setPosCode(wordspaceId, posCode) {
		this.setWordspaceConfigParam(wordspaceId, "posCode", posCode);
	}
	
	assembleJson() {

		console.log("Final JSON: ", JSON.stringify(this.params));
		
		sleep(5000);
		
		delete this.params.ws["default"];
		
		return JSON.stringify(this.params);
	}	
	
	unpackFromJson(paramsJson) {
		
		let parseSuccess = true;
		
		let params = {}
	
		try {
			params = JSON.parse(paramsJson);
		}
		catch(e) {
			parseSuccess = false;
		}			
				
		if(parseSuccess) {
						
			for(let paramName in params.sys) 
				this.setSystemConfigParam(paramName, params.sys[paramName]);
				
			for(let wsId in params.ws) 
				for(let paramName in params.ws[wsId]) 
					this.setWordspaceConfigParam(wsId, paramName, params.ws[wsId][paramName]);
		}
		
		return parseSuccess;
	}
}