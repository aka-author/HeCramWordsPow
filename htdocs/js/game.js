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
			let heWord = new Lexeme( "he", GLOBAL_heru.dic[i]["he"]);
			let ruWord = new Lexeme( "ru", GLOBAL_heru.dic[i]["ru"]);
			let heru = new DicEntry();
			heru.addLexeme(heWord);
			heru.addLexeme(ruWord);
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
		
		let wsf = new WordspaceFactory(gdoc);
		wsf.importWordspace();
		let ws = wsf.getWordspace();
		
		console.log(ws);
		
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
