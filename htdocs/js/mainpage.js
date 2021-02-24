//* * ** *** ***** ******** ************* *********************
// The main page of the POW module
//
//                                               (\_/)
//                                               (^.^) 
//* * ** *** ***** ******** ************* *********************

class MainPage {
	
	constructor(game, i18n) {
		
		this.currUiLang = "en";
		this.createUiLangSelector();
		
		this.createMainMenuItems();
		this.createMainGroupOfPanes();
		this.wordsMainMenuItem.onSwitch();
		
		this.lessonSelector = new LessonSelector(this, "lessonSelectorSelect");
		let lessons = ["all"].concat(game.getLessons());
		this.lessonSelector.appendLessons(lessons);
		this.lessonSelector.setObjectValue(game.getCurrLesson());
		
		this.srcLangSelector = new SrcLangSelector(this, "srcLangSelectorSelect");
		this.targetLangSelector = new TargetLangSelector(this, "targetLangSelectorSelect");
		
		this.questionArea = new WordInfoArea(this, "questionAreaDiv");
		this.answerArea = new WordInfoArea(this, "answerAreaDiv");
		this.promptArea = new PromptWordInfoArea(this, "promptAreaDiv");
		this.mnemoPoemArea = new MnemoPoemArea(this, "mnemoPoemAreaDiv");
		
		this.wordInfoAreas = 
			{"question"  : this.questionArea,
			 "answer"    : this.answerArea,
			 "prompt"    : this.promptArea,
			 "mnemoPoem" : this.mnemoPoemArea};
			 
		this.visibleArea = "question";	 
		
		this.giveUpButton = 
			new GiveUpButton(this, "giveUpButtonImg");
		this.showPromptButton = 
			new ShowPromptButton(this, "showPromptButtonImg");
		this.takeNextQuestionButton = 
			new TakeNextQuestionButton(this, "takeNextQuestionButtonImg");
		
		this.game = game;
		this.game.setMainPage(this);
		
		
		this.game.setSrcLang(this.srcLangSelector.getObjectValue());
		this.game.setTargetLang(this.targetLangSelector.getObjectValue());
		this.game.takeNextQuestion();
		
		this.i18n = i18n;
		this.i18n.loadLocalLabels(document);
	}		
	
	
	// UI language 
	
	getAvailableUiLangs() {
		return [{"value" : "en", "wording" : "English"},
			    {"value" : "es", "wording" : "Española"},
			    {"value" : "he", "wording" : "עברית"},
				{"value" : "pt", "wording" : "Português"},
				{"value" : "ru", "wording" : "Русский"}];
	}
	
	getCurrUiLang() {
		return this.uiLang;
	}
	
	setCurrUiLang(lang) {
		this.currUiLang = lang;
		this.i18n.loadLocalLabels(document, lang);
	}
	
	createUiLangSelector() {
		this.uiLangSelector = new UiLangSelector(this, "uiLangSelectorSelect");
		this.uiLangSelector.appendOptions(this.getAvailableUiLangs());
	}
	
	
	// Main menu
	
	createMainMenuItems() {
		this.wordsMainMenuItem   = new MainMenuItem(this, "wordsMenuItemSpan");
		this.textsMainMenuItem   = new MainMenuItem(this, "textsMenuItemSpan");
		this.serviceMainMenuItem = new MainMenuItem(this, "serviceMenuItemSpan");

		this.aboutUsMainMenuItem = new MainMenuItem(this, "aboutUsMenuItemSpan");
		this.partnerMainMenuItem = new MainMenuItem(this, "partnerMenuItemSpan");
		this.techdocMainMenuItem = new MainMenuItem(this, "techdocMenuItemSpan");
		this.helpMainMenuItem    = new MainMenuItem(this, "helpMenuItemSpan");
	}
	
	
	// Scope of learning
	
		// Wordspace goes here
	
		// Level goes here 
	
	getLesson() {
		return this.lessonSelector.getObjectValue();
	}
	
	
	// Main group of panes
	
	createMainGroupOfPanes() {
		
		this.mainGroupOfPanes = new GroupOfPanes(this, "mainGroupOfPanes");
		
		this.wordsPane = new Pane(this.mainGroupOfPanes, "wordsPaneDiv");
		this.mainGroupOfPanes.appendPane(this.wordsPane, this.wordsMainMenuItem);
		
		this.textsPane = new Pane(this.mainGroupOfPanes, "textsPaneDiv");
		this.mainGroupOfPanes.appendPane(this.textsPane, this.textsMainMenuItem);
		
		this.servicePane = new Pane(this.mainGroupOfPanes, "servicePaneDiv");
		this.mainGroupOfPanes.appendPane(this.servicePane, this.serviceMainMenuItem);
		
		this.aboutUsPane = new Pane(this.mainGroupOfPanes, "aboutUsPaneDiv");
		this.mainGroupOfPanes.appendPane(this.aboutUsPane, this.aboutUsMainMenuItem);
		
		this.partnerPane = new Pane(this.mainGroupOfPanes, "partnerPaneDiv");
		this.mainGroupOfPanes.appendPane(this.partnerPane, this.partnerMainMenuItem);
		
		this.techdocPane = new Pane(this.mainGroupOfPanes, "techdocPaneDiv");
		this.mainGroupOfPanes.appendPane(this.techdocPane, this.techdocMainMenuItem);
		
		this.helpPane = new Pane(this.mainGroupOfPanes, "helpPaneDiv");
		this.mainGroupOfPanes.appendPane(this.helpPane, this.helpMainMenuItem);
	}
	
	
	// Game
	
	getGame() {
		return this.game;
	}
	
	getVisibleAreaName() {
		return this.visibleArea;
	}
	
	
	
	getMnemoPoemState() {
		return this.mnemoPoemState;
	}
	
	displayWordInfoArea(targetAreaName) {
		for(let areaName in this.wordInfoAreas)
			if(areaName == targetAreaName) {
				this.wordInfoAreas[areaName].show();
				this.visibleArea = areaName;
			}	
			else
				this.wordInfoAreas[areaName].hide();
	}
	
	displayQuestion(dicWordInfo) {
		this.questionArea.setObjectValue(dicWordInfo);
		this.displayWordInfoArea("question");
	}
	
	displayPrompt(dicWordInfo) {
		this.promptArea.setObjectValue(dicWordInfo);
		this.displayWordInfoArea("prompt");
	}
	
	displayMnemoPoem(mnemoPoem) {
		this.mnemoPoemArea.setObjectValue(mnemoPoem);
		this.displayWordInfoArea("mnemoPoem");
		this.mnemoPoemState = "concealed";
	}
	
	discloseHebrewWords() {
		this.mnemoPoemArea.discloseHebrewWords();
		this.mnemoPoemState = "disclosed";	
	}
	
	displayAnswer(dicWordInfo) {
		this.answerArea.setObjectValue(dicWordInfo);
		this.displayWordInfoArea("answer");
	}
}