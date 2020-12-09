new JdAppleLive().main();
/*

苹果抽奖机
脚本会给内置的码进行助力
活动于2020-12-14日结束
活动地址：https://h5.m.jd.com/babelDiy/Zeus/2zwQnu4WHRNfqMSdv69UPgpZMnE2/index.html/

*/
// export function getJdAppleLive(exportCk) {
// 	return new JdAppleLive(exportCk);
// }

// export default getJdAppleLive;

function JdAppleLive(exportCk) {
	this.rootUrl = "https://api.m.jd.com/";
	this.isLogDetail = false;
	this.curPageObj = null;
	this.log = function(...text) {
		console.log(...text);
		if (this.curPageObj != null && this.curPageObj != undefined) {
			if (this.curPageObj['msgList']) {
				this.curPageObj['msgList'] = this.curPageObj['msgList'].concat(text)
			}
		}
	}
	this.get = function(options, callback) {
		try {
			let resp = null;
			if (fetch) {
				fetch(options['url'], {
					method: "GET",
					credentials: options['credentials'] == undefined ? "include" : options['credentials'],
					mode: "cors",
					headers: options['headers']
				}).then(function(response) {
					resp = response;
					return response.json();
				}).then((res) => {
					callback(null, resp, JSON.stringify(res));
				}).catch((e) => {
					this.log(e);
				});
			} else if (uni != undefined) {
				uni.$u.get(options['url'], options['body'], options['headers']).then(res => {
					callback(null, resp, JSON.stringify(res));
				}).catch((e) => {
					this.log(e);
				});
			}
		} catch (e) {
			this.log(e);
		}
	}
	this.post = function(options, callback) {
		let resp = null;
		if (fetch) {
			fetch(options['url'], {
				method: "post",
				mode: "cors",
				credentials: "include",
				headers: options['headers'],
				body: options['body']
			}).then(function(response) {
				resp = response;
				return response.json();
			}).then((res) => {
				callback(null, resp, JSON.stringify(res));
			}).catch((e) => {
				this.log(e);
			});
		} else if (uni != undefined) {
			uni.$u.post(options['url'], options['body'], options['headers']).then(res => {
				callback(null, resp, JSON.stringify(res));
			}).catch((e) => {
				this.log(e);
			});;
		}
	}
	this.cookie = exportCk == undefined ? '' : exportCk;
	this.outTime = 0;
	this.wait = function(t) {
		return new Promise(e => setTimeout(e, t));
	}
	this.main = async function() {
    console.group('%c京东joy脚本1.1', 'color:#009a61; font-size: 36px; font-weight: 400');
		console.log('新版加了签名验证，已更新', 'color:#009a61');
		console.group('%c作者信息', 'color:blue; font-size: 36px; font-weight: 250');
		console.log('%c本插件仅供学习交流使用\n作者:小赤佬ByQQ83802712 \n联系作者 tencent://message/?uin=83802712&Menu=yes', 'color:#009a61');
		console.log('%c作者博客:http://blog.tyh52.com', 'color:#009a61');
		console.log('%c学习交流群：333736660\n没事不用进群，里面全是傻逼(除了群主)\nhttps://jq.qq.com/?_wv=1027&k=Mes9sRIc', 'color:#009a61');
		console.log('%c购物优惠群：32412734\n这个可以进群，禁言群，支持一下\nhttps://jq.qq.com/?_wv=1027&k=yB4utzbU', 'color:#009a61');
		console.log('%c小赤佬の京东苏宁神价屋：53810353\n禁言群，发京东苏宁漏洞单\nhttps://jq.qq.com/?_wv=1027&k=TdNX4f50', 'color:#009a61');
		console.groupEnd();
		console.log(
			"当前活动地址：https://h5.m.jd.com/babelDiy/Zeus/2zwQnu4WHRNfqMSdv69UPgpZMnE2/index.html/"
		);
		console.group('%c任务日志', 'color:blue; font-size: 36px; font-weight: 250');
		cookie = that.cookie;
		$.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
		$.index = 1;
		$.isLogin = true;
		$.nickName = '';
		message = '';
		if(!fetch){
			await TotalBean();
			that.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
			if (!$.isLogin) {
				$.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/`, {
					"open-url": "https://bean.m.jd.com/"
				});
			}
		}
		await jdHealth()
	}

	var that = this;
	var $ = {
		name: '苹果抽奖机',
		logErr: (...text) => {
			this.log(...text)
		},
		log: (...text) => {
			this.log(...text)
		},
		wait: (t) => {
			return new Promise(e => setTimeout(e, t));
		},
		post: function(o, f) {
			that.post(o, f)
		},
		get: function(o, f) {
			that.get(o, f)
		},
		msg: (...text) => {
			this.log(...text)
		},
	}

	let cookiesArr = [],
		cookie = '',
		message; 
	const JD_API_HOST = 'https://api.m.jd.com/client.action';
	const inviteCodes = ['P04z54XCjVUm4aW5jcMc7RwW6vACisvnW0','P04z54XCjVUm4aW5m9cZ2au231Ck-5r2T5nqbI','P04z54XCjVUm4aW5m9cZ2TwjnlJw0zPgEbABso'];
	$.newShareCodes=inviteCodes;
	async function jdHealth() {
		await helpFriends();
		await jdapple_getTaskDetail();
		await doTask();
		await jdapple_getTaskDetail(0);
		if ($.userInfo.scorePerLottery <= $.userInfo.userScore) {
			that.log(`当前用户金币: ${$.userInfo.userScore}，抽奖需要${$.userInfo.scorePerLottery}，开始抽奖`)
			message += `当前用户金币: ${$.userInfo.userScore}，抽奖需要${$.userInfo.scorePerLottery}，开始抽奖\n`
			for (let i = 0; i < parseInt($.userInfo.userScore) / $.userInfo.scorePerLottery; ++i) {
				await jdapple_getLottery()
			}
		} else {
			that.log(`当前用户金币: ${$.userInfo.userScore}，抽奖需要${$.userInfo.scorePerLottery}，金币不足无法抽奖`)
			message += `当前用户金币: ${$.userInfo.userScore}，抽奖需要${$.userInfo.scorePerLottery}，金币不足无法抽奖\n`
		}
		await showMsg();
	}

	function showMsg() {
		return new Promise(resolve => {
			$.log(`京东账号${$.index}${$.nickName}\n${message}`);
			if (new Date().getHours() === 23) {
				$.msg($.name, '', `京东账号${$.index}${$.nickName}\n${message}`);
			}
			resolve()
		})
	}
	async function helpFriends() {
		for (let code of $.newShareCodes) {
			if (code) {
				const helpRes = await jdapple_collectScore(code, 6, null);
				if (helpRes.code === 0 && helpRes.data.bizCode === -7) {
					that.log(`助力机会已耗尽，跳出`);
					break
				}
			}
		}
	}
	async function doTask() {
		for (let item of $.taskVos) {
			if (item.taskType === 9 || item.taskType === 26) {
				//逛会场任务
				if (item.status === 1) {
					that.log(`准备做此任务：${item.taskName}`)
					for (let task of item.shoppingActivityVos) {
						if (task.status === 1) {
							await jdapple_collectScore(task.taskToken, item.taskId, task.itemId, 1);
							await $.wait(6500)
							await jdapple_collectScore(task.taskToken, item.taskId, task.itemId, 0);
						}
					}
				} else if (item.status !== 4) {
					that.log(`${item.taskName}已做完`)
				}
			}
			if (item.taskType === 8) {
				// 浏览商品任务
				if (item.status === 1) {
					that.log(`准备做此任务：${item.taskName}`)
					for (let task of item.productInfoVos) {
						if (task.status === 1) {
							await jdapple_collectScore(task.taskToken, item.taskId, task.itemId, 1);
							await $.wait(15000)
							await jdapple_collectScore(task.taskToken, item.taskId, task.itemId, 0);
						}
					}
				} else if (item.status !== 4) {
					that.log(`${item.taskName}已做完`)
				}
			}

			if (item.taskType === 1) {
				// 关注任务
				if (item.status === 1) {
					that.log(`准备做此任务：${item.taskName}`)
					for (let task of item.followShopVo) {
						if (task.status === 1) {
							that.log(`去关注 ${task.shopName}`)
							await jdapple_collectScore(task.taskToken, item.taskId, task.itemId, 1);
							await $.wait(1000)
							await jdapple_collectScore(task.taskToken, item.taskId, task.itemId, 0);
						}
					}
				} else if (item.status !== 4) {
					that.log(`${item.taskName}已做完`)
				}
			}

		}
	}

	//领取做完任务的奖励
	function jdapple_collectScore(taskToken, taskId, itemId, actionType = 0) {
		return new Promise(resolve => {
			let body = {
				"appId": "1EFRTxw",
				"taskToken": taskToken,
				"taskId": taskId,
				"itemId": itemId,
				"actionType": actionType
			}
			$.post(taskPostUrl("harmony_collectScore", body), async (err, resp, data) => {
				try {
					if (err) {
						that.log(`${JSON.stringify(err)}`)
						that.log(`${$.name} API请求失败，请检查网路重试`)
					} else {
						if (safeGet(data)) {
							data = JSON.parse(data);
							if (data.data.bizCode === 1) {
								that.log(`任务领取成功`);
								message += `任务领取成功\n`
							} else if (data.data.bizCode === 0) {
								if (data.data.result.taskType === 6) {
									//that.log(`助力好友：${data.data.result.itemId}成功！`)
									message += `助力好友：${data.data.result.itemId}成功！\n`
								} else {
									that.log(`任务完成成功`);
								}

							} else {
								//that.log(`${data.data.bizMsg}`)
							}
						}
					}
				} catch (e) {
					$.logErr(e, resp)
				} finally {
					resolve(data);
				}
			})
		})
	}

	// 抽奖
	function jdapple_getLottery() {
		return new Promise(resolve => {
			let body = {
				"appId": "1EFRTxw"
			}
			$.post(taskPostUrl("interact_template_getLotteryResult", body), async (err, resp, data) => {
				try {
					if (err) {
						that.log(`${JSON.stringify(err)}`)
						that.log(`${$.name} API请求失败，请检查网路重试`)
					} else {
						if (safeGet(data)) {
							data = JSON.parse(data);
							if (data.data.bizCode === 0) {
								that.log(`抽奖成功，获得：${JSON.stringify(data.data.result.userAwardsCacheDto)}`);
								message += `抽奖成功，获得：${JSON.stringify(data.data.result.userAwardsCacheDto)}\n`
							} else {
								that.log(JSON.stringify(data))
							}
						}
					}
				} catch (e) {
					$.logErr(e, resp)
				} finally {
					resolve(data);
				}
			})
		})
	}

	function jdapple_getTaskDetail(get = 1) {
		return new Promise(resolve => {
			$.post(taskPostUrl("healthyDay_getHomeData", {
				"appId": "1EFRTxw",
				"taskToken": ""
			}, ), async (err, resp, data) => {
				try {
					if (err) {
						that.log(`${JSON.stringify(err)}`)
						that.log(`${$.name} API请求失败，请检查网路重试`)
					} else {
						if (safeGet(data)) {
							data = JSON.parse(data);
							if (data.data.bizCode === 0) {
								$.taskVos = data.data.result.taskVos; //任务列表
								$.userInfo = data.data.result.userInfo;
								if (get)
									$.taskVos.map(item => {
										if (item.taskType === 14) {
											that.log(`\n您的${$.name}好友助力邀请码：${item.assistTaskDetailVo.taskToken}\n`)
											message += `\n您的${$.name}好友助力邀请码：${item.assistTaskDetailVo.taskToken}\n`
										}
									})
							}
						}
					}
				} catch (e) {
					$.logErr(e, resp)
				} finally {
					resolve();
				}
			})
		})
	}

	function readShareCode() {
		that.log(`开始`)
		return new Promise(async resolve => {
			$.get({
				url: `http://api.turinglabs.net/api/v1/jd/jdapple/read/${randomCount}/`
			}, (err, resp, data) => {
				try {
					if (err) {
						that.log(`${JSON.stringify(err)}`)
						that.log(`${$.name} API请求失败，请检查网路重试`)
					} else {
						if (data) {
							that.log(`随机取${randomCount}个码放到您固定的互助码后面`)
							data = JSON.parse(data);
						}
					}
				} catch (e) {
					$.logErr(e, resp)
				} finally {
					resolve(data);
				}
			})
			// await $.wait(2000);
			// resolve()
		})
	}

	function taskPostUrl(function_id, body = {}, function_id2) {
		let url = `${JD_API_HOST}`;
		if (function_id2) {
			url += `?functionId=${function_id2}`;
		}
		return {
			url,
			body: `functionId=${function_id}&body=${escape(JSON.stringify(body))}&client=wh5&clientVersion=9.1.0`,
			headers: {
				"Cookie": cookie,
				"origin": "https://h5.m.jd.com",
				"referer": "https://h5.m.jd.com/",
				'Content-Type': 'application/x-www-form-urlencoded',
				"User-Agent": "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0",
			}
		}
	}

	function TotalBean() {
		return new Promise(async resolve => {
			const options = {
				"url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
				"headers": {
					"Accept": "application/json,text/plain, */*",
					"Content-Type": "application/x-www-form-urlencoded",
					"Accept-Language": "zh-cn",
					"Connection": "keep-alive",
					"Cookie": cookie,
					"Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
					"User-Agent":"jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"
				}
			}
			$.post(options, (err, resp, data) => {
				try {
					if (err) {
						that.log(`${JSON.stringify(err)}`)
						that.log(`${$.name} API请求失败，请检查网路重试`)
					} else {
						if (data) {
							data = JSON.parse(data);
							if (data['retcode'] === 13) {
								$.isLogin = false; //cookie过期
								return
							}
							$.nickName = data['base'].nickname;
						} else {
							that.log(`京东服务器返回空数据`)
						}
					}
				} catch (e) {
					$.logErr(e, resp)
				} finally {
					resolve();
				}
			})
		})
	}

	function safeGet(data) {
		try {
			if (typeof JSON.parse(data) == "object") {
				return true;
			}
		} catch (e) {
			that.log(e);
			that.log(`京东服务器访问数据为空，请检查自身设备网络情况`);
			return false;
		}
	}
}
