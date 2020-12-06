import http from './interface'

/**
 * 将业务所有接口统一起来便于维护
 * 如果项目很大可以将 url 独立成文件，接口分成不同的模块
 * 
 */

// 单独导出(测试接口) import {test} from '@/common/vmeitime-http/'
export const test = (data) => {
	/* http.config.baseUrl = "http://localhost:8080/api/"
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		config.header = {
			"token": uni.getStorageSync('token')
		}
	} 
	*/
	//设置请求结束后拦截器
	http.interceptor.response = (response) => {
		console.log('个性化response....')
		//判断返回状态 执行相应操作
		return response;
	}
	return http.request({
		url: 'home/content',
		dataType: 'text',
		data,
	})
}

//首页商品搜索
export const search=(keyWord)=>{
	http.interceptor();
	return http.get('home/search?keyword='+ keyWord);
}

//设置头像
export const setIcon=(data)=>{
	http.interceptor();
	return http.post('member/modifyAvatarUrl',data);
}
//设置昵称
export const setNickname=(data)=>{
	http.interceptor();
	return http.post('member/modifyNickname',data);
}
//手机登录
export const phoneLogin=(data)=>{
	http.interceptor();
	return http.asPost('member/login',data);
}
//微信绑定手机
export const bindPhone=(data)=>{
	http.interceptor();
	return http.post('member/bindPhone',data);
}
export const getTradeList = (data)=>{
	http.interceptor();
	return http.get('financial/getTradeList',data)
}
export const getFreezeTradeList = (data)=>{
	http.interceptor();
	return http.get('financial/getFreezeTradeList',data)
}
//获取验证码
export const getAuthCode=(data)=>{
	http.interceptor();
	return http.get('member/getAuthCode',data);
}

//微信默认登录
export const login=(data)=>{
	http.interceptor();
	return http.post('member/wechatLogin',data);
}
//微信注册
export const wechatRegister=(data)=>{
	http.interceptor();
	return http.post('member/wechatRegister',data);
}
//获得授权码
export const postCode=(data)=>{
	http.interceptor();
	return http.post('member/wechatPublicLogin',data);
}

//获得授权地址
export const getUrl=(data)=>{
	http.interceptor();
	return http.get('member/getAuthorizeUrl');
}

// 首页头部数据
export const header = (data) => {
	return http.get('home/content')
}
// 会员充值
export const recharge = (data) => {
	return http.get('home/recharge')
}
//分类请求
export const productCateList = (data) => {
	return http.get('home/productCateList')
}
//商品列表
export const getProductList = (data) => {
	return http.post('home/queryProductList', data)
}
//秒杀商品列表
export const getFlashList = (data) => {
	return http.get('home/getFlashList', data)
}
//热销商品列表
export const getHotProductList = (data) => {
	return http.get('home/getCategoryHotProduct', data)
}
// 商品详情页
export const goodInfo = (data) => {
	return http.get('home/getProductInfo/' + data.id)
}
//获取SKU商品信息
export const getProductSke = (data) => {
	return http.get('home/getProductSku/' + data.productId, data)
}

//注册完善个人资料
export const SaveMemberInfo = (data) => {
	return http.asPost('member/firstSaveMemberInfo', data)
}

//用户注册
export const toRegister = (data) => {
	return http.post('member/register', data)
}
//用户登录
export const toLogin = (data) => {
	return http.asPost('member/login', data)
}
//用户个人信息
export const getMemberInfo = (data) => {
	http.interceptor();
	return http.get('member/getMemberInfo', data);
}
//提交收货地址
export const setAddress = (data) => {
	http.interceptor();
	return http.post('member/address/add', data);
}

//修改地址
export const editAddress = (data) => {
	http.interceptor();
	return http.post('member/address/update', data);
}

//删除地址
export const deletAddress = (data) => {
	http.interceptor();
	return http.post('member/address/delete', data);
}

//获取快递公司
export const getExpressOptions = () => {
	http.interceptor();
	return http.get('express/list/expressOptions');
}

