//* * ** *** ***** ******** ************* *********************
// Project: Nakar
// Module:  Play of Words
// Layer:	Web front-end
// File:	mainpage.js                           (\_/)
// Func:	The main page of the POW module       (^.^)
//* * ** *** ***** ******** ************* *********************

class MainPage extends Bureaucrat {
	
	constructor(app) {
		
		super(app, "MAINPAGE");
		
		this.app = app;
		
		this.uiLangs = this.fetchUiLangs();
				
		this.createUiLangSelector();
		
		this.createMainMenuItems();
		this.createMainGroupOfPanes();
		this.wordsMainMenuItem.onSwitch();
		
		this.createSections();
		
		this.levelSelector = new LevelSelector(this, "levelSelectorSelect");
		this.lessonSelector = new LessonSelector(this, "lessonSelectorSelect");
		this.riddleLangSelector = new RiddleLangSelector(this, "riddleLangSelectorSelect");
		this.guessLangSelector = new GuessLangSelector(this, "guessLangSelectorSelect");
		this.partOfSpeachSelector = new PartOfSpeachSelector(this, "partOfSpeachSelectorSelect");
		
		this.subjectDomainTagCloudSwitch = new subjectDomainTagCloudSwitch(this, "subjectDomainCloudSwitchDiv");
		this.subjectDomainTagCloud = new SubjectDomainTagCloud(this, "subjectDomainCloudDiv");
			
		this.questionArea = new LexemeArea(this, "questionAreaDiv");
		this.answerArea = new LexemeArea(this, "answerAreaDiv");
		this.promptArea = new PromptLexemeArea(this, "promptAreaDiv");
		this.mnemoPhraseArea = new MnemoPhraseArea(this, "mnemoPhraseAreaDiv");
		
		this.LexemeAreas = 
			{"question"    : this.questionArea,
			 "answer"      : this.answerArea,
			 "prompt"      : this.promptArea,
			 "mnemoPhrase" : this.mnemoPhraseArea};
			 
		this.visibleArea = "question";	 
		
		this.giveUpButton = new GiveUpButton(this, "giveUpButtonImg");
		this.showPromptButton = new ShowPromptButton(this, "showPromptButtonImg");
		this.takeNextQuestionButton = new TakeNextQuestionButton(this, "takeNextQuestionButtonImg");
		
		this.wordListSwitch = new WordListSwitch(this, "wordListSwitchSpan");
		this.wordList = new WordList(this, "wordListDiv");
		
		this.createLongreads();	

		this.setCurrUiLang(this.getUiLang(this.getUserConfig().getUiLangCode()));
		
		this.printCardsButton = new PrintCardsButton(this, "printButton");	

		this.externalLinkInput = new ExternalLinkInput(this, "extlinkInput");
		this.externalLinkClearButton = new ExternalLinkClearButton(this, "extlinkClearImg");
        this.externalLinkCopyButton = new ExternalLinkCopyButton(this, "extlinkCopyButtonImg");

	}		
		
	// Title
	
	setTitle(title) {
		
		let appName = this.getI18n().getText("appName", this.getCurrUiLang());
		
		document.title = appName + " - " + title;
		
		document.getElementById("wordspaceTitleDiv").innerHTML = title;
		
	}
	
	
	// Game and wordspace	
	
	setGame() {
	
		let game = this.getGame();
		
		let ws = game.getWordspace();
		let wsId = ws.getId();
		let targetLangCode = ws.getTargetLangCode();
		let targetLangName = ws.getTargetLangName();
		let defaultBaseLangCode = ws.getDefaultBaseLangCode();
	}
		
		
	// UI language 
	
	fetchUiLangs() {
		return new Factor(new Lang("en", "English"),
					      new Lang("es", "Española"),
					      new Lang("pt", "Português"),
					      new Lang("ru", "Русский"));
	}
	
	getUiLangs() {
		return this.uiLangs;
	}
	
	isUiLangAvailable(langCode) {
		return this.getUiLangs().exists(langCode);
	}
	
	getUiLang(langCode) {
		return this.getUiLangs().getValue(langCode);
	}
	
	getCurrUiLangCode() {
		return this.uiCurrLangCode;
	}
	
	getCurrUiLang() {
		return this.getUiLangs().getValue(this.getCurrUiLangCode());
	}
	
	setCurrUiLang(lang) {		
		
		let langCode = lang.getCode();
		this.currUiLangCode = this.isUiLangAvailable(langCode) ? langCode : "en";
			
		this.getI18n().loadLocalLabels(document, this.currUiLangCode);
		this.localizeSubjectDomainTagCloud(this.currUiLangCode);
		this.uiLangSelector.setUiControlValue(lang);
		
		this.update();

		this.getUserConfig().setUiLangCode(this.currUiLangCode);
	}
	
	propagateCurrUiLang() {
		this.setCurrUiLang(this.getUiLang(this.currUiLangCode));
	}
	
	createUiLangSelector() {
		this.uiLangSelector = new UiLangSelector(this, "uiLangSelectorSelect");
		this.uiLangSelector.appendOptions(this.getUiLangs().getValues());
	}
	
	
	// Provider info
	
