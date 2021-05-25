//* * ** *** ***** ******** ************* *********************
// Project: Nakar
// Module:  Play of Words
// Layer:	Web front-end
// File:	utils.js                              (\_/)
// Func:	Configuration of an application       (^.^) 
//* * ** *** ***** ******** ************* *********************


const CFG_SYSTEM_PARAMS = undefined;
const DEFAULT_WORDSPACE_ID = "default";
const LANG_TARGET_CODE = "t";
const LANG_BASE_DEFAULT_CODE = "b";


class UserConfig {
	
	constructor() {
		this.params = {"sys" : {}, "ws" : {}};
		this.setDefaults();
	}		
	
	peekConfigParam(wordspaceId, paramName) {
	
		let safeParamValue = wordspaceId ? 
					this.params.ws[wordspaceId][paramName] : 
					this.params.sys[paramName];
		
		return safeParamValue;
	}
	
	checkWordspace(wordspaceId) {
		if(!this.params.ws[wordspaceId]) this.params.ws[wordspaceId] = {};
	}
	
	pokeConfigParam(wordspaceId, paramName, safeParamValue) {
				
		if(wordspaceId) {
			this.checkWordspace(wordspaceId);
			this.params.ws[wordspaceId][paramName] = safeParamValue;	
		}
		else
			this.params.sys[paramName] = safeParamValue;
	}
	
	getSystemConfigParam(paramName) {
		return asciiSafeDecode(this.peekConfigParam(CFG_SYSTEM_PARAMS, paramName));
	}
	
	setSystemConfigParam(paramName, paramValue) {
		this.pokeConfigParam(CFG_SYSTEM_PARAMS, paramName, asciiSafeEncode(paramValue));
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
		
		let safeParamValue = undefined;
		
		let wordspaceId = this.params.ws[_wordspaceId] ? 
							_wordspaceId : DEFAULT_WORDSPACE_ID;
		
		let defautValue = this.peekConfigParam(DEFAULT_WORDSPACE_ID, paramName);
				
		if(wordspaceId != DEFAULT_WORDSPACE_ID) {
			let explicitValue = this.peekConfigParam(wordspaceId, paramName);
			safeParamValue = useful(explicitValue, defautValue);
		}				 
		else
			safeParamValue = defautValue;	
				
		return asciiSafeDecode(safeParamValue);
	}
	
	setWordspaceConfigParam(wordspaceId, paramName, paramValue) {
		this.pokeConfigParam(wordspaceId, paramName, asciiSafeEncode(paramValue));
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
		
		delete this.params.ws[DEFAULT_WORDSPACE_ID];
		
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
				this.pokeConfigParam(CFG_SYSTEM_PARAMS, paramName, params.sys[paramName]);
				
			for(let wsId in params.ws) 
				for(let paramName in params.ws[wsId]) 
					this.pokeConfigParam(wsId, paramName, params.ws[wsId][paramName]);
		}
				
		return parseSuccess;
	}
	
	setDefaults() {
		this.setLevelCode(DEFAULT_WORDSPACE_ID, "all");
		this.setLessonNo(DEFAULT_WORDSPACE_ID, "all");
		this.setRiddleLangCode(DEFAULT_WORDSPACE_ID, LANG_BASE_DEFAULT_CODE);
		this.setGuessLangCode(DEFAULT_WORDSPACE_ID, LANG_TARGET_CODE);
		this.setPosCode(DEFAULT_WORDSPACE_ID, "all");
	}
}
