//* * ** *** ***** ******** ************* *********************
// Game User Interface
//
//                                                (\_/)
//                                                (^.^) 
//* * ** *** ***** ******** ************* *********************

class LessonSelector extends Selector {
	
	assembleObjectValueAppearence(objectValue) {
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
	
	assembleControlValue(objectValue) {
		return objectValue.value;
	}
	
	assembleControlValueAppearance(objectValue) {
		return objectValue.wording;
	}
}


class SrcLangSelector extends LangSelector {
	
	onChange() {
				
		let newSrcLang = this.getObjectValue();
		let game = this.getGame();
		let oldSrcLang = game.getSrcLang();
		game.setSrcLang(newSrcLang);
		let parentUiControl = this.getparentUiControl();
		if(newSrcLang != "he") {
			parentUiControl.targetLangSelector.setObjectValue("he");
			game.setTargetLang("he");
		} 
		else {
			parentUiControl.targetLangSelector.setObjectValue(oldSrcLang);
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
		let parentUiControl = this.getparentUiControl();
		if(newTargetLang != "he") {
			parentUiControl.srcLangSelector.setObjectValue("he");
			game.setSrcLang("he");
		} 
		else {
			parentUiControl.srcLangSelector.setObjectValue(oldTargetLang);
			game.setSrcLang(oldTargetLang);
		}	
	}	
}


class WordInfoArea extends Area {

	setControlValue(headword) {
		this.getControl().innerHTML = headword;
	}

	assembleControlValue(dicWordInfo) {
		return dicWordInfo.getHeadword();
	}

}


class PromptWordInfoArea extends WordInfoArea {

	assembleControlValue(dicWordInfo) {
		
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
	
	assembleControlValue(mnemoPoem) {
		
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


class UiLangSelector extends LangSelector {
	
	onChange() {
		let lang = this.getObjectValue();
		this.getparentUiControl().setCurrUiLang(lang);
	}
	
}
	

class MainMenuItem extends PaneLabel {
	
	sendFront() {
		this.getControl().style.textDecoration = "none";
		this.getControl().style.cursor = "default";
	}
	
	sendBack() {
		this.getControl().style.textDecoration = "underline";
		this.getControl().style.cursor = "pointer";
	}
}