//获取默认地址
export const getDefaultReceivingAddress = (data) => {
	http.interceptor();
	return http.post('member/address/getDefaultReceivingAddress');
}

//获取所有地址
export const getAddressList = () => {
	http.interceptor();
	return http.post('member/address/list');
}
//获取单个地址
export const getAddresInfo = (data) => {
	http.interceptor();
	return http.post('member/address/getOneAddress',data);
}


//充值vip
export const buyVip = (data) => {
	http.interceptor();
	return http.post('member/bugVip');
}
//获取用户订单
//查询订单状态条件：0->待付款; 1->待发货; 2->待评价; 3->已完成; 4->已关闭; 5->已取消; 6->全部
export const getOrderList = (data) => {
	http.interceptor();
	return http.get('member/order/getMemberOrderList', data);
}
//获取待处理订单数量
export const getOrderNumber = (data) => {
	http.interceptor();
	return http.get('member/order/getMemberOrderInfo', data);
}
//获取团长订单
export const getLeaderOrderList = (data) => {
	http.interceptor();
	return http.get('member/order/getStoreOrder', data);
}
//获取团长订单
export const getStoreOrderDetail = (data) => {
	http.interceptor();
	return http.get('member/order/getStoreOrderDetail', data);
}
//获取团队列表
export const getLeaderList = (data) => {
	http.interceptor();
	return http.post('member/getMyGroup', data);
}
//通过扫码获取店长订单
export const getLeaderOrderListByCode = (data) => {
	http.interceptor();
	return http.asPost('member/order/getMemberOrder', data);
}
//获取默认店长
export const defaultLeader = (data) => {
	http.interceptor();
	return http.post('member/getDefaultStore');
}
//获取附近店长
export const queryLeaderList = (data) => {
	http.interceptor();
	return http.post('member/nearTheShop?pageSize='+data.pageSize+'&pageNum='+data.pageNum,data);
}
//设置默认店长
export const setDefaultLeader = (data) => {
	http.interceptor();
	return http.post('member/setDefaultStore/'+data);
}
//核销订单
export const orderStockOut = (data) => {
	http.interceptor();
	return http.asPost('member/order/confirmReceiving/',data);
}
//提示到货
export const promptArrive = (data) => {
	http.interceptor();
	return http.asPost('member/order/promptArrive/',data);
}
//获取订单详情
export const getOrderInfo = (data) => {
	http.interceptor();
	return http.post('member/order/getMemberOrderDetailInfo', data)
}
//取消订单
export const cancelOrder = (data) => {
	http.interceptor();
	return http.asPost('member/order/cancelOrder', data);
}
//删除订单
export const deleteOrder = (data) => {
	http.interceptor();
	return http.asPost('member/order/deleteOrder', data);
}
//催单
export const rushOrder = (data) => {
	http.interceptor();
	return http.asPost('member/order/orderRush', data);
}
//获取所有地区代码表
export const getAllArea = (data) => {
	http.interceptor();
	return http.get('member/address/getAllArea', data)
}

//用户地址
export const getUserAddress = (data) => {
	http.interceptor();
	return http.get('member/address/list', data)
}
//获取用户默认地址
export const getDefaulteceivingAddress = (data) => {
	http.interceptor();
	return http.get('member/address/getDefaultReceivingAddress', data)
}
//获取礼包列表
export const getGiftList = (data) => {
	http.interceptor();
	return http.get('gift/getMyGiftList', data)
}
//打开礼包
export const openGift = (data) => {
	http.interceptor();
	return http.post('gift/openGift', data)
}
//领取礼包
export const getGift = (data) => {
	http.interceptor();
	return http.post('gift/getGift', data)
}
//查询订单礼包
export const getOrderGift = (data) => {
	http.interceptor();
	return http.get('gift/getOrderGift', data)
}
//获取套餐信息
export const getMealInfo = (data) => {
	http.interceptor();
	return http.get('gift/getGiftList', data)
}
//添加收货地址用户
export const memberAddressAdd = (data) => {
	http.interceptor();
	return http.post('member/address/add', data)
}
//编辑收货地址用户
export const memberAddressUpdate = (data) => {
	http.interceptor();
	return http.post('member/address/update/' + data.id, data)
}
//删除收货地址用户
export const memberAddressDel = (data) => {
	http.interceptor();
	return http.post('member/address/delete/' + data.id, data)
}
//修改密码
export const memberUpdatePassword = data => {
	http.interceptor();
	return http.asPost('member/updatePassword', data)
}

