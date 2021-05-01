//* * ** *** ***** ******** ************* *********************
// Project: Nakar
// Module:  Play of Words
// Layer:	Web front-end
// File:	wspsheets.js                           (\_/)
// Func:	Creating wordspaces from workbooks     (^.^) 
//* * ** *** ***** ******** ************* *********************

class WordspaceFactory {
	
	constructor(workbook) {
		
		this.workbook = workbook; 
		
		this.sheetNames = workbook.getSheetNames();
		this.classifySheets();
		
		this.baseLangCodes = new Array();
		
		this.wordspace = new Wordspace();
	}

	getWorkbook() {
		return this.workbook;
	}

	getWordspace() {
		return this.wordspace;
	}

	getLangCodes() {
		return this.langCodes;
	}

	getTargetLangCode() {
		return this.targetLangCode;
	}

	setTargetLangCode(langCode) {
		this.targetLangCode = langCode; 
	}		

	isTargetLangCode(langCode) {
		return langCode == this.getTargetLangCode();
	}

	getBaseLangCodes() {
		return this.baseLangCodes;
	}
	
	setBaseLangCodes(langCodes) {
		this.baseLangCodes = langCodes;
	}
	
	getSheetNames() {
		return this.sheetNames;
	}
	
	getMetaSheetName(sheetTypeCode) {
		return this.metaSheetNames[sheetTypeCode];
	}		
	
	getPosSheetNames() {
		return this.posSheetNames;
	}	
	
	detectSheetClass(sheetName) {
		
		let wb = this.getWorkbook();
				
		if(wb.fieldExists(sheetName, "headword")) 
			return "pos";
			
		if(wb.fieldExists(sheetName, "sheet")) 
			return "toc";
		
		if(wb.fieldExists(sheetName, "field")) 
			return "general";
		
		if(wb.fieldExists(sheetName, "lang_code")) 
			return "langs";
			
		if(wb.fieldExists(sheetName, "tag")) 
			return "tags";
		
		return undefined;
	}
		
	classifySheet(sheetName) {
		
		let sheetClassCode = this.detectSheetClass(sheetName);
		
		if(sheetClassCode) {
			
			if(sheetClassCode == "pos")
				this.posSheetNames.push(sheetName);
			else
				this.metaSheetNames[sheetClassCode] = sheetName;
		}
	}		
		
	classifySheets() {
			
		this.metaSheetNames = new Array();
		this.posSheetNames = new Array();	
			
		let sheetNames = this.getSheetNames();
		
		for(let sheetIdx in this.sheetNames) 
			this.classifySheet(sheetNames[sheetIdx]);
	}
		
	importTitle(generalSheetName) {
		
		let wb = this.getWorkbook();
		let ws = this.getWordspace();
		
		this.title = 
			wb.getPropValue(generalSheetName, "field", "value", "title");
		
		ws.setTitle(this.title);
	}

	importTargetLangCode(generalSheetName) {
		
		let wb = this.getWorkbook();
		let ws = this.getWordspace();
		
		this.targetLangCode = 
			wb.getPropValue(generalSheetName, "field", "value", "target_lang_code");	
		
		ws.setTargetLang(this.targetLangCode);
	}

	importBaseLangCodes() {
		
		let ws = this.getWordspace();
		
		let baseLangCodes = new Array();
		
		let langs = this.getLangCodes();
		for(let langCodeIdx in langs) 
			if(!this.isTargetLangCode(langs[langCodeIdx]))
				baseLangCodes.push(langs[langCodeIdx]);	
			
		this.setBaseLangCodes(baseLangCodes);
		ws.setBaseLangCodes(baseLangCodes);	
	}

	importDefaultBaseLangCode(generalSheetName) {
		
		let wb = this.getWorkbook();
		let ws = this.getWordspace();
		
		this.defaultBaseLangCode = 
			wb.getPropValue(generalSheetName, "field", "value", "default_base_lang_code");	
		
		ws.setDefaultBaseLang(this.defaultBaseLangCode);
	}	
		
	importExternalDics(generalSheetName) {
		
		let wb = this.getWorkbook();
		let ws = this.getWordspace();
		
		let baseLangCodes = this.getBaseLangCodes();
		for(let langCodeIdx in baseLangCodes) {
			
			let langCode = baseLangCodes[langCodeIdx];	
			
			let dicUrlTemplate = 
					wb.getPropValue(generalSheetName, "field", "value", 
				                    "dictionary_url_template", langCode);
			if(dicUrlTemplate)								
				ws.setExternalDic(langCode, dicUrlTemplate);				
		}
	}		
		
	importGeneral() {
		
		let generalSheetName = this.getMetaSheetName("general");
		
		this.importTitle(generalSheetName);
		this.importTargetLangCode(generalSheetName);	
		this.importBaseLangCodes();
		this.importDefaultBaseLangCode(generalSheetName);
		this.importExternalDics(generalSheetName);				
	}		
		
	importPartsOfSpeach() {
	}
	
	fetchLangCodes(langsSheetName) {
		
		let langCodes = new Array();
		
		let wb = this.getWorkbook();

		let countRows = wb.countRows(langsSheetName);
		for(let rowIdx = 0; rowIdx < countRows; rowIdx++) 
			langCodes.push(wb.getFieldValue(langsSheetName, rowIdx, "lang_code"));
		
		return langCodes;
	}
	
