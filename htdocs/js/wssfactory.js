

const SRC_SIMPLE_GDOC = "gdocs";


class WorkbookFactory {

	constructor() {
		this.workbook = null;
	}
	
	getWorkbook() {
		return this.workbook;
	}
	
	createWorkbook(params) {
		
		switch (params.srcId) {
			case SRC_SIMPLE_GDOC: 
				this.workbook = new SimpleGoogleWordspace(params.wspId);
				break;
			default:
				this.workbook = null;
		}
		
		return this;
	}

}