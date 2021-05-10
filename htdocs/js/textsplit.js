
class Token {

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


class LexemSplitter {

	constructor(source) {
		
		this.source = source;
		
		this.resetStack();
		this.resetTokens();
	}

	getSource() {
		return this.source;
	}

	resetStack() {
		this.stack = [];
	}

	getTokens() {
		return this.tokens;
	}

	resetTokens() {
		this.tokens = [];
	}

	getHead(remain) {
		return firstChr(String(remain));
	}

	getTail(remain) {
		return trimFirstChr(String(remain));
	}

	assembleToken(block) {
		
		return new Token(block, this.assembleTokenMetadata())
	
	}
	
	extractStack() {
		return this.stack.join("");
	}
	
	takeTokenFromStak(remain) {
		
		let block = this.extractStack();
			
		let token = this.isToken(block, remain) ? this.assembleToken(block) : null;
		
		return token; 
	}
	
	appendToken(token) {
		this.tokens.push(token);
	}
	
	pushBlock(block) {
		this.stack.push(block)
	}
	
	splitSlice(remain) {
	
		if(remain.length > 0) {
			
			let token = takeTokenFromStak();
			
			if(token) {
				this.appendToken(token);
				this.resetStack();
				this.splitSlice(remain);
			} 
			else {
				this.pushBlock(this.getHead(remain));
				this.splitSlice(this.getTail(remain));
			}
		}		
					   
		return getTokens();
	}

	split() {
		this.resetStack();
		this.resetTokens();
		return this.splitSlice(this.getSource());
	}

}


class SubstToken extends Token {

	isText() {
		return this.metadata == "text";
	}
	
	isSubst() {
		return this.metadata == "subst";
	}

}


class SubstLexemSplitter extends LexemSplitter {
	
	assembleToken(content, metadata) {
		return new SubstToken(content, metadata);
	}
	
	splitSlice(remain) {
		
		let tokens = [];
		
		let buffer = "";
		
		for(let i = 0; i < remain.length; i++)	
			switch(remain.charAt(i)) {
				case "{":
					if(buffer)
						tokens.push(new SubstToken(buffer, "text"));
					buffer = "";
					break;
				case "}":
					if(buffer)	
						tokens.push(new SubstToken(buffer, "subst"));
					buffer = "";
					break;
				default:
					buffer += remain.charAt(i);
			}
			
		if(buffer)
			tokens.push(new SubstToken(buffer, "text"));		
		
		return tokens;	
	}

}