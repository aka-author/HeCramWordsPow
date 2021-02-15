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
class DicSpreadsheet extends GoogleSpreadsheetSimple {
	
	isValidDataRow(row, fields) {
		return isHebrewTextInside(row["spelling"]);
	}	
	
	getSpelling(sheetName, rowIdx) {
		return this.getFieldValue(sheetName, rowIdx, "spelling");
	}
	
	getRussian(sheetName, rowIdx) {
		return this.getFieldValue(sheetName, rowIdx, "russian");
	}
	
	getLesson(sheetName, rowIdx) {
		return this.getFieldValue(sheetName, rowIdx, "lesson");
	}	
	
	getMnemoPoemRu(sheetName, rowIdx) {
		return this.getFieldValue(sheetName, rowIdx, "mnemo_ru");
	}
}


// A word with associated grammer data
class DicWordInfo {
	
	constructor(lang, headword) {
		this.lang = lang;
		this.headword = headword;
		this.mnemoPoem = undefined;
	}
	
	getLang() {
		return this.lang;
	}
	
	getHeadword() {
		return this.headword;
	}
	
	getMnemoPoem() {
		return this.mnemoPoem;	
	}	
	
	setMnemoPoem(mnemoPoem) {
		this.mnemoPoem = mnemoPoem;
	}
}


// A set of words with the same meaning in different languages
class DicEntry {
	
	constructor() {
		this.dicWordInfos = new Array();
		this.lesson = undefined;
	}
	
	addWordInfo(dicWordInfo) {
		let lang = dicWordInfo.getLang();
		this.dicWordInfos[lang] = dicWordInfo;
	}
	
	getHeadword(lang) {
		return this.dicWordInfos[lang].getHeadword();	
	}
		
	getLesson() {
		return this.lesson;
	}
	
	setLesson(lesson) {
		this.lesson = lesson;
	}	

	getMnemoPoem(lang) {
		return this.dicWordInfos[lang].getMnemoPoem();	
	}	
	
	setMnemoPoem(lang, mnemoPoem) {
		this.dicWordInfos[lang].setMnemoPoem(mnemoPoem);
	}	
}


// A dictionary
class Dictionary {
	
	constructor() {
		this.langIndices = new Array();
		this.lessonIndex = new Array();
	}
	
	checkLangIndex(lang) {
		if(!this.langIndices[lang]) 
			this.langIndices[lang] = new Array();
	}
	
	checkLessonIndex(lesson) {
		if(!this.lessonIndex[lesson])
			this.lessonIndex[lesson] = new Array();
	}
	
	addDicEntry2LangIndex(lang, dicEntry) {
		this.checkLangIndex(lang);
		this.langIndices[lang][dicEntry.getHeadword(lang)] = dicEntry;
	}
	
	addDicEntry(dicEntry) {
		
		for(var lang in dicEntry.dicWordInfos)  
			this.addDicEntry2LangIndex(lang, dicEntry);	
		
		let lesson = dicEntry.getLesson();
		if(lesson) {
			this.checkLessonIndex(lesson);
			this.lessonIndex[lesson].push(dicEntry);
		}
	}
		
	translateHeadword(srcLang, srcHeadword, targetLang) {
		var translations = new Array();
		translations[0] = this.langIndices[srcLang][srcHeadword].getHeadword(targetLang);
		return translations;
	}
	
	getRandomEntry(lang, lesson="all") {
			
		
		let index = lesson == "all" ? 
				this.langIndices["he"] :
			 	this.lessonIndex[lesson];
				
		let dicEntry = index[getRandomKey(index)];		
			
		return dicEntry;		
	}
	
	compareLessonNumbers(lesson1, lesson2) {
		return parseInt(lesson2) - parseInt(lesson1);
	}
	
	getLessons() {
		return Object.keys(this.lessonIndex).sort(this.compareLessonNumbers);
	}
	
}
