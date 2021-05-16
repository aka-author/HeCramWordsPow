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


class AppResponse {

	constructor(payload=null, appError=null) {
		this.payload = payload;
		this.appError = appError ? appError : new AppError(ERR_OK);
	}
	
	getPayload() {
		return this.payload;
	}
	
	setPayload(payload) {
		this.payload = payload;
	}
	
	getAppError() {
		return this.appError;
	}
	
	setAppError(appError) {
		this.appError = appError;
	}	
	
	getAppErrorCode() {
		return this.getAppError().getCode();
	}
}


class RemoteDataset {

	constructor(id, url, creds=null) {
		this.id = id;
		this.appError = new AppError(ERR_OBJECT_IMMATURE);
		this.url = url;
		this.creds = creds;
		this.authData = null;
		this.content = new Array();
	}
	
	getId() {
		return this.id;
	}
	
	getApp() {
		return getGlobalApp();
	}
	
	getUrl() {
		return this.url;
	}
	
	setUrl(url) {
		this.url = url;
	}
	
	getCreds() {
		return this.creds;
	}
	
	setCreds(creds) {
		this.creds = creds;
	}
	
	getAuthData() {
		return this.authData;
	}
	
	setAuthData(authData) {
		this.authData = authData;
	}
	
	getAppError() {
		return this.appError;
	}
	
	getAppErrorCode() {
		return this.getAppError().getCode();
	}
	
	setAppError(appError) {
		return this.appError = appError;
	}
	
	getContent() {
		return this.content;
	}
	
	setContent(content) {
		this.content = content;
	}
	
	isAuthorized() {
		
		let appErrCode = this.getAppError().getCode();
		
		return (appErrCode != ERR_OBJECT_IMMATURE) && 
		       (appErrCode != ERR_AUTH_FAILURE);
	}
	
	isRawDataLoaded() {
		
		let appErrCode = this.getAppErr().getCode();
		
		return this.isAuthorized() && 
		       (appErrCode != ERR_ACCESS_FAILURE);
	}
	
	sendAuthRequest(creds) {
		return new AppResponse();
	}
	
	auth() {
		
		let creds = this.getCreds();
		
		let authResp = this.sendAuthRequest(creds);
		
		this.setAuthData(authResp.getPayload());
		this.setAppError(authResp.getAppError());
		
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
			this.setAppError(loadResp.getAppError());
			
			if(loadResp.getAppErrorCode() == ERR_OK) {
				let rawData = loadResp.getPayload();
				let parseResp = this.parseRawData(rawData);
				this.setAppError(parseResp.getAppError());
				if(parseResp.getAppErrorCode() == ERR_OK) {
					let content = parseResp.getPayload();
					this.setContent(content);
				}	
			}	
		}
		else {
			let appError = new AppError(ERR_AUTH_FAILURE);
			this.setAppError(appError);
		}	
		
		return this;
	}
	
}