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
// Numeric
//

function max2(a, b) {
	 return a >= b ? a : b;
}

function maxMulti(getComparableValueFunc) {
	
	let max = undefined;
	
	if(arguments.length < 2) {
		max = getComparableValueFunc(arguments[1]);
		for(let argIdx = 2; argIdx < arguments.length; argIdx++)
			max = max2(max, getComparableValueFunc(arguments[argIdx]));
	}
	
	return max;
}

function safeDiv(a, b) {
	return b != 0 ? a/b : undefined;
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
// Comparing values
//

function safeCompareStrings(s1, s2) {
	
	if(!Boolean(s1) && Boolean(s2))
		return 1;
	else 
		if(Boolean(s1) && !Boolean(s2))
			return -1;
		else 
			if(!Boolean(s1) && !Boolean(s2))
				return 0;
			else
				return s1.localeCompare(s2);	
}



//
// HTML
//

function isHtmlElement(domNode) {
	return domNode instanceof HTMLElement;
}


function clearInnerHtml(htmlElement) {
	htmlElement.innerHTML = "";
}


function guarnteeDomObject(smth) {
	return isHtmlElement(smth) ? smth : document.createTextNode(smth);
}


function wrapIntoLink(linkHolder, url, target=undefined) {
	
	let resultHtml = null;
	
	let innerHtml = guarnteeDomObject(linkHolder);
	
	if(Boolean(url)) {
		let a = document.createElement("a");
		a.setAttribute("href", url);
		if(target) a.setAttribute("target", target);
		a.appendChild(innerHtml);
		resultHtml = a;
	}
	else 
		resultHtml = innerHtml;
	
	return resultHtml;
}
