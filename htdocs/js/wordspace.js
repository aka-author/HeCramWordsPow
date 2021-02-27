//* * ** *** ***** ******** ************* *********************
// Managing a Multilingual Dictionary
//
//                                                   (\_/)
//                                                   (^.^) 
//* * ** *** ***** ******** ************* *********************

// Parsing headwords

function isHeadwordBaseTerminator(chr) {
	const headwordBaseTerminators = ",(";
	return headwordBaseTerminators.includes(chr);
}


function headwordBase(headword) {
	
	let mainPart = "";
	
	if(isHebrewTextInside(headword)) 
		for(let i = 0; i < headword.length; i++)
			mainPart += isHebrewLetter(headword[i]) ? headword[i] : "";
	else	
		for(let i = 0; i < headword.length; i++)
			if(!isHeadwordBaseTerminator(headword[i]))
				mainPart += headword[i];
			else
				break;
			
	return mainPart.trim();
}


// Dictionary Google spreadsheet
class WsSpreadsheet extends GoogleSpreadsheetSimple {
	
	isValidDataRow(row, fields) {
		return isHebrewTextInside(row["spelling"]);
	}	
	
	getHeadword(sheetName, rowIdx) {
		return this.getFieldValue(sheetName, rowIdx, "spelling");
	}
	
	getRussian(sheetName, rowIdx) {
		return this.getFieldValue(sheetName, rowIdx, "russian");
	}
	
	getTranslation(sheetName, rowIdx, langCode) {
		return this.getFieldValue(sheetName, rowIdx, langCode);
	}
	
	getLevelNo(sheetName, rowIdx) {
		return this.getFieldValue(sheetName, rowIdx, "level");
	}	
	
	getLessonNo(sheetName, rowIdx) {
		return this.getFieldValue(sheetName, rowIdx, "lesson");
	}	
	
	getMnemoPhrase(sheetName, rowIdx, langCode) {
		let mnemoColName = "mnemo_" + langCode;
		return this.getFieldValue(sheetName, rowIdx, mnemoColName);
	}
}


// A word with associated grammer data
class WordInfo {
	
	constructor(langCode, headword) {
		this.langCode = langCode;
		this.headword = headword;
		this.mnemoPhrase = undefined;
	}
	
	getLangCode() {
		return this.langCode;
	}
	
	getHeadword() {
		return this.headword;
	}
	
	getMnemoPhrase() {
		return this.mnemoPhrase;	
	}	
	
	setMnemoPhrase(mnemoPhrase) {
		this.mnemoPhrase = mnemoPhrase;
	}
}


// A set of words with the same meaning in different languages
class DicEntry {
	
	constructor() {
		this.wordInfos = new Array();
		this.levelNo = undefined;
		this.lessonNo = undefined;
	}
	
	appendWordInfo(wordInfo) {
		let langCode = wordInfo.getLangCode();
		this.wordInfos[langCode] = wordInfo;
	}
	
	getHeadword(langCode) {
		return this.wordInfos[langCode].getHeadword();	
	}
	
	getLevelNo() {
		return this.levelNo;
	}
	
	setLevelNo(levelNo) {
		this.levelNo = levelNo;
	}
	
	getLessonNo() {
		return this.lessonNo;
	}
	
	setLessonNo(lessonNo) {
		this.lessonNo = lessonNo;
	}	

	getMnemoPhrase(langCode) {
		return this.wordInfos[langCode].getMnemoPhrase();	
	}	
	
	setMnemoPhrase(langCode, mnemoPhrase) {
		if(this.wordInfos[langCode])
			this.wordInfos[langCode].setMnemoPprase(mnemoPhrase);
	}	
}


class Wordspace {
	
	constructor() {
		this.langIndices = new Array();
		this.lessonIndex = new Array();
	}
	
	checkLangIndex(langCode) {
		if(!this.langIndices[langCode]) 
			this.langIndices[langCode] = new Array();
	}
	
	checkLessonIndex(lessonNo) {
		if(!this.lessonIndex[lessonNo])
			this.lessonIndex[lessonNo] = new Array();
	}
	
	appendDicEntry2LangIndex(langCode, dicEntry) {
		this.checkLangIndex(langCode);
		this.langIndices[langCode][dicEntry.getHeadword(langCode)] = dicEntry;
	}
	
	appendDicEntry(dicEntry) {
		
		for(let langCode in dicEntry.wordInfos)  
			this.appendDicEntry2LangIndex(langCode, dicEntry);	
		
		let lessonNo = dicEntry.getLessonNo();
		if(lessonNo) {
			this.checkLessonIndex(lessonNo);
			this.lessonIndex[lessonNo].push(dicEntry);
		}
	}
		
	translateHeadword(srcLangCode, srcHeadword, targetLangCode) {
		var translations = new Array();
		translations[0] = this.langIndices[srcLangCode][srcHeadword].getHeadword(targetLangCode);
		return translations;
	}
	
	getRandomEntry(langCode, lessonNo="all") {
			
		let index = (lessonNo == "all") || (!lessonNo) ? 
				this.langIndices["he"] :
			 	this.lessonIndex[lessonNo];
						
		let dicEntry = index[getRandomKey(index)];		
			
		return dicEntry;		
	}
	
	compareLessonNumbers(lessonNo1, lessonNo2) {
		return parseInt(lessonNo2) - parseInt(lessonNo1);
	}
	
	getLessons() {
		return Object.keys(this.lessonIndex).sort(this.compareLessonNumbers);
	}
	
}
