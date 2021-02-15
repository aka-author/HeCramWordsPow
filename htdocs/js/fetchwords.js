
class Google {
	
	constructor() {
		this.visualization = new Array();
        this.visualization.Query = new Array();
		this.visualization.Query.setResponse = this.setResponseFunc;
		this.gdocData = Array();
		this.gdocData.sheets = Array();
	}	
	
	detectPartOfSpeech(sheetJson) {
	
		let partOfSpeech = "other";
		
		let tag = sheetJson.table.cols[0].label.toLowerCase().trim();
	
		if(tag.includes("noun"))
			partOfSpeech = "nouns";
		else 
			if(tag.includes("adjective")) 
				partOfSpeech = "adjectives";
		else 
			if(tag.includes("adverb")) 
				partOfSpeech = "adverbs";
		else 
			if(tag.includes("verb")) 
				partOfSpeech = "verbs";
		else
			partOfSpeech = "other";
		
		return partOfSpeech;
	}	

	setResponseFunc(sheetJson) {
		let partOfSpeech = google.detectPartOfSpeech(sheetJson);
		google.gdocData.sheets[partOfSpeech] = sheetJson;
	}
	
}

var google = new Google();
