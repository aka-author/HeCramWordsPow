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
		this.reporter = null;
		this.timeout = 60*1000;
		this.checkStatusTime = 1000;
		this.loadRequestComplete = false;
		this.onLoad = null;
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
	
	getCheckStatusTime() {
		return this.checkStatusTime;
	}
	
	setCheckStatusTime(msec) {
		this.checkStatusTime = msec;
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
	
	getProcessReporter() {
		return this.reporter;
	}
	
	setProcessReporter(processReporter) {
		this.reporter = processReporter;
	}
	
	setOnLoad(func) {
		this.onLoad = func;
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
	
	isLoadRequestComplete() {
		return this.loadRequestComplete;
	}
	
	setLoadRequestComplete() {
		this.loadRequestComplete = true;
	}
	
	sendLoadRequest() {
		this.setLoadRequestComplete();
	}
	
	parseRawData(rawData) {
		return new AppResponse();
	}
	
	startLoad() {
		
		this.loadResp = new AppResponse();
		
		let thisDataSet = this;
		let checkStatusTime = this.getCheckStatusTime();
		
		function checkStatus() {
			if(thisDataSet.isLoadRequestComplete())
				thisDataSet.finishLoad();
			else
				setTimeout(checkStatus, checkStatusTime);
		}
		
		if(this.isAuthorized()) {
			setTimeout(checkStatus, checkStatusTime);
			this.sendLoadRequest();
		}	
		else {
			let appError = new AppError(ERR_AUTH_FAILURE);
			this.setAppError(appError);
		}
	}
	
	finishLoad() {
			
		this.setAppError(this.loadResp.getAppError());
				
		if(this.loadResp.getAppErrorCode() == ERR_OK) {
			let rawData = this.loadResp.getPayload();
			let parseResp = this.parseRawData(rawData);
			this.setAppError(parseResp.getAppError());
			if(parseResp.getAppErrorCode() == ERR_OK) {
				let content = parseResp.getPayload();
				this.setContent(content);
			}	
		}

		if(this.onLoad) this.onLoad(this.loadResp);
	}
	
}