	assembleLangFieldName(langCode) {
		return "lang_" + langCode;
	}
	
	importLang(langsSheetName, rowIdx) {
		
		let wb = this.getWorkbook();
		let ws = this.getWordspace();
		
		let currLangCode = wb.getFieldValue(langsSheetName, rowIdx, "lang_code");
		let lang = new Lang(currLangCode);
		
		for(let langCodeIdx in this.langCodes) {
			let langCode = this.langCodes[langCodeIdx];
			let langFieldName = this.assembleLangFieldName(langCode);
			let langName = wb.getFieldValue(langsSheetName, rowIdx, langFieldName);
			lang.setName(langCode, langName);
		}
								
		ws.appendLang(lang);
	}
	
	importLangs() {
		let langsSheetName = this.getMetaSheetName("langs");
		this.langCodes = this.fetchLangCodes(langsSheetName);
		let countLangs = this.langCodes.length; 	
		for(let rowIdx = 0; rowIdx < countLangs; rowIdx++) 
			this.importLang(langsSheetName, rowIdx);
	}
	
	importTags() {
		
		let wb = this.getWorkbook();
		let ws = this.getWordspace();
		
		let tagsSheetName = this.getMetaSheetName("tags");
		
		let baseLangCodes = this.getBaseLangCodes();
		
		let tagWordings = new Array();
		
		let countRows = wb.countRows(tagsSheetName);
		
		for(let rowIdx = 0; rowIdx < countRows; rowIdx++) {
			
			let tag = wb.getFieldValue(tagsSheetName, rowIdx, "tag");
			
			tagWordings[tag] = new Array();
			
			for(let baseLangCodeIdx in baseLangCodes) {
				let langCode = baseLangCodes[baseLangCodeIdx];
				tagWordings[tag][langCode] = 
					wb.getFieldValue(tagsSheetName, rowIdx, "tag_" + langCode);
			}
		}
		
		ws.setSubjectDomainTagWordings(tagWordings);
	}		
		
	importLexemes(dicEntry, sheetName, rowIdx, baseLangCodes) {
		
		let wb = this.getWorkbook();
		
		for(let baseLangIdx in baseLangCodes) {
			let baseLangCode = baseLangCodes[baseLangIdx];
			let baseColName = wb.getLocalFieldName(sheetName, "", baseLangCode);
			let baseHeadword = wb.getTranslation(sheetName, rowIdx, baseColName);
			
			let baseLexeme = new Lexeme(baseLangCode, baseHeadword);
			
			let mnemoPhrase = wb.getMnemoPhrase(sheetName, rowIdx, baseLangCode);
			if(mnemoPhrase)
				baseLexeme.setMnemoPhrase(mnemoPhrase);
			
			dicEntry.appendLexeme(baseLexeme); 
		}
	}
		
	importLevelLessonNo(dicEntry, sheetName, rowIdx) {
		
		let wb = this.getWorkbook();
		
		let levelNo = wb.getLevelNo(sheetName, rowIdx);				
		dicEntry.setLevelNo(levelNo);
		
		let lessonNo = wb.getLessonNo(sheetName, rowIdx);
		dicEntry.setLessonNo(lessonNo);
	}		
		
	importDomainTagCodes(dicEntry, sheetName, rowIdx) {
		
		let wb = this.getWorkbook();
		
		let subjectDomainTags = wb.getSubjectDomainTags(sheetName, rowIdx);
		dicEntry.setSubjectDomainTags(subjectDomainTags);
	}			
		
	importDicEntry(sheetName, rowIdx) {
		
		let dicEntry = new DicEntry();
		
		let wb = this.getWorkbook();
		let targetLangCode = this.getTargetLangCode();
		let baseLangCodes = this.getBaseLangCodes();
					
		let targetHeadword = wb.getHeadword(sheetName, rowIdx);
		let targetLexeme = new Lexeme(targetLangCode, targetHeadword);
		targetLexeme.setPartOfSpeach(sheetName);
		
		dicEntry.appendLexeme(targetLexeme);
		
		this.importLexemes(dicEntry, sheetName, rowIdx, baseLangCodes);
		this.importLevelLessonNo(dicEntry, sheetName, rowIdx);	
		this.importDomainTagCodes(dicEntry, sheetName, rowIdx);				
		
		return dicEntry;
	}
	
	importDicEntries() {
		
		let wb = this.getWorkbook();
		let ws = this.getWordspace();
		
		let posSheetNames = this.getPosSheetNames();
		
		for(let posSheetNameIdx in posSheetNames) {
			let posSneetName = posSheetNames[posSheetNameIdx];
			let countRows = wb.countRows(posSneetName);
			for(let rowIdx = 0; rowIdx < countRows; rowIdx++) {
				let dicEntry = this.importDicEntry(posSneetName, rowIdx);
				ws.appendDicEntry(dicEntry);
			}	
		}
	}
	
	importWordspace() {
	
		this.importLangs();
		this.importGeneral();
		this.importPartsOfSpeach();
		this.importTags();
		this.importDicEntries();
	}
}	