	showProviderInfo() {
	
		let providerSpan = document.createElement("span");
	
		let provider = this.getWordspace().getProvider();
		
		if(provider.primaryAuthor) {
			
			let primaryAuthorA = wrapIntoLink(provider.primaryAuthor, 
									provider.primaryAuthorUrl, "_new");
						
			if(isHtmlElement(primaryAuthorA))
				primaryAuthorA.setAttribute("class", "providerRef");								
									
			providerSpan.appendChild(primaryAuthorA);

			if(provider.name) {
			
				let commaText = document.createTextNode(", ");
				
				providerSpan.appendChild(commaText);
			}
		}
		
		if(provider.name) {
			
			let providerA = wrapIntoLink(provider.name, provider.website, "_new");
			
			if(isHtmlElement(providerA))
				providerA.setAttribute("class", "providerRef");
			
			providerSpan.appendChild(providerA);
		}
		
		let providerRefDiv = document.getElementById("providerRefDiv");
		
		providerRefDiv.innerHTML = "";
		providerRefDiv.appendChild(providerSpan);
	}
	
	// Main menu
	
	createMainMenuItems() {
		
		this.wordsMainMenuItem   = new MainMenuItem(this, "wordsMenuItemSpan");
		this.spacesMainMenuItem  = new MainMenuItem(this, "spacesMenuItemSpan");
		this.serviceMainMenuItem = new MainMenuItem(this, "serviceMenuItemSpan");

		this.aboutUsMainMenuItem = new MainMenuItem(this, "aboutUsMenuItemSpan");
		this.partnerMainMenuItem = new MainMenuItem(this, "partnerMenuItemSpan");
		this.techdocMainMenuItem = new MainMenuItem(this, "techdocMenuItemSpan");
		this.helpMainMenuItem    = new MainMenuItem(this, "helpMenuItemSpan");
	}
	
	getCurrLevelNo() {
		return this.levelSelector.getUiControlValue();
	}
	
	getCurrLessonNo() {
		return this.lessonSelector.getUiControlValue();
	}
	
	
	// Main group of panes
	
	createMainGroupOfPanes() {
		
		this.mainGroupOfPanes = new GroupOfPanes(this, "contentArea");
		
		this.wordsPane = new Pane(this.mainGroupOfPanes, "wordsPaneDiv");
		this.mainGroupOfPanes.appendPane(this.wordsPane, this.wordsMainMenuItem);
		
		this.spacesPane = new Pane(this.mainGroupOfPanes, "spacesPaneDiv");
		this.mainGroupOfPanes.appendPane(this.spacesPane, this.spacesMainMenuItem);
		
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
	
	
	// Sections
	
	createSections() {
		this.subjectDomainTagsSection = new SubjectDomainTagsSection(this);
		this.gamingSection = new GamingSection(this);	
		this.wordListSection = new WordListSection(this);	
	}
	
	
	// Cloud of tags 
	
	setSubjectDomainTags(tagRecords, tagLocalWordings) {		
		this.subjectDomainTagCloud.appendTags(tagRecords);
		this.subjectDomainTagCloud.setTagLocalWordings(tagLocalWordings);
	}
	
	localizeSubjectDomainTagCloud(localTags, langCode) {		
		this.subjectDomainTagCloud.showLocalWordings(langCode);
	}
	
	
	// Longreads 
	
	assembleLongreadUrl(localPath) {
		return "/cramwords/topics/{lang_code}/" + localPath;
	}		
	
	createLongreads() {
	
		this.wordspaceDirectory = new Longread(this, "wordspaceDirectoryDiv",
			this.assembleLongreadUrl("wordspace-directory.html"));
	
		this.createWordsheet = new Longread(this, "extlinkCreateTableProcDiv",
			this.assembleLongreadUrl("create-wordsheet.html"))
	
		this.aboutPage = new Longread(this, "aboutUsLongreadDiv", 
			this.assembleLongreadUrl("about.html"));
			
		this.partnerPage = new Longread(this, "partnerLongreadDiv", 
			this.assembleLongreadUrl("friends.html"));

		this.docsPage = new Longread(this, "techdocLongreadDiv", 
			this.assembleLongreadUrl("techdoc.html"));

		this.helpPage = new Longread(this, "helpLongreadDiv", 
			this.assembleLongreadUrl("help.html"));				
	}
	
	
	// Game
	
	getVisibleAreaName() {
		return this.visibleArea;
	}
	
	getMnemoPhraseState() {
		return this.mnemoPhraseState;
	}
	
	displayLexemeArea(targetAreaName) {
		for(let areaName in this.LexemeAreas)
			if(areaName == targetAreaName) {
				this.LexemeAreas[areaName].show();
				this.visibleArea = areaName;
			}	
			else 
				this.LexemeAreas[areaName].hide();
	}
	
	displayQuestion(Lexeme) {
		this.questionArea.setUiControlValue(Lexeme);
		this.displayLexemeArea("question");
	}
	
	displayPrompt(Lexeme) {
		this.promptArea.setUiControlValue(Lexeme);
		this.displayLexemeArea("prompt");
	}
	
	displayMnemoPhrase(mnemoPhrase) {
		this.mnemoPhraseArea.setUiControlValue(mnemoPhrase);
		this.displayLexemeArea("mnemoPhrase");
		this.mnemoPhraseState = "concealed";
	}
	
	discloseTargetWords() {
		this.mnemoPhraseArea.discloseTargetWords();
		this.mnemoPhraseState = "disclosed";	
	}
	
	displayAnswer(Lexeme) {
		this.answerArea.setUiControlValue(Lexeme);
		this.displayLexemeArea("answer");
	}
	
}


class UiLangSelector extends LangSelector {
	
	onChange() {
		let lang = this.getUiControlValue();
		this.getChief().setCurrUiLang(lang);
	}
	
}