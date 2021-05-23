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
	
	assembleEmptyUiControlValue() {
		return undefined;
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
	
	constructor(parentUiControl, id) {
		super(parentUiControl, id);
		this.hashes = new Array();
	}
	
	assembleOptionId(hash) {
		return this.getId() + "__" + hash;
	}
	
	assembleDomObjectValue(uiControlValue) {
		return useful(uiControlValue.code, String(uiControlValue));
	}
	
	assembleDomObjectValueAppearance(uiControlValue) {
		return useful(uiControlValue.wording, String(uiControlValue));
	}
	
	hash(domObjectValue) {
		return encodeURIComponent(domObjectValue).replace("%", "_");
	}
	
	storeHash(uiControlValue, hash) {
		this.hashes[hash] = uiControlValue;
	}
	
	restoreUiControlValue(hash) {
		return this.hashes ? this.hashes[hash] : undefined;
	}
	
	assembleOptionElement(uiControlValue) {
		
		let optionElement = document.createElement("option");
			
		let hash = this.hash(this.assembleDomObjectValue(uiControlValue));
		this.storeHash(uiControlValue, hash);
		
		optionElement.setAttribute("value", hash);
		
		optionElement.setAttribute("id", this.assembleOptionId(hash));
		
		let optionWording = this.assembleDomObjectValueAppearance(uiControlValue);
				
		let optionTextNode = document.createTextNode(optionWording);
		optionElement.appendChild(optionTextNode);
		
		return optionElement;
	}
	
	appendOptions(uiControlValues) {
		
		let selectElement = this.getDomObject();
		
		for(let valIdx in uiControlValues) {
			let optionElement = this.assembleOptionElement(uiControlValues[valIdx]);
			selectElement.appendChild(optionElement);
		}
	}
	
	setLocalWording(id, langCode, wording) {
		this.getApp().setI18nText(this.assembleOptionId(id), langCode, wording);
	}
	
	setLocalWordings(localWordings) {
		
		for(let id in localWordings) 
			for(let langCode in localWordings[id])
				this.setLocalWording(id, langCode, localWordings[id][langCode]);
	}
	
	getUiControlValue() {
		return this.restoreUiControlValue(this.getDomObjectValue());
	}
	
	setUiControlValue(uiControlValue) {
		this.setDomObjectValue(this.hash(this.assembleDomObjectValue(uiControlValue)));
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
	
	constructor(tagCloud, tagRecord) {
		let id = tagCloud.getId() + "__" + tagRecord.code;
		super(tagCloud, id);
		this.tagRecord = tagRecord;
		this.uiControlValue = this.getEmptyValue();
		this.className = this.assembleClassName(tagRecord); 
	}
		
	assembleClassName() {
		return "tag" + Math.floor(this.tagRecord.relativeSize*10);
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
		this.uiControlValue = this.tagRecord.code;
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
		tagSpan.innerHTML = this.tagRecord.wording;
		
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
	
	assembleSeparatorHtml() {
		return document.createTextNode(" ");
	}
	
	assembleTagCloudWrapperElementId() {
		return this.getId() + "Wrapper"; 	
	}
	
	assembleTagCloudWrapperElement() {
		let tagCloudWrapperElement = document.createElement("div");
		let id = this.assembleTagCloudWrapperElementId();
		tagCloudWrapperElement.setAttribute("id", id);
		return tagCloudWrapperElement;
	}
	
	assembleHtml() {
		
		this.tagSwitches = new Array();
	
		let tagCloudWrapper = this.assembleTagCloudWrapperElement();
		
		let tags = Object.keys(this.tagRecords);
		
		let count = 0;		
		for(let tagIdx in tags) {
			let tagRecord = this.tagRecords[tags[tagIdx]];
			let tagSwitch = new TagSwitch(this, tagRecord);
			if(count > 0) 
				tagCloudWrapper.appendChild(this.assembleSeparatorHtml());
			tagCloudWrapper.appendChild(tagSwitch.assembleHtml());
			this.tagSwitches[tagRecord.code] = tagSwitch;
			count++;
		}
		
		return tagCloudWrapper;
	}
	
	appendTags(tagRecords) {
		this.tagRecords = tagRecords;
		let html = this.assembleHtml();
		this.getDomObject().appendChild(html);
	}
	
	setTagLocalWordings(localWordings) {
		this.localTagWordings = localWordings;
	}		
	
	getTagWording(tag, langCode=undefined) {
			
		let wording = "";
		
		if(this.localTagWordings[tag] && langCode) 
			wording = this.localTagWordings[tag][langCode];
		else 
			if(this.tagRecords[tag])
				wording = this.tagRecords[tag].wording;
			
		return wording;		
	}
	
	getUiControlValue() {
		return this.uiControlValue;
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
	
	showLocalWordings(langCode) {
		for(let tag in this.tagRecords) {
			let wording = this.getTagWording(tag, langCode);
			if(wording)
				this.tagSwitches[tag].setWording(wording);
		}
	}
}



//
//  Sections
//

class SectionHeader extends UiControl {
}


class Section extends UiControl {
}
