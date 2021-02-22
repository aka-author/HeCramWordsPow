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
		this.setupProperties();	
	}
	
	setupProperties() {
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


class GroupOfPanes extends UIControl {
	
	setupProperties() {
		this.paneLabels = new Array();
		this.frontPaneLabel = null;
	}
	
	appendPane(pane, paneLabel) {
		paneLabel.setPane(pane);
		paneLabel.setGroupOfPanes(this);
		this.paneLabels[paneLabel.getId()] = paneLabel;
		this.frontPaneLabel = paneLabel;
	}
	
	getFrontPane() {
		return this.getFrontPaneLabel().getPane();
	}
	
	getFrontPaneLabel() {
		return this.frontPaneLabel;
	}
	
	switchToPane(paneLabel) {
		
		this.getFrontPane().hide();
		this.getFrontPaneLabel().goBack();
		
		this.frontPaneLabel = paneLabel;
		
		this.getFrontPane().show();
		this.getFrontPaneLabel().goFront();
	}
}


class Pane extends UIControl {
}


class PaneLabel extends UIControl {
	
	getPane() {
		return this.pane;
	}
	
	setPane(pane) {
		this.pane = pane;
	}		
	
	getGroupOfPanes() {
		return this.groupOfPanes;
	}
	
	setGroupOfPanes(groupOfPanes) {
		this.groupOfPanes = groupOfPanes;
	}
	
	isFront() {
		return this.getGroupOfPanes().getFrontPaneLabel().getId() == this.getId();
	}
	
	goFront() {
	}
	
	goBack() {
	}
	
	onSwitch() {
		if(!this.isFront())
			this.getGroupOfPanes().switchToPane(this);
	}
}



