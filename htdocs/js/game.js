//* * ** *** ***** ******** ************* *********************
// The Game
//
//                                                    (\_/)
//                                                    (^.^) 
//* * ** *** ***** ******** ************* *********************

class Game extends Bureaucrat {

	constructor(app) {
		
		super(app, "GAME");
		
		this.mainPage = null;
		
		let config = this.getUserConfig();
		
		this.ws = this.useWordspaceFromGdocs();
		this.filter = this.ws.dicEntries;
		
		this.riddleLangCode = config.getDefaultRiddleLangCode(this.ws);
		this.guessLangCode = config.getDefaultGuessLangCode(this.ws);
		this.currLevelNo  = config.getDefaultCurrLevelNo(this.ws);		
		this.currLessonNo = config.getDefaultCurrLessonNo(this.ws);
		
		this.currPartOfSpeach = config.getDefaultPartOfSpeachCode(this.ws);
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
	
	assembleCurrFilter() {
		
		let filter = new Array();
		
		let query = new Array();
		
		query.lessonNo = this.getCurrLessonNo();
		query.partOfSpeach = this.getCurrPartOfSpeach();
		
		filter = this.getWordspace().selectDicEntries(query);
		
		return filter;
	}
	
	getCurrLevelNo() {
		return this.currLevel;
	}
	
	setCurrLevel(levelNo) {
		this.currLevelNo = levelNo;
	}
	
	getCurrLessonNo() {
		return this.currLessonNo;
	}

	setCurrLesson(lessonNo) {
		this.currLessonNo = lessonNo;
		this.filter = this.assembleCurrFilter();
	}

	getRiddleLangCode() {
		return this.riddleLangCode;
	}
	
	setRiddleLang(langCode) {
		this.riddleLangCode = langCode;
		this.takeNextQuestion();
	}
	
	getGuessLangCode() {
		return this.guessLangCode;
	}
	
	setGuessLang(langCode) {
		this.guessLangCode = langCode;
	}

	useDummyWordspace() {
		var hatul = new DicWordInfo("he", "חתול");
		var cat = new DicWordInfo("ru", "кот");
		var hatul_cat = new DicEntry();
		hatul_cat.addWordInfo(hatul);
		hatul_cat.addWordInfo(cat);
		var more = new DicWordInfo("he", "מוֹרֶה");
		var teacher = new DicWordInfo("ru", "учитель");
		var more_techer = new DicEntry();
		more_techer.addWordInfo(more);
		more_techer.addWordInfo(teacher);
		var ws = new Wordspace();
		ws.addDicEntry(hatul_cat);
		ws.addDicEntry(more_techer);
		return ws;
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
	
	useWordspaceFromGdocs() {
		
		let gdoc = new WsSpreadsheet();
		gdoc.fetch();
		
		let ws = new Wordspace();
		
		let targetLangCode = ws.getTargetLangCode();
		
		for(let partOfSpeach in gdoc.doc.sheets) {
			
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
				
				ws.appendDicEntry(dicEntry);
			}
		}
		
		return ws;
	}
	
	getWordspace() {
		return this.ws;
	}
	
	getCurrDicEntry() {
		return this.currDicEntry;
	}
	
	setCurrDicEntry(dicEntry) {
		this.currDicEntry = dicEntry;
	
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
	
	getCurrPartOfSpeach() {
		return this.currPartOfSpeach;
	}
	
	setCurrPartOfSpeach(partOfSpeachCode) {
		this.currPartOfSpeach = partOfSpeachCode;
		this.filter = this.assembleCurrFilter();
	}
	
	selectLexemesByFilters() {
		
		let query = new Array();
		
		query.lessonNo = this.getCurrLessonNo();
		query.partOfSpeach = this.getCurrPartOfSpeach();
		
		this.filter = this.getWordspace().selectDicEntries(query);
		
		this.takeNextQuestion();
	}
	
	selectRandomWord(langCode) {
		let randomLexemeIdx = randomInt(0, this.filter.length - 1);
		return this.filter[randomLexemeIdx];
	}

	giveUp() {
		
		let visibleAreaName = this.getMainPage().getVisibleAreaName();
		
		switch(visibleAreaName) {
			case "question": 
			case "prompt":
				let guessLangCode = this.getGuessLangCode();
				let guessWordInfo = this.getCurrDicEntry().wordInfos[guessLangCode];
				this.getMainPage().displayAnswer(guessWordInfo);
				break;
			case "answer":
				let riddleLangCode = this.getRiddleLangCode();
				let riddleWordInfo = this.getCurrDicEntry().wordInfos[riddleLangCode];
				this.getMainPage().displayQuestion(riddleWordInfo);
				break;
			case "mnemoPhrase":
				switch(this.getMainPage().getMnemoPhraseState()) {
					case "concealed":	
						this.getMainPage().discloseTargetWords();
						break;
					case "disclosed":
						let baseLangCode = this.getRiddleLangCode();
						let baseWordInfo = this.getCurrDicEntry().wordInfos[baseLangCode];
						this.getMainPage().displayQuestion(baseWordInfo);
				}
		}
	}
	
	showPrompt() {
		
		let guessLangCode = this.getGuessLangCode();
		
		let guessWordInfo = this.getCurrDicEntry().wordInfos[guessLangCode];
		
		let riddleLangCode = this.getRiddleLangCode();
		
		let mnemoPhrase = this.getCurrDicEntry().getMnemoPhrase(riddleLangCode);
		
		if(mnemoPhrase)
			this.getMainPage().displayMnemoPhrase(mnemoPhrase);
		else
			this.getMainPage().displayPrompt(guessWordInfo);
	}

	takeNextQuestion() {
		
		
		if(this.filter.length != 0) {
			let ws = this.getWordspace();
			let riddleLangCode = this.getRiddleLangCode();
			let randomWord = this.selectRandomWord(riddleLangCode);
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
	
	play() {
		
		let mainPage = this.getMainPage();
		this.setRiddleLang(mainPage.riddleLangSelector.getUiControlValue());
		this.setGuessLang(mainPage.guessLangSelector.getUiControlValue());
		this.takeNextQuestion();
	}
}
