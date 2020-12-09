import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: false,//是否登录
		memberInfo:null,//用户数据
		loginStatus:0,//登录请求状态(0:未调用登录1：登录请求中2：已请求完毕)
		shareMemberId:null,//分享人
		temp:'',//临时数据
		flag:"",
		phone:'',
		address:null
	},
	mutations: {
		setAddress(state,address){
			state.address=address;
		},
		setFlag(state,flag){
			state.flag=flag;
		},
		setHasLogin(state,status){
			state.hasLogin=status;
		},
		setPhone(state,phone){
			state.phone=phone;
		},
		setTemp(state,temp){
			state.temp=temp;
		},
		setLoginStatus(state,status){
			state.loginStatus=status;
		},
		setShareMember(state,memberId){
			state.shareMemberId=memberId;
		},
		//改变登录状态
		login(state,memberInfo) {
			memberInfo && (state.hasLogin =true,state.memberInfo=memberInfo);
		},
		//退出登录
		logout(state) {
			state.hasLogin = false;
			state.memberInfo=null;
			uni.clearStorageSync();
		}
	},
	actions: {
	
	}
})

export default store
