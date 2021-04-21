//* * ** *** ***** ******** ************* *********************
// Project: Nakar
// Module:  Play of Words
// Layer:	Web front-end
// File:	game.js                         (\_/)
// Func:	Executing user's commands       (^.^)
//* * ** *** ***** ******** ************* *********************


var GLOBAL_PRINT = new Array();

class Game extends Bureaucrat {

	constructor(app) {
		
		super(app, "GAME");
		
		this.mainPage = null;
		
		let config = this.getUserConfig();
		
		this.ws = this.useWordspaceFromGdocs();
		
		this.currRiddleLangCode = config.getDefaultRiddleLangCode(this.ws);
		this.currGuessLangCode = config.getDefaultGuessLangCode(this.ws);
		
		this.currLevelNo  = config.getDefaultCurrLevelNo(this.ws);		
		this.currLessonNo = config.getDefaultCurrLessonNo(this.ws);
		this.currPartOfSpeachTags = config.getDefaultPartOfSpeachCode(this.ws);
		this.currFilter = this.ws.assembleLessonNoFilter("all");
	}		
	
	useBuitInWordspace(id=undefined) {
		
		let ws = new Wordspace();
		
		for(let i = 0; i < GLOBAL_heru.dic.length; i++) {
			let heWord = new wordInfo( "he", GLOBAL_heru.dic[i]["he"]);
			let ruWord = new wordInfo( "ru", GLOBAL_heru.dic[i]["ru"]);
			let heru = new DicEntry();
			heru.addWordInfo(heWord);
			heru.addWordInfo(ruWord);
			ws.addDicEntry(heru);
		}	
			
		return ws;
	}	
	
	assembleWsColName(colName) {
		return colName;
	}
	
	assembleTagRecord(code, relativeSize){
		return {"code"         : code,  
		        "wording"      : code, 
				"relativeSize" : relativeSize};
	}
	
	getSubjectDomainTagRecords(wordspace) {
		
		let tags = wordspace.getSubjectDomainTags();
		
		let tagRecords = new Array();
		
		for(let tagIdx in tags) {
			let tag = tags[tagIdx];
			let stat = wordspace.getSubjectDomainTagStat(tag);
			let tagRecord = this.assembleTagRecord(tag, stat.relativeSize);
			tagRecords[tag] = tagRecord;
		}
		
		return tagRecords;
	}
	
	getSubjectDomainTagLocalWordings(wordspace) {
		return wordspace.getSubjectDomainTagWordings();
	}
	
	useWordspaceFromGdocs() {
		
		let gdoc = new SimpleGoogleWordspace("1ii9CGetudA74mPmuDCYfE1hEbWmt5kHa3IGSZOLSg4M");
		gdoc.auth();
		gdoc.load();
		
		let ws = new Wordspace();
		
		let targetLangCode = ws.getTargetLangCode();
		
		for(let partOfSpeach in gdoc.getContent().sheets) {
			
			if(!partOfSpeach.includes("service.")) {
				
				let countRows = gdoc.countRows(partOfSpeach);
				let baseLangCodes = this.getAvailableBaseLangCodes();
				
				for(let rowIdx = 0; rowIdx < countRows; rowIdx++) {
					
					let dicEntry = new DicEntry();
					
					let targetWord = gdoc.getHeadword(partOfSpeach, rowIdx);
					let targetWordInfo = new WordInfo(targetLangCode, targetWord);
					targetWordInfo.setPartOfSpeach(partOfSpeach);
					
					dicEntry.appendWordInfo(targetWordInfo);
					
					for(let baseLangIdx in baseLangCodes) {
						
						let baseLangCode = baseLangCodes[baseLangIdx].code;
						
						let baseColName = this.assembleWsColName(baseLangCode);
						let baseWord = gdoc.getTranslation(partOfSpeach, rowIdx, baseColName);
						
						let baseWordInfo = new WordInfo(baseLangCode, baseWord);
						
						let mnemoPhrase = gdoc.getMnemoPhrase(partOfSpeach, rowIdx, baseLangCode);
						if(mnemoPhrase)
							baseWordInfo.setMnemoPhrase(mnemoPhrase);
						
						dicEntry.appendWordInfo(baseWordInfo); 
					}
									
					let levelNo = gdoc.getLevelNo(partOfSpeach, rowIdx);				
					dicEntry.setLevelNo(levelNo);
					
					let lessonNo = gdoc.getLessonNo(partOfSpeach, rowIdx);
					dicEntry.setLessonNo(lessonNo);
					
					let subjectDomainTags = gdoc.getSubjectDomainTags(partOfSpeach, rowIdx);
					dicEntry.setSubjectDomainTags(subjectDomainTags);
					
					ws.appendDicEntry(dicEntry);
				} // for
			} // if	
		} // for
		
		let tagWordings = new Array();
		
		let countRows = gdoc.countRows("service.tags");
		let baseLangCodes = this.getAvailableBaseLangCodes();
		
		for(let rowIdx = 0; rowIdx < countRows; rowIdx++) {
			
			let tag = gdoc.getFieldValue("service.tags", rowIdx, "tag");
			
			tagWordings[tag] = new Array();
			for(let baseLangIdx in baseLangCodes) {
				let langCode = baseLangCodes[baseLangIdx].code;
				tagWordings[tag][langCode] = 
					gdoc.getFieldValue("service.tags", rowIdx, "tag_" + langCode);
			}
		}
		
		ws.setSubjectDomainTagWordings(tagWordings);
		
		this.subjectDomainTagRecords = 
			this.getSubjectDomainTagRecords(ws);
		
		return ws;
	}
	
