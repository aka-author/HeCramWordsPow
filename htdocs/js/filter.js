//* * ** *** ***** ******** ************* *********************
// Project: Nakar
// Module:  Play of Words
// Layer:	Web front-end
// File:	filter.js                      (\_/)
// Func:	Managing subsets of items      (^.^)
//* * ** *** ***** ******** ************* *********************

class Filter {
	
	constructor(setOfItems) {
		this.itemComparators = new Array();
		this.setSetOfItems(setOfItems);
	}
	
	getSetOfItems() {
		return this.setOfItems;
	}
	
	setSetOfItems(setOfItems) {
		this.setOfItems = setOfItems;
		this.rebuild();
	}
	
	selectItemComparatorsByPriority() {
	
		let itemComparatorsByPriority = new Array();
		
		for(let fieldName in this.itemComparators)
			itemComparatorsByPriority.push(this.itemComparators[fieldName]);
		
		let comparePrioritiesFunc = 
			function(e1, e2){return e1.priority - e2.priority};
		
		itemComparatorsByPriority.sort(comparePrioritiesFunc);
		
		return itemComparatorsByPriority;
	}
	
	itemComparatorPriorityExists(priority) {
		return Boolean(this.itemComparators[priority]);
	}
	
	compareItems(item1, item2) {
		
		let result = 0;
		
		let itemComparatorsByPriority = 
			this.selectItemComparatorsByPriority();
		
		for(let priority in itemComparatorsByPriority) {
			if(this.itemComparatorPriorityExists(priority)) {
				
				let itemComparator 
					= this.itemComparators[priority].itemComparator;
					
				result = itemComparator.compareItems(item1, item2);
				
				if(result != 0)
					break;
			}
		}
		
		return result;
	}
	
	countItemComporators() {
		let count = 0;
		for(let priority in this.itemComparators)
			count++;
		return count;
	}
	
	bbb() {
		return this.compareItems;
	}
	
	rebuild() {
		
		this.sortedItems = new Array(...this.getSetOfItems());
		
		// That's too strange but it works
		// in Chrome, FF, Edge, Opera
		let thisFilter = this;
		
		let compareItemsFunc = function(item1, item2) {
			return thisFilter.compareItems(item1, item2);
		};
		
		if(this.countItemComporators() > 0) 	
			this.sortedItems.sort(compareItemsFunc);
		
	}
	
	assembleItemComparatorEntry(itemComparator, fieldName, sortMode, priority) {
		
		return itemComparatorEntry;
	}
	
	getNewItemComparatorPriority() {
		
		let newItemComparatorPriority = 0;
		
		for(let fieldName in this.itemComparators)
			if(this.itemComparators[fieldName].priority > newItemComparatorPriority)
				newItemComparatorPriority = this.itemComparators[fieldName].priority;
		
		return newItemComparatorPriority++;	
	}
	
	appendItemComparator(itemComparator, fieldName, sortMode=SORT_ASCENDING) {
		
		let itemComparatorEntry = new Array();
		
		itemComparatorEntry.itemComparator = itemComparator;
		itemComparatorEntry.fieldName = fieldName;
		itemComparatorEntry.sortMode = sortMode;
		itemComparatorEntry.priority = this.getNewItemComparatorPriority();
		
		this.itemComparators.push(itemComparatorEntry);
		
		this.rebuild();
	}
	
	setItemComparatorPriority(fieldName, priority) {
		// TBD
	}
	
	setItemComparatorSortMode(fieldName, sortMode) {
		// TBD
	}
	
	deleteItemComparator(fieldName) {
		// TBD
	}
	
	joinFilters() {
		let setsOfItems = new Array(this.getSetOfItems());
		for(argIdx in arguments)
			setsOfItems.push(arguments[argIdx].getSetOfItems());
		this.setSetOfItems(uniteSets(...setsOfItems));
		return this;
	}
	
	crossWithFilters() {
		let setsOfItems = new Array(this.getSetOfItems());
		for(let argIdx in arguments)
			setsOfItems.push(arguments[argIdx].getSetOfItems());
		this.setSetOfItems(intersectSets(...setsOfItems));
		return this;
	}
	
	countItems() {
		return this.sortedItems.length;
	}
	
	fetchItemByIdx(idx) {
		return this.sortedItems[idx];
	}
	
	fetchRandomItem() {
		return this.fetchItemByIdx(randomInt(0, this.countItems() - 1));
	}
}


// TEST
/*
console.log("Start testing filters");

var item1 = {"company" : "Vector", "name" : "Vasya", "age" : 20, "salary" : 1000, "nic" : "Darklord"};
var item2 = {"company" : "Vector", "name" : "Asya",  "age" : 30, "salary" : 2000};
var item3 = {"company" : "Zaichik", "name" : "Sya",   "age" : 40, "salary" : 3000, "nic" : "Darklord"};
var item4 = {"company" : "Zaichik", "name" : "Ari",   "age" : 45, "salary" : 4000, "nic" : "Darklord"};

class CompanyIndex extends StringIndex {
	getItemKeyValues(item) {
			return [item.company];
	}
}

class NameIndex extends StringIndex {
	getItemKeyValues(item) {
		if(item.nic) 
			return [item.name, item.nic];
		else
			return [item.name];
	}
}

class AgeIndex extends NumericIndex {
	getItemKeyValues(item) {
		return [item.age];
	}
}

class SalaryIndex extends NumericIndex {
	getItemKeyValues(item) {
		return [item.salary];
	}
}

var companyIndex = new CompanyIndex("company", SORT_DESCENDING);
var nameIndex = new NameIndex("name", SORT_ASCENDING);
var ageIndex = new AgeIndex("age", SORT_ASCENDING);
var salaryIndex = new SalaryIndex("salary", SORT_ASCENDING);

companyIndex.appendItem(item1);
nameIndex.appendItem(item1);
ageIndex.appendItem(item1);
salaryIndex.appendItem(item1);

companyIndex.appendItem(item2);
nameIndex.appendItem(item2);
ageIndex.appendItem(item2);
salaryIndex.appendItem(item2);

companyIndex.appendItem(item3);
nameIndex.appendItem(item3);
ageIndex.appendItem(item3);
salaryIndex.appendItem(item3);

companyIndex.appendItem(item4);
nameIndex.appendItem(item4);
ageIndex.appendItem(item4);
salaryIndex.appendItem(item4);

console.log(nameIndex.selectItemsByKeyValues("Vasya", "Sya", "Asya"));
console.log(ageIndex.selectItemsByKeyValues(40, 30));

let filter0 = nameIndex.selectAllItems();
console.log(filter0.countItems());
console.log(filter0.fetchItemByIdx(filter0.countItems() - 1));
console.log(filter0.fetchRandomItem());

let filter1 = nameIndex.selectItemsByKeyValues("Vasya", "Asya");
console.log(filter1.countItems());
console.log(filter1.fetchItemByIdx(1));

let filter2 = ageIndex.selectItemsByKeyValues(40, 30);
console.log(filter1.fetchItemByIdx(0));

console.log("Darklord");
let filter3 = nameIndex.selectItemsByKeyValues("Darklord", "Vasya");
console.log(filter3);

console.log("Company");
let filter4 = companyIndex.selectAllItems();
filter4.appendItemComparator(salaryIndex);
console.log(filter4);

console.log(filter1.crossWithFilters(filter2));

console.log("Stop testing filters");
*/