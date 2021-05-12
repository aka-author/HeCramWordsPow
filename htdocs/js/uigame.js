//* * ** *** ***** ******** ************* *********************
// Project: Nakar
// Module:  Play of Words
// Layer:	Web front-end
// File:	mainpage.js                           (\_/)
// Func:	UI controls specific for the game     (^.^)
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
		let oldRiddleLangCode = game.getCurrRiddleLangCode();
		let guessLangCode = game.getCurrGuessLangCode();
		let targetLangCode = game.getTargetLangCode();
		game.setCurrRiddleLang(newRiddleLangCode);
		let parentUiControl = this.getChief();
		if(newRiddleLangCode == targetLangCode && guessLangCode == targetLangCode) {
			parentUiControl.guessLangSelector.setUiControlValue({"code" : oldRiddleLangCode});
			game.setCurrGuessLang(oldRiddleLangCode);
		} 
		else if(newRiddleLangCode != targetLangCode && guessLangCode != targetLangCode) {
			parentUiControl.guessLangSelector.setUiControlValue({"code" : targetLangCode});
			game.setCurrGuessLang(targetLangCode);
		}
		
		//this.getChief().subjectDomainCloud.showLocalWordings(this.getGame().currBaseLangCode);
		
	}	
}


class GuessLangSelector extends LangSelector {
	
	onChange() {	
		let newGuessLangCode = this.getUiControlValue();
		let game = this.getGame();
		let oldGuessLangCode = game.getCurrGuessLangCode();
		game.setCurrGuessLang(newGuessLangCode);
		let parentUiControl = this.getChief();
		let riddleLangCode = game.getCurrRiddleLangCode();
		let targetLangCode = game.getTargetLangCode();
		if(newGuessLangCode == targetLangCode && riddleLangCode == targetLangCode) {
			parentUiControl.riddleLangSelector.setUiControlValue({"code" : oldGuessLangCode});
			game.setCurrRiddleLang(oldGuessLangCode);
		} 		
		else if(newGuessLangCode != targetLangCode && riddleLangCode != targetLangCode){
			parentUiControl.riddleLangSelector.setUiControlValue({"code" : targetLangCode});
			game.setCurrRiddleLang(targetLangCode);
		}
	}
}


class PartOfSpeachSelector extends Selector {
	
	assembleDomObjectValue(uiControlValue) {
		return uiControlValue.code;
	}
	
	assembleDomObjectValueAppearance(uiControlValue) {
		return uiControlValue.wording;
	}

	onChange() {
		this.getGame().setCurrPartOfSpeach(this.getUiControlValue());
	}

}

class LexemeArea extends Area {

	setDomObjectValue(headword) {
		this.getDomObject().innerHTML = headword;
	}

	assembleDomObjectValue(Lexeme) {
		return Lexeme ? Lexeme.getHeadword() : "";
	}

}


class PromptLexemeArea extends LexemeArea {

