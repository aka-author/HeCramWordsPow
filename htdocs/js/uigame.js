//* * ** *** ***** ******** ************* *********************
// Game User Interface
//
//                                                (\_/)
//                                                (^.^) 
//* * ** *** ***** ******** ************* *********************

class LessonSelector extends Selector {
	
	publishObjectValue(objectValue) {
		return objectValue == "all" ? "Все" : String(objectValue);	
	}
	
	appendLessons(lessons) {
		this.appendOptions(lessons);
	}
	
	onChange() {
		this.getGame().setCurrLesson(this.getObjectValue);
		this.getGame().takeNextQuestion();
	}	

}


class LangSelector extends Selector {
}


class SrcLangSelector extends LangSelector {
	
	onChange() {
				
		let newSrcLang = this.getObjectValue();
		let game = this.getGame();
		let oldSrcLang = game.getSrcLang();
		game.setSrcLang(newSrcLang);
		let parentControl = this.getParentControl();
		if(newSrcLang != "he") {
			parentControl.targetLangSelector.setObjectValue("he");
			game.setTargetLang("he");
		} 
		else {
			parentControl.targetLangSelector.setObjectValue(oldSrcLang);
			game.setTargetLang(oldSrcLang);
		}			
	}
}


class TargetLangSelector extends LangSelector {
	
	onChange() {
		let newTargetLang = this.getObjectValue();
		let game = this.getGame();
		let oldTargetLang = game.getTargetLang();
		game.setTargetLang(newTargetLang);
		let parentControl = this.getParentControl();
		if(newTargetLang != "he") {
			parentControl.srcLangSelector.setObjectValue("he");
			game.setSrcLang("he");
		} 
		else {
			parentControl.srcLangSelector.setObjectValue(oldTargetLang);
			game.setSrcLang(oldTargetLang);
		}	
	}	
}


class WordInfoArea extends Area {

	setControlValue(headword) {
		this.getControl().innerHTML = headword;
	}

	serializeObjectValue(dicWordInfo) {
		return dicWordInfo.getHeadword();
	}

}


class PromptWordInfoArea extends WordInfoArea {

	serializeObjectValue(dicWordInfo) {
		
		let base = headwordBase(dicWordInfo.getHeadword());
		
		let wordPrompt = firstChr(base);
			
		if(base.length > 1)	
			wordPrompt += multiChr("-", base.length - 2) + lastChr(base);
		
		return wordPrompt;
	}

}


class MnemoPoemArea extends Area {
	
	setControlValue(poemDiv) {
		this.getControl().innerHTML = "";
		this.getControl().appendChild(poemDiv);
	}
	
	splitPoemLine(poemLineRemain, stack="", tokens=null) {
		
		if(!tokens)
			var tokens = new Array();
		
		if(poemLineRemain.length > 0) {
			
			let currChr = firstChr(poemLineRemain)		
			let isCurrChrHebrew = isHebrewChr(currChr);
			
			let isPrevChrHebrew = stack.length > 0 ? 
				isHebrewChr(lastChr(stack)) : isCurrChrHebrew;
			
			if(isPrevChrHebrew != isCurrChrHebrew) { 
				tokens.push(stack);
				stack = "";
			}	
				
			stack += currChr;	
				
			if(poemLineRemain.length > 0)
				this.splitPoemLine(trimFirstChr(poemLineRemain),
								   stack,
								   tokens);
		}
		else 
			if(stack.length > 0 )
				tokens.push(stack);
					   
		return tokens;					   
	}
	
	hebrewSpan(token) {
		let span = document.createElement("span");
		let node = document.createTextNode(token);
		span.appendChild(node);
		span.setAttribute("lang", "he");
		span.setAttribute("class", "hebrewWordInMnemoPoem");
		return span;
	}
	
	usualSpan(token) {
		let span = document.createElement("span");
		let node = document.createTextNode(token);
		span.appendChild(node);
		return span;
	}
	
