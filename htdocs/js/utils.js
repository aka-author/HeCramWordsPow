//* * ** *** ***** ******** ************* *********************
// Project: Nakar
// Module:  Play of Words
// Layer:	Web front-end
// File:	utils.js                                (\_/)
// Func:	Common constants, functions, etc.       (^.^) 
//* * ** *** ***** ******** ************* *********************

//
// Boolean
//

function comparableBooleanNum(v) {
	return typeof v == "number" ? 1 : 0;
}


function comparableBooleanStr(v1) {
	return typeof v == "string" ? 1 : 0;
}



//
// Characters and strings
//

function firstChr(str) {
	return str ? str[0] : "";
}


function lastChr(str) {
	return str ? str[str.length - 1] : "";
}


function trimFirstChr(str) {
	return str ? str.substring(1) : "";
}


function multiChr(chr, num) {
	return chr.repeat(num);
}


function capitalizeFirstChr(str) {
	return firstChr(str).toUpperCase() + trimFirstChr(str);
}


function safeCompareStrings(s1, s2) {
	
	if(!Boolean(s1) && Boolean(s2))
		return -1;
	else 
		if(Boolean(s1) && !Boolean(s2))
			return 1;
		else 
			if(!Boolean(s1) && !Boolean(s2))
				return 0;
			else
				return String(s1).localeCompare(String(s2));	
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
// Arrays
//

function matrixMap(matrix, func) {
	return matrix.map(function(row) {row.map(func)});
}


function assMap(assArr, func, upperContext=null) {

	let outAssArr = new Array();
	
	for(let key in assArr) {
		
		let context = {
			"upperContext" : upperContext, 
			"array"        : assArr,
			"key"          : key, 
		}
		
		outAssArr[key] = func(assArr[key], context);
	}	
		
	return outAssArr;
}


function matrixAssMap(matrix, func) {
		
	function mapRow(row, upperContext) {
		return assMap(row, func, upperContext);
	}
	
	return assMap(matrix, mapRow);
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

function isHtmlTextNode(smth) {
	return false;//smth instanceof HTMLTextNode;
}


function isHtmlElement(smth) {
	return smth instanceof HTMLElement;
}


function isDomObject(smth) {
	return isHtmlTextNode(smth) || isHtmlElement(smth);
}


function guarnteeDomObject(smth) {
	
	let domObject = null;
	
	switch (typeof smth) {
		case "string": 
			domObject = document.createTextNode(smth);
			break;
		case "number":
			domObject = document.createTextNode(String(smth));
			break;
		default:
			domObject = isDomObject(smth) ? 
							smth : document.createTextNode(String(smth));  
	}
	
	return domObject;
}


function clearInnerHtml(htmlElement) {
	htmlElement.innerHTML = "";
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


function wrapIntoSpan(smth) {
	
	let resultHtml = null;
	
	let innerHtml = guarnteeDomObject(smth);
		
	resultHtml = document.createElement("span");
	resultHtml.appendChild(innerHtml);
	
	return resultHtml;
}


function assembleUrlParams() {
	
	let urlParams = "";
	let paramNameIdx = 0;
	let paramCount = 0;
	
	while(paramNameIdx < arguments.length) {
		
		let paramValueIdx = paramNameIdx + 1;
		
		if(arguments[paramValueIdx]) { 
		
			urlParams += 
				(paramCount == 0 ? "?" : "&") + 
			    arguments[paramNameIdx] + 
			    "=" + 
			    arguments[paramValueIdx];
					  
			paramCount++;		  
		}			  
					
		paramNameIdx += 2;
	}
		
	return urlParams;
}