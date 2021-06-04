//* * ** *** ***** ******** ************* *********************
// Project: Nakar
// Module:  Play of Words
// Layer:	Web front-end
// File:	mainpage.js                           (\_/)
// Func:	UI controls specific for the game     (^.^)
//* * ** *** ***** ******** ************* *********************

//
// Level selector
//

class LevelSelector extends Selector {
	
	appendLevels(levels) {
		this.appendOptions(levels);
	}
	
	onChange() {
		this.getGame().selectLevel(this.getUiControlValue());
	}	

}



//
// Lesson selector
//

class LessonSelector extends Selector {
	
	appendLessons(lessons) {
		this.appendOptions(lessons);
	}
	
	onChange() {
		this.getGame().selectLesson(this.getUiControlValue());
	}	

}



//
// Language selector
//

class LangSelector extends Selector {
	
	assembleDomObjectValue(lang) {
		return lang.getCode();
	}
	
	assembleEmptyUiControlValue() {
		return new Lang("un");
	}
	
	assembleDomObjectValueAppearance(lang) {
		return lang.getOriginalName();
	}
	
}



//
// Riddle and guess language selectors
//

class RiddleLangSelector extends LangSelector {
	
	onChange() {
		this.getGame().selectRiddleLang(this.getUiControlValue());
	}	
}


class GuessLangSelector extends LangSelector {
	
	onChange() {	
		this.getGame().selectGuessLang(this.getUiControlValue());
	}
}


class PartOfSpeachSelector extends Selector {
	
	assembleDomObjectValue(pos) {
		return pos ? pos.getCode() : "all";
	}
	
	assembleDomObjectValueAppearance(pos) {
		return pos.getOriginalName();
	}

	onChange() {
		this.getGame().selectPartOfSpeach(this.getUiControlValue());
	}

}


// Sections 

class SubjectDomainTagsSection extends Section {

	constructor(chief) {
		super(chief, "subjectDomainSectionDiv", "subjectDomainSectionClickerDiv", 
			"subjectDomainSectionHeaderDiv", "subjectDomainContentAreaDiv");
	}
	
	getWordspaceConfigParams() {
		let params = {};
		params[CFG_SCT_TAGS] = this.getUiControlValue();
		return params;
	}
}


class GamingSection extends Section {

	constructor(chief) {
	
		super(chief, "gamingSectionDiv", "gamingSectionClickerDiv", 
			"gamingSectionHeaderDiv", "gamingSectionContentAreaDiv");		
	}

	getWordspaceConfigParams() {
		let params = {};
		params[CFG_SCT_GAMING] = this.getUiControlValue();
		return params;
	}

}


class WordListSection extends Section {

	constructor(chief) {

		super(chief, "wordListSectionDiv", "wordListSectionClickerDiv", 
			"wordListSectionHeaderDiv", "wordListSectionContentAreaDiv");	
	}
	
	getWordspaceConfigParams() {
		let params = {};
		
		console.log('=====', this.getUiControlValue());
		params[CFG_SCT_WORD_LIST] = this.getUiControlValue();
		return params;
	}
}


// Gaming

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
		this.getGame().selectSubjectDomains(this.getUiControlValue());
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

	assembleWordListTd(dicEntry, _langCode=undefined) {
		
		let wordListTd = document.createElement("td");
				
		let langCode = _langCode ? _langCode : this.getTargetLangCode();
		
		let extDicUrl = 
			this.assembleExtDicUrl(dicEntry, langCode, 
					this.getCurrBaseLangCode(), this.getUiLangCode());
		
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


class ExternalLinkInput extends UiControl {
	
	setLink(url) {
		console.log(url);
		let nakarLinkA = document.getElementById("extlinkLinkA");
		nakarLinkA.innerHTML = url;
		nakarLinkA.setAttribute("href", url);
	}
	
	onChange() {
	
		let externalLink = this.getUiControlValue();
		
		let gdocId = substringBefore(substringAfter(externalLink,"/d/"), "/");
		
		let nakarLink = "http://www.cramwords.com?src_id=gdocs&wsp_id=" + gdocId;
		
		this.setLink(nakarLink);
	} 
}


class ExternalLinkClearButton extends Button {

	getPressed() {		
		let input = this.getChief().externalLinkInput;
		input.setUiControlValue("");
		input.getDomObject().focus();
		input.setLink("");
	}
}


class ExternalLinkCopyButton extends Button {

	getPressed() {
		let nakarLinkA = document.getElementById("extlinkLinkA");
		let promise = navigator.clipboard ? 
						navigator.clipboard.writeText(nakarLinkA.textContent) : 
						null;
	}
}

