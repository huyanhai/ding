/**
 * 通用uni-app网络请求
 * 基于 Promise 对象实现更简单的 request 使用方式，支持请求和响应拦截
 */
/*
// 开放的接口
import http from './interface'

http.config.baseUrl = "http://localhost:8080/api/"

http.request(url:'user/list',method:'GET').then((res)=>{
	console.log(JSON.stringify(res))
})
http.get('user/list').then((res)=>{
	console.log(JSON.stringify(res))
})
http.get('user/list', {status: 1}).then((res)=>{
	console.log(JSON.stringify(res))
})
http.post('user', {id:1, status: 1}).then((res)=>{
	console.log(JSON.stringify(res))
})
http.put('user/1', {status: 2}).then((res)=>{
	console.log(JSON.stringify(res))
})
http.delete('user/1').then((res)=>{
	console.log(JSON.stringify(res))
})
*/

import store from '../../store'
export default {
	config: {
		baseUrl: "https://interface.dinglaobiao.com/api/",
		// baseUrl: "https://interface.dinglaobiao.com/api/",
		// baseUrl: "http://192.168.0.121:8091/api/",
		header: {
			'Content-Type': 'application/json;charset=UTF-8',
			"token": uni.getStorageSync('tokenHead') + uni.getStorageSync('token')
		},
		data: {},
		method: "GET",
		dataType: "json",
		/* 如设为json，会对返回的数据做一次 JSON.parse */
		responseType: "text",
		success() {},
		fail() {},
		complete() {}
	},
	interceptor: {
		request: null,
		response: null
	},
	request(options) {
		if (!options) {
			options = {}
		}
		options.baseUrl = options.baseUrl || this.config.baseUrl;
		options.dataType = options.dataType || this.config.dataType;
		options.url = options.baseUrl + options.url;
		options.data = options.data || {};
		options.method = options.method || this.config.method;
		options.header = options.header || this.config.header;
		//console.log('options',options);
		//console.log("options",options)
		return new Promise((resolve, reject) => {
			let _config = null
			// 接口调用结束的回调函数（调用成功、失败都会执行）
			options.complete = (response) => {
				response.config = _config

				//拦截器
				if (this.interceptor.response) {
					let newResponse = this.interceptor.response(response)
					if (newResponse) {
						response = newResponse
					}
				}
				//console.log('response',response);
				//_reslog(response)//打印响应日志
				if (response.statusCode === 200 || response.statusCode === 500) { //成功
					//返回的已经是JSON
					//resolve(JSON.parse(response.data));
					// console.log(response)
					if(response.data.code==401){
						// getLoginCode().then(res=>{
						// 	console.log(res)
						// 	userLogin(getUrl()+'/member/wechatLogin',res.code).then(res=>{})
						// })
						var pages = getCurrentPages();
						var curPage = pages[pages.length - 1]; // 当前页面路径
						uni.clearStorageSync();
						// if(curPage.route!='pages/public/authorizationLogin'){
							
						// 	uni.navigateTo({
						// 		url: '/pages/public/authorizationLogin'
						// 	})
						// }
						reject(response)
					}else{
						resolve(response.data);
					}
				}
				else{
					reject(response)
				}
			}
			// Object.assign详解:https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
			_config = Object.assign({}, this.config, options)
			_config.requestId = new Date().getTime()
			uni.request(_config); // 发起请求
		});
	},
	get(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'GET'
		options.header = {
			'Content-Type': 'application/json;charset=UTF-8',
			"token": uni.getStorageSync('tokenHead') + uni.getStorageSync('token')
		}
		return this.request(options)
	},
	post(url, data, options) {
		if (!options) {
			options = {}
		}
		options.header = {
			'Content-Type': 'application/json;charset=UTF-8',
			"token": uni.getStorageSync('tokenHead') + uni.getStorageSync('token')
		}
		options.url = url
		options.data = data
		options.method = 'POST'
		return this.request(options)
	},
	asPost(url, data, options) {
		if (!options) {
			options = {}
		}
		let params = Object.keys(data).map(function(key) {
			return encodeURIComponent(key) + "=" + encodeURIComponent(data[key]);
		}).join("&");
		options.header = {
			'Content-Type': 'application/json;charset=UTF-8',
			"token": uni.getStorageSync('tokenHead') + uni.getStorageSync('token')
		}
		options.url = url + '?' + params
		options.data = data
		options.method = 'POST'
		return this.request(options)
	},
	put(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'PUT'
		return this.request(options)
	},
	delete(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'DELETE'
		return this.request(options)
	},
	interceptor() {
		//设置请求结束后拦截器
		this.interceptor.response = (response,show = false) => {
			if (response.errMsg == "request:fail") {
				msg('服务器异常!');
				return false;
			}
			if (response.statusCode == 500) {
				msg('服务器异常!');
				return false;
			}
			if (response.statusCode == 404) {
				msg('网络请求找不到');
				return false;
			}
			if (response.data.code == 401) {
				if (show) {
					msg('请登录');
				}
			}
		}
	}


}

