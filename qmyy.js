var rootURI = "https://api.m.jd.com/";
var secretp = "";
var myItemId = "";
var itemsList = [];
var shopitemsList = [];
var qryCompositeMaterialList= [];
var qryCompositeMaterialStatus=true;


function log(text) {
	console.log(text);
}
main();

async function main() {
	!(async () => {
		console.group('%c京东全民营业脚本', 'color:#009a61; font-size: 36px; font-weight: 400');
		console.group('%c作者信息', 'color:blue; font-size: 36px; font-weight: 250');
		console.log('%c本插件仅供学习交流使用\n作者:小赤佬ByQQ83802712 \n联系作者 tencent://message/?uin=83802712&Menu=yes', 'color:#009a61');
		console.log('%c作者博客:http://blog.tyh52.com', 'color:#009a61');
		console.log('%c学习交流群：333736660\n没事不用进群，里面全是傻逼(除了群主)\nhttps://jq.qq.com/?_wv=1027&k=Mes9sRIc', 'color:#009a61');
		console.log('%c购物优惠群：32412734\n这个可以进群，禁言群，支持一下\nhttps://jq.qq.com/?_wv=1027&k=yB4utzbU', 'color:#009a61');
		console.log('%c小赤佬の京东苏宁神价屋：53810353\n禁言群，发京东苏宁漏洞单\nhttps://jq.qq.com/?_wv=1027&k=TdNX4f50', 'color:#009a61');
		console.groupEnd();
		console.log("当前活动地址：https://wbbny.m.jd.com/babelDiy/Zeus/4SJUHwGdUQYgg94PFzjZZbGZRjDd/index.html#/home");
		console.group('%c任务日志', 'color:blue; font-size: 36px; font-weight: 250');
		await stall_getHomeData();
		if (secretp != "") {
			log("开始做任务");
			init();
			
			await stall_collectProduceScore();
			log("主线任务");
			await stall_getTaskDetail();
			let shopSign="";
			console.log("数量：" + itemsList.length);
			for (var i = 0; i < itemsList.length; i++) {
				let item = itemsList[i];
				let taskName = item.taskName;
				await wait(1000);
				if (item.taskId == 101) {
					await stall_getFeedDetailByAdd(item);
				} else if (item.taskId == 100) {
					await stall_getFeedDetailByView(item);
				} else {
					await stall_collectScore(taskName, item.taskId, item.itemId, shopSign);
				}
			}
			log("开始店铺任务");
			await stall_myShop();
			
			for (var i = 0; i < shopitemsList.length; i++) {
				let item = shopitemsList[i];
				await stall_getTaskDetail(item.shopId);
				await wait(1000);
				shopSign=item.shopId;
				console.log(item.shopId + "数量：" + itemsList.length);
				for (var j = 0; j < itemsList.length; j++) {
					let item = itemsList[j];
					let taskName = item.taskName;
					await wait(1000);
					if (item.taskId == 101) {
						await stall_getFeedDetailByAdd(item);
					} else if (item.taskId == 100) {
						await stall_getFeedDetailByView(item);
					} else {
						await stall_collectScore(taskName, item.taskId, item.itemId, shopSign);
					}
				}
			}
			log("开始品牌任务");
			await qryCompositeMaterials();
			
			for (var i = 0; i < qryCompositeMaterialList.length; i++) {
				if(qryCompositeMaterialStatus){
					let item = qryCompositeMaterialList[i];
					await stall_shopSignInRead(item.name, item.link);
					await wait(1000);
				}
			}
			log("开始夺红包");
			await douhb();
			log("轮询主线任务，直到做完");
			let falg=true;
			while(falg){
				await stall_getTaskDetail();
				let shopSign="";
				console.log("数量：" + itemsList.length);
				if(itemsList.length==0){
					console.log("主线任务全部完成，除加入品牌会员任务");
					falg=false;
					break;
				}
				for (var i = 0; i < itemsList.length; i++) {
					let item = itemsList[i];
					let taskName = item.taskName;
					await wait(1000);
					if (item.taskId == 101) {
						await stall_getFeedDetailByAdd(item);
					} else if (item.taskId == 100) {
						await stall_getFeedDetailByView(item);
					} else {
						await stall_collectScore(taskName, item.taskId, item.itemId, shopSign);
					}
				}
			}
		} else {
			log("初始化失败");
		}

	})()
	.catch((e) => {
			console.log('发生异常', e)
		})
		.finally(() => {
			console.log("结束");
		})
}

