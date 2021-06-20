//* * ** *** ***** ******** ************* *********************
// Project: Nakar
// Module:  Play of Words
// Layer:	Web front-end
// File:	wssfactory.js                   (\_/)
// Func:	Creating workbooks              (^.^) 
//* * ** *** ***** ******** ************* *********************

const SRC_SIMPLE_GDOC = "gdocs";


class WorkbookFactory {

	constructor() {
		this.workbook = null;
	}
	
	getWorkbook() {
		return this.workbook;
	}
	
	createWorkbook(chief, params) {
		
		switch (params.srcId) {
			case SRC_SIMPLE_GDOC: 
				this.workbook = new SimpleGoogleWordspace(chief, params.wspId);
				break;
			default:
				this.workbook = null;
		}
		
		return this;
	}

}