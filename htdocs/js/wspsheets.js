//* * ** *** ***** ******** ************* *********************
// Project: Nakar
// Module:  Play of Words
// Layer:	Web front-end
// File:	wspsheets.js                    (\_/)
// Func:	Accessing spreadsheets          (^.^) 
//* * ** *** ***** ******** ************* *********************

class Field {
	
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
	
	isLocalField(fieldName) {
		
		return (fieldName.indexOf(fieldNameBase) == 0) &&
			   (fieldName.charAt(fieldNameBase.length) == "_");
	}
	
	getLocalFieldName(fieldNameBase, langCode=undefined) {
				
		if(fieldsByName[fieldNameBase]) return fieldNameBase;
		
		if(langCode) return fieldNameBase + "_" + langCode;
		
		let localFieldName = undefined;
		
		let fields = this.getFields()
		
		for(let fieldIdx in this.fields) {
			
			let fieldName = this.fields[fieldIdx].getName(); 
			
			if(this.isLocalField(fieldName)) {
				localFieldName = fieldName;
				break;
			}
		}		
		
		return localFieldName;
	}
	
	appendField(field) {
		this.fields.push(field);
		this.fieldsByName[field.getName()] = field;
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
		
	lookupRow(keyFieldName, keyFieldValue) {
		
		let countRows = this.countRows();
		
		for(let rowIdx = 0; rowIdx < countRows; rowIdx++) 
			if(this.getFieldValue(rowIdx, keyFieldName) == keyFieldValue)
				break;
	
		return rowIdx < countRows ? rowIdx : undefined; 
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
		return this.content.sheets[sheetName];
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


function assembleSheetUrl(gdocId, sheetName=undefined) {
		
	let rawUri = 
		getGlobalApp().getGdocsServUrl() + 
		assembleUrlParams(
			"gdoc_id", gdocId, 
			"sheet_name", sheetName);
			
	return encodeURI(rawUri);
}
	
	
class SimpleGoogleWorkbook extends Workbook {
	
	constructor(gdocId) {
		
		super(assembleSheetUrl(gdocId));
		
		this.gdocId = gdocId;
	}

	getGdocId() {
		return this.gdocId;
	}

	retrieveSheetRawJson(sheetName) {
		
		let resp = new AppResponse();
		
		let xmlHttp = new XMLHttpRequest();
		let strRequestUrl = assembleSheetUrl(this.gdocId, sheetName);
		
		let appError = new AppError(ERR_ACCESS_FAILURE);
		
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
		}
		
		resp.setPayload(sheetJson);
		resp.setAppError(appError);
		
		return resp;
	}

	retrieveSheetNames() {
		return [""];
	}

	sendLoadRequest() {
				
		let error = new AppError(ERR_OK);
		
		let sheetNames = this.retrieveSheetNames();
		
		let sheets = new Array();
		
		for(let sheetIdx in sheetNames) {
			
			let sheetResp = this.retrieveSheetRawJson(sheetNames[sheetIdx]);
			
			if(sheetResp.getAppErrorCode() == ERR_OK)
				sheets[sheetNames[sheetIdx]] = sheetResp.getPayload();
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
				
		let content = new Array();	
		content.sheets = sheets;
				
		resp.setPayload(content);		
				
		return resp;		
	}
}


//
// Wordsheets based on simple Google spreadsheets
//

class SimpleGoogleWordspace extends SimpleGoogleWorkbook {
	
	retrieveSheetNames() {
		
		let sheetNames = new Array();
		
		let tocResp = this.retrieveSheetRawJson("TOC");
				
		if(tocResp.getAppErrorCode() == ERR_OK) {
			
			let tocSheet = new SimpleGoogleWorksheet("TOC"); 
			tocSheet.parseRawJson(tocResp.getPayload());
			
			for(let rowIdx = 0; rowIdx < tocSheet.countRows(); rowIdx++)
				sheetNames.push(tocSheet.getFieldValue(rowIdx, "sheet"));
		}	
		
		return sheetNames;
	}
	
}