function wait(t) {
	return new Promise(e => setTimeout(e, t))
}
async function init() {
	await stall_pk_assistGroup();
	await help();
	await ccf();
	await qhb();
}

//stall_getTaskDetail();
//qryCompositeMaterials();
//stall_collectProduceScore();
//stall_myShop();

async function stall_getHomeData() {
	return new Promise(resolve => {
		let bodys = {}
		fetch(rootURI + "client.action?functionId=stall_getHomeData", {
			method: "post",
			mode: "cors",
			credentials: "include",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: "functionId=stall_getHomeData&client=wh5&clientVersion=1.0.0&body=" + JSON.stringify(bodys)
		}).then(function(response) {
			return response.json();
		}).then((res) => {
			try {
				let data = res.data;
				if (data) {
					let result = data.result;
					if (result) {
						let homeMainInfo = result.homeMainInfo;
						if (homeMainInfo) {
							if (homeMainInfo.secretp) {
								secretp = homeMainInfo.secretp;
							} else {
								log("初始化失败");
							}
						} else {
							log("初始化失败");
						}
					} else {
						log("初始化失败");
					}
				} else {
					log("初始化失败");
				}
			} catch (e) {
				console.error(e);
			} finally {
				resolve();
			}
		});
	})
}


function stall_myShop() {
	return new Promise(resolve => {
		let bodys = {}
		fetch(rootURI + "client.action?functionId=stall_myShop", {
			method: "post",
			mode: "cors",
			credentials: "include",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: "functionId=stall_myShop&client=wh5&clientVersion=1.0.0&body=" + JSON.stringify(bodys)
		}).then(function(response) {
			return response.json();
		}).then((res) => {
			try {
				let data = res.data;
				if (data) {
					let result = data.result;
					let items = [];
					if (result) {
						let list = result.shopList;
						let items = [];
						if (list) {
							for (var j = 0; j < list.length; j++) {
								let sitem = list[j];
								if (sitem) {
									items.push(sitem);
								}
							}
						}
						shopitemsList = items;
					}
				}
			} catch (e) {
				console.error(e);
			} finally {
				resolve();
			}
		});
	})
}

function qryCompositeMaterials() {
	return new Promise(resolve => {
		let bodys = {
			"qryParam": "[{\"type\":\"advertGroup\",\"mapTo\":\"homeFeedBanner\",\"id\":\"04891279\"},{\"type\":\"advertGroup\",\"mapTo\":\"homeBottomBanner\",\"id\":\"04888981\"}]",
			"activityId": "4SJUHwGdUQYgg94PFzjZZbGZRjDd",
			"pageId": "",
			"reqSrc": "",
			"applyKey": "raiders_venue_lite"
		}
		fetch(rootURI + "client.action?functionId=qryCompositeMaterials", {
			method: "post",
			mode: "cors",
			credentials: "include",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: "functionId=qryCompositeMaterials&client=wh5&clientVersion=1.0.0&body=" + JSON.stringify(bodys)
		}).then(function(response) {
			return response.json();
		}).then((res) => {
			try {
				let data = res.data;
				if (data) {
					let homeBottomBanner = data.homeBottomBanner;
					let items = [];
					if (homeBottomBanner) {
						let list = homeBottomBanner.list;
						let items = [];
						if (list) {
							for (var j = 0; j < list.length; j++) {
								let sitem = list[j];
								if (sitem) {
									items.push(sitem);
								}
							}
						}
						qryCompositeMaterialList=items;
					}
				}
			} catch (e) {
				console.error(e);
			} finally {
				resolve();
			}
		});
	})
}