//修改购物车中某个商品的数量
export const updateQuantity = (data) => {
	http.interceptor();
	return http.post('cart/update/quantity', data)
}
//用户购物车
export const getCartList = (data) => {
	http.interceptor();
	return http.post('cart/cartItemlist', data)
}
//加入购物车
export const cartAdd = (data) => {
	http.interceptor();
	return http.post('cart/add', data)
}
//删除购物车
export const cartDelete = (data) => {
	http.interceptor();
	return http.asPost('cart/delete', data)
}
//清空购物车
export const cartClear = (data) => {
	http.interceptor();
	return http.post('cart/clear', data)
}

//加入收藏
export const addProductCollection = (data) => {
	http.interceptor();
	return http.post('member/collection/addProduct', data)
}
//取消收藏
export const delProductCollection = (data) => {
	http.interceptor();
	return http.asPost('member/collection/deleteProduct/' + data.productId, data)
}
//收藏列表
export const memberCollectionListProduct = (data) => {
	http.interceptor();
	return http.get('member/collection/listProduct/' + data.id)
}



//根据手机号获取用户真实姓名
export const getRealName = (data) => {
	http.interceptor();
	return http.get('member/getRealName?phone='+data.phone)
}





//用户浏览记录
export const readHistoryList = (data) => {
	http.interceptor();
	return http.get('member/readHistory/list', data)
}
//添加商品浏览记录
export const memberReadHistoryCreate = (data) => {
	return http.post('member/readHistory/create', data)
}

//删除商品浏览记录
export const memberReadHistoryDelete = (data) => {
	http.interceptor();
	return http.post('member/readHistory/delete', data)
}

//得到用户体现申请
export const getWithdrawApply=(data)=>{
	 http.interceptor();
	 return http.get('member/getWithdrawApply',data)
}

//提交订单
export const generateOrder = (data) => {
	http.interceptor();
	return http.post('member/order/createCartOrder', data)
}

//立即下单
export const orderCreateOrder = (data) => {
	http.interceptor();
	return http.post('member/order/createOrder', data)
}
//获取赠品
export const getGive = (data) => {
	http.interceptor();
	return http.get('GiveAway/get', data)
}
//立即下单秒杀
export const seckill = (data) => {
	http.interceptor();
	return http.post('flash/rob', data)
}
//重新激活订单
export const remindOrder = (data) => {
	http.interceptor();
	return http.asPost('member/order/againBuy', data)
}
//重新激活订单
export const queryPhoneNumber = (data) => {
	http.interceptor();
	return http.get('home/getPhone')
}
//收货
export const orderReceive = (data) => {
	http.interceptor();
	return http.asPost('member/order/confirmReceiving', data)
}
//申请店长
export const applyLeader = (data) => {
	http.interceptor();
	return http.asPost('member/applyGroup', data)
}
//获取商家银行卡信息
export const getBankInfo = (data) => {
	http.interceptor();
	return http.get('member/order/getSellerBankAccount', data)
}

//显示会员所有的银行信息
export const getBankList=(data)=>{
	http.interceptor();
	return http.get('bank/bankList', data)
}

//添加银行信息
export const addBank=(data)=>{
	http.interceptor();
	return http.post('member/bankAccount/add', data)
}

//删除银行卡
export const delBank=(data)=>{
	http.interceptor();
	return http.post('member/bankAccount/delete/'+data.id)
}

