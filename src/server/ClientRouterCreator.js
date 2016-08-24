"use strict";

import fs from "fs";
import path from "path";
import FileUtil from "../utils/FileUtil.js";
import Utils from "../utils/Utils.js";
import ReactRouterUtil from "../utils/ReactRouterUtil.js";
import Lobenton, {BaseComponent} from 'lobenton';

function writeFile(path, content) {
	fs.writeFile(path, content, function(err) {
		if(err) {
			return console.log(err);
		}

		console.log("The react router file was created at "+path+"!");
	});
}

class ClientRouterCreator extends BaseComponent {
	constructor () {
		super();
		this.callback = null;
		this.allUrl = {};
		this.registedUrl = [];
		this.urlManager = null;
		this.controllerMap = {};
	}
	
	setUrlManager(urlManager) {
		this.urlManager = urlManager;
	}
	
	initial(build) {
		const controllerList =  FileUtil.getFileList(path.join(this.config.basePath, "/src/server/controllers/"));

		controllerList.map(function loop(fileName) {
			const filePath = path.join(this.config.basePath, "/src/server/controllers/"+fileName);		
			this.addControllerToMap(filePath, build);
		}.bind(this));
		
		if(build === true){
			this.buildRouter();
		}
	}
	
	renew(filePath) {
		const re = new RegExp(this.config.basePath+"/src", "gi");
		const reController = new RegExp(this.config.basePath+"/src/server/controllers", "gi");
		
		if(re.test(filePath)){
			if(reController.test(filePath)){
				this.addControllerToMap(filePath);	
			}
					
			this.buildRouter();
		}
	}
	
	after(callback) {
		this.callback = callback;
	}
	
	addControllerToMap(filePath, build) {
		const fileSource = FileUtil.getFile(filePath);
		
		if(build === true && FileUtil.isControllerHasLayoutAndView(fileSource)){
			if(FileUtil.isSourceHasLoginTrue(fileSource)){
				try{
					Lobenton.getComponent("loginFilter");
				}catch(e){
					throw e;	
				}
			}
			
			const urlPattern = FileUtil.getUrlPatternFromController(fileSource);

			this.controllerMap[filePath] = {
				source: fileSource,
				urlPattern : urlPattern
			}
		}
	}
		
	buildRouter() {
		let self = this;
		let router = {};
		
		Object.keys(self.controllerMap).map(function loopFile(filePath) {
			const urlPattern = self.controllerMap[filePath].urlPattern;
			
			Object.keys(urlPattern).map(function loopPattern(url) {
				const pattern = urlPattern[url];
				const result = self.findMatchRoute(router, url, pattern);
				
				router = Object.assign(router, result);
			});
		});
		
		const noHandleUrl = Object.keys(this.allUrl).filter(function loop(url){
			return this.registedUrl.indexOf(url) === -1 && !this.allUrl[url].hasOwnProperty("ajax");
		}.bind(this)).reduce(function loopNoHandle(newObj, url, index){
				newObj.push(url + " => " + Utils.capitalizeFirstLetter(this.allUrl[url].controller) + "Controller");
				return newObj;
			}.bind(this), []);
		
		if(noHandleUrl.length > 0){
			throw new Error("Following those routes you set in '"+Lobenton.configPath+ "' are no handler:\r\n\t"+noHandleUrl.join("\r\n\t")+"\r\n\r\n");
		}
		
		const str = ReactRouterUtil.createRouter(router);
		const filepath = path.resolve(__dirname, "../../createRouter.js");
		writeFile(filepath, str);
		
		if(this.callback){
			this.callback();
		}
	}
	
	findMatchRoute(router, url, pattern) {
		let hasRoot = false;
		
		if(this.urlManager.rulesRegex["\\/"]){
			hasRoot = true;
			
			if(!router.hasOwnProperty("/")){
				router["/"] = {};
			}	
		}
		
		Object.keys(this.urlManager.rulesRegex).map(function loopRule(rule) {
			const ruleValue = this.urlManager.rulesRegex[rule];
			const ruleTarget = ruleValue["controller"]+"/"+ruleValue["action"];
			
			if(!this.allUrl.hasOwnProperty(ruleTarget)){
				this.allUrl[ruleTarget] = ruleValue;
			}
			
			if(ruleTarget === url){
				if(this.registedUrl.indexOf(ruleTarget) === -1){
					this.registedUrl.push(ruleTarget);
				}
				
				let cpRuleValue = Object.assign({},ruleValue);
				
				delete cpRuleValue.controller;
				delete cpRuleValue.action;
				
				const urlArray = Object.keys(cpRuleValue).reduce(function reduceCp(newObj, param, index) {
					const value = cpRuleValue[param];
					const fixParam = /^d(\d+)$/.test(param) ? param.replace(/^d/, "") : param;
					
					if(value === "("+fixParam+")"){
						newObj.push(fixParam);
					}else{
						newObj.push(":"+fixParam);
					}
					
					return newObj;
				}, []);
				
				if(urlArray.length === 1 && !/^\:/.test(urlArray[0])){
					urlArray.push(urlArray[0]);
				}
				
				let first = "";
				
				if(hasRoot === false){
					first = urlArray.shift();
					
					if(!router.hasOwnProperty("/"+first)){
						router["/"+first] = {};
					}
				}
					
				let newUrl = "/"+urlArray.join("/");
				
				if(newUrl === "//"){
					newUrl = "/";
				}
			
				router["/"+first][newUrl] = {
					view: pattern.view,
					viewName: FileUtil.getViewName(pattern.view),
					docParams: pattern.docParams
				}
			}
		}.bind(this));
		
		return router;
	}
}

export default ClientRouterCreator;