function stall_getTaskDetail(shopSign) {
	return new Promise(resolve => {
		let bodys = {
			"shopSign": shopSign == undefined ? "" : shopSign
		}
		fetch(rootURI + "client.action?functionId=stall_getTaskDetail", {
			method: "post",
			mode: "cors",
			credentials: "include",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: "functionId=stall_getTaskDetail&client=wh5&clientVersion=1.0.0&body=" + JSON.stringify(bodys)
		}).then(function(response) {
			return response.json();
		}).then((res) => {
			try {
				let data = res.data;
				if (data) {
					if (data.success) {
						let result = data.result;
						if (result) {
							let taskVos = result.taskVos;
							let items = [];
							for (var i = 0; i < taskVos.length; i++) {
								let item = taskVos[i];
								if (item.status == 1) {
									if (item.taskType == 9) {
										let shoppingActivityVos = item.shoppingActivityVos;
										if (shoppingActivityVos) {
											for (var j = 0; j < shoppingActivityVos.length; j++) {
												let sitem = shoppingActivityVos[j];
												if (sitem) {
													if (sitem.status == 1) {
														sitem['taskId'] = item.taskId;
														sitem['taskName'] = item.taskName;
														items.push(sitem);
													}
												}
											}
										}
									} else if (item.taskType == 7) {
										let browseShopVo = item.browseShopVo;
										if (browseShopVo) {
											for (var j = 0; j < browseShopVo.length; j++) {
												let sitem = browseShopVo[j];
												if (sitem) {
													if (sitem.status == 1) {
														sitem['taskId'] = item.taskId;
														sitem['taskName'] = item.taskName;
														items.push(sitem);
													}
												}
											}
										}
									} else if (item.taskType == 2) {
										let productInfoVos = item.productInfoVos;
										if (productInfoVos) {
											for (var j = 0; j < productInfoVos.length; j++) {
												let sitem = productInfoVos[j];
												if (sitem) {
													if (sitem.status == 1) {
														sitem['taskId'] = item.taskId;
														sitem['taskName'] = item.taskName;
														items.push(sitem);
													}
												}
											}
										}
									} else if (item.taskType == 3) {
										let shoppingActivityVos = item.shoppingActivityVos;
										if (shoppingActivityVos) {
											for (var j = 0; j < shoppingActivityVos.length && j < item.maxTimes; j++) {
												let sitem = shoppingActivityVos[j];
												if (sitem) {
													if (sitem.status == 1) {
														sitem['taskId'] = item.taskId;
														sitem['taskName'] = item.taskName;
														items.push(sitem);
													}
												}
											}
										}
									} else if (item.taskType == 1) {
										let followShopVo = item.followShopVo;
										if (followShopVo) {
											for (var j = 0; j < followShopVo.length && j < item.maxTimes; j++) {
												let sitem = followShopVo[j];
												if (sitem) {
													if (sitem.status == 1) {
														sitem['taskId'] = item.taskId;
														sitem['taskName'] = item.taskName;
														items.push(sitem);
													}
												}
											}
										}
									} else if (item.taskType == 12) {
										let simpleRecordInfoVo = item.simpleRecordInfoVo;
										if (simpleRecordInfoVo) {
											if (item.times < item.maxTimes) {
												for (var j = item.times; j < item.maxTimes; j++) {
													let sitem = simpleRecordInfoVo;
													if (sitem) {
														sitem['taskId'] = item.taskId;
														sitem['taskName'] = item.taskName;
														items.push(sitem);
													}
												}
											}
										}
									}
								}
							}
							itemsList = items;
						}
					}
				}
			} catch (e) {
				console.error(e);
			} finally {
				resolve();
			}
		});
	})

}


