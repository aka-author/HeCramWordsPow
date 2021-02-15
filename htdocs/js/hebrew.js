//* * ** *** ***** ******** ************* *********************
// Working with Hebrew Text
//
//                                                  (\_/)
//                                                  (^.^) 
//* * ** *** ***** ******** ************* *********************

function isHebrewLetter(chr) {
	return Boolean(chr.match(/[\u05d0-\u05ea]/));
}


function isHebrewChr(chr) {
	return Boolean(chr.match(/[\u05a0-\u05ef]/));
}


function isHebrewTextInside(str) {
	return str ? Boolean(str.match(/.*([\u05d0-\u05ea]).*/)) : false;	
}