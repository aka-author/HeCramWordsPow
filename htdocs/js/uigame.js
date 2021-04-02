//* * ** *** ***** ******** ************* *********************
// User Interface Controls Specific for the Game
//
//                                                (\_/)
//                                                (^.^) 
//* * ** *** ***** ******** ************* *********************

//
// Level and lesson selectors
//

class LevelSelector extends Selector {
	
	appendLevels(levels) {
		this.appendOptions(levels);
	}
	
	onChange() {
		// this.getGame().setCurrLesson(this.getUiControlValue());
	}	

}


class LessonSelector extends Selector {
	
	appendLessons(lessons) {
		this.appendOptions(lessons);
	}
	
	onChange() {
		this.getGame().setCurrLesson(this.getUiControlValue());
	}	

}



//
// Language selector
//

class LangSelector extends Selector {
	
	assembleDomObjectValue(uiControlValue) {
		return uiControlValue.code;
	}
	
	assembleDomObjectValueAppearance(uiControlValue) {
		return uiControlValue.wording;
	}
}



//
// Riddle and guess language selectors
//

class RiddleLangSelector extends LangSelector {
	
	onChange() {
		let newRiddleLangCode = this.getUiControlValue();
		let game = this.getGame();
		let oldRiddleLangCode = game.getRiddleLangCode();
		let guessLangCode = game.getGuessLangCode();
		let targetLangCode = game.getTargetLangCode();
		game.setRiddleLang(newRiddleLangCode);
		let parentUiControl = this.getChief();
		if(newRiddleLangCode == targetLangCode && guessLangCode == targetLangCode) {
			parentUiControl.guessLangSelector.setUiControlValue({"code" : oldRiddleLangCode});
			game.setGuessLang(oldRiddleLangCode);
		} 
		else if(newRiddleLangCode != targetLangCode && guessLangCode != targetLangCode) {
			parentUiControl.guessLangSelector.setUiControlValue({"code" : targetLangCode});
			game.setGuessLang(targetLangCode);
		}
		
	}	
}


class GuessLangSelector extends LangSelector {
	
	onChange() {	
		let newGuessLangCode = this.getUiControlValue();
		let game = this.getGame();
		let oldGuessLangCode = game.getGuessLangCode();
		game.setGuessLang(newGuessLangCode);
		let parentUiControl = this.getChief();
		let riddleLangCode = game.getRiddleLangCode();
		let targetLangCode = game.getTargetLangCode();
		if(newGuessLangCode == targetLangCode && riddleLangCode == targetLangCode) {
			parentUiControl.riddleLangSelector.setUiControlValue({"code" : oldGuessLangCode});
			game.setRiddleLang(oldGuessLangCode);
		} 		
		else if(newGuessLangCode != targetLangCode && riddleLangCode != targetLangCode){
			parentUiControl.riddleLangSelector.setUiControlValue({"code" : targetLangCode});
			game.setRiddleLang(targetLangCode);
		}
	}
}


class PartOfSpeachSelector extends Selector {

	onChange() {
		this.getGame().setCurrPartOfSpeachCode(this.getUiControlValue());
	}

}

class WordInfoArea extends Area {

	setDomObjectValue(headword) {
		this.getDomObject().innerHTML = headword;
	}

	assembleDomObjectValue(wordInfo) {
		return wordInfo ? wordInfo.getHeadword() : "";
	}

}


class PromptWordInfoArea extends WordInfoArea {

	assembleDomObjectValue(wordInfo) {
		
		let base = headwordBase(wordInfo.getHeadword());
		
		let wordPrompt = firstChr(base);
			
		if(base.length > 1)	
			wordPrompt += multiChr("-", base.length - 2) + lastChr(base);
		
		return wordPrompt;
	}

}


class MnemoPhraseArea extends Area {
	
	setDomObjectValue(mnemoPhraseDiv) {
		this.getDomObject().innerHTML = "";
		this.getDomObject().appendChild(mnemoPhraseDiv);
	}
	
	splitPhraseLine(phraseLineRemain, stack="", tokens=null) {
		
		if(!tokens)
			var tokens = new Array();
		
		if(phraseLineRemain.length > 0) {
			
			let currChr = firstChr(phraseLineRemain)		
			let isCurrChrHebrew = isHebrewChr(currChr);
			
			let isPrevChrHebrew = stack.length > 0 ? 
				isHebrewChr(lastChr(stack)) : isCurrChrHebrew;
			
			if(isPrevChrHebrew != isCurrChrHebrew) { 
				tokens.push(stack);
				stack = "";
			}	
				
			stack += currChr;	
				
			if(phraseLineRemain.length > 0)
				this.splitPhraseLine(trimFirstChr(phraseLineRemain),
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
		span.setAttribute("class", "hebrewWordInMnemoPhrase");
		return span;
	}
	
	usualSpan(token) {
		let span = document.createElement("span");
		let node = document.createTextNode(token);
		span.appendChild(node);
		return span;
	}
	
	markupPhraseLine(phraseLine) {
	
		let tokens = this.splitPhraseLine(phraseLine);

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
	
	splitPhrase(phrase) {
	
		let rawPhraseLines = phrase.split(/\//);
		
		let phraseLines = new Array();
		
		for(let phraseLineIdx in rawPhraseLines)
			phraseLines.push(rawPhraseLines[phraseLineIdx].trim());
		
		return phraseLines;
	}
	
	assembleDomObjectValue(mnemoPhrase) {
		
		let phraseLines = this.splitPhrase(mnemoPhrase);
		
		this.hebrewSpans = new Array();
		
		let mnemoPhraseDiv = document.createElement("div");
		
		for(let phraseLineIdx in phraseLines) {
			
			let phraseLineDiv = document.createElement("div");

			let phraseLineSpans = this.markupPhraseLine(phraseLines[phraseLineIdx]);

			for(let spanIdx in phraseLineSpans)	
				phraseLineDiv.appendChild(phraseLineSpans[spanIdx]);
			
			mnemoPhraseDiv.appendChild(phraseLineDiv);
		}
		
		return mnemoPhraseDiv;
	}
	
	discloseTargetWords() {
		for(let hebrewSpanIdx in this.hebrewSpans) {
			this.hebrewSpans[hebrewSpanIdx].setAttribute("class", 
		"hebrewDisclosedWordInMnemoPhrase"); }
	}
	
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
		let lang = this.getUiControlValue();
		this.getChief().setCurrUiLang(lang);
	}
	
}
	

class MainMenuItem extends PaneLabel {
	
	sendFront() {
		this.getDomObject().style.textDecoration = "none";
		this.getDomObject().style.cursor = "default";
	}
	
	sendBack() {
		this.getDomObject().style.textDecoration = "underline";
		this.getDomObject().style.cursor = "pointer";
	}
}


class SubjectDomainsTagCloud extends TagCloud {
	
	onChange() {
		this.getGame().setCurrSubjectDomains(this.getUiControlValue());
	}
	
}

