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
	
	// when picking from a file
	parseSerializedObjectValue(serializedObjectValue) {
		return serializedObjectValue;
	}
	
	// when loading to a control, e.g. option/@vaue
	assembleControlValue(objectValue) {
		return String(objectValue);
	}
	
	// when loading to a control, e.g. option
	assembleControlValueAppearance(objectValue) {
		return String(objectValue);
	}
	
	// when retrieving from a control
	parseControlValue(controlValue) {
		return controlValue;
	}
	
	// when saving to a file
	serializeObjectValue(objectValue) {
		return String(objectValue);
	}
	
	// when displaying a value out of a control
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
		this.controlValue = this.assembleControlValue(objectValue);
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
			
			let optionValue = this.assembleControlValue(objectValues[i]);
			optionElement.setAttribute("value", optionValue);
			
			let optionWording = this.assembleControlValueAppearance(objectValues[i]);
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
	}
	
	getFrontPane() {
		return this.frontPaneLabel ? 
					this.getFrontPaneLabel().getPane() : 
					null;
	}
	
	getFrontPaneLabel() {
		return this.frontPaneLabel;
	}
	
	switchToPane(paneLabel) {
		
		if(this.getFrontPaneLabel()) {
			this.getFrontPane().hide();
			this.getFrontPaneLabel().sendBack();
		}	
		
		this.frontPaneLabel = paneLabel;
		
		this.getFrontPane().show();
		this.getFrontPaneLabel().sendFront();
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
		
		let frontPaneLabel = 
			this.getGroupOfPanes().getFrontPaneLabel();
		
		return frontPaneLabel ? 
					frontPaneLabel.getId() == this.getId() :
					false;
	}
	
	sendFront() {
	}
	
	sendBack() {
	}
	
	onSwitch() {
		if(!this.isFront())
			this.getGroupOfPanes().switchToPane(this);
	}
}



