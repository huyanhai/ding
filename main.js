import Vue from 'vue'
import store from './store'
import App from './App'
// import {wexinPay} from '@/common/wx_pay'
import Http from '@/common/request/'
import Json from './Json' //测试用数据
/**
 *  因工具函数属于公司资产, 所以直接在Vue实例挂载几个常用的函数
 *  所有测试用数据均存放于根目录json.js
 *  
 *  css部分使用了App.vue下的全局样式和iconfont图标，有需要图标库的可以留言。
 *  示例使用了uni.scss下的变量, 除变量外已尽量移除特有语法,可直接替换为其他预处理器使用
 */
const msg = (title, duration = 1500, mask = false, icon = 'none') => {
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
const json = type => {
	//模拟异步请求数据
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(Json[type]);
		}, 500)
	})
}

const prePage = () => {
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 2];
	// #ifdef H5
	return prePage;
	// #endif
	return prePage.$vm;
}

//获取登录态
const getCode = async () => {
	let url = await Http.getUrl();
	return url.data;
	return new Promise((resolve, reject) => {
		// uni.login({
		// 	success:function(result){
		// 		if(result.code)
		// 			resolve(result);
		// 		else
		// 			reject(result);
		// 	}
		// })
	});
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
						url: '/pages/public/authorizationLogin'
					})
				}
			}
		})
	});
}


//获取用户微信数据
const getuserInfo = () => {
	return new Promise((resolve, reject) => {
		uni.getuserInfo({
			success: function(result) {
				if (result.code) resolve(result);
				else reject(result);
			}
		})
	});
}

//默认登陆
const login = async () => {
	store.commit("setLoginStatus", 1);
	let option = {
		code: code
	};
	let loginResult = await Http.login(option);
	if (loginResult.code != 200) {
		store.commit("setLoginStatus", 2);
		return false;
	}
	store.commit("setFlag", loginResult.data.flag);
	store.commit("setHasLogin", true);
	// store.commit("setPhone", loginResult.data.phone);
	uni.setStorageSync('token', loginResult.data.token);
	uni.setStorageSync('tokenHead', loginResult.data.tokenHead);
	if (loginResult.data.flag == '0') {
		uni.navigateTo({
			url: '/pages/public/register?type=1'
		})
		return true;
	} else {
		let memberInfo = await getMemberInfo();
		
		if (!memberInfo) {
			store.commit("setLoginStatus", 2);
			return false;
		}

		console.log("login:默认登录成功!");
		store.commit("setShareMember", memberInfo.data.memberId);
		store.commit("setLoginStatus", 3);
		return memberInfo;
	}
}


//手机登陆
const phoneLogin = async (data) => {

	store.commit("setLoginStatus", 1);
	let loginResult = await Http.phoneLogin(data);
	if (loginResult.code != 200) {
		store.commit("setLoginStatus", 2);
		return false;
	}
	store.commit("setHasLogin", true);
	// store.commit("setFlag", loginResult.data.flag);
	// store.commit("setFlag", 1);
	// store.commit("setPhone", loginResult.data.phone);
	uni.setStorageSync('token', loginResult.data.token);
	uni.setStorageSync('tokenHead', loginResult.data.tokenHead);
	
	let memberInfo = await getMemberInfo();
	if (!memberInfo) {
		store.commit("setLoginStatus", 2);
		return false;
	}
	store.commit("setShareMember", memberInfo.data.memberId);
	store.commit("setLoginStatus", 3);
	return loginResult;
}

//获取用户微信数据
const getUserInfo = () => {
	return new Promise((resolve, reject) => {
		uni.getUserInfo({
			success: function(result) {
				resolve(result);
			},
			fail: function(result) {
				reject(result);
			}
		});
	});
}

//用户授权登录
const userLogin = async (option) => {
	if (!option) {
		msg("获取登录态失败！");
		return false;
	}
	
	// let option = {
	// 	code: code,
	// };
	
	// if (store.state.shareMemberId)
	// option.memberId = store.state.shareMemberId;
	store.commit("setLoginStatus", 1);
	let loginResult = await Http.login(option);
	if (loginResult.code != 200) {
		msg(loginResult.message);
		return false;
	}
	uni.setStorageSync('token', loginResult.data.token);
	uni.setStorageSync('tokenHead', loginResult.data.tokenHead);
	store.commit("setHasLogin", true);
	
	// let memberInfo = await getMemberInfo();
	// if (!memberInfo) {
	// 	// return false;
	// }else{
		
	// }
	store.commit("setLoginStatus", 3);
	return true;
}

//得到用户数据
const getMemberInfo = async () => {
	let membeResult = await Http.getMemberInfo();
	if (membeResult.code != 200) {
		msg(membeResult.message);
		return;
	}
	store.commit("login", membeResult.data);
	return membeResult;
}

//显示正在加载中加载信息
const showLoading = (title = "加载中...", mask = true) => {
	uni.showLoading({
		title: title,
		mask: mask
	})
}

const clearStorage = () => {
	store.commit("logout");
}
Vue.config.productionTip = false
Vue.prototype.$fire = new Vue();
Vue.prototype.$store = store;
Vue.prototype.$api = {
	msg,
	json,
	prePage,
	login,
	userLogin,
	getMemberInfo,
	showLoading,
	clearStorage,
	getCode,
	phoneLogin,
	getLoginCode
};
Vue.prototype.$http = Http;
Vue.prototype.$cateid = '';
App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
