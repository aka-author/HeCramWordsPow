//* * ** *** ***** ******** ************* *********************
// Misc. constants, functions, etc.
//
//                                                    (\_/)
//                                                    (^.^) 
//* * ** *** ***** ******** ************* *********************

//
// Characters and strings
//

function firstChr(str) {
	return str[0];
}


function lastChr(str) {
	return str[str.length - 1];
}


function trimFirstChr(str) {
	return str.substring(1);
}


function multiChr(chr, num) {
	return chr.repeat(num);
}



//
// Randomization
//

function getRandomAlternative(probabilityOfTrue) {
	return Math.random()*100 < probabilityOfTrue;
}


function randomInt(from, to) {
	let rawRi = 1 + from + Math.round(Math.random()*(to - from));
	return rawRi <= to ? rawRi : from;	
}


function getRandomKey(arr) {
	let keys = arr ? Object.keys(arr) : [];
	let randomKeyIdx = randomInt(0, keys.length - 1);	
	return keys[randomKeyIdx];
}



//
// HTML
//

function isHtmlElement(domNode) {
	return domNode instanceof HTMLElement;
}