	markupPoemLine(poemLine) {
	
		let tokens = this.splitPoemLine(poemLine);

		let spans = new Array();
		
		for(let tokenIdx in tokens) {
			
			let token = tokens[tokenIdx];
			
			if(isHebrewTextInside(token)) {
				let hebrewSpan = this.hebrewSpan(token);
				spans.push(hebrewSpan); 
				this.hebrewSpans.push(hebrewSpan); 
			}	
			else 
				spans.push(this.usualSpan(token));
		}
		
		return spans;
	}
	
	splitPoem(poem) {
	
		let rawPoemLines = poem.split(/\//);
		
		let poemLines = new Array();
		
		for(let poemLineIdx in rawPoemLines)
			poemLines.push(rawPoemLines[poemLineIdx].trim());
		
		return poemLines;
	}
	
	serializeObjectValue(mnemoPoem) {
		
		let poemLines = this.splitPoem(mnemoPoem);
		
		this.hebrewSpans = new Array();
		
		let poemDiv = document.createElement("div");
		
		for(let poemLineIdx in poemLines) {
			
			let poemLineDiv = document.createElement("div");

			let poemLineSpans = this.markupPoemLine(poemLines[poemLineIdx]);

			for(let spanIdx in poemLineSpans)	
				poemLineDiv.appendChild(poemLineSpans[spanIdx]);
			
			poemDiv.appendChild(poemLineDiv);
		}
		
		return poemDiv;
	}
	
	discloseHebrewWords() {
		for(let hebrewSpanIdx in this.hebrewSpans) {
			this.hebrewSpans[hebrewSpanIdx].setAttribute("class", 
		"hebrewDisclosedWordInMnemoPoem"); }
	}
	
}


class Button extends UIControl {
	
	animatePress() {}
	
	performAction() {}
	
	getPressed() {
		this.animatePress();
		this.performAction();
	}
}


class GraphButton extends Button {
}


class GiveUpButton extends GraphButton {
	
	performAction() {
		this.getGame().giveUp();
	}
}


class ShowPromptButton extends GraphButton {
	
	performAction() {
		this.getGame().showPrompt();
	}
}


class TakeNextQuestionButton extends GraphButton {
	
	performAction() {
		this.getGame().takeNextQuestion();
	}
}


class MainGroupOfPanesLabel extends PaneLabel {
	
	goFront() {
		this.getControl().style.textDecoration = "none";
		this.getControl().style.cursor = "default";
	}
	
	goBack() {
		this.getControl().style.textDecoration = "underline";
		this.getControl().style.cursor = "pointer";
	}
}

class MainPage {
	
	constructor(game) {
		
		// Creating a main menu
		this.mainGroupOfPanes = new GroupOfPanes(this, "mainGroupOfPanes");
		
		this.learnPane = new Pane(this.mainGroupOfPanes, "learnPaneDiv");
		this.learnPaneLabel = new MainGroupOfPanesLabel(this, "learnMenuItemSpan");
		this.mainGroupOfPanes.appendPane(this.learnPane, this.learnPaneLabel);
		
		this.teachPane = new Pane(this.mainGroupOfPanes, "teachPaneDiv");
		this.teachPaneLabel = new MainGroupOfPanesLabel(this, "teachMenuItemSpan");
		this.mainGroupOfPanes.appendPane(this.teachPane, this.teachPaneLabel);
		
		this.servicePane = new Pane(this.mainGroupOfPanes, "servicePaneDiv");
		this.servicePaneLabel = new MainGroupOfPanesLabel(this, "serviceMenuItemSpan");
		this.mainGroupOfPanes.appendPane(this.servicePane, this.servicePaneLabel);
		
		this.aboutUsPane = new Pane(this.mainGroupOfPanes, "aboutUsPaneDiv");
		this.aboutUsPaneLabel = new MainGroupOfPanesLabel(this, "aboutUsMenuItemSpan");
		this.mainGroupOfPanes.appendPane(this.aboutUsPane, this.aboutUsPaneLabel);
		
		this.learnPaneLabel.onSwitch();
		
		
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
	}		
	
	getGame() {
		return this.game;
	}
	
	getVisibleAreaName() {
		return this.visibleArea;
	}
	
	getLesson() {
		return this.lessonSelector.getObjectValue();
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