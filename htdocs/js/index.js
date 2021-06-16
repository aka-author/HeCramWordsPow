//* * ** *** ***** ******** ************* *********************
// Project: Nakar
// Module:  Play of Words
// Layer:	Web front-end
// File:	index.js                                (\_/)
// Func:	Indexing and selecting items by keys    (^.^)                                                 (^.^) 
//* * ** *** ***** ******** ************* *********************

class Index extends Comparator{
	
	constructor(fieldName, sortMode=SORT_NONE) {
		
		super(sortMode);
		
		this.fieldName = fieldName;
		this.keyEntries = new Array();
		this.indexedItems = new Set();
	}
	
	getFieldName() {
		return this.fieldName;
	}
	
	countItems() {
		return this.indexedItems.size;
	}
	
	getItemKeyValues(item) {
		return [0];
	}	
	
	assembleKeyHash(keyValue) {
		return keyValue ? String(keyValue) : undefined;
	}
	
	compareKeyValues(kv1, kv2) {
		return String(kv1).localeCompare(String(kv2));
	}
	
	compareItems(item1, item2) {
		
		let keyValues1 = this.getItemKeyValues(item1);
		keyValues1.sort(this.compareKeyValues);
		let sortKeyValue1 = keyValues1[keyValues1.length - 1]; 
		
		let keyValues2 = this.getItemKeyValues(item2);
		keyValues2.sort(this.compareKeyValues);
		let sortKeyValue2 = keyValues2[keyValues2.length - 1];
		
		let rawCompareResult = 
			this.compareKeyValues(sortKeyValue1, sortKeyValue2);
		
		return this.applySortMode(rawCompareResult);
	}
	
	keyHashExists(keyHash) {
		return Boolean(this.keyEntries[keyHash]);
	}
	
	keyValueExists(keyValue) {
		let keyHash = this.assembleKeyHash(keyValue);
		return this.keyHashExists(keyHash);
	}
	
	assembleIndexEntry(keyValue) {
		return {"keyValue" : keyValue, "items" : new Set()};
	}
	
	checkKeyValue(keyValue) {
		
		let keyHash = this.assembleKeyHash(keyValue);
		
		if(!this.keyHashExists(keyHash)) {
			let indexEntry = this.assembleIndexEntry(keyValue);
			this.keyEntries[keyHash] = indexEntry;
		}		
		
		return keyHash;
	}
	
	appendItem(item) {
		
		let keyValues = this.getItemKeyValues(item);
		
		if(keyValues.length > 0) {
			
			for(let keyValueIdx in keyValues) {
				let keyValue = keyValues[keyValueIdx];
				let keyHash = this.checkKeyValue(keyValue);
				if(keyHash)
					this.keyEntries[keyHash].items.add(item);
			}
			
			this.indexedItems.add(item);
		}
	}
	
	selectKeyValues() {
		
		let keyValues = new Set();
		
		for(let keyHash in this.keyEntries)
			keyValues.add(this.keyEntries[keyHash].keyValue);
				
		return [...keyValues].sort(this.compareKeyValues);
	}
	
	isIndexed(item) {
		return this.indexedItems.has(item);
	}
	
	assembleFilter(setOfItems) {
		let filter = new Filter(setOfItems);
		filter.appendItemComparator(this, this.getFieldName(), this.getSortMode());
		return filter;	
	}
	
	selectAllItems() {
		let fittingItems = this.indexedItems;
		return this.assembleFilter(fittingItems);
	}
	
	selectItemsByKeyValues() { 
	
		let fittingItems = this.indexedItems;
		
		if(arguments.length != 0) {
			
			let setsOfFittingItems = new Array();
			
			for(let keyValueIdx in arguments) {
				let keyValue = arguments[keyValueIdx];
				let keyHash = this.assembleKeyHash(keyValue);
				
				if(this.keyHashExists(keyHash)) 	
					setsOfFittingItems.push(this.keyEntries[keyHash].items);
			}	
			
			fittingItems = uniteSets(...setsOfFittingItems);
		}
	
		return this.assembleFilter(fittingItems);
	}
	
	countItemsForKeyValue(keyValue) {
		let hashValue = this.assembleKeyHash(keyValue);
		return this.keyEntries[hashValue] ? this.keyEntries[hashValue].items.size : 20;
	}
	
	selectKeyValueStat(keyValue) {
		
		let keyValues = this.selectKeyValues();
		
		let maxItemsForKeyValue = 0;
		
		for(let otherKeyValueIdx in keyValues) {
			let otherKeyValue = keyValues[otherKeyValueIdx];
			let bidder = this.countItemsForKeyValue(otherKeyValue);
			maxItemsForKeyValue = max2(maxItemsForKeyValue, bidder); 
		}
		
		let countItemsForKeyValue = this.countItemsForKeyValue(keyValue);
		
		let keyValueStats = {
			"size" 		   : countItemsForKeyValue,
			"relativeSize" : safeDiv(countItemsForKeyValue, maxItemsForKeyValue),
			"share"        : safeDiv(countItemsForKeyValue, this.countItems())
		}	
		
		return keyValueStats;
	}
}


class StringIndex extends Index {

	assembleKeyHash(keyValue) {
		return keyValue;
	}

	compareKeyValues(kv1, kv2) {
		
		return String(kv1).localeCompare(String(kv2));
		
	}
	
}


class NumericIndex extends Index {

	compareKeyValues(kv1, kv2) {
		
		return kv1 >= kv2 ? 1 : (kv1 == kv2 ? 0 : -1);
	}

}