	getWordspace() {
		return this.ws;
	}
	
	getAvailableBaseLangCodes() {
		return [{"code" : "en", "wording" : "English"},
			    {"code" : "es", "wording" : "Española"},
				{"code" : "pt", "wording" : "Português"},
				{"code" : "ru", "wording" : "Русский"}];
	}
	
	isBaseLangAvailable(langCode) {
		let langs = this.getAvailableBaseLangCodes();
		let result = false;
		for(let langIdx in langs)
			if(langs[langIdx].code == langCode) {
				result = true;
				break;
			}	
		return result;
	}
	
	getTargetLangCode() {
		return this.getWordspace() ? 
					this.getWordspace().getTargetLangCode() : 
					undefined;
	}

	getLevelList() {
		return this.getWordspace().getLevelLessonList();
	}
	
	getLevels() {
		return []; //this.getWordspace().getLessons();
	}
	
	getLessons() {
		return this.getWordspace().getLessons();
	}
	
	getCurrLevelNo() {
		return this.currLevelNo;
	}
	
	setCurrLevel(levelNo) {
		this.currLevelNo = levelNo;
		this.takeNextQuestion();
	}
	
	getCurrLessonNo() {
		return this.currLessonNo;
	}

	setCurrLesson(lessonNo) {
		this.currLessonNo = lessonNo;
		this.takeNextQuestion();
		this.updateWordList();
	}

	getCurrRiddleLangCode() {
		return this.currRiddleLangCode;
	}
	
	setCurrRiddleLang(langCode) {
		this.currRiddleLangCode = langCode;
		this.takeNextQuestion();
		this.updateWordList();
		let localTags = this.getWordspace().getSubjectDomainTagWordings();
		this.getMainPage().subjectDomainTagCloud.showLocalWordings(langCode);
	}
	
	getCurrGuessLangCode() {
		return this.currGuessLangCode;
	}
	
	setCurrGuessLang(langCode) {
		this.currGuessLangCode = langCode;
		this.takeNextQuestion();
		this.updateWordList();
		
		let localTags = this.getWordspace().getSubjectDomainTagWordings();
		this.getMainPage().subjectDomainTagCloud.showLocalWordings(langCode);
	}
	
	getCurrPartOfSpeachCode() {
		return this.currPartOfSpeachCode;
	}
	
	setCurrPartOfSpeach(partOfSpeachCode) {
		this.currPartOfSpeachCode = partOfSpeachCode;
		this.takeNextQuestion();
		this.updateWordList();
	}
	
	setSubjectDomainTags(wordspace) {
		
		let mainPage = this.getMainPage();
		
		let tagRecords = this.getSubjectDomainTagRecords(wordspace);
		mainPage.subjectDomainTagCloud.appendTags(tagRecords);
		
		let tagLocalWordings = this.getSubjectDomainTagLocalWordings(wordspace);
		mainPage.subjectDomainTagCloud.setTagLocalWordings(tagLocalWordings);
		
		this.takeNextQuestion();
		this.updateWordList();
	}
	
	getCurrSubjectDomainTags(subjectDomainTags) {
		return this.currSubjectDomainTags;
	}
	