//提交银行卡信息
export const submitBankInfo = (data) => {
	http.interceptor();
	return http.post('member/order/payment', data)
}
//获得支行信息
export const getBankBranch = (data) => {
	http.interceptor();
	return http.post('bank/branch', data)
}
//银行卡进件
export const merchantAdd=(data)=>{
	http.interceptor();
	return http.post('bank/merchantAdd', data)
}
//获取银行卡列表
export const getMyBankList=(data)=>{
	http.interceptor();
	return http.get('bank/queryMyBank', data)
}
//设置默认银行卡
export const setDefaultBank=(data)=>{
	http.interceptor();
	return http.post('bank/setDefault', data)
}
//获取我的提成明细
export const queryMemberDistribution=(data)=>{
	http.interceptor();
	return http.get('financial/queryMemberDistribution', data)
}
//获取物流信息
export const getLogistics = (data) => {
	http.interceptor();
	return http.get('member/order/getLogistics', data)
}
//获取小程序码
export const getCode = (data) => {
	http.interceptor();
	// return http.post('smallProgram/generateCode?page='+data.page+'&scene='+data.scene)
	return http.post('smallProgram/generateCode',data)
}
//获取直播间列表
export const getLiveList = (data) => {
	http.interceptor();
	return http.post('list',data,{baseUrl:'https://zhibo.zuizhezhi.com/home_api/live/'})
}
//获取我的直播间列表
export const getMyLiveList = (data) => {
	http.interceptor();
	return http.post('user_list',data,{baseUrl:'https://zhibo.zuizhezhi.com/home_api/live/'})
}
//获取直播间详情
export const getLiveDetail = (data) => {
	http.interceptor();
	return http.post('info_live',data,{baseUrl:'https://zhibo.zuizhezhi.com/home_api/live/'})
}
//获取申请记录
export const getLiveVerify = (data) => {
	http.interceptor();
	return http.post('apply_list',data,{baseUrl:'https://zhibo.zuizhezhi.com/home_api/live/'})
}
//申请直播
export const applyLive = (data) => {
	http.interceptor();
	return http.post('apply_add',data,{baseUrl:'https://zhibo.zuizhezhi.com/home_api/live/'})
}
//更改直播间信息
export const updateLive = (data) => {
	http.interceptor();
	return http.post('edit_live',data,{baseUrl:'https://zhibo.zuizhezhi.com/home_api/live/'})
}
//开始直播
export const startLive = (data) => {
	http.interceptor();
	return http.post('start_live',data,{baseUrl:'https://zhibo.zuizhezhi.com/home_api/live/'})
}
//结束直播
export const endLive = (data) => {
	http.interceptor();
	return http.post('end_live',data,{baseUrl:'https://zhibo.zuizhezhi.com/home_api/live/'})
}
//获取推流信息
export const pushLive = (data) => {
	http.interceptor();
	return http.post('push_live',data,{baseUrl:'https://zhibo.zuizhezhi.com/home_api/live/'})
}
//获取签名
export const gensin = (data) => {
	http.interceptor();
	return http.post('gensin',data,{baseUrl:'https://zhibo.zuizhezhi.com/home_api/im/'})
}
//获取礼物列表
export const giftCategoryList = (data) => {
	http.interceptor();
	return http.post('gift_category_list',data,{baseUrl:'https://zhibo.zuizhezhi.com/home_api/live/'})
}
//获取礼物
export const giftList = (data) => {
	http.interceptor();
	return http.post('gift_list',data,{baseUrl:'https://zhibo.zuizhezhi.com/home_api/live/'})
}
//-----------修改用户资料-------------

//填写邀请人手机
export const addInviter = (data) => {
	http.interceptor();
	return http.asPost('member/addInviter', data)
}

//修改用户昵称
export const updateMemberNickname = (data) => {
	http.interceptor();
	return http.asPost('member/updateMemberNickname', data)
}

//修改真实姓名
export const updateRealName = (data) => {
	http.interceptor();
	return http.asPost('member/updateRealName', data)
}


//修改地址
export const updateAddress = (data) => {
	http.interceptor();
	return http.asPost('member/updateAddress', data)
}

//修改用户手机号码
export const updateMemberPhone = (data) => {
	http.interceptor();
	return http.asPost('member/updateMemberPhone', data)
}