function stall_getFeedDetailByAdd(data) {
	return new Promise(resolve => {
		var postData = {
			"taskId": data['taskId']
		};
		fetch("https://api.m.jd.com/client.action", {
			method: "POST",
			mode: "cors",
			credentials: "include",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: `functionId=stall_getFeedDetail&body=` + JSON.stringify(postData) + `&client=wh5&clientVersion=1.0.0`
		}).then(function(response) {
			return response.json();
		}).then((res) => {
			try {
				let addProductVos = res.data.result.addProductVos;
				let count = 0;
				for (var i = 0; i < addProductVos.length; i++) {
					let item = addProductVos[i];
					if (item.status == 1) {
						let productInfoVos = item.productInfoVos;
						for (let j = item.times; j < item.maxTimes && j < productInfoVos.length; j++) {
							let productInfoVo = productInfoVos[j],
								taskId = item['taskId'];
							setTimeout(function() {
								stall_collectScore("加购商品", taskId, productInfoVo['itemId'], "");
							}, 1000 * 1 * count);
							count++;
						}
					}
				}
			} catch (e) {
				console.error(e);
			} finally {
				resolve();
			}
		});
	})
}

function stall_getFeedDetailByView(data) {
	return new Promise(resolve => {
		var postData = {
			"taskId": data['taskId']
		};
		fetch("https://api.m.jd.com/client.action", {
			method: "POST",
			mode: "cors",
			credentials: "include",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: `functionId=stall_getFeedDetail&body=` + JSON.stringify(postData) + `&client=wh5&clientVersion=1.0.0`
		}).then(function(response) {
			return response.json();
		}).then((res) => {
			try {
				let viewProductVos = res.data.result.viewProductVos;
				let count = 0;
				for (var i = 0; i < viewProductVos.length; i++) {
					let item = viewProductVos[i];
					if (item.status == 1) {
						let productInfoVos = item.productInfoVos;
						for (let j = item.times; j < item.maxTimes && j < productInfoVos.length; j++) {
							let productInfoVo = productInfoVos[j],
								taskId = item['taskId'];
							setTimeout(function() {
								stall_collectScore("浏览甄选商品", taskId, productInfoVo['itemId'], "");
							}, 1000 * 1 * count);
							count++;
						}
					}
				}
			} catch (e) {
				console.error(e);
			} finally {
				resolve();
			}
		});
	})
}

function stall_collectScore(taskName, taskId, itemId, shopSign) {
	return new Promise(resolve => {
		let bodys = {
			"taskId": taskId,
			"itemId": itemId,
			"ss": JSON.stringify({
				"secretp": secretp
			}),
			"actionType": "1",
			"shopSign": shopSign == undefined ? '' : shopSign
		}
		fetch(rootURI + "client.action?functionId=stall_collectScore", {
			method: "post",
			mode: "cors",
			credentials: "include",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: "functionId=stall_collectScore&client=wh5&clientVersion=1.0.0&body=" + JSON.stringify(bodys)
		}).then(function(response) {
			return response.json();
		}).then((res) => {
			try {
				let data = res.data;
				if (data) {
					if (data.success) {
						if (data.result) {
							if (data.result.taskToken) {
								log("shopSign:" + (shopSign == undefined ? '无' : shopSign) + "," + taskName + "：浏览中，10秒后领取奖励");
								setTimeout(function() {
									lingqujiangli(taskName, data.result.taskToken);
								}, 1000 * 10);
							} else {
								log("shopSign:" + (shopSign == undefined ? '无' : shopSign) + "," + taskName + "：" + JSON.stringify(data.result));
							}
						}
					}
				}
			} catch (e) {
				console.error(e);
			} finally {
				resolve();
			}
		});
	})
}

