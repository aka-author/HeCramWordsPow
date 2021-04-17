//* * ** *** ***** ******** ************* *********************
// Project: Nakar
// Module:  Play of Words
// Layer:	Web front-end
// File:	cards.js                                 (\_/)
// Func:	Formatting cards for printing them out   (^.^)
//* * ** *** ***** ******** ************* *********************

class CardGenerator {
	
	constructor(filter, riddleLangCode, guessLangCode, cardFormat, pageFormat) {
		this.filter = filter;
		this.riddleLangCode = riddleLangCode;
		this.guessLangCode = guessLangCode;
		this.cardFormat = cardFormat;
		this.pageFormat = pageFormat;
	}
	
	getColsPerPage() {
		return 3;
	}
	
	getRowsPerPage() {
		return 6;
	}
	
	getCardsPerPage() {
		return this.getColsPerPage()*this.getRowsPerPage();
	}
	
	countPages() {
		return Math.ceil(this.filter.countItems()/this.getCardsPerPage());
	}
	
	assembleHtml() {
		
		let div = document.createElement("div");
		
		let langCodes = [this.riddleLangCode, this.guessLangCode];
		
		for(let langIdx in langCodes) {
			let dicEntryIdx = 0;
			for(let pageIdx = 0; pageIdx < this.countPages(); pageIdx++) {
				let table = document.createElement("table");
				for(let rowIdx = 0; rowIdx < this.getRowsPerPage(); rowIdx++) {
					let tr = document.createElement("tr");
					if(langIdx == 1) 
						dicEntryIdx += this.getColsPerPage() - 1;
					for(let colIdx = 0; colIdx < this.getColsPerPage(); colIdx++) {
						let td = document.createElement("td");
						if(dicEntryIdx < this.filter.countItems()) {
							let dicEntry = this.filter.fetchItemByIdx(dicEntryIdx);
							let headword = dicEntry.getHeadword(langCodes[langIdx]);
							td.innerHTML = headword;
						}
						dicEntryIdx += langIdx == 0 ? 1 : -1;
						tr.appendChild(td);
					}
					if(langIdx == 1) 
							dicEntryIdx += this.getColsPerPage() + 1;
					table.appendChild(tr);
				}
				div.appendChild(table);
			}
		}	
			
		return div;
	}
}


function test() {
	return GLOBAL_PRINT[GLOBAL_PRINT.length - 1];
}

