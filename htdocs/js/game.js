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
		this.srcLang = "en";
		this.targetLang = "he";
		
		this.dic = this.loadDictionaryFromGdocs();
				
		this.currLesson = "all";
	}		

	getLessons() {
		return this.getDictionary().getLessons();
	}
	
	getCurrLesson() {
		return this.currLesson;
	}

	setCurrLesson(lesson) {
		this.currLesson = lesson;
	}

	getSrcLang() {
		return this.srcLang;
	}
	
	setSrcLang(lang) {
		this.srcLang = lang;
		this.takeNextQuestion();
	}
	
	getTargetLang() {
		return this.targetLang;
	}
	
	setTargetLang(lang) {;
		this.targetLang = lang;
	}

	loadDummyDictionary() {
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
		var dic = new Dictionary();
		dic.addDicEntry(hatul_cat);
		dic.addDicEntry(more_techer);
		return dic;
	}	

	loadStaticDictionary() {
		
		let dic = new Dictionary();
		
		for(let i = 0; i < GLOBAL_heru.dic.length; i++) {
			let heWord = new DicWordInfo( "he", GLOBAL_heru.dic[i]["he"]);
			let ruWord = new DicWordInfo( "ru", GLOBAL_heru.dic[i]["ru"]);
			let heru = new DicEntry();
			heru.addWordInfo(heWord);
			heru.addWordInfo(ruWord);
			dic.addDicEntry(heru);
		}	
			
		return dic;
	}	
	
	colname(coltag) {
		return coltag == "ru" ? "russian" : coltag;
	}
	
	loadDictionaryFromGdocs() {
		
		let gdoc = new DicSpreadsheet();
		gdoc.fetch();
		
		let dic = new Dictionary();
		
		let targetDicLang = this.getTargetDicLang();
		
		for(let partOfSpeach in gdoc.doc.sheets) {
			
			let countRows = gdoc.countRows(partOfSpeach);
			let langs = this.getAvailableDicLangs();
			
			for(let rowIdx = 0; rowIdx < countRows;  rowIdx++) {
				
				let dicEntry = new DicEntry();
				
				let headword = gdoc.getSpelling(partOfSpeach, rowIdx);
				let headwordInfo = new DicWordInfo(targetDicLang, headword);
				
				dicEntry.addWordInfo(headwordInfo);
				
				for(let langIdx in langs) {
					let lang = langs[langIdx].code;
					//console.log(lang);
					let translation = gdoc.getTranslation(partOfSpeach, rowIdx, this.colname(lang));
					//console.log(translation);
					let translationWordInfo = new DicWordInfo(lang, translation);
					dicEntry.addWordInfo(translationWordInfo); 
				}
								
				let lesson = gdoc.getLesson(partOfSpeach, rowIdx);
				dicEntry.setLesson(lesson);
				
				let mnemoPoemRu = gdoc.getMnemoPoemRu(partOfSpeach, rowIdx);
				//dicEntry.setMnemoPoem("ru", mnemoPoemRu);
				//console.log(dicEntry)
				dic.addDicEntry(dicEntry);
			}
		}
		
		return dic;
	}
	
	getDictionary() {
		return this.dic;
	}
	
	getCurrDicEntry() {
		return this.currDicEntry;
	}
	
	setCurrDicEntry(dicEntry) {
		this.currDicEntry = dicEntry;
	
	}
	
	getAvailableDicLangs() {
		return [{"code" : "en", "wording" : "English"},
			    {"code" : "es", "wording" : "Española"},
				{"code" : "pt", "wording" : "Português"},
				{"code" : "ru", "wording" : "Русский"}];
	}
	
	getTargetDicLang() {
		return "he";
	}
	
	selectRandomWord(lang) {
		let mainPage = this.getMainPage();
		let lesson = mainPage ? this.getMainPage().getLesson() : "all";
		return this.getDictionary().getRandomEntry(lang, lesson);
	}

	giveUp() {
		
		let visibleAreaName = this.getMainPage().getVisibleAreaName();
		
		switch(visibleAreaName) {
			case "question": 
			case "prompt":
				let targetLang = this.getTargetLang();
				let targetDicWordInfo = this.getCurrDicEntry().dicWordInfos[targetLang];
				this.getMainPage().displayAnswer(targetDicWordInfo);
				break;
			case "answer":
				let srcLang = this.getSrcLang();
				let srcDicWordInfo = this.getCurrDicEntry().dicWordInfos[srcLang];
				this.getMainPage().displayQuestion(srcDicWordInfo);
				break;
			case "mnemoPoem":
				switch(this.getMainPage().getMnemoPoemState()) {
					case "concealed":	
						this.getMainPage().discloseHebrewWords();
						break;
					case "disclosed":
						let srcLang = this.getSrcLang();
						let srcDicWordInfo = this.getCurrDicEntry().dicWordInfos[srcLang];
						this.getMainPage().displayQuestion(srcDicWordInfo);
				}
		}
	}
	
	showPrompt() {
		let targetLang = this.getTargetLang();
		let targetDicWordInfo = this.getCurrDicEntry().dicWordInfos[targetLang];
		
		let mnemoPoem = this.getCurrDicEntry().getMnemoPoem("ru");
		if(mnemoPoem)
			this.getMainPage().displayMnemoPoem(mnemoPoem);
		else
			this.getMainPage().displayPrompt(targetDicWordInfo);
	}

	takeNextQuestion() {
		
		let dic = this.getDictionary();
		let srcLang = this.getSrcLang();
		let randomWord = this.selectRandomWord(srcLang);
		this.setCurrDicEntry(randomWord);	
		
		let srcDicWordInfo = randomWord.dicWordInfos[srcLang];
		this.getMainPage().displayQuestion(srcDicWordInfo);
	}
	
	play() {
		
		let mainPage = this.getMainPage();
		this.setSrcLang(mainPage.srcLangSelector.getObjectValue());
		this.setTargetLang(mainPage.targetLangSelector.getObjectValue());
		this.takeNextQuestion();
	}
}