//修改用户性别
export const updateMemberGender = (data) => {
	http.interceptor();
	return http.asPost('member/updateMemberGender', data)
}
//获取用户余额
export const getIncome = (data) => {
	http.interceptor();
	return http.get('member/getAccountDetail?pageSize=10&pageNum='+data.page)
}
//获取用户团队信息
export const getGroup = (id,pageNum) => {
	http.interceptor();
	return http.get('member/getTeamList?pageSize=10&memberId='+id+'&pageNum='+pageNum)
}
//使用用户余额付款
export const payAsBalance = (data) => {
	http.interceptor();
	return http.asPost('member/order/balancePayment',data)
}
//获取用提现银行卡信息
export const getCardInfo = () => {
	http.interceptor();
	return http.get('member/getBankAccount')
}


//用户更改银行卡信息
export const updateBankAccount = (data) => {
	http.interceptor();
	return http.post('member/bankAccount/update',data)
}

//得到用户默认银行
export const getDefaultBank=()=>{
	http.interceptor();
	return http.get('member/bankAccount/getDefaultBankAccount')
}

//用户提现
export const withdrawApply=(data)=>{
	http.interceptor();
	return http.get('financial/memberDistribution',data)
}

export const updateMemberIcon = () => {
	return http.config.baseUrl +'member/updateMemberIcon'
}

//转让金额
export const transferMoney=(data)=>{
	http.interceptor();
	return http.post('member/transfer',data)
}

//获取用户转账记录
export const getTransferList=(data)=>{
	http.interceptor();
	return http.get('member/getTransferList',data)
}

//调取微信支付
export const wxPrePay=(data)=>{
	http.interceptor();
	return http.asPost('member/order/wxPrePay',data)
}

//---------------用户优惠券-----------------

//获取优惠券列表
export const couponList=(type)=>{
	http.interceptor();
	return http.get('member/coupon/list?useStatus='+type)
}
//获取订单可用优惠券列表
export const couponOrderList=(type)=>{
	http.interceptor();
	return http.post('member/coupon/list/order',type)
}
//领取优惠券
export const couponAdd=(type)=>{
	http.interceptor();
	return http.post('member/coupon/add/'+type)
}
//获取可领取优惠券
export const couponCanreceive=(type)=>{
	http.interceptor();
	return http.post('member/coupon/canReceive')
}
//---------------获赠用户领取礼物-----------------

//领取礼物
export const receiveGift=(data)=>{
	http.interceptor();
	return http.post('member/order/receiveGiftOrder',data)
}

//问题反馈
export const issueFeedback=(data)=>{
	http.interceptor();
	return http.post('other/issueFeedback',data);
}
//服务条款
export const getService=()=>{
	http.interceptor();
	return http.get('home/getServicTerms');
}

//帮助中心
export const getHelp=()=>{
	http.interceptor();
	return http.get('home/getHelp');
}
//帮助中心
export const getAboutUs=()=>{
	http.interceptor();
	return http.get('other/getAboutUs');
}
//---------------退货退款-----------------
//订单退款
export const refundOrder=(data)=>{
	http.interceptor();
	return http.get('member/order/refundOrder',data);
}
//订单退款
export const refundOrderItem=(data)=>{
	http.interceptor();
	return http.get('member/order/refundOrderItem',data);
}
//退款原因
export const getReturnReason=()=>{
	http.interceptor();
	return http.get('member/order/return/getReturnReason');
}
//退换货提交
export const refundExchange=(data)=>{
	http.interceptor();
	return http.post('member/order/return/refundExchange',data);
}

//获取会员退换货列表
export const getMemberOrderReturnList=(data)=>{
	http.interceptor();
	return http.get('member/order/return/getMemberOrderReturnList',data);
}

//获取会员退换货详细信息
export const getMemberOrderReturnDetailInfo=(orderReturnId)=>{
	http.interceptor();
	return http.get('member/order/return/getMemberOrderReturnDetailInfo?orderReturnId='+orderReturnId);
}