	assembleDomObjectValue(Lexeme) {
		
		let base = headwordBase(Lexeme.getHeadword());
		
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
	
	splitPhraseLine(phraseLine) {
					   
		let splitter = new SubstFormalSplitter(phraseLine);	
 
		return splitter.split().getClauses();				   
	}
	
	targetSpan(token) {
		let span = document.createElement("span");
		let node = document.createTextNode(token);
		span.appendChild(node);
		span.setAttribute("lang", "he");
		span.setAttribute("class", "hebrewWordInMnemoPhrase");
		return span;
	}
	
	baseSpan(token) {
		let span = document.createElement("span");
		let node = document.createTextNode(token);
		span.appendChild(node);
		return span;
	}
	
	markupPhraseLine(phraseLine) {
	
		let tokens = this.splitPhraseLine(phraseLine); 
		
		console.log(tokens);

		let spans = new Array();
		
		for(let tokenIdx in tokens) {
			
			let token = tokens[tokenIdx];
			
			if(token.isSubst()) {
				let targetSpan = this.targetSpan(token.getContent());
				spans.push(targetSpan); 
				this.targetSpans.push(targetSpan); 
			}	
			else 
				spans.push(this.baseSpan(token.getContent()));
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
		
		this.targetSpans = new Array();
		
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
		for(let targetSpanIdx in this.targetSpans) {
			this.targetSpans[targetSpanIdx].setAttribute("class", 
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


class subjectDomainTagCloudSwitch extends UiControl {
	
	onChange() {
		let switchImg = document.getElementById("subjectDomainCloudSwitchImg");
		let cloud = document.getElementById("subjectDomainCloudDiv");
		let state = cloud.style.display;
		cloud.style.display = state == "none" ? "" : "none";
		switchImg.src = state == "none" ? "img/glaz-zakr.png" : "img/glaz-otkr.png";
	}
	
}

class SubjectDomainTagCloud extends TagCloud {
	
	onChange() {
		this.getGame().setCurrSubjectDomains(this.getUiControlValue());
	}
	
}


class WordListSwitch extends UiControl {
	
	onChange() {
		let switchImg = document.getElementById("wordListSwitchImg");
		let list = document.getElementById("wordListSubBlockDiv");
		let state = list.style.display;
		list.style.display = state == "none" ? "" : "none";
		switchImg.src = state == "none" ? "img/glaz-zakr.png" : "img/glaz-otkr.png";
	}
	
}


class WordList extends UiControl {

	assembleWordListTd(dicEntry, _langCode=undefined) {
		
		let wordListTd = document.createElement("td");
				
		let langCode = _langCode ?? this.getTargetLangCode();
		
		let extDicUrl = 
			this.assembleExtDicUrl(dicEntry, langCode, 
					this.getCurrBaseLangCode(), this.getCurrUiLangCode());
		
		let headword = dicEntry.getHeadword(langCode);
		
		let innerHtml = 
				langCode == this.getTargetLangCode() ? 
					wrapIntoLink(headword, extDicUrl, "_blank") : 
					wrapIntoSpan(headword);
		
		if(isHtmlElement(innerHtml))
			innerHtml.setAttribute("class", "wordListLink");
		
		wordListTd.appendChild(innerHtml);
		
		wordListTd.setAttribute("lang", langCode);
		wordListTd.setAttribute("dir", "auto");
		
		return wordListTd;
	}
	
	assembleExtDicUrl(dicEntry, langCode, baseLangCode, uiLangCode) {
		
		let url = "";
		
		let urlTemplate = this.getWordspace().getExternalDic(baseLangCode);
		
		let headword = dicEntry.getHeadword(langCode);
		
		let params = {"headword"    : headword, 
					  "target_lang" : langCode,
					  "base_lang"   : baseLangCode,
					  "ui_lang"     : uiLangCode};
		
		let externalDicLinkTemplate = this.getWordspace().getExternalDic(baseLangCode);
		
		let splitter = new SubstFormalSplitter(externalDicLinkTemplate); 		
		
		return splitter.split().substStr(params);
	}

	assembleHtml() {
				
		let countDicEntries = this.currFilter.countItems();
				
		let wordListTable = document.createElement("table");
		wordListTable.setAttribute("id", "wordListTable");
		
		for(let dicEntryIdx = 0; dicEntryIdx < countDicEntries; dicEntryIdx++) {
			
			let dicEntry = this.currFilter.fetchItemByIdx(dicEntryIdx);
			let dicEntryTr = document.createElement("tr");
			
			let riddleTd = this.assembleWordListTd(dicEntry, this.currRiddleLangCode);
			dicEntryTr.appendChild(riddleTd);
			
			let guessTd = this.assembleWordListTd(dicEntry, this.currGuessLangCode);	
			dicEntryTr.appendChild(guessTd);
			
			wordListTable.appendChild(dicEntryTr);
		}
		
		return wordListTable;
	}
	
	setParams(filter, riddleLangCode, guessLangCode) {
	
		let dicEntryComparator = new DicEntryComparator(riddleLangCode);
	
		this.currFilter = new Filter();
		this.currFilter.appendItemComparator(dicEntryComparator);
		this.currFilter.joinFilters(filter);
				
		this.currRiddleLangCode = riddleLangCode;
		this.currGuessLangCode = guessLangCode;
		this.html = this.assembleHtml();
		
		let div = this.getDomObject();
		clearInnerHtml(div);
		div.appendChild(this.html);
	}
	
} 


class PrintCardsButton extends Button {

	getPressed() {
		
		this.getGame().printCards();
	}

}