	setCurrSubjectDomains(subjectDomainTags) {
		this.currSubjectDomainTags = subjectDomainTags;
		this.takeNextQuestion();
		this.updateWordList();
	}
	
	getCurrFilter() {
		return this.currFilter;
	}

	updateCurrFilter() {
		
		let ws = this.getWordspace();
		
		let currLessonNoFilter = 
			ws.assembleLessonNoFilter(this.getCurrLessonNo());
		let currPartOfSpeachFilter = 
			ws.assemblePartOfSpeachFilter(this.getCurrPartOfSpeachCode());	
		let currSubjectDomainTagFilter = 
			ws.assembleSubjectDomainTagFilter(this.getCurrSubjectDomainTags());
			
		this.currFilter = 
			currLessonNoFilter.crossWithFilters(currPartOfSpeachFilter, 
			                               currSubjectDomainTagFilter);	
	}

	getCurrDicEntry() {
		return this.currDicEntry;
	}
	
	setCurrDicEntry(dicEntry) {
		this.currDicEntry = dicEntry;
	
	}
	
	giveUp() {
		
		let visibleAreaName = this.getMainPage().getVisibleAreaName();
		
		switch(visibleAreaName) {
			case "question": 
			case "prompt":
				let guessLangCode = this.getCurrGuessLangCode();
				let guessWordInfo = this.getCurrDicEntry().wordInfos[guessLangCode];
				this.getMainPage().displayAnswer(guessWordInfo);
				break;
			case "answer":
				let riddleLangCode = this.getCurrRiddleLangCode();
				let riddleWordInfo = this.getCurrDicEntry().wordInfos[riddleLangCode];
				this.getMainPage().displayQuestion(riddleWordInfo);
				break;
			case "mnemoPhrase":
				switch(this.getMainPage().getMnemoPhraseState()) {
					case "concealed":	
						this.getMainPage().discloseTargetWords();
						break;
					case "disclosed":
						let baseLangCode = this.getCurrRiddleLangCode();
						let baseWordInfo = this.getCurrDicEntry().wordInfos[baseLangCode];
						this.getMainPage().displayQuestion(baseWordInfo);
				}
		}
	}
	
	showPrompt() {
		let guessLangCode = this.getCurrGuessLangCode();
		let guessWordInfo = this.getCurrDicEntry().wordInfos[guessLangCode];
		let riddleLangCode = this.getCurrRiddleLangCode();
		let mnemoPhrase = this.getCurrDicEntry().getMnemoPhrase(riddleLangCode);
		if(mnemoPhrase)
			this.getMainPage().displayMnemoPhrase(mnemoPhrase);
		else
			this.getMainPage().displayPrompt(guessWordInfo);
	}

	takeNextQuestion() {
		
		this.updateCurrFilter();
		
		let currFilter = this.getCurrFilter();
			
		if(currFilter.countItems() > 0) {
			let riddleLangCode = this.getCurrRiddleLangCode();
			let randomWord = currFilter.fetchRandomItem();
			this.setCurrDicEntry(randomWord);	
			let riddleWordInfo = randomWord.wordInfos[riddleLangCode];
			this.getMainPage().displayQuestion(riddleWordInfo);		
		}	
		else {
			this.getMainPage().questionArea.clear();
			this.getMainPage().answerArea.clear();
			this.getMainPage().promptArea.clear();
			this.getMainPage().mnemoPhraseArea.clear();
		}
	}
	
	updateWordList() {
		let mainPage = this.getMainPage();
		mainPage.wordList.setParams(this.currFilter, 
								this.currRiddleLangCode,
								this.currGuessLangCode);
	}
	
	
	
	
	printCards() {
		
		let carder = new CardGenerator(this.currFilter, this.getCurrRiddleLangCode(), 
										this.getCurrGuessLangCode());
										
		var html = carder.assembleHtml();	
		
		GLOBAL_PRINT.push(html);
		
		let win1 = window.open("print/cards.html");	
	}
	
	play() {
		let mainPage = this.getMainPage();
		
		this.setSubjectDomainTags(this.getWordspace());
		this.setCurrRiddleLang(mainPage.riddleLangSelector.getUiControlValue());
		this.setCurrGuessLang(mainPage.guessLangSelector.getUiControlValue());
			
		this.takeNextQuestion();
	}
}
