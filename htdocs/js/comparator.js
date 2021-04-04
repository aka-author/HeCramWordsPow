class Comparator {

	constructor() {}
	
	compareItems(item1, item2) {
		return String(item1).localeCompare(String(item2));
	}

}