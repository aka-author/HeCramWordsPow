//* * ** *** ***** ******** ************* *********************
// Project: Nakar
// Module:  Play of Words
// Layer:	Web front-end
// File:	wspsheets.js                    (\_/)
// Func:	Accessing spreadsheets          (^.^) 
//* * ** *** ***** ******** ************* *********************

class Field() {
	
	constructor(name, letter, dataType) {
		this.name = name;
		this.letter = letter;
		this.dataType = dataType;
	}
	
	getName() {
		return this.name;
	}
	
	getLetter() {
		return this.letter;
	}
	
	getDataType() {
		return this.dataType;
	}
}


//
// Abstract spresdsheets
//

class Worksheet {

	constructor(name) {
		
		this.name = name;
		
		this.fields = new Array();
		this.fieldsByName = new Array();
		
		this.rows = new Array();
	}
	
	getName() {
		return this.name;
	}
	
	countFields() {
		return this.fields.length;
	}
	
	getFieldByIdx(fieldIdx) {
		return this.fields[fieldIdx];
	}
	
	getFieldByName(fieldName) {
		return this.fieldsByName[fieldName];
	}
	
	getFields() {
		return this.fields;
	}
	
	appendField(field) {
		this.fields.push(field);
		this.fieldsByName[field.getname()] = field;
	}
	
	countRows() {
		return this.rows.length;
	}
	
	getRowByIdx(rowIdx) {
		return this.rows[rowIdx];
	}

	isValidDataRow(row) {
		return true;
	}

	appendRow(row) {
		if(this.isValidDataRow(row))
			this.rows.push(row);
	}

	getFieldValue(rowIdx, fieldName) {
		return this.getRowByIdx(rowIdx)[fieldName];
	}	
		
	getPropValue(propName, langCode=undefined) {
		// TBD
	}	
}


class Workbook extends RemoteDataset {

	constructor(url, creds=null) {
		
		super(url, creds);
		
		this.content.sheets = new Array();
	}
	
	countSheets() {
		return Object.keys(this.content.sheets).length;
	}	
	
	getSheet(sheetName) {
		this.content.sheets[sheetName];
	}		
		
	createBlankSheet(sheetName) {
		return new Worksheet(sheetName);
	}		
		
	appendSheet(sheet) {	
		this.content.sheets[sheet.getName()] = sheet;
	}
		
	countFields(sheetName) {
		return this.getSheet(sheetName).countFields();
	}
	
	getFieldByName(sheetName, fieldName) {
		return this.getSheet(sheetName).getFieldByName(fieldName);
	}
	
	countRows(sheetName) {
		return this.getSheet(sheetName).countRows();
	}
	
	getFieldValue(sheetName, rowIdx, fieldName) {
		return this.getSheet(sheetName).getFieldValue(rowIdx, fieldName);
	}	
		
	getPropValue(sheetName, propName, langCode=undefined) {
		return this.getSheet(sheetName).getPropValue(propName, langCode);
	}	
}


//
// Simple Google spreadsheets
//

class SimpleGoogleWorksheet extends Worksheet {
	
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
		let name = this.assembleFieldName(colJson.label);
		let field = new Field(name, colJson.id, colJson.type);
		return field;
	}		
	
	parseCols2Fields(colsJson) {
		
		for(let colIdx in colsJson) 
			this.appendField(this.parseCol2Field(colsJson[colIdx]));	
	}
	
	parseCell(cellJson) {
		return cellJson ? cellJson.v : null;
	}

	parseRow(rowJson) {

		let row = new Array();
		
		for(let fieldIdx in this.getFields()) { 
			let fieldName = this.getFieldByIdx(fieldIdx).getName();
			row[fieldName] = this.parseCell(rowJson.c[fieldIdx]);
		}
		
		return row;
	}

	parseRows(rowsJson) {
		
		for(let rowIdx in rowsJson) 
			this.appendRow(this.parseRow(rowsJson[rowIdx]));
	}
	
	parseRawJson(sheetRawJson) {
		
		this.parseCols2Fields(sheetRawJson.table.cols);
		
		this.parseRows(sheetRawJson.table.rows);
		
		return this;
	}
}


class SimpleGoogleWorkbook extends Workbook {
	
	constructor(gdocId) {
		
		this.gdocId = gdocId;
		
		super(this.assembleSheetUrl(gdocId));
	}

