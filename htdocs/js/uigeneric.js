//* * ** *** ***** ******** ************* *********************
// Project: Nakar
// Module:  Play of Words
// Layer:	Web front-end
// File:	uigeneric.js                         (\_/)
// Func:	Generic user interface controls      (^.^)
//* * ** *** ***** ******** ************* *********************

//
// Abstract controls
//

class UiControl extends Bureaucrat {
	
	constructor(parentUiControl, id) {
		
		super(parentUiControl, id);
				
		this.domObject = this.getDomObject();
		this.domObjectValue = this.getDomObjectValue();
		this.uiControlValue = this.domObject ? this.getUiControlValue() : null;	
		this.setupProperties();	
	}
	
	setupProperties() {/* abstract */}
	
	getDomObject() {
		return document.getElementById(this.getId());
	}
	
	getDomObjectValue() { 	
		let domObject = this.getDomObject();
		return domObject ? this.getDomObject().value : this.getId();
	}
	
	setDomObjectValue(domObjectValue) {
		this.getDomObject().value = domObjectValue;
	}
	
	// when picking from a file
	parseSerializedUiControlValue(serializedUiControlValue) {
		return serializedUiControlValue;
	}
	
	// when loading a value to a DOM object, e.g. select/option/@value
	assembleDomObjectValue(uiControlValue) {
		return String(uiControlValue);
	}
	
	// when loading a representation to a DOM object, e.g. select/option
	assembleDomObjectValueAppearance(uiControlValue) {
		return String(uiControlValue);
	}
	
	// when retrieving a value from a DOM object
	parseDomObjectValue(domObjectValue) {
		return domObjectValue;
	}
	
	// when saving to a file
	serializeUiControlValue(uiControlValue) {
		return String(uiControlValue);
	}
	
	// when displaying a value out of a control
	publishUiControlValue(uiControlValue) {
		return String(uiControlValue);
	}	
	
	getUiControlValue() {
		this.domObject = this.getDomObject();
		this.domObjectValue = this.getDomObjectValue();
		this.uiControlValue = this.parseDomObjectValue(this.domObjectValue);
		return this.uiControlValue;
	}
	
	setUiControlValue(uiControlValue) {
		this.uiControlValue = uiControlValue;
		this.domObject = this.getDomObject();
		this.domObjectValue = this.assembleDomObjectValue(uiControlValue);
		this.setDomObjectValue(this.domObjectValue);
	}		
	
	show() {
		this.getDomObject().style.display = "";
	}
	
	hide() {
		this.getDomObject().style.display = "none";
	}
	
	onChange() {
	}
}



//
// Selectors
//

class Selector extends UiControl {
	
	assembleOptionId(value) {
		return this.getId() + "__" + value;
	}
	
	appendOptions(uiControlValues) {
		
		let selectElement = this.getDomObject();
		
		for(let uiControlValueIdx in uiControlValues) {
			
			let optionElement = document.createElement("option");
			
			let optionValue = 
					this.assembleDomObjectValue(uiControlValues[uiControlValueIdx]);
			
			optionElement.setAttribute("value", optionValue);
			optionElement.setAttribute("id", this.assembleOptionId(optionValue));
			
			let optionWording = 
					this.assembleDomObjectValueAppearance(uiControlValues[uiControlValueIdx]);
					
			let optionTextNode = document.createTextNode(optionWording);
			optionElement.appendChild(optionTextNode);
			
			selectElement.appendChild(optionElement);
		}
	}
}



//
// Areas and panes
//

class Area extends UiControl {
	
	clear() {
		this.getDomObject().innerHTML = "";
	}
	
}


class GroupOfPanes extends UiControl {
	
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


class Pane extends UiControl {/* gasket */}


class PaneLabel extends UiControl {
	
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
	
	sendFront() {/* abstract */}
	
	sendBack() {/* abstract */}
	
	onSwitch() {
		if(!this.isFront())
			this.getGroupOfPanes().switchToPane(this);
	}
}



//
// Buttons
//

class Button extends UiControl {
	
	animatePress() {}
	
	performAction() {}
	
	getPressed() {
		this.animatePress();
		this.performAction();
	}
}


class GraphButton extends Button {
}



//
// Clouds of tags
//

class TagSwitch extends UiControl {
	
	constructor(tagCloud, tag) {
		let id = tagCloud.getId() + "__" + tag.code;
		super(tagCloud, id);
		this.tag = tag;
		this.uiControlValue = this.getEmptyValue();
		this.className = this.assembleClassName(tag); 
	}
		
	assembleClassName() {
		return "tag" + Math.floor(this.tag.relativeSize*10);
	}
	
	getClassName() {
		return this.className;
	}
	
	getEmptyValue() {
		return "*";
	}
	
	getUiControlValue() {
		return this.uiControlValue;
	}
	
	isTagOn() {
		return this.getUiControlValue() != this.getEmptyValue();
	}
	
	turnOn() {
		this.uiControlValue = this.tag.code;
	}
	
	turnOff() {
		this.uiControlValue = this.getEmptyValue();
	}
	
	getPressed() {
		
		if(this.isTagOn()) 
			this.turnOff();
		else 
			this.turnOn();
		
		this.show();
		
		this.getChief().getPressed(); 
	}
	
	assembleHtml() {
		
		let id = this.getId();
		
		let tagSpan = document.createElement("span");
		
		tagSpan.setAttribute("id", id);
		tagSpan.setAttribute("class", this.getClassName());
		tagSpan.innerHTML = this.tag.wording;
		
		tagSpan.onclick = function() {
			GLOBAL_app.process(id, 'getPressed');
		};
		
		return tagSpan;
	}
	
	show() {
		let span = this.getDomObject();
		
		if(this.isTagOn()) 
			span.style.background = "#ffccdd";
		else 
			span.style.background = "#ffffff";
	}
	
	setWording(wording) {
		let span = this.getDomObject();
		span.innerHTML = wording;
	}
}


class TagCloud extends UiControl {
	
	assembleHtml() {
	
		let tagCloudDiv = document.createElement("div");
	
		this.tagSwitches = new Array();
	
		for(let tagIdx in this.tags) {
			let tag = this.tags[tagIdx];
			let tagSwitch = new TagSwitch(this, tag);
			this.tagSwitches[tag.code] = tagSwitch;
			tagCloudDiv.appendChild(tagSwitch.assembleHtml());
			
			tagCloudDiv.appendChild(document.createTextNode(" "));
		}
		
		return tagCloudDiv;
	}
	
	getUiControlValue() {
		return this.uiControlValue;
	}
	
	appendTags(tags) {
		this.tags = tags;
		let html = this.assembleHtml();
		
		console.log(html);
		console.log(this.getDomObject());
		
		this.getDomObject().appendChild(html);
	}
	
	getPressed() {
		
		this.uiControlValue = new Array();
		
		for(let tagCode in this.tagSwitches) 
			if(this.tagSwitches[tagCode].isTagOn())
				this.uiControlValue.push(tagCode);
		
		this.onChange();	
	}
	
	onChange() {
		// Abstract
	}
	
	setUiControlValue(tags) {
		this.uiControlValue = tags;
	}
	
	setLocalTagWordings(tagWordings) {
		this.tagWordings = tagWordings;
	}
	
	localize(i18nTable, langCode) {
		for(let tagCode in this.tagsSwitches) {
			let wording = this.tagWordings[tagCode][langCode];
			if(wording)
				this.tagSwitches[tagCode].setWording(wording);
		}
	}
}
