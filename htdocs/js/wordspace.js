//* * ** *** ***** ******** ************* *********************
// Project: Nakar
// Module:  Play of Words
// Layer:	Web front-end
// File:	wordspace.js                (\_/)
// Func:	Managing wordspaces         (^.^) 
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


// Indices 

class LangCodeIndex extends Index {
	
	constructor() {
		super("lang_code");
	}

	getKeyValues(dicEntry) {
		return dicEntry.getLangCodes();
	}

}


class LevelCodeIndex extends Index {
	
	constructor() {
		super("level_code");
	}
	
	getKeyValues(dicEntry) {
		return [dicEntry.getLevelCode()];
	}
	
}


class LessonNoIndex extends Index {
	
	constructor() {
		super("lesson_no");
	}
	
	getItemKeyValues(dicEntry) {
		
		let lessonNo = dicEntry.getLessonNo();
		return lessonNo ? [lessonNo] : [];
	}
	
	compareKeyValues(kv1, kv2) {
		
		let result = 0;
		
		if(Boolean(kv1) && Boolean(kv2)) {
		
			//let result = kv1.levelCode.locateCompare(kv2.levelCode)
			
			//if(result == 0) 
			//	result = kv1.lessonNo - kv2.lessonNo;
			result = kv1 - kv2;
		}
			
		return [result];
	}	
	
}


class PartOfSpeachIndex extends StringIndex {
	
	constructor() {
		super("part_of_speach");
	}
	
	getItemKeyValues(dicEntry) {
		return [dicEntry.getPartOfSpeachCode()];
	}
}


class SubjectDomainTagIndex extends StringIndex {
	
	constructor() {
		super("subject_domain_tag");
	}
	
	getItemKeyValues(dicEntry) {
		return dicEntry.getSubjectDomainTags();
	}
	
}


// A word with associated grammer data
class Lexeme {
	
	constructor(langCode, headword) {
		this.langCode         = langCode;
		this.headword         = headword;
		this.partOfSpeachCode = "other";
		this.mnemoPhrase      = undefined;
	}
	
	getLangCode() {
		return this.langCode;
	}
	
	getHeadword() {
		return this.headword;
	}
	
	getPartOfSpeachCode() {
		return this.partOfSpeachCode;
	}
	
	setPartOfSpeach(partOfSpeachCode) {
		this.partOfSpeachCode = partOfSpeachCode;
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
		this.Lexemes = new Array();
		this.levelNo = undefined;
		this.lessonNo = undefined;
	}
	
	appendLexeme(Lexeme) {
		let langCode = Lexeme.getLangCode();
		this.Lexemes[langCode] = Lexeme;
	}
	
	getHeadword(langCode) {
		return this.Lexemes[langCode].getHeadword();	
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

	getPartOfSpeachCode() {
		let partOfSpeachCode = "";
		for(let langCode in this.Lexemes) {
			partOfSpeachCode =
				this.Lexemes[langCode].getPartOfSpeachCode();
			break;	
		}
		return partOfSpeachCode;
	}
	
	getSubjectDomainTags() {
		return this.subjectDomainTags;
	}
	
	setSubjectDomainTags(subjectDomainTagsStr) {
		let rawTags = subjectDomainTagsStr ? 
			subjectDomainTagsStr.split(",") : "";
		this.subjectDomainTags = new Array();
		for(let tagIdx in rawTags) {
			let tag = rawTags[tagIdx].trim();
			if(tag != "")
				this.subjectDomainTags.push(tag);
		}	
	}

	getMnemoPhrase(langCode) {
		return this.Lexemes[langCode].getMnemoPhrase();	
	}	
	
	setMnemoPhrase(langCode, mnemoPhrase) {
		if(this.Lexemes[langCode])
			this.Lexemes[langCode].setMnemoPprase(mnemoPhrase);
	}	
}


class DicEntryComparator extends Comparator {

	constructor(compareLangCode) {
		super();
		this.compareLangCode = compareLangCode;
	}
	
	compareItems(dicEntry1, dicEntry2) {
		let headword1 = dicEntry1.getHeadword(this.compareLangCode);
		let headword2 = dicEntry2.getHeadword(this.compareLangCode);
		return safeCompareStrings(headword1, headword2);
	}		
}


class wordspaceQuery {
	
	matches(dicEntry) {
		return true; 
	}

}


class Wordspace {
	
	constructor() {
		this.dicEntries  = new Array();
		
		this.langCodeIndex = new LangCodeIndex();
		this.levelCodeIndex = new LevelCodeIndex();
		this.lessonNoIndex = new LessonNoIndex();
		this.partOfSpeachIndex = new PartOfSpeachIndex();
		this.subjectDomainTagIndex = new SubjectDomainTagIndex();
	}
	
	checkLangIndex(langCode) {
		//if(!this.langIndices[langCode]) 
		//	this.langIndices[langCode] = new Array();
	}
	
	checkLessonIndex(lessonNo) {
		if(!this.lessonNoIndex[lessonNo])
			this.lessonNoIndex[lessonNo] = new Array();
	}
	
	appendDicEntry2LangIndex(langCode, dicEntry) {
		this.checkLangIndex(langCode);
		//this.langIndices[langCode][dicEntry.getHeadword(langCode)] = dicEntry;
	}
	
	appendDicEntry(dicEntry) {
		
		this.dicEntries.push(dicEntry);
		
		for(let langCode in dicEntry.Lexemes)  
			this.appendDicEntry2LangIndex(langCode, dicEntry);	
		
		let lessonNo = dicEntry.getLessonNo();
		if(lessonNo) {
			this.checkLessonIndex(lessonNo);
			this.lessonNoIndex[lessonNo].push(dicEntry);
		}
		
		this.lessonNoIndex.appendItem(dicEntry);
		this.partOfSpeachIndex.appendItem(dicEntry);
		this.subjectDomainTagIndex.appendItem(dicEntry);
	}
		
	translateHeadword(srcLangCode, srcHeadword, targetLangCode) {
		var translations = new Array();
		translations[0] = this.langIndices[srcLangCode][srcHeadword].getHeadword(targetLangCode);
		return translations;
	}
		
	compareLessonNumbers(lessonNo1, lessonNo2) {
		return parseInt(lessonNo2) - parseInt(lessonNo1);
	}
	
	getTargetLangCode() {
		return "he";
	}
	
	getLessons(levelCode) {
		return this.lessonNoIndex.selectKeyValues().sort(this.compareLessonNumbers);
	}
	
	getSubjectDomainTags() {
		return this.subjectDomainTagIndex.selectKeyValues();
	}
	
	getSubjectDomainTagStat(tag) {
		return this.subjectDomainTagIndex.selectKeyValueStat(tag);
	}
	
	getSubjectDomainTagWordings() {
		return this.subjectDomainTagWordings;
	}
	
	setSubjectDomainTagWordings(tagWordings) {
		this.subjectDomainTagWordings = tagWordings;
	}
	
	selectDicEntries(query, _filter=null) {
		
		let lessonNo = query.lessonNo;
		
		let partOfSpeach = query.partOfSpeach;
		
		let candidates = new Array();
		
		let filter = new Array();
		
		if(lessonNo != "all") {
			candidates = this.lessonIndex[lessonNo];
		}	
		else
			candidates = this.dicEntries;
		
		if(partOfSpeach != "all") 
			for(let dicEntryIdx in candidates) { 
				if(candidates[dicEntryIdx].Lexemes["he"].getPartOfSpeachCode() == partOfSpeach)
					filter.push(candidates[dicEntryIdx]);
			}
		else
			filter = candidates;
		
		return filter;
	}
	
	assembleLessonNoFilter(lessonNo) {
		return lessonNo && (lessonNo != "all") ?
			this.lessonNoIndex.selectItemsByKeyValues(parseInt(lessonNo)) :
			this.lessonNoIndex.selectAllItems();
	}
	
	assemblePartOfSpeachFilter(partOfSpeachCode) {
		return partOfSpeachCode && (partOfSpeachCode != "all")? 
			this.partOfSpeachIndex.selectItemsByKeyValues(partOfSpeachCode) :
			this.partOfSpeachIndex.selectAllItems();
	}
	
	assembleSubjectDomainTagFilter(tags) {
		return tags ? 
			this.subjectDomainTagIndex.selectItemsByKeyValues(...tags) :
			this.subjectDomainTagIndex.selectAllItems();
	}
	
	assembleExtDicUrl(dicEntry, langCode) {
		let url = "";
		if(langCode == "he") {
			let headword = dicEntry.getHeadword(langCode);
			url = "https://www.pealim.com/search/?q=" + headword;
		}	
		
		return url;
	}
	
}
