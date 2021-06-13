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
				
		let config = this.getUserConfig();

		this.mainPage = null;
	}		
	
	// Getting ready
	
	isReady() {
		return this.wb ? this.wb.isLoaded() : false;
	}
	
	startGettingReady() {
		
		let wssFactory = new WorkbookFactory();
		wssFactory.createWorkbook(this, this.getWordspaceAccessParams());
				
		this.wb = wssFactory.getWorkbook();
		this.wb.setOnLoad(playGame);

		this.wb.auth();
		this.wb.startLoad();
	}
	
	useWordspaceFromGdocs() {
								
		let wsf = new WordspaceFactory(this.wb);
		wsf.setProcessReporter(this.getApp().getProcessReporter());
		
		let ws = wsf.importWordspace().getWordspace();
				
		this.subjectDomainTagRecords = ws.getSubjectDomainTagRecords();
		
		return ws;
	}
	
	finishGettingReady() {
	
		let config = this.getApp().getLocalUserConfig();
		
		this.ws = this.useWordspaceFromGdocs();
				
		let wsId = this.getWordspaceId();

		this.currLevelCode = config.getLevelCode(wsId);		
		this.currLessonNo = config.getLessonNo(wsId);
		
		this.currPartOfSpeachCode = config.getPosCode(wsId);

		this.currRiddleLangCode = this.getDefaultBaseLangCode();
		this.currGuessLangCode = this.getTargetLangCode();
		
		this.setCurrRiddleLang(config.getRiddleLangCode(wsId));
		this.setCurrGuessLang(config.getGuessLangCode(wsId));
		
		this.currFilter = this.ws.assembleLessonNoFilter("all");
	}
	
	
	// Managing wordspace access parametrs
	
	getWordspaceAccessParams() {
		return this.getApp().getWordspaceAccessParams();
	}
	
	getWspId() {
		return this.wspId;
	}
	
	
	// Managing a wordspace
	
	getWordspace() {
		return this.ws;
	}
	
	getWordspaceId() {
		return this.getWordspace().getId();
	}
	
	getWordspaceLangs() {
		return this.getWordspace().getLangs();
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
	
	getLang(langCode) {
		return this.getWordspace().getLang(langCode);
	}		
	
	getTargetLang() {
		return this.getWordspace().getTargetLang();
	}
	
	getTargetLangCode() {
		return this.getWordspace() ? 
					this.getWordspace().getTargetLangCode() : 
					undefined;
	}
	
	getDefaultBaseLangCode() {
		return this.getWordspace() ?  
					this.getWordspace().getDefaultBaseLangCode() :
					undefined;
	}
	
	getCurrRiddleLang() {
		return this.getLang(this.getCurrRiddleLangCode());
	}
	
	getCurrGuessLang() {
		return this.getLang(this.getCurrGuessLangCode());
	}
	
	getLevels() {
		return this.getWordspace().getLevels();
	}
	
	getLessons() {
		return this.getWordspace().getLessons();
	}
	
	getPartsOfSpeach() {
		return this.getWordspace().getPartsOfSpeach();
	}
	
	getPartOfSpeachLocalNames() {
		return this.getWordspace().getPartOfSpeachLocalNames();
	}	
	
	
	// Managing a game current state
	
	getCurrDicEntry() {
		return this.currDicEntry;
	}
	
	setCurrDicEntry(dicEntry) {
		this.currDicEntry = dicEntry;
	}
	
	getCurrFilter() {
		return this.currFilter;
	}

	rebuildCurrFilter() {
		
		let ws = this.getWordspace();
		
		let currLevelCodeFilter = ws.assembleLevelCodeFilter(this.getCurrLevelCode());
		let currLessonNoFilter = ws.assembleLessonNoFilter(this.getCurrLessonNo());
		let currPartOfSpeachFilter = ws.assemblePartOfSpeachFilter(this.getCurrPartOfSpeachCode());	
		let currSubjectDomainTagFilter = ws.assembleSubjectDomainTagFilter(this.getCurrSubjectDomainTags());
			
		this.currFilter = 
			currLessonNoFilter.crossWithFilters(currLevelCodeFilter,
				currPartOfSpeachFilter, currSubjectDomainTagFilter);	
	}
	
	getCurrLevelCode() {
		return this.currLevelCode;
	}
	
	setCurrLevel(levelCode) {
		this.currLevelCode = levelCode;
		this.rebuildCurrFilter();
		this.getUserConfig().setLevelCode(this.getWordspaceId(), levelCode);
	}
	
	getCurrLessonNo() {
		return this.currLessonNo;
	}

	setCurrLesson(lessonNo) {
		this.currLessonNo = lessonNo;
		this.rebuildCurrFilter();
		this.getUserConfig().setLessonNo(this.getWordspaceId(), lessonNo);
	}

	getCurrSubjectDomainTags(subjectDomainTags) {
		return this.currSubjectDomainTags;
	}
	
	setCurrSubjectDomains(subjectDomainTags) {
		this.currSubjectDomainTags = subjectDomainTags;
		this.rebuildCurrFilter();
	}

	getCurrPartOfSpeachCode() {
		return this.currPartOfSpeachCode;
	}
	
	setCurrPartOfSpeach(pos) {
		this.currPartOfSpeachCode = pos ? pos.getCode() : "all";
		this.rebuildCurrFilter();
		this.getUserConfig().setPosCode(this.getWordspaceId(), this.currPartOfSpeachCode);
	}

	getCurrBaseLangCode() {
		
		let targetLangCode = this.getTargetLangCode();
		let riddleLangCode = this.getCurrRiddleLangCode();
		let guessLangCode = this.getCurrGuessLangCode();
		
		return guessLangCode == targetLangCode ? riddleLangCode : guessLangCode;
	}

	getCurrRiddleLangCode() {
		return this.currRiddleLangCode;
	}
	
	getActualLangCode(langCode) {
	
		let actualLangCode = langCode;
		
		switch (actualLangCode) {
			case CFG_TARGET_LANG_CODE:
				actualLangCode = this.getTargetLangCode();
				break;
			case CFG_DEFAULT_BASE_LANG_CODE: 
				let navLangCode = navigator.language.substring(0,2);
				actualLangCode = 
					navLangCode != this.getTargetLangCode ? 
						navLangCode : this.getDefaultBaseLangCode(); 				
		}
	
		return actualLangCode;
	}
	
	setCurrRiddleLang(langCode) {
		
		let actualLangCode = this.getActualLangCode(langCode);
		
		if(actualLangCode != this.currRiddleLangCode) {
			
			if(
			   (this.currRiddleLangCode == this.getTargetLangCode()) ||
			   (actualLangCode == this.getTargetLangCode())
			  )
				this.currGuessLangCode = this.currRiddleLangCode;
				
			this.currRiddleLangCode = actualLangCode;
			
			let wsId = this.getWordspaceId();
			
			this.getUserConfig().setRiddleLangCode(wsId, this.currRiddleLangCode);
			this.getUserConfig().setGuessLangCode(wsId, this.currGuessLangCode);
		}
	}
	
	getCurrGuessLangCode() {
		return this.currGuessLangCode;
	}
	
	setCurrGuessLang(langCode) {
		
		let actualLangCode = this.getActualLangCode(langCode);
		
		if(actualLangCode != this.currGuessLangCode) {
			
			if(
			   (this.currGuessLangCode == this.getTargetLangCode()) ||
			   (actualLangCode == this.getTargetLangCode())
			  )
				this.currRiddleLangCode = this.currGuessLangCode;
		
			this.currGuessLangCode = actualLangCode;
			
			let wsId = this.getWordspaceId();
			
			this.getUserConfig().setRiddleLangCode(wsId, this.currRiddleLangCode);
			this.getUserConfig().setGuessLangCode(wsId, this.currGuessLangCode);
		}
	}
	
	
	// Performing game activities
	
	updateSubjectDomainTagCloud() {
		let langCode = this.getCurrBaseLangCode();
		this.getMainPage().subjectDomainTagCloud.showLocalWordings(langCode);
	}
	
	updateRiddleLangSelector() {
		let lang = this.getCurrRiddleLang();
		this.getMainPage().riddleLangSelector.setUiControlValue(lang);
	}
	
	updateGuessLangSlector() {
		let lang = this.getCurrGuessLang();
		this.getMainPage().guessLangSelector.setUiControlValue(lang);
	}
	
	updateWordList() {
		this.getMainPage().wordList.setParams(this.getCurrFilter(), 
					this.currRiddleLangCode, this.currGuessLangCode);
	}
	
	updatePage() {
		this.updateRiddleLangSelector();
		this.updateGuessLangSlector();
		this.updateWordList();
		this.updateSubjectDomainTagCloud();		
	}
	
	selectLevel(levelCode) {
		this.setCurrLevel(levelCode);
		this.updatePage();
		this.takeNextQuestion();
	}
	
	selectLesson(lessonNo) {
		this.setCurrLesson(lessonNo);
		this.updatePage();
		this.takeNextQuestion();
	}

	selectSubjectDomains(subjectDomainTags) {
		this.setCurrSubjectDomains(subjectDomainTags);
		this.updatePage();
		this.takeNextQuestion();
	}

	selectPartOfSpeach(pos) {
		this.setCurrPartOfSpeach(pos);
		this.updatePage();
		this.takeNextQuestion();
	}

	selectRiddleLang(lang) {
		this.setCurrRiddleLang(lang.code);
		this.updatePage();
	}		

	selectGuessLang(lang) {
		this.setCurrGuessLang(lang.code);
		this.updatePage();
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
	
	
	// Service activities
	
	printCards() {
		
		let carder = new CardGenerator(this.getCurrFilter(), 
						this.getCurrRiddleLangCode(), this.getCurrGuessLangCode());
										
		var html = carder.assembleHtml();	
		
		GLOBAL_PRINT.push(html);
		
		let win1 = window.open("print/cards.html");	
	}


	// Starting a game	
	
	setupLevelSelector() {
		
		let mainPage = this.getMainPage();
		
		let levels = ["all"].concat(this.getLevels());
		
		mainPage.levelSelector.appendLevels(levels);
		mainPage.levelSelector.setUiControlValue(this.getCurrLevelCode());
	}
	
	setupLessonSelector() {
		
		let mainPage = this.getMainPage();
		
		let lessons = ["all"].concat(this.getLessons());
		
		mainPage.lessonSelector.appendLessons(lessons);
		mainPage.lessonSelector.setUiControlValue(this.getCurrLessonNo());
	}
	
	setupSubjectDomainTagCloud() {
		
		let mainPage = this.getMainPage();

		let ws = this.getWordspace();

		let tagRecords = ws.getSubjectDomainTagRecords();
		let tagLocalWordings = ws.getSubjectDomainTagWordings();
				
		mainPage.setSubjectDomainTags(tagRecords, tagLocalWordings);
	}
	
	setupPartOfSpeachSelector() {
		
		let mainPage = this.getMainPage();
		
		let selector = mainPage.partOfSpeachSelector;
				
		selector.appendOptions(this.getPartsOfSpeach());
		
		function capFirstChar(pns, context) {
			return capitalizeFirstChr(pns);
		}
		
		let posNames = matrixAssMap(this.getPartOfSpeachLocalNames(), capFirstChar);		

		selector.setLocalWordings(posNames);
				
		selector.setUiControlValue(this.getWordspace().getPartOfSpeach(this.getCurrPartOfSpeachCode()));
	}
	
	setupRiddleLangSelector() {
		
		let selector = this.getMainPage().riddleLangSelector;
		selector.appendOptions(this.getWordspaceLangs());
		selector.setUiControlValue(this.getCurrRiddleLang());
	}
	
	setupGuessLangSelector() {
		
		let selector = this.getMainPage().guessLangSelector;
		
		selector.appendOptions(this.getWordspaceLangs());
		selector.setUiControlValue(this.getCurrGuessLang());
	}
	
	setupSections() {
	
		let config = this.getUserConfig();
		let wspId = this.getWordspace().getId();
		let mp = this.getMainPage();
			
		mp.subjectDomainTagsSection.setUiControlValue(config.getWordspaceConfigParam(wspId, CFG_SCT_TAGS));
		mp.gamingSection.setUiControlValue(config.getWordspaceConfigParam(wspId, CFG_SCT_GAMING));
		mp.wordListSection.setUiControlValue(config.getWordspaceConfigParam(wspId, CFG_SCT_WORD_LIST));
		
		this.getMainPage().mainGroupOfPanes.show();
		document.getElementById("contentHeaderDiv").style.display = "";
		document.getElementById("footerDiv").style.display = "";
		
	}
	
	setupPage() {
		
		this.getMainPage().setTitle(this.getWordspace().getTitle());
		this.getMainPage().showProviderInfo();
		
		
		this.setupLevelSelector();
		this.setupLessonSelector();
		this.setupSubjectDomainTagCloud();
		this.setupPartOfSpeachSelector();
		
		this.setupRiddleLangSelector();
		this.setupGuessLangSelector();
		
		this.setupSections();
		
		this.getMainPage().propagateCurrUiLang();
		
		this.updatePage();
	}
	
	play() {
		
		this.rebuildCurrFilter();
		this.setupPage();
		this.takeNextQuestion();
		
		sleep(2000);
		
		this.getProcessReporter().hide();
	}
}
