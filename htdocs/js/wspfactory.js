//* * ** *** ***** ******** ************* *********************
// Project: Nakar
// Module:  Play of Words
// Layer:	Web front-end
// File:	wspfactory.js                             (\_/)
// Func:	Transforming workbooks into wordspaces    (^.^) 
//* * ** *** ***** ******** ************* *********************

class WordspaceFactory {
	
	constructor(workbook) {
		
		this.workbook = workbook; 
		console.log("::: ", workbook);
		this.wordspace = new Wordspace(workbook.getId());
		console.log(workbook);
		
		this.langCodes = new Array();
		
		this.metaSheetNames = new Array();
		this.posSheetNames = new Array();
		
		this.classifySheets();
	}

	// Input data, output data

	getWorkbook() {
		return this.workbook;
	}

	getWordspace() {
		return this.wordspace;
	}
	
	// Managing sheets, rows, fields, properties
	
	getSheetNames() {
		return this.getWorkbook().getSheetNames();
	}
	
	getSheet(sheetName) {
		return this.getWorkbook().getSheet(sheetName);
	}
	
	countRows(sheetName) {
		return this.getWorkbook().getSheet(sheetName).countRows();
	}
	
	getLocalFieldName(sheetName, fieldNameBase, langCode=undefined) {
		return this.getSheet(sheetName).getLocalFieldName(fieldNameBase, langCode);
	}
	
	fieldExists(sheetName, fieldName) {
		return this.getWorkbook().fieldExists(sheetName, fieldName);
	}
	
	getFieldValue(sheetName, rowIdx, fieldName) {
		return this.getWorkbook().getFieldValue(sheetName, rowIdx, fieldName);
	}
	
	getPropValue(sheetName, propFieldName, valFieldName, propName, langCode=undefined) {
		return this.getWorkbook().getPropValue(sheetName, propFieldName, 
					valFieldName, propName, langCode);
	}
	
	// Classifying sheets
	
	getMetaSheetName(sheetTypeCode) {
		return this.metaSheetNames[sheetTypeCode];
	}		
	
	getPosSheetNames() {
		return this.posSheetNames;
	}	
	
	detectSheetClass(sheetName) {
						
		if(this.fieldExists(sheetName, "headword")) 
			return "pos";
			
		if(this.fieldExists(sheetName, "sheet")) 
			return "toc";
		
		if(this.fieldExists(sheetName, "field")) 
			return "general";
		
		if(this.fieldExists(sheetName, "lang_code")) 
			return "langs";
			
		if(this.fieldExists(sheetName, "tag")) 
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
			
		let sheetNames = this.getSheetNames();
		
		for(let sheetIdx in sheetNames) 
			this.classifySheet(sheetNames[sheetIdx]);
	}
		
	// Importing data from sheets	
	
	// Common methods
	
	fetchLocalValues(sheetName, rowIdx, valueFieldNameBase=undefined) {
	
		let localValues = new Array();
		
		let langCodes = this.getLangCodes();
				
		for(let langCodeIdx in langCodes) {
			let langCode = langCodes[langCodeIdx];
			let localFieldName = 
				this.getLocalFieldName(sheetName, valueFieldNameBase, langCode);
			localValues[langCode] = 
				this.getFieldValue(sheetName, rowIdx, localFieldName);
		}
		
		return localValues;
	}
	
	importFeatureLocalNames(feature, sheetName, rowIdx, nameFieldNameBase=undefined) {
		let localValues = this.fetchLocalValues(sheetName, rowIdx, nameFieldNameBase);
		for(let langCode in localValues) {
			feature.setName(langCode, localValues[langCode]);
		}
	}
		
	// Languages
	
	getLangCodes() {
		return this.langCodes;
	}
	
	countLangs() {
		return this.getLangCodes().length;
	}
	
	setLangCodes(langCodes) {
		this.langCodes = langCodes;
	}

	getTargetLangCode() {
		return this.getWordspace().getTargetLangCode();
	}

	setTargetLang(langCode) {
		this.getWordspace().setTargetLang(langCode); 
	}		

	isTargetLangCode(langCode) {
		return langCode == this.getTargetLangCode();
	}

	getBaseLangCodes() {
		return this.getWordspace().getBaseLangCodes();
	}
	
