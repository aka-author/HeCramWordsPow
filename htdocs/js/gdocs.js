//* * ** *** ***** ******** ************* *********************
// Accessing Google Docs
//
//                                              (\_/)
//                                              (^.^) 
//* * ** *** ***** ******** ************* *********************

// Generic Google document
class GoogleDoc {
	
	constructor(gdocId, queryData=null) {
		this.gdocId = this.setGdocId(gdocId);
		this.setQueryData(queryData);
		this.gdocData = null;
		this.doc = null;
	}
	
	getGdocId() {
		return this.gdocId;
	}
	
	setGdocId(gdocId) {
		this.gdocId = gdocId;
	}
	
	getQueryData() {
		return this.queryData;
	}
	
	setQueryData(queryData) {
		return this.queryData = queryData;
	}
		
	parseGdocData(gdocData) {
		return null;	
	}
	
	retrieveGdocFromGoogle(queryData) {
		return null;
	}
	
	fetch() {
		let queryData = this.getQueryData();
		this.gdocData = this.retrieveGdocFromGoogle(queryData);	
		this.doc = this.parseGdocData(this.gdocData);
	}
}


// Generic Google spreadsheet
class GoogleSpreadsheet extends GoogleDoc {

	countFields(sheetName) {
		return this.doc.sheets[sheetName].fields.length;
	}
	
	countRows(sheetName) {
		return this.doc.sheets[sheetName].rows.length;
	}
	
	countSheets() {
		return Object.keys(this.doc.sheets).length;
	}	
	
	getRowByIndex(sheetName, rowIdx) {
		return this.doc.sheets[sheetName].rows[rowIdx];
	}

	getFieldValue(sheetName, rowIdx, fieldName) {
		return this.getRowByIndex(sheetName, rowIdx)[fieldName];
	}
}


// Google spreadsheet retrieved via a simple request
class GoogleSpreadsheetSimple extends GoogleSpreadsheet {
	
	// The format of a simple request is
	// https://docs.google.com/spreadsheets/d/{dicID}/gviz/tq?tqx=out:json&sheet={sheet}

	isValidDataRow(row, fields) {
		return true;
	}
	
	parseCell(cellJson) {
		return cellJson ? cellJson.v : null;
	}

	parseRow(rowJson, fields) {

		let row = new Array();
		
		for(let fieldIdx in fields) 
			row[fields[fieldIdx].name] = this.parseCell(rowJson.c[fieldIdx]);
		
		return row;
	}

	parseRows(rowsJson, fields) {
		
		let rows = new Array();
		
		for(let rowIdx in rowsJson) {
			let row = this.parseRow(rowsJson[rowIdx], fields);
			if(this.isValidDataRow(row, fields)) 
				rows[rows.length] = row;
		}
		
		return rows;
	}
	
	assembleFieldName(colLabel) {
		
		const whiteSpace = " ";
		
		let fieldNameLength = colLabel.indexOf(whiteSpace);
		
		let rawFieldName = colLabel.includes(whiteSpace) ?
				colLabel.substring(0, fieldNameLength) :
				colLabel;
				
		let fieldName = rawFieldName.trim();
		
		return fieldName;
	}
	
	parseCol2Field(colJson) {
		
		let field = new Array();
		
		field.letter = colJson.id;
		field.name = this.assembleFieldName(colJson.label);
		field.dataType = colJson.type;
	
		return field;
	}		
	
	parseCols2Fields(colsJson) {
		
		let fields = new Array();
		
		for(let colIdx in colsJson) 		
			fields.push(this.parseCol2Field(colsJson[colIdx]));	
		
		return fields;
	}
	
	parseSheet(sheetJson) {
		
		let sheet = new Array();
		
		sheet.fields = this.parseCols2Fields(sheetJson.table.cols);
		sheet.rows = this.parseRows(sheetJson.table.rows, sheet.fields);
		
		return sheet;
	}
	
	parseSheets(sheetsJson) {
		
		let sheets = new Array();
		
		for(let sheetName in sheetsJson) 
			sheets[sheetName] = 
				this.parseSheet(sheetsJson[sheetName]);
				
		return sheets;		
	}
	
	parseGdocData(gdocData) {
		
		let doc = new Array();
		
		doc.sheets = this.parseSheets(gdocData.sheets);
		
		return doc; 
	}
	
	getGdocId() {
		return "1ii9CGetudA74mPmuDCYfE1hEbWmt5kHa3IGSZOLSg4M";
	}
	
	assembleRequest(gdocId, sheetName) {
		
		return "http://cramwords.com/cgi-bin/wordspace?" + 
		       "gdoc_id=" + gdocId + 
			   "&sheet_name=" + sheetName;
	}
	
	retrieveSheet(gdocId, sheetName) {
		
		let sheetJson = null; 
		let xmlHttp = new XMLHttpRequest();
		let strRequestUrl = this.assembleRequest(gdocId, sheetName);
		let success = false;
		
		try {            
			xmlHttp.open("GET", strRequestUrl, false); 
			xmlHttp.send("anonymous");  
			success = (xmlHttp.status == 200);
		}	
		catch(error) {
			success = false;
		}
					
		if(success) {
			sheetJson = JSON.parse(xmlHttp.response);
			console.log(sheetJson);
		}
		
		return sheetJson;
	}
	
	extractPartsOfSpeach(tocJson) {
		return ["Nouns", "Adjectives", "Verbs", "Adverbs", 
		        "Pronouns", "Prepositions", "Conjunctions"];
	}
	
	retrieveGdocFromGoogle(queryData) {
		
		let wsGdoc = new Array();
		
		let gdocId = this.getGdocId(); 
		
		wsGdoc.passport = this.retrieveSheet(gdocId, "Passport");
		wsGdoc.toc = this.retrieveSheet(gdocId, "TOC");
		wsGdoc.tags = this.retrieveSheet(gdocId, "Tags");
		
		let partsOfSpeach = this.extractPartsOfSpeach(wsGdoc.toc);
		
		for(let posIdx in partsOfSpeach) {
			let posSheetName = partsOfSpeach[posIdx]
			wsGdoc[posSheetName] = this.retrieveSheet(gdocId, posSheetName);
		}	
		
		//console.log(this.retrieveSheet(this.getGdocId(), "Nouns"));	
		
		return wsGdoc;
		
		//return google.gdocData;
	}
}