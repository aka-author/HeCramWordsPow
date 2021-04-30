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
		
		this.wordspace = new Wordspace();
	}

	getWorkbook() {
		return this.workbook;
	}

	getWordspace() {
		return this.wordspace;
	}

	getTargetLangCode() {
		return this.targetLangCode;
	}

	setTargetLangCode(langCode) {
		this.targetLangCode = langCode; 
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
		
	importGeneral() {
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
	
	importLang(langsSheetName, rowIdx) {
		
		let wb = this.getWorkbook();
		let ws = this.getWordspace();
		
		let langCode = wb.getFieldValue(langsSheetName, rowIdx, "lang_code");
		
		let lang = new Lang(langCode);
		
		for(let langCodeIdx in this.langCodes) {
			let crossLangCode = this.langCodes[langCodeIdx];
			let crossLangFieldName = "lang_" + crossLangCode;
			let crossLangName = 
				wb.getFieldValue(langsSheetName, rowIdx, crossLangFieldName);
			lang.setName(crossLangCode, crossLangName);
		}
				
		ws.appendLang(lang);
	}
	
	importLangs() {
		
		let wb = this.getWorkbook();
		let ws = this.getWordspace();
		
		let langsSheetName = this.getMetaSheetName("langs");
		
		this.langCodes = this.fetchLangCodes(langsSheetName);
		
		let countLangs = this.langCodes.length; 	
		
		for(let rowIdx = 0; rowIdx < countLangs; rowIdx++)
			this.importLang(langsSheetName, rowIdx);
		
		console.log(ws.langs);
		
		//this.targetLangCode = "he";
		//this.baseLangCodes = ["en", "es", "pt", "ru"];
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
		
		console.log(tagWordings);
		
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
	
		this.importGeneral();
		this.importPartsOfSpeach();
		this.importLangs();
		this.importTags();
		this.importDicEntries();
	}
}	