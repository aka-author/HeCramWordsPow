//* * ** *** ***** ******** ************* *********************
// Project: Nakar
// Module:  Play of Words
// Layer:	Web front-end
// File:	remoteds.js                         (\_/)
// Func:	Accessing remote data objects       (^.^)
//* * ** *** ***** ******** ************* *********************

class Credentials {

	constructor(login, pwd, secret=undefined) {
		this.login = login;
		this.pwd = pwd;
		this.secret = secret;
	}
	
	getLogin() {
		return this.login;
	}
	
	getPwd() {
		return this.pwd;
	}
	
	getSecret() {
		return this.secret;
	}
}


const ERR_VIRGIN = 1;
const ERR_REJECTED = 2;
const ERR_NOT_AUTHORIZED = 3;
const ERR_LOAD_FAILURE = 4;
const ERR_PARSE_FAILURE = 5;

class AppResponse {

	constructor(payload=null, error=null) {
		this.payload = payload;
		this.error = error ? error : new AppError(ERR_OK);
	}
	
	getPayload() {
		return this.payload;
	}
	
	setPayload(payload) {
		this.payload = payload;
	}
	
	getError() {
		return this.error;
	}
	
	setError(error) {
		this.error = error;
	}	
	
	getErrorCode() {
		return this.getError().getCode();
	}
}


class RemoteDataset {

	constructor(url, credentials=null) {
		this.error = new AppError(ERR_VIRGIN);
		this.url = url;
		this.credentials = credentials;
		this.authData = null;
		this.content = null;
	}
	
	getApp() {
		return GLOBAL_app;
	}
	
	getUrl() {
		return this.url;
	}
	
	setUrl() {
		this.url = url;
	}
	
	getCredentials() {
		return this.credentials;
	}
	
	setCredentials(credentials) {
		this.credentials = credentials;
	}
	
	getAuthData() {
		return this.authData;
	}
	
	setAuthData(authData) {
		this.authData = authData;
	}
	
	getError() {
		return this.error;
	}
	
	setError(error) {
		return this.error = error;
	}
	
	getContent() {
		return this.content;
	}
	
	setContent(content) {
		this.content = content
	}
	
	isAuthorized() {
		
		let errCode = this.getAuthError().getCode();
		
		return (errCode != ERR_VIRGIN) && 
		       (errCode != ERR_REJECTED);
	}
	
	isRawDataLoaded() {
		
		let errCode = this.getErr().getCode();
		
		return this.isAuthorized() && 
		       errCode != ERR_RMT_LOAD_FAILURE;
	}
	
	sendAuthRequest(credentials) {
		return new AppResponse();
	}
	
	auth() {
		
		let cred = this.getCredentials();
		
		let authResp = this.sendAuthRequest(cred);
		
		this.setAuthData(authResp.getAuthData());
		this.setError(authResp.getError());
		
		return this;
	}
	
	sendLoadRequest() {
		return new AppResponse();
	}
	
	parseRawData(rawData) {
		return new AppResponse();
	}
	
	load() {
		
		if(this.isAuthorized()) {
			
			let loadResp = this.sendLoadRequest();
			this.setError(loadResp.getError());
			
			if(loadResp.getErrorCode() == ERR_OK) {
				let rawData = loadResp.getPayload();
				let parseResp = this.parseRawData(rawData);
				this.setError(parseResp.getError());
				if(parseResp.getErrorCode() == ERR_OK) {
					let content = parseResp.getPayload();
					this.setContent(content);
				}	
			}	
		}
		else {
			let error = new AppError(ERR_NOT_AUTHORIZED);
			this.setError(error);
		}	
		
		return this;
	}
	
}