	setBaseLangs(langCodes) {
		this.getWordspace().setBaseLangs(langCodes);
	}
	
	getDefaultBaseLangCode() {
		this.getWordspace().getDefaultBaseLangCode();
	}
	
	setDefaultLevelCode(levelCode) {
		this.getWordspace().setDefaultLevelCode(levelCode);
	}
	
	setDefaultBaseLang(langCode) {
		this.getWordspace().setDefaultBaseLang(langCode);
	}
	
	appendLang(lang) {
		this.getWordspace().appendLang(lang);
	}
	
	fetchLangCodes(langsSheetName) {
		
		let langCodes = new Array();
		
		let countRows = this.countRows(langsSheetName);
		for(let rowIdx = 0; rowIdx < countRows; rowIdx++) 
			langCodes.push(this.getFieldValue(langsSheetName, rowIdx, "lang_code"));
		
		return langCodes;
	}
	
	importLang(langsSheetName, rowIdx) {
				
		let currLangCode = this.getFieldValue(langsSheetName, rowIdx, "lang_code");
		let lang = new Lang(currLangCode);
		
		this.importFeatureLocalNames(lang, langsSheetName, rowIdx, "lang");
								
		this.appendLang(lang);
	}
	
	importLangs() {
		let langsSheetName = this.getMetaSheetName("langs");
		this.setLangCodes(this.fetchLangCodes(langsSheetName)); 	
		for(let rowIdx = 0; rowIdx < this.countLangs(); rowIdx++) 
			this.importLang(langsSheetName, rowIdx);
	}
	
	importBaseLangCodes() {
				
		let baseLangCodes = new Array();
		
		let langs = this.getLangCodes();
		for(let langCodeIdx in langs) 
			if(!this.isTargetLangCode(langs[langCodeIdx]))
				baseLangCodes.push(langs[langCodeIdx]);	
			
		this.setBaseLangs(baseLangCodes);
	}
	
	// General properties 
		
	setTitle(title) {
		this.getWordspace().setTitle(title);
	}
	
	setExternalDic(langCode, dicUrlTemplate) {
		this.getWordspace().setExternalDic(langCode, dicUrlTemplate);
	}
	
	importTitle(generalSheetName) {
		this.setTitle(this.getPropValue(generalSheetName, 
				"field", "value", "title"));
	}

	importTargetLangCode(generalSheetName) {
		this.setTargetLang(this.getPropValue(generalSheetName, 
				"field", "value", "target_lang_code"));
	}

	importDefaultBaseLangCode(generalSheetName) {
		this.setDefaultBaseLang(this.getPropValue(generalSheetName, 
					"field", "value", "default_base_lang_code"));	
	}

	importDefaultLevelCode(generalSheetName) {
		this.setDefaultLevelCode(this.getPropValue(generalSheetName, 
					"field", "value", "default_level_code"));	
	}	
		
	importExternalDics(generalSheetName) {
				
		let baseLangCodes = this.getBaseLangCodes();
		for(let langCodeIdx in baseLangCodes) {
			
			let langCode = baseLangCodes[langCodeIdx];	
			
			let dicUrlTemplate = 
					this.getPropValue(generalSheetName, "field", "value", 
				                    "dictionary_url_template", langCode);
			if(dicUrlTemplate)								
				this.setExternalDic(langCode, dicUrlTemplate);	
		}
	}		
		
	importGeneral() {
		
		let generalSheetName = this.getMetaSheetName("general");
		
		this.importTitle(generalSheetName);
		this.importTargetLangCode(generalSheetName);	
		this.importBaseLangCodes();
		this.importDefaultLevelCode(generalSheetName);
		this.importDefaultBaseLangCode(generalSheetName);
		this.importExternalDics(generalSheetName);				
	}	
	
	// Parts of speach
	
	importPartOfSpeach(posSheetName, tocSheetName, rowIdx) {		
		let pos = new PartOfSpeach(posSheetName);
		this.importFeatureLocalNames(pos, tocSheetName, rowIdx, "title");
		this.getWordspace().appendPartOfSpeach(pos);
	}
	
