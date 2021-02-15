//* * ** *** ***** ******** ************* *********************
// The Game
//
//                                                    (\_/)
//                                                    (^.^) 
//* * ** *** ***** ******** ************* *********************

class Game {

	constructor() {
		this.mainPage = null;
		this.srcLang = "ru";
		this.targetLang = "he";
		
		this.dic = this.loadDictionaryFromGdocs();
				
		this.currLesson = "all";
	}		

	getMainPage() {
		return this.mainPage;
	}

	setMainPage(mainPage) {
		this.mainPage = mainPage;
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
	
	loadDictionaryFromGdocs() {
		
		let gdoc = new DicSpreadsheet();
		gdoc.fetch();
		
		let dic = new Dictionary();
		
		for(let partOfSpeach in gdoc.doc.sheets) {
			
			let countRows = gdoc.countRows(partOfSpeach);
			
			for(let rowIdx = 0; rowIdx < countRows;  rowIdx++) {
				
				let heHeadword = gdoc.getSpelling(partOfSpeach, rowIdx);
				let heWord = new DicWordInfo( "he", heHeadword);
				
				let ruHeadword = gdoc.getRussian(partOfSpeach, rowIdx);
				let ruWord = new DicWordInfo( "ru", ruHeadword);
								
				let heru = new DicEntry();
				heru.addWordInfo(heWord);
				heru.addWordInfo(ruWord);
				
				let lesson = gdoc.getLesson(partOfSpeach, rowIdx);
				heru.setLesson(lesson);
				
				let mnemoPoemRu = gdoc.getMnemoPoemRu(partOfSpeach, rowIdx);
				heru.setMnemoPoem("ru", mnemoPoemRu);
				
				dic.addDicEntry(heru);
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
	
	selectRandomWord(lang) {
		let lesson = this.getMainPage().getLesson();
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
}




