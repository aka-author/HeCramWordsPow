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

	constructor(workbook, name) {
		
		this.workbook = workbook;
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
	
	fieldExists(fieldName) {
		return Boolean(this.fieldsByName[fieldName]);
	}
	
	getFields() {
		return this.fields;
	}
	
	getFieldNames() {
		
		let fieldNames = new Array();
		
		let fields = this.getFields();
		
		for(let fieldIdx in fields)
			fieldNames.push(fields[fieldIdx].getName());
		
		return fieldNames;
	}
	
	isLocalField(fieldName, fieldNameBase) {
		return (fieldName.indexOf(fieldNameBase) == 0) &&
			   (fieldName.charAt(fieldNameBase.length) == "_");
	}
	
	getLocalFieldName(fieldNameBase, langCode=undefined) {
				
		if(this.fieldsByName[fieldNameBase]) return fieldNameBase;
		
		if(langCode) return (fieldNameBase ? fieldNameBase + "_" : "") + langCode;
		
		let localFieldName = undefined;
		
		let fields = this.getFields()
		
		for(let fieldIdx in this.fields) {
			
			let fieldName = this.fields[fieldIdx].getName(); 
			
			if(this.isLocalField(fieldName, fieldNameBase)) {
				localFieldName = fieldName;
				break;
			}
		}		
		
		return localFieldName;
	}
	
	appendField(field) {
		if(field.getName().trim()) {
			this.fields.push(field);
			this.fieldsByName[field.getName()] = field;
		}
	}
	
	countRows() {
		return this.rows.length;
	}
	
	getRowByIdx(rowIdx) {
		return this.rows[rowIdx];
	}

	isEmptyField(rowIdx, fieldName) {
		let value = this.getFieldValue(rowIdx, fieldName);
		return Boolean(String(value).trim());
	}

	isEmptyRow(rowIdx) {
		
		let result = true;
		
		let fields = this.getFields();
		
		for(let fieldIdx in fields) 
			if(this.isEmptyField(rowIdx, fields[fieldIdx].getName())) {
				result = false;
				break;
			}
		
		return result;
	}

	detectFirstDataRowIdx() {
		
		let countRows = this.countRows();
		
		let headingRowIdx = 0;
		
		for(headingRowIdx = 0; headingRowIdx < countRows; headingRowIdx++)
			if(this.isEmptyRow(headingRowIdx))
				break;
			
		let emptyRowIdx = 0;
		
		for(emptyRowIdx = headingRowIdx; emptyRowIdx < countRows; emptyRowIdx++)
			if(!this.isEmptyRow(emptyRowIdx))
				break;	
			
		return emptyRowIdx;
	}

	isValidDataRow(row, fields) {
		return true;
	}

	appendRow(row) {
		if(this.isValidDataRow(row, this.getFields()))
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
		
	getPropValue(propFieldName, valFieldName, propName, langCode=undefined) {
				
		let fieldValue = undefined;
	
		let countRows = this.countRows();
		for(let rowIdx = 0; rowIdx < countRows; rowIdx++) {
			
			let currPropName = this.getFieldValue(rowIdx, propFieldName);
			if(currPropName == propName) {
				let fieldName = this.getLocalFieldName(valFieldName, langCode);
				fieldValue = this.getFieldValue(rowIdx, fieldName);
				break;
			}
		}
				
		return fieldValue;
	}	
}


class Workbook extends RemoteDataset {

	constructor(url, creds=null) {
		
		super(url, creds);
		
		this.content.sheets = new Array();
	}
	
	getSheets() {
		return this.content.sheets;	
	}
	
	countSheets() {
		return Object.keys(this.getSheets()).length;
	}	
	
	getSheet(sheetName) {
		return this.getSheets()[sheetName];
	}		
		
	getSheetNames() {
		return Object.keys(this.getSheets());
	}		
		
	createBlankSheet(sheetName) {
		return new Worksheet(this, sheetName);
	}		
		
	appendSheet(sheet) {	
		this.content.sheets[sheet.getName()] = sheet;
	}
		
	countFields(sheetName) {
		return this.getSheet(sheetName).countFields();
	}
	
	fieldExists(sheetName, fieldName) {
		return this.getSheet(sheetName).fieldExists(fieldName);
	}
	
	getFieldNames(sheetName) {
		return this.getSheet(sheetName).getFieldNames();
	}
	
	getLocalFieldName(sheetName, fieldNameBase, langCode=undefined) {
		return this.getSheet(sheetName).getLocalFieldName(fieldNameBase, langCode);
	}
	
	getFieldByName(sheetName, fieldName) {
		return this.getSheet(sheetName).getFieldByName(fieldName);
	}
	
	countRows(sheetName) {
		return this.getSheet(sheetName).countRows();
	}
	
	isEmptyRow(sheetName, rowIdx) {
		return this.getSheet(sheetName).isEmptyRow(rowIdx);
	}
	
	detectFirstDataRowIdx(sheetName) {
		return this.getSheet(sheetName).detectFirstDataRowIdx();
	}
	
	getFieldValue(sheetName, rowIdx, fieldName) {
		return this.getSheet(sheetName).getFieldValue(rowIdx, fieldName);
	}	
		
	getPropValue(sheetName, propFieldName, valFieldName, propName, langCode=undefined) {
		let sheet = this.getSheet(sheetName);		
		return sheet.getPropValue(propFieldName, valFieldName, propName, langCode);
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

	isValidDataRow(row, fields) {
		return this.workbook.isValidDataRow(row, fields);
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
		this.tocSheetRawJson = null;
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
		
		if(this.tocSheetRawJson)
			sheets["TOC"] = this.tocSheetRawJson;
		
		for(let sheetIdx in sheetNames) {
			
			let sheetResp = this.retrieveSheetRawJson(sheetNames[sheetIdx]);
			
			if(sheetResp.getAppErrorCode() == ERR_OK)
				sheets[sheetNames[sheetIdx]] = sheetResp.getPayload();
		}
			
		let resp = new AppResponse(sheets, error);
		
		return resp;
	}
		
	createBlankSheet(sheetName) {
		return new SimpleGoogleWorksheet(this, sheetName);
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
			
			this.tocSheetRawJson = tocResp.getPayload();
			
			let tocSheet = new SimpleGoogleWorksheet(this, "TOC"); 
			tocSheet.parseRawJson(this.tocSheetRawJson);
			
			for(let rowIdx = 0; rowIdx < tocSheet.countRows(); rowIdx++)
				sheetNames.push(tocSheet.getFieldValue(rowIdx, "sheet"));
		}	
		
		return sheetNames;
	}
	
	isValidDataRow(row, fields) {
		return (parseInt(row["#"]) > 0);
	}	
	
	getHeadword(sheetName, rowIdx) {
		return this.getFieldValue(sheetName, rowIdx, "headword");
	}
	
	getRussian(sheetName, rowIdx) {
		return this.getFieldValue(sheetName, rowIdx, "ru");
	}
	
	getTranslation(sheetName, rowIdx, langCode) {
		return this.getFieldValue(sheetName, rowIdx, langCode);
	}
	
	getLevelNo(sheetName, rowIdx) {
		return this.getFieldValue(sheetName, rowIdx, "level");
	}	
	
	getLessonNo(sheetName, rowIdx) {
		return this.getFieldValue(sheetName, rowIdx, "lesson");
	}	
	
	getSubjectDomainTags(sheetName, rowIdx) {
		return this.getFieldValue(sheetName, rowIdx, "tags");
	}
	
	getMnemoPhrase(sheetName, rowIdx, langCode) {
		let mnemoColName = "mnemo_" + langCode;
		return this.getFieldValue(sheetName, rowIdx, mnemoColName);
	}
}