function lingqujiangli(name, token) {
	return new Promise(resolve => {
		let body = {
			dataSource: "newshortAward",
			method: "getTaskAward",
			reqParams: JSON.stringify({
				taskToken: token
			}),
			sdkVersion: "1.0.0",
			clientLanguage: "zh"

		}
		fetch(rootURI + "?client=wh5&clientVersion=1.0.0&functionId=qryViewkitCallbackResult&body=" + JSON.stringify(body) +
			"&_timestamp=" + new Date().getTime(), {
				method: "get",
				mode: "cors",
				credentials: "include",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}
			}).then(function(response) {
			return response.json();
		}).then((res) => {

			try {
				if (res.code == "0") {
					var data = res.toast;
					if (data) {
						log(name + ":" + data.subTitle);
					}
				} else {
					log("初始化任务失败");
				}
			} catch (e) {
				console.error(e);
			} finally {
				resolve();
			}
		});

	})
}

function stall_shopSignInRead(taskName, shopId) {
	return new Promise(resolve => {
		let bodys = {
			"shopSign": shopId
		}
		fetch(rootURI + "client.action?functionId=stall_shopSignInRead", {
			method: "post",
			mode: "cors",
			credentials: "include",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: "functionId=stall_shopSignInRead&client=wh5&clientVersion=1.0.0&body=" + JSON.stringify(bodys)
		}).then(function(response) {
			return response.json();
		}).then((res) => {
			try {
				let data = res.data;
				if (data) {
					if (data.success) {
						if (data.result) {
							if (data.result.signInTag != 1) {
								if (secretp == "") {
									secretp = data.result.secretp;
								}
								setTimeout(function() {
									stall_shopSignInWrite(taskName, shopId);
								}, 1000);
							}
						}
					}
				}
			} catch (e) {
				console.error(e);
			} finally {
				resolve();
			}
		});
	})
}

function stall_shopSignInWrite(taskName, shopId) {
	return new Promise(resolve => {
		let bodys = {
			"ss": JSON.stringify({
				"secretp": secretp
			}),
			"shopSign": shopId
		}
		fetch(rootURI + "client.action?functionId=stall_shopSignInWrite", {
			method: "post",
			mode: "cors",
			credentials: "include",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: "functionId=stall_shopSignInWrite&client=wh5&clientVersion=1.0.0&body=" + JSON.stringify(bodys)
		}).then(function(response) {
			return response.json();
		}).then((res) => {
			try {
				let data = res.data;
				if (data) {
					log(taskName + ":" + JSON.stringify(data));
					if(data.success==false){
						if(data.bizCode==-2){
							qryCompositeMaterialStatus=false;
						}
					}
				}
			} catch (e) {
				console.error(e);
			} finally {
				resolve();
			}

		});

	})

}

function stall_collectProduceScore(taskName, shopId) {
	return new Promise(resolve => {
		let bodys = {
			"ss": JSON.stringify({
				"secretp": secretp
			}),
		}
		fetch(rootURI + "client.action?functionId=stall_collectProduceScore", {
			method: "post",
			mode: "cors",
			credentials: "include",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: "functionId=stall_collectProduceScore&client=wh5&clientVersion=1.0.0&body=" + JSON.stringify(bodys)
		}).then(function(response) {
			return response.json();
		}).then((res) => {
			try {
				let data = res.data;
				if (data) {
					log("收取金币" + ":" + JSON.stringify(data));
				}
			} catch (e) {
				console.error(e);
			} finally {
				resolve();
			}

		});

	})

}

function request(functionId, body = {}) {
	return fetch(`https://api.m.jd.com/client.action?functionId=${functionId}`, {
		body: `functionId=${functionId}&body=${JSON.stringify(body)}&client=wh5&clientVersion=1.0.0`,
		headers: {
			"content-type": "application/x-www-form-urlencoded",
		},
		method: "POST",
		credentials: "include",
	});
}

