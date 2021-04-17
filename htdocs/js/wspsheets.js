//* * ** *** ***** ******** ************* *********************
// Project: Nakar
// Module:  Play of Words
// Layer:	Web front-end
// File:	wspsheets.js                    (\_/)
// Func:	Accessing spreadsheets          (^.^) 
//* * ** *** ***** ******** ************* *********************

class Field() {
	
	constructor(name, colIdx) {
		this.name = name;
		this.colIdx = colIdx;
	}
	
	getName() {
		return this.name;
	}
	
	getColIdx() {
		return this.colIdx;
	}
}


class Worksheet extends {

	constructor(name) {
		this.name = name;
		this.fieldsByColIdx = new Array();
		this.fieldsByName = new Array();
		this.rows = new Array();
	}
	
	getName() {
		return this.name;
	}
	
	getRow(rowIdx) {
		return this.rows[rowIdx];
	}
	
	appendField(name, colIdx) {
		
		let field = new Field(name, colIdx);
		
		this.fieldsByColIdx[colIdx] = field;
		this.fieldsByName[name] = field;
		
		return field;
	}
	
	appendRow() {
	}
	
	convertFieldNameToColIdx(rowIdx, fieldName) {
		return this.fields[fieldName].getColIdx();
	}
	
	countRows() {
		return this.rows.length;
	}
	
	getColValue(rowIdx, colIdx) {
		return this.getRow(rowIdx)[colIdx];
	}
	
	getFieldValue(rowIdx, fieldName) {
		let colIdx = this.convertFieldNameToColIdx(fieldName);
		return this.getColValue(rowIdx, colIdx);
	}

}


class Workbook extends RemoteDataset {

	constructor(docId, credentials=null) {
		
		this.docId = docId;
		
		let url = this.assembleUrl(docId);
		super(url, credentials);
	}
		
	assembleUrl(docId) {
		return String(docId);
	}		
		
	load(connectionString, ) {
		let err = new AppError();
		this.authData = null;
		return err;
	}
	
	getSheetNames() {
		return Object(this.sheets).keys();
	}
	
	getSheet(sheetName) {
		return this.sheets[sheetName];
	}
	
	getFieldValue(sheetName, rowIdx, fieldName) {
		let sheet = this.getSheet(sheetName);
		return sheet.getFieldValue(rowIdx, fieldName);
	}
	
	getParamValue(sheetName, paramName, langCode=undefined) {
		let sheet = this.getSheet(sheetName);
		return sheet.getParamValue(paramName, langCode);
	}		
}


class SimpleGdocsSpreadsheet extends {

	assembleSheetUrl(gdocId, sheetName) {
		
		let rawUri = 
				this.getApp().getGdocsServUrl() + 
				assembleUrlParams(
					"gdoc_id", gdocId, 
					"sheet_name", sheetName);
				
		return encodeURI(rawUri);
	}

	retrieveSheet(gdocId, sheetName) {
		
		let resp = new AppResponce();
		
		let xmlHttp = new XMLHttpRequest();
		let strRequestUrl = this.assembleSheetUrl(gdocId, sheetName);
		
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

	getSheetNames() {
		return [""];
	}

	sendLoadRequest() {
				
		let error = new AppError(ERR_RMT_OK);
		
		let sheetNames = this.getSheetNames();
		
		for(let sheetIdx in sheetNames) {
			let sheetName = sheetNames[sheetIdx];
			sheets[sheetName] = this.retrieveSheet(gdocId, sheetName);
		}
			
		let resp = new AppResponce(sheets, error);
		
		return resp;
	}
	
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
	
	parseRawData(rawJsonSheets) {
		
		let resp = new AppResponse();
		
		let sheets = new Array();
				
		for(let sheetName in rawJsonSheets) 
			sheets[sheetName] = 
				this.parseSheet(rawJsonSheets[sheetName]);
				
		resp.setPayload(sheets);		
				
		return resp;		
	}
}


SimpleGoogleWordsheet extends SimpleGoogleSpreadsheet {
	
	getSheetNames() {
		
		let gdocId = this.getId();
		
		this.retrieveSheet(gdocId, "Parts");
		
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