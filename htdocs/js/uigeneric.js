//* * ** *** ***** ******** ************* *********************
// Generic User Interface Controls
//
//                                                 (\_/)
//                                                 (^.^) 
//* * ** *** ***** ******** ************* *********************

class UIControl {
	
	constructor(parentControl, id) {
		this.parentControl = parentControl;
		this.id = id;
		this.control = this.getControl();
		this.controlValue = "";
		this.objectValue = this.control ? this.getObjectValue() : null;		 
	}
	
	getParentControl() {
		return this.parentControl;
	}
	
	getId() {
		return this.id;
	}
	
	getControl() {
		return document.getElementById(this.getId());
	}
	
	getControlValue() { 	
		return this.control.value;
	}
	
	setControlValue(controlValue) {
		this.control.value = controlValue;
	}
	
	parseControlValue(controlValue) {
		return controlValue;
	}
	
	serializeObjectValue(objectValue) {
		return String(objectValue);
	}
	
	publishObjectValue(objectValue) {
		return String(objectValue);
	}	
	
	getObjectValue() {
		this.control = this.getControl();
		this.controlValue = this.getControlValue();
		this.objectValue = this.parseControlValue(this.controlValue);
		return this.objectValue;
	}
	
	setObjectValue(objectValue) {
		this.control = this.getControl();
		this.controlValue = this.serializeObjectValue(objectValue);
		this.setControlValue(this.controlValue);
	}		
	
	show() {
		this.getControl().style.display = "";
	}
	
	hide() {
		this.getControl().style.display = "none";
	}
	
	getGame() {
		return this.game ? this.game : this.parentControl.getGame();  
	}
	
	onChange() {
	}
}


class Selector extends UIControl {
	
	appendOptions(objectValues) {
		
		let selectElement = this.getControl();
		
		for(let i = 0; i < objectValues.length; i++) {
			
			let optionElement = document.createElement("option");
			
			let optionValue = this.serializeObjectValue(objectValues[i]);
			optionElement.setAttribute("value", optionValue);
			
			let optionWording = this.publishObjectValue(objectValues[i]);
			let optionTextNode = document.createTextNode(optionWording);
			optionElement.appendChild(optionTextNode);
			
			selectElement.appendChild(optionElement);
		}
	}
}

class Area extends UIControl {
}