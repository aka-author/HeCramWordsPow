//* * ** *** ***** ******** ************* *********************
// Project: Nakar
// Module:  Play of Words
// Layer:	Web front-end
// File:	formalsplit.js                            (\_/)
// Func:	Splitting sequences by separators         (^.^) 
//* * ** *** ***** ******** ************* *********************

//
// Abstract splitters
//

class FormalClause {

	constructor(content, metadata=null) {
		
		this.setContent(content);
		this.setMetadata(metadata);
	}
	
	getContent() {
		return this.content;
	}
	
	setContent(content) {
		this.content = content;
	}
	
	getMetadata() {
		return this.metadata;
	}
	
	setMetadata(metadata) {
		this.metadata = metadata;
	}		
}


class FormalSlider {

	constructor(source) {
		this.source = source;
		this.sliceLength = 1;
		this.currPos = 0;
	}
	
	getSource() {
		return this.source;
	}
	
	getSourceLength() {
		return String(this.getSource()).length;
	}
	
	getSliceLength() {
		return this.sliceLength;
	}
	
	setSliceLength(numberOfAtoms) {
		this.sliceLength = numberOfAtoms;
	}
	
	getCurrPos() {
		return this.currPos;
	}
	
	setCurrPos(pos) {
		let lastPossiblePos = this.getSourceLength() - 1;
		this.currPos = pos <= lastPossiblePos ? pos : lastPossiblePos;
		return this;					
	}
	
	eof() {
		return this.getCurrPos() >= this.getSourceLength(); 
	}
	
	getAtomAt(pos) {
		return this.getSource()[pos];
	}
	
	getSlice(startPos, numberOfAtoms=1) {
		
		let slice = [];
		
		for(let offset = 0; offset < numberOfItems; offset++)
			slice.push(this.getAtomAt(startPos + shift));
		
		return slice;
	}
	
	getHeadSlice() {
		return this.getSlice(this.getSliderPos(), this.getSliceLength());
	}
	
	shiftSlider(numberOfAtoms=undefined) {
		let shift = numberOfAtoms ? numberOfAtoms : this.getSliceLength();
		this.setSliderPos(this.getSliderPos() + shift);
		return this;
	}
}


class FormalSplitter {

	constructor(source) {
		
		this.source = source;
		
		this.resetStack();
		this.resetClauses();
		this.assembleSlider(this.source);
	}

	getSource() {
		return this.source;
	}

	resetStack() {
		this.stack = [];
	}

	getClauses() {
		return this.clauses;
	}

	getClauseByIdx(idx) {
		return this.getClauses()[idx];
	}

	countClauses() {
		return this.getClauses().length;
	}

	resetClauses() {
		this.clauses = [];
	}

	assembleSlider() {
		return new FormalSlider(this.getSource());
	}

	getSlider() {
		return this.slider;
	}

	assembleClauseMetadata(slice, slider=null) {		
		return null;
	}

	assembleClause(slice, _slider=null) {
		
		let slider = _slider ? _slider : this.getSlider();
				
		let metadata = this.assembleClauseMetadata(slice, slider);
		
		return new FormalClause(slice, metadata);
	}
	
	extractStack() {		
		return this.stack;
	}
	
	isClause(slice) {
		return true;
	}
	
	takeClauseFromStak(_slider=null) {
		
		let slider = _slider ? _slider : this.getSlider();
		
		let slice = this.extractStack();
			
		let clause = this.isClause(slice) ? this.assembleClause(slice) : null;
		
		return clause; 
	}
	
	appendClause(clause) {
		this.clauses.push(clause);
	}
	
	pushSlice(slice) {
		this.stack.push(slice);
	}
	
	splitSlice(_slider=null, evidence=null) {
	
		let slider = _slider ? _slider : this.getSlider();
	
		if(slider.eof() > 0) {
			
			let clause = takeClauseFromStak();
			
			if(clause) {
				this.appendClause(clause);
				this.resetStack();
			} 
			else 
				this.pushSlice(slider.getHeadSlice());
			
			this.splitSlice(slider, evidence);
		}		
					   
		return getClauses();
	}

	split() {
		this.resetStack();
		this.resetClauses();
		this.splitSlice();
		return this;
	}
}



//
// String splitters
//

class StringFormalClause extends FormalClause { }

class StringFormalSlider extends FormalSlider {

	getAtomAt(pos) {
		return this.getSource().charAt(pos);
	}	
}


class StringFormalSplitter extends FormalSplitter {

	assembleSlider(source) {
		return new StringFormalSlider(source);
	}	

	extractStack() {
		return this.stack.join("");
	}
}



//
// Splitter for strings that include {} substitutions
//

class SubstFormalClause extends StringFormalClause {

	isText() {
		return !Boolean(this.metadata);
	}
	
	isSubst() {
		return Boolean(this.metadata);
	}
}

	
class SubstFormalSplitter extends StringFormalSplitter {
	
	splitSlice(_slider=null, evidence=null) {
				
		let remain = this.getSource(); 
		
		let buffer = "";
		
		for(let i = 0; i < remain.length; i++)	
			switch(remain.charAt(i)) {
				case "{":
					if(buffer)
						this.clauses.push(new SubstFormalClause(buffer));
					buffer = "";
					break;
				case "}":
					if(buffer)	
						this.clauses.push(new SubstFormalClause(buffer, "subst"));
					buffer = "";
					break;
				default:
					buffer += remain.charAt(i);
			}
			
		if(buffer)
			this.clauses.push(new SubstFormalClause(buffer));		
		
		return this.clauses;	
	}
	
	getSubstClauses() {
		return this.substClauses ? this.substClauses : [];
	}
	
	subst(substValues) {
		
		this.substClauses = [];
		
		for(let clauseIdx = 0; clauseIdx < this.countClauses(); clauseIdx++) {
			
			let clause = this.getClauseByIdx(clauseIdx);	
			
			let substClause = null; 
			
			if(clause.isSubst()) {
				
				let substKey = clause.getContent();
				let value = substValues[substKey];
								
				substClause = this.assembleClause(value);
				substClause.setMetadata(substKey);
				
			}
			else 
				substClause = this.assembleClause(clause.getContent());
			
			this.substClauses.push(substClause);
		}
			
		return this;
	}

	substStr(substValues) {
	
		let result = "";
		
		let substClauses = this.subst(substValues);

		for(let clauseIdx in this.substClauses)
			result += this.substClauses[clauseIdx].getContent();
			
		return result;
	}

}