//取消退换货申请
export const cancelRefundExchange=(data)=>{
	http.interceptor();
	return http.post('member/order/return/cancelRefundExchange',data);
}
//修改退换货申请
export const updateRefundExchange=(data)=>{
	http.interceptor();
	return http.post('member/order/return/updateRefundExchange',data);
}

//---------------七牛云配置-----------------
//获取七牛云配置
export const getQiniu=()=>{
	http.interceptor();
	return http.get('qiniu/getToken');
}

export const getCardList=()=>{
	http.interceptor();
	return http.get('card/list');
}

export const getMyGroup=(data)=>{
	http.interceptor();
	return http.post('member/getMyGroup',data);
}

export const allowList = ()=>{
	http.interceptor();
	return http.get('card/allowList');
}



// 默认全部导出  import api from '@/common/vmeitime-http/'
export default {
	updateQuantity,
	updateAddress,
	updateRealName,
	getRealName,
	getTransferList,
	transferMoney,
	getWithdrawApply,
	withdrawApply,
	getDefaultBank,
	delBank,
	addBank,
	getBankList,
	test,
	header,
	recharge,
	productCateList,
	goodInfo,
	getAuthCode,
	toRegister,
	toLogin,
	getAllArea,
	getUserAddress,
	readHistoryList,
	getCartList,
	memberAddressAdd,
	memberAddressUpdate,
	memberAddressDel,
	memberUpdatePassword,
	cartAdd,
	addProductCollection,
	delProductCollection,
	memberCollectionListProduct,
	memberReadHistoryCreate,
	memberReadHistoryDelete,
	getMemberInfo,
	buyVip,
	getOrderList,
	getOrderNumber,
	getLeaderOrderList,
	getStoreOrderDetail,
	getLeaderList,
	getLeaderOrderListByCode,
	defaultLeader,
	queryLeaderList,
	setDefaultLeader,
	orderStockOut,
	promptArrive,
	getOrderInfo,
	cartClear,
	cartDelete,
	getProductSke,
	getDefaulteceivingAddress,
	getGiftList,
	openGift,
	getGift,
	getOrderGift,
	getMealInfo,
	generateOrder,
	orderCreateOrder,
	getGive,
	seckill,
	remindOrder,
	queryPhoneNumber,
	submitBankInfo,
	getBankBranch,
	merchantAdd,
	getMyBankList,
	setDefaultBank,
	queryMemberDistribution,
	getBankInfo,
	cancelOrder,
	deleteOrder,
	rushOrder,
	getProductList,
	getFlashList,
	getHotProductList,
	updateMemberNickname,
	updateMemberPhone,
	addInviter,
	updateMemberGender,
	getLogistics,
	getCode,
	getLiveList,
	getMyLiveList,
	getLiveDetail,
	getLiveVerify,
	applyLive,
	updateLive,
	startLive,
	endLive,
	pushLive,
	gensin,
	giftCategoryList,
	giftList,
	orderReceive,
	applyLeader,
	getIncome,
	getGroup,
	payAsBalance,
	getCardInfo,
	updateBankAccount,
	updateMemberIcon,
	login,
	wechatRegister,
	SaveMemberInfo,
	wxPrePay,
	postCode,
	getUrl,
	phoneLogin,
	bindPhone,
	getTradeList,
	getFreezeTradeList,
	couponList,
	couponOrderList,
	couponCanreceive,
	couponAdd,
	receiveGift,
	search,
	setIcon,
	setNickname,
	issueFeedback,
	getService,
	getHelp,
	getAboutUs,
	refundOrder,
	refundOrderItem,
	getReturnReason,
	getQiniu,
	refundExchange,
	getMemberOrderReturnList,
	getMemberOrderReturnDetailInfo,
	cancelRefundExchange,
	updateRefundExchange,
	setAddress,
	editAddress,
	deletAddress,
	getExpressOptions,
	getDefaultReceivingAddress,
	getAddressList,
	getAddresInfo,
	getCardList,
	getMyGroup,
	allowList
}