function msg(title, duration = 1500, mask = false, icon = 'none') {
	//统一提示方便全局修改
	if (Boolean(title) === false) {
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}


/**
 * 请求接口日志记录
 */
function _reqlog(req) {
	if (process.env.NODE_ENV === 'development') {
		console.log("【" + req.requestId + "】 地址：" + req.url)
		if (req.data) {
			console.log("【" + req.requestId + "】 请求参数：" + JSON.stringify(req.data))
		}
		// console.log('开发环境')
	} else {
		// console.log('生产环境')
	}
}

//获取用户code
const getLoginCode = () => {
	return new Promise((resolve, reject) => {
		uni.login({
			success(res) {
				if (res.code) {
					//发起网络请求
					resolve(res);
				} else {
					console.log('登录失败！' + res.errMsg)
					uni.navigateTo({
						url: '/pages/public/register'
					})
				}
			}
		})
	});
}


//用户授权登录
const userLogin = async (url,code) => {
	return new Promise((resolve, reject) => {
		let option = {
			code: code,
		};
		
		// if (store.state.shareMemberId)
		// option.memberId = store.state.shareMemberId;
		
		// store.commit("setLoginStatus", 1);
		uni.request({
		  url: url, //仅为示例，并非真实的接口地址
		  data: option,
		  header: {
		    'content-type': 'application/json' ,// 默认值
		  },
		  method :'POST',
		  success (res) {
			  if(res.code!==200){
				  uni.navigateTo({
				  	url:'/pages/public/authorizationLogin'
				  })
				  return
			  }
			// console.log(res)
			// store.commit("setHasLogin", true);
			uni.setStorageSync('token', res.data.token);
			uni.setStorageSync('tokenHead', res.data.tokenHead);
			resolve(res)
		  },
		  fail(res) {
		  	 console.log(res.data)
			 uni.navigateTo({
			 	url:'/pages/public/authorizationLogin'
			 })
		  }
		})
	});
}
/**
 * 响应接口日志记录
 */
function _reslog(res) {
	let _statusCode = res.statusCode;
	if (process.env.NODE_ENV === 'development') {
		console.log("【" + res.config.requestId + "】 地址：" + res.config.url)
		if (res.config.data) {
			console.log("【" + res.config.requestId + "】 请求参数：" + JSON.stringify(res.config.data))
		}
		console.log("【" + res.config.requestId + "】 响应结果：" + JSON.stringify(res.data))
		// console.log('开发环境')
	} else {
		// console.log('生产环境')
	}
	//TODO 除了接口服务错误外，其他日志调接口异步写入日志数据库
	switch (_statusCode) {
		case 200:
			break;
		case 401:
			break;
		case 404:
			break;
		default:
			break;
	}
}
