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
		
		this.currLevelCode = config.getDefaultCurrLevelCode(this.ws);		
		this.currLessonNo = config.getDefaultCurrLessonNo(this.ws);
		this.currPartOfSpeachTags = config.getDefaultPartOfSpeachCode(this.ws);
		this.currFilter = this.ws.assembleLessonNoFilter("all");
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
				
		let gdoc = new SimpleGoogleWordspace("1Z6vXmRocZhrpLVc_1XP5BsgUwOXu_Q0L5gboDi2nWEg");
		gdoc.auth();
		gdoc.load();
		
		let wsf = new WordspaceFactory(gdoc);
		wsf.importWordspace();
		let ws = wsf.getWordspace();
				
		this.subjectDomainTagRecords = 
			this.getSubjectDomainTagRecords(ws);
		
		return ws;
	}
	
	getWordspace() {
		return this.ws;
	}
	
	getAvailableBaseLangCodes() {
				
		let ws = this.getWordspace();			
				
		let baseLangCodes = ws.getBaseLangCodes();
		
		let options = new Array();
		
		for(let baseLangCodeIdx in baseLangCodes) {
			let lang = ws.getLang(baseLangCodes[baseLangCodeIdx]);
			options.push({"code" : lang.getCode(), 
			              "wording" : capitalizeFirstChr(lang.getName())});
		}
		
		return options;
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
	
	getTargetLang() {
		return this.getWordspace().getTargetLang();
	}
	
	getTargetLangCode() {
		return this.getWordspace() ? 
					this.getWordspace().getTargetLangCode() : 
					undefined;
	}
	
	getTargetLangOriginalWording() {
	}

	getLevelList() {
		return this.getWordspace().getLevelLessonList();
	}
	
	getLevels() {
		return this.getWordspace().getLevels();
	}
	
	getLessons() {
		return this.getWordspace().getLessons();
	}
	
	getCurrLevelCode() {
		return this.currLevelCode;
	}
	
	setCurrLevel(levelCode) {
		this.currLevelCode = levelCode;
		this.takeNextQuestion();
		this.updateWordList();
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
	
	getCurrBaseLangCode() {
		let targetLangCode = this.getTargetLangCode();
		let riddleLangCode = this.getCurrRiddleLangCode();
		let guessLangCode = this.getCurrGuessLangCode();
		
		return guessLangCode == targetLangCode ?  riddleLangCode : guessLangCode;
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
	
	getPartsOfSpeach() {
				
		let ws = this.getWordspace();			
				
		let partOfSpeachCodes = ws.getPartOfSpeachCodes();
						
		let options = new Array();
		
		for(let posCodeIdx in partOfSpeachCodes) {
			let pos = ws.getPartOfSpeach(partOfSpeachCodes[posCodeIdx]);
			options.push(
				{"code" : pos.getCode(), 
			     "wording" : 
					capitalizeFirstChr(pos.getName(this.getCurrRiddleLangCode()))});
		}
				
		return options;
	}
	
	getPartOfSpeachLocalNames() {
		return this.getWordspace().getPartOfSpeachLocalNames();
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
		
		let currLevelCodeFilter = 
			ws.assembleLevelCodeFilter(this.getCurrLevelCode());
		let currLessonNoFilter = 
			ws.assembleLessonNoFilter(this.getCurrLessonNo());
		let currPartOfSpeachFilter = 
			ws.assemblePartOfSpeachFilter(this.getCurrPartOfSpeachCode());	
		let currSubjectDomainTagFilter = 
			ws.assembleSubjectDomainTagFilter(this.getCurrSubjectDomainTags());
			
		this.currFilter = 
			currLessonNoFilter.crossWithFilters(currLevelCodeFilter,
				currPartOfSpeachFilter, currSubjectDomainTagFilter);	
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
				let guessLexeme = this.getCurrDicEntry().lexemes[guessLangCode];
				this.getMainPage().displayAnswer(guessLexeme);
				break;
			case "answer":
				let riddleLangCode = this.getCurrRiddleLangCode();
				let riddleLexeme = this.getCurrDicEntry().lexemes[riddleLangCode];
				this.getMainPage().displayQuestion(riddleLexeme);
				break;
			case "mnemoPhrase":
				switch(this.getMainPage().getMnemoPhraseState()) {
					case "concealed":	
						this.getMainPage().discloseTargetWords();
						break;
					case "disclosed":
						let baseLangCode = this.getCurrRiddleLangCode();
						let baseLexeme = this.getCurrDicEntry().lexemes[baseLangCode];
						this.getMainPage().displayQuestion(baseLexeme);
				}
		}
	}
	
	showPrompt() {
		let guessLangCode = this.getCurrGuessLangCode();
		let guessLexeme = this.getCurrDicEntry().lexemes[guessLangCode];
		let riddleLangCode = this.getCurrRiddleLangCode();
		let mnemoPhrase = this.getCurrDicEntry().getMnemoPhrase(riddleLangCode);
		if(mnemoPhrase)
			this.getMainPage().displayMnemoPhrase(mnemoPhrase);
		else
			this.getMainPage().displayPrompt(guessLexeme);
	}

	takeNextQuestion() {
		
		this.updateCurrFilter();
		
		let currFilter = this.getCurrFilter();
			
		if(currFilter.countItems() > 0) {
			let riddleLangCode = this.getCurrRiddleLangCode();
			let randomWord = currFilter.fetchRandomItem();
			this.setCurrDicEntry(randomWord);	
			let riddleLexeme = randomWord.lexemes[riddleLangCode];
			this.getMainPage().displayQuestion(riddleLexeme);		
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