	getGdocId() {
		return this.gdocId;
	}

	assembleSheetUrl(sheetName=undefined) {
		
		let rawUri = 
				this.getApp().getGdocsServUrl() + 
				assembleUrlParams(
					"gdoc_id", this.getGdocId(), 
					"sheet_name", sheetName);
				
		return encodeURI(rawUri);
	}

	retrieveSheetRawJson(sheetName) {
		
		let resp = new AppResponse();
		
		let xmlHttp = new XMLHttpRequest();
		let strRequestUrl = this.assembleSheetUrl(sheetName);
		
		let appError = new AppError(ERR_RMT_LOAD_FAILURE);
		
		try {            
			xmlHttp.open("GET", strRequestUrl, false); 
			xmlHttp.send("anonymous");  
			
			if(xmlHttp.status == 200)
				appError.setCode(ERR_OK);
		}	
		catch(error) {}
					
		let sheetJson = null; 
		
		if(appError.getCode() == ERR_OK) {
			sheetJson = JSON.parse(xmlHttp.response);
			console.log(sheetJson);
		}
		
		resp.setPayload(sheetJson);
		resp.setError(appError);
		
		return resp;
	}

	retrieveSheetNames() {
		return [""];
	}

	sendLoadRequest() {
				
		let error = new AppError(ERR_RMT_OK);
		
		let sheetNames = this.retrieveSheetNames();
		
		for(let sheetIdx in sheetNames) {
			
			let sheetResp = this.retrieveSheetRawJson(sheetNames[sheetIdx]);
			
			if(sheetResp.getAppErrorCode() == ERR_OK)
				sheets[sheetName] = sheetResp.getPayload();
		}
			
		let resp = new AppResponse(sheets, error);
		
		return resp;
	}
		
	createBlankSheet(sheetName) {
		return new SimpleGoogleWorksheet(sheetName);
	}
	
	parseRawData(sheetsRawJson) {
		
		let resp = new AppResponse();
		
		let sheets = new Array();
				
		for(let sheetName in sheetsRawJson) {
			let sheet = this.createBlankSheet(sheetName);
			sheet.parseRawJson(sheetsRawJson[sheetName]);
			sheets[sheetName] = sheet;
		}		
				
		resp.setPayload(sheets);		
				
		return resp;		
	}
}


//
// Wordsheets based on simple Google spreadsheets
//

class SimpleGoogleWordspace extends SimpleGoogleWorkbook {
	
	retrieveSheetNames() {
		
		let sheetNames = new Array();
		
		let tocResp = this.retrieveSheetRawJson(gdocId, "TOC");
		
		if(tocResp.getAppErrorCode() == ERR_OK) {
			
			let tocSheet = new SimpleGoogleWorksheet("TOC"); 
			tocSheet.parseRawJson(tocResp.getPayload());
			
			for(let rowIdx in tocSheet.countRows())
				sheetNames.push(tocSheet.getFieldValue(rowIdx, "sheet"));
		}	
		
		return sheetNames;
	}
	
}


// old

class Wordsheet {
	
	constructor() {
		this.sheets = new Array();
	}
	
	connect() {
		
		let appError = new AppError();
		
		return appError;
	}
	
	fetchSheetIds() {
		
		let sheetNames = Array();
		
		return sheetNames;
	}
	
	fetchSheetRawData(sheetId) {
	}
	
	parseWordsheetRawData() {
		
		
		
	}
	
}


class SimpleGoogleSheet extends Sheet {
	
	

// Generic wordspace spreadsheet
class Wordsheet {
	
	constructor(docId, query=null) {
		this.docId = this.setDocId(docId);
		this.setQuery(query);
		this.docRawData = null;
		this.general = null;
		
	}
	
	getDocId() {
		return this.docId;
	}
	
	setDocId(gdocId) {
		this.docId = docId;
	}
	
	getQuery() {
		return this.query;
	}
	
	setQuery(query) {
		return this.query = query;
	}
		
	parseDocRawData(docRawData) {
		return null;	
	}
	
	retrieveDocRawData(query) {
		return null;
	}
	
	fetch() {
		let query = this.getQuery();
		this.docRawData = this.retrieveDocRawData(query);	
		this.doc = this.parseDocRawData(this.docRawData);
		return this;
	}
	
	countSheets() {
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