	isPosSheet(sheetName) {
		
		let result = false;
		
		let posSheetNames = this.getPosSheetNames();
		
		for(let nameIdx = 0; nameIdx < posSheetNames.length; nameIdx++)
			if(sheetName == posSheetNames[nameIdx]) {
				result = true;
				break;
			}
		
		return result;
	}
	
	importPartsOfSpeach() {
		
		let tocSheetName = this.getMetaSheetName("toc");
				
		let countRows =  this.getSheet(tocSheetName).countRows();

		for(let rowIdx = 0; rowIdx < countRows; rowIdx++) {
			
			let sheetName = this.getFieldValue(tocSheetName, rowIdx, "sheet");

			if(this.isPosSheet(sheetName)) 
				this.importPartOfSpeach(sheetName, tocSheetName, rowIdx);
		}			
	}	
	
	// Subject domain tags 
	
	importTags() {
				
		let tagsSheetName = this.getMetaSheetName("tags");
				
		let baseLangCodes = this.getBaseLangCodes();
		
		let tagWordings = new Array();
		
		let countRows = this.countRows(tagsSheetName);
				
		for(let rowIdx = 0; rowIdx < countRows; rowIdx++) {
			
			let tag = this.getFieldValue(tagsSheetName, rowIdx, "tag");
			
			tagWordings[tag] = new Array();
			
			for(let baseLangCodeIdx in baseLangCodes) {
				let langCode = baseLangCodes[baseLangCodeIdx];
				tagWordings[tag][langCode] = 
					this.getFieldValue(tagsSheetName, rowIdx, "tag_" + langCode);
			}
		}
		
		this.getWordspace().setSubjectDomainTagWordings(tagWordings);
	}		
		
	// Dictionary entries and lexemes	
		
	importLexemes(dicEntry, sheetName, rowIdx, baseLangCodes) {
		
		let wb = this.getWorkbook();
		
		for(let baseLangIdx in baseLangCodes) {
			
			let baseLangCode = baseLangCodes[baseLangIdx];
			let baseColName = this.getLocalFieldName(sheetName, "", baseLangCode);
			let baseHeadword = wb.getTranslation(sheetName, rowIdx, baseColName);
			let baseLexeme = new Lexeme(baseLangCode, baseHeadword);
			let mnemoPhrase = wb.getMnemoPhrase(sheetName, rowIdx, baseLangCode);
			if(mnemoPhrase)
				baseLexeme.setMnemoPhrase(mnemoPhrase);
			
			dicEntry.appendLexeme(baseLexeme); 
		}
	}
		
	getDefaultLevelCode() {
		return "א";
	}		
		
	importLevelLessonNo(dicEntry, sheetName, rowIdx) {
		
		let wb = this.getWorkbook();
		
		let levelCode = wb.getLevelCode(sheetName, rowIdx);		
		dicEntry.setLevelCode(levelCode ? levelCode : this.getDefaultLevelCode());
		
		let lessonNo = wb.getLessonNo(sheetName, rowIdx);
		dicEntry.setLessonNo(lessonNo);
	}		
		
	importDomainTagCodes(dicEntry, sheetName, rowIdx) {
		
		let wb = this.getWorkbook();
		
		let subjectDomainTags = wb.getSubjectDomainTags(sheetName, rowIdx);
		dicEntry.setSubjectDomainTags(subjectDomainTags);
	}			
		
	appendDicEntry(dicEntry) {
		this.getWordspace().appendDicEntry(dicEntry);
	}
		
	fetchDicEntry(sheetName, rowIdx) {
		
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
				
		let posSheetNames = this.getPosSheetNames();
		
		for(let posSheetNameIdx in posSheetNames) {
			let posSneetName = posSheetNames[posSheetNameIdx];
			let countRows = this.countRows(posSneetName);
			for(let rowIdx = 0; rowIdx < countRows; rowIdx++) {
				let dicEntry = this.fetchDicEntry(posSneetName, rowIdx);
				if(dicEntry.getHeadword(this.getTargetLangCode()))
					this.appendDicEntry(dicEntry);
			}	
		}
	}
	
	// Entire import procedure
	
	importWordspace() {
	
		this.importLangs();
		this.importGeneral();
		this.importPartsOfSpeach();
		this.importTags();
		this.importDicEntries();
		
		console.log(this.wordspace);
		
		return this;
	}
}	