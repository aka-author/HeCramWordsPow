//* * ** *** ***** ******** ************* *********************
// Project: Nakar
// Module:  Play of Words
// Layer:	Web front-end
// File:	wordspace.js                   (\_/)
// Func:	Managing wordspaces            (^.^) 
//* * ** *** ***** ******** ************* *********************


const EVERY_TAG_CODE = "every";
const OUTER_TAG_CODE = "outer";
const INNER_TAG_CODE = "inner";
      

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
	
	getItemKeyValues(dicEntry) {
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
		
		let result = compareCompoundNumbers(kv1, kv2);
			
		return [-result];
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


class TagIndex extends StringIndex {
	
	constructor(indexName, validTags=null) {
		super(indexName);
		this.validTags = validTags;
	}
	
	getItemKeyValues(dicEntry) {

		let tags = [];
		
		let rawTags = dicEntry.getSubjectDomainTags();
		
		if(this.validTags) {
			for(let i in rawTags)
				if(this.validTags.includes(rawTags[i])) 
					tags.push(rawTags[i]);
		}		
		else 
			tags = rawTags;

		return tags;
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
		this.lexemes = new Array();
		this.levelCode = undefined;
		this.lessonNo = undefined;
	}
	
	appendLexeme(lexeme) {
		let langCode = lexeme.getLangCode();
		this.lexemes[langCode] = lexeme;
	}
	
	getHeadword(langCode) {
		if(this.lexemes[langCode]) 
			return this.lexemes[langCode].getHeadword();
		else 
			return undefined;	
	}
	
	getLevelCode() {
		return this.levelCode;
	}
	
	setLevelCode(levelCode) {	
		this.levelCode = levelCode;
	}
	
	getLessonNo() {
		return this.lessonNo;
	}
	
	setLessonNo(lessonNo) {
		this.lessonNo = lessonNo;
	}	

	getPartOfSpeachCode() {
		let partOfSpeachCode = "";
		for(let langCode in this.lexemes) {
			partOfSpeachCode =
				this.lexemes[langCode].getPartOfSpeachCode();
			break;	
		}
		return partOfSpeachCode;
	}
	
	getSubjectDomainTags(tagClassCode=EVERY_TAG_CODE) {
		return this.subjectDomainTags;
	}
	
	setSubjectDomainTags(subjectDomainTagsStr) {
		let rawTags = subjectDomainTagsStr ? 
			String(subjectDomainTagsStr).split(",") : "";
		this.subjectDomainTags = new Array();
		for(let tagIdx in rawTags) {
			let tag = rawTags[tagIdx].trim();
			if(tag != "")
				this.subjectDomainTags.push(tag);
		}	
	}

	getMnemoPhrase(langCode) {
		return this.lexemes[langCode].getMnemoPhrase();	
	}	
	
	setMnemoPhrase(langCode, mnemoPhrase) {
		if(this.lexemes[langCode])
			this.lexemes[langCode].setMnemoPprase(mnemoPhrase);
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
	
	constructor(id) {
		
		this.id = id;
		
		this.title = "Default Wordspace";
		this.provider = {};
		
		this.langs = new Array();	
		this.targetLangCode = "en";
		this.baseLangCodes = new Array();
		this.defaultBaseLangCode = "en";
		
		this.poses = new Factor();
		
		this.externalDics = new Array();
		
		this.dicEntries  = new Array();

		this.outerTags = new Array();
		this.innerTags = new Array();
		
		this.langCodeIndex = new LangCodeIndex();
		this.levelCodeIndex = new LevelCodeIndex();
		this.lessonNoIndex = new LessonNoIndex();
		this.partOfSpeachIndex = new PartOfSpeachIndex();
		this.outerTagIndex = new TagIndex("outer_tags", this.getOuterTags());
		this.innerTagIndex = new TagIndex("inner_tags", this.getInnerTags());
	}
	
	getId() {
		return this.id;
	}
	
	appendLang(lang) {
		this.langs[lang.getCode()] = lang;
	}
	
	getLang(langCode) {
		return this.langs[langCode];
	}
	
	getTargetLangCode() {
		return this.targetLangCode;
	}
	
	getTargetLang() {
		return this.getLang(this.getTargetLangCode());
	}
	
	getTargetLangName(langCode=undefined) {
		return this.getTargetLang().getName(langCode);
	}
	
	setTargetLang(langCode) {
		this.targetLangCode = langCode;
	}
	
	getLangCodes() {
		return [this.targetLangCode(), ...this.getBaseLangCodes()];
	}
	
	getBaseLangCodes() {
		return this.baseLangCodes;
	}
	
	setBaseLangs(baseLangCodes) {
		this.baseLangCodes = baseLangCodes;
	}
	
	getDefaultBaseLangCode() {
		return this.defaultBaseLangCode;
	}
	
	setDefaultBaseLang(langCode) {
		this.defaultBaseLangCode = langCode;
	}
	
	getLangs() {
		return this.langs;
	}
	
	getLang(langCode) {
		return this.getLangs()[langCode];
	}
	
	checkLangIndex(langCode) {
		if(!this.langIndices[langCode]) 
			this.langIndices[langCode] = new Array();
	} 
	
	appendPartOfSpeach(pos) {
		this.poses.appendValue(pos);
	}
	
	getPartOfSpeachCodes() {
		return Object.keys(this.poses);
	}
	
	getPartsOfSpeach() {
		return this.poses.getValues();
	}
	
	getPartOfSpeach(posCode) {
		return this.poses.getValue(posCode);
	}
	
	getPartOfSpeachLocalNames() {
		return this.poses.getValueNames();
	}
	
	getDefaultLevelCode() {
		return this.defaultLevelCode;
	}
	
	setDefaultLevelCode(levelCode) {
		this.defaultLevelCode = levelCode;
	}
	
	appendDicEntry(dicEntry) {

		this.dicEntries.push(dicEntry);
		
		this.levelCodeIndex.appendItem(dicEntry);
		this.lessonNoIndex.appendItem(dicEntry);
		this.partOfSpeachIndex.appendItem(dicEntry);
		this.outerTagIndex.appendItem(dicEntry);
		this.innerTagIndex.appendItem(dicEntry);
	}
		
	translateHeadword(srcLangCode, srcHeadword, targetLangCode) {
		var translations = new Array();
		translations[0] = this.langIndices[srcLangCode][srcHeadword].getHeadword(targetLangCode);
		return translations;
	}
	
	compareLessonNumbers(lessonNo1, lessonNo2) {
		return this.lessonNoIndex.compareKeyValues(lessonNo1, lessonNo2);
	} 
	
	getTitle() {
		return this.title;
	}
	
	setTitle(title) {
		this.title = title;
	}
	
	getProvider() {
		return this.provider;
	}
	
	setProvider(provider) {
		this.provider = provider;
	}

	getExternalDic(_langCode=undefined) {
		let langCode = _langCode ? _langCode : this.getDefaultBaseLangCode();
		return this.externalDics[langCode] ? this.externalDics[langCode] : 
		       this.externalDics[this.getDefaultBaseLangCode()];
	}
	
	setExternalDic(langCode, externalDicUrlTemplate) {
		this.externalDics[langCode] = externalDicUrlTemplate;
	}
	
	getLevels() {
		return this.levelCodeIndex.selectKeyValues().sort(this.compareLevelCodes);
	}
	
	getLessons() {
		
		function cmpFunc(ln1, ln2) {
			return compareCompoundNumbers(ln2, ln1);
		}
		
		return this.lessonNoIndex.selectKeyValues().sort(cmpFunc);
	}
	
	appendTag(tag, tagClassCode) {

		switch(tagClassCode) {
			case OUTER_TAG_CODE: 
				this.outerTags.push(tag);
				break;
			case INNER_TAG_CODE:
				this.innerTags.push(tag)	
				break;
			default:
				this.outerTags.push(tag);	
		}

	}

	getOuterTags() {
		return this.outerTags;
	}

	getInnerTags() {
		return this.innerTags;
	}

	getSubjectDomainTags(tagClassCode=EVERY_TAG_CODE) {

		let tags = [];

		switch(tagClassCode) {
			case OUTER_TAG_CODE:
				tags = this.getOuterTags();
				break;
			case INNER_TAG_CODE:
				tags = this.getInnerTags();
				break; 		
			default:
				tags = [...this.getOuterTags(), ...this.getInnerTags()];//this.outerTagIndex.selectKeyValues(); 	
		}

		return tags;
	}
	
	getSubjectDomainTagStat(tag) {

		if(this.getInnerTags().includes(tag))
			return this.innerTagIndex.selectKeyValueStat(tag);
		else		
			return this.outerTagIndex.selectKeyValueStat(tag);
	}

	getInnerTagStat(tag) {
		return this.innerTagIndex.selectKeyValueStat(tag);
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
				if(candidates[dicEntryIdx].lexemes["he"].getPartOfSpeachCode() == partOfSpeach)
					filter.push(candidates[dicEntryIdx]);
			}
		else
			filter = candidates;
		
		return filter;
	}
	
	assembleLevelCodeFilter(levelCode) {
		return levelCode && (levelCode != "all") ?
			this.levelCodeIndex.selectItemsByKeyValues(levelCode) :
			this.levelCodeIndex.selectAllItems();
	}
	
	assembleLessonNoFilter(lessonNo) {
		return lessonNo && (lessonNo != "all") ?
			this.lessonNoIndex.selectItemsByKeyValues(lessonNo) :
			this.lessonNoIndex.selectAllItems();
	}
	
	assemblePartOfSpeachFilter(partOfSpeachCode) {
		return partOfSpeachCode && (partOfSpeachCode != "all")? 
			this.partOfSpeachIndex.selectItemsByKeyValues(partOfSpeachCode) :
			this.partOfSpeachIndex.selectAllItems();
	}
	
	assembleTagRecord(code, relativeSize){
		return {"code"         : code,  
		        "wording"      : code, 
				"relativeSize" : relativeSize};
	}
	
	getSubjectDomainTagRecords(tagClassCode) {
				
		let tags = this.getSubjectDomainTags(tagClassCode);
		
		let tagRecords = new Array();
		
		for(let tagIdx in tags) {
			let tag = tags[tagIdx];
			let stat = this.getSubjectDomainTagStat(tag);
			let tagRecord = this.assembleTagRecord(tag, stat.relativeSize);
			tagRecords[tag] = tagRecord;
		}
		
		return tagRecords;
	}

	geInnerDomainTagRecords() {
				
		let tags = this.getSubjectDomainTags(INNER_TAG_CODE);
		
		let tagRecords = new Array();
		
		for(let tagIdx in tags) {
			let tag = tags[tagIdx];
			let stat = this.getInnerTagStat(tag);
			let tagRecord = this.assembleTagRecord(tag, stat.relativeSize);
			tagRecords[tag] = tagRecord;
		}
		
		return tagRecords;
	}
	
	assembleOuterTagFilter(tags) {
		return tags ? 
			this.outerTagIndex.selectItemsByKeyValues(...tags) :
			this.outerTagIndex.selectAllItems();
	}

	assembleInnerTagFilter(tags) {
		return tags ? 
			this.innerTagIndex.selectItemsByKeyValues(...tags) :
			this.innerTagIndex.selectAllItems();
	}
}
