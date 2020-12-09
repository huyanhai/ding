<template>
	<view class="container">
		<image class="bg" src="/static/user-bg.png" mode="scaleToFill" style="286upx"></image>
		<view class="user-section">
			<view class="user-info-box">
				<view class="portrait-box">
					<image class="portrait" :src="memberInfo.headPicture ||'/static/missing-face.png'" @click="navTo('/pages/user/uploadHeaderPic')"></image>
					<image v-if="memberInfo.vip==1" class="vip" src="/static/vip.png"></image>
				</view>
				<view class="info-box">
					<text v-if="memberInfo" class="username">{{ memberInfo.nickname || memberInfo.phone }}</text>
					<text v-if="memberInfo" class="inviteCode">邀请码：{{ memberInfo.inviteCode }}</text>
					<text v-if="!memberInfo" @click="login" class="login">去登录</text>
					<!-- <text></text> -->
				</view>
				<!-- <text v-if="!memberInfo.phone" @click="bindPhone"  class="bindPhone">绑定手机</text> -->
			</view>
			<!-- <view class="vip-card-box" v-if="memberInfo.vip==0">
				<image class="card-bg" src="/static/vip-card-bg.png" mode=""></image>
				<view @click="recharge" class="b-btn">立即开通</view>
				<view v-if="memberInfo.memberLevelName" class="tit">
					<text class="yticon icon-iLinkapp-"></text>
					{{memberInfo.memberLevelName}}
				</view>
				<text class="e-m">更多特权</text>
			</view> -->
			<!-- 订单 -->
			<!-- <view class="tj-sction">
				<view class="tj-title">
					账户余额
				</view>
				<view class="tj-content"  @click="navTo('/pages/user/detail')">
					<text style="font-size: 72upx;color: #1DC7AC;">{{memberInfo.balance||0}}</text><text style="font-size: 48upx;color: #000;">CNY</text>
				</view>
				<view style="font-size: 24upx;color: rgb(51,51,51);">
					冻结金额：{{memberInfo.freeze||0}}
				</view>
			</view> -->
			<view class="order-container">

				<!-- <view v-if="memberInfo.memberLevelName" class="tit">
					<text class="yticon icon-iLinkapp-"></text>
					<view class="text">{{memberInfo.memberLevelName}}</view>
				</view> -->
				<view>
					<view class="border_b flexbetween" style="padding:0 48rpx 30rpx">
						<view class="fontB ml10" style="font-size: 30upx;">
							我的订单
						</view>
						<view class=" font10 ml10 " @click="navTo('/pages/order/order?state=5')">
							<text class="fontcolor16">查看全部</text>
							<text class="yticon icon-you ml10 fontcolor16"></text>
						</view>
					</view>
					<view class="order-section">
						<!-- <view class="order-item" @click="navTo('/pages/order/order?state=6')" hover-class="common-hover" :hover-stay-time="50">
							<text class="yticon icon-shouye"></text>
							<image src="../../static/all.png" style="width: 22px;height: 22px;margin-bottom: 10px;"></image>
							<text>全部</text>
						</view> -->
						<view class="order-item" @click="navTo('/pages/order/order?state=0')" hover-class="common-hover" :hover-stay-time="50">
							<!-- <text class="yticon icon-daifukuan"></text> -->
							<image src="../../static/repay.png" style="width: 80upx;height: 80upx;"></image>
							<view class="tip" v-if="numberList[0]>0">{{numberList[0]}}</view>
							<text style="font-size: 24upx;margin-top: 16upx;">待付款</text>
						</view>
						<view class="order-item" @click="navTo('/pages/order/order?state=1')" hover-class="common-hover" :hover-stay-time="50">
							<!-- <text class="yticon icon-daifukuan"></text> -->
							<image src="../../static/send.png" style="width: 80upx;height: 80upx;"></image>
							<view class="tip" v-if="numberList[1]>0">{{numberList[1]}}</view>
							<text style="font-size: 24upx;margin-top: 16upx;">待发货</text>
						</view>
						<view class="order-item" @click="navTo('/pages/order/order?state=2')" hover-class="common-hover" :hover-stay-time="50">
							<!-- <text class="yticon icon-yishouhuo"></text> -->
							<image src="../../static/Receipt.png" style="width: 80upx;height: 80upx;"></image>
							<view class="tip" v-if="numberList[2]>0">{{numberList[2]}}</view>
							<text style="font-size: 24upx;margin-top: 16upx;">待收货</text>
						</view>
						<view class="order-item" @click="navTo('/pages/order/order?state=3')" hover-class="common-hover" :hover-stay-time="50">
							<!-- <text class="yticon icon-yishouhuo"></text> -->
							<image src="../../static/complete.png" style="width: 80upx;height: 80upx;"></image>
							<text style="font-size: 24upx;margin-top: 16upx;">已完成</text>
						</view>
						<!-- <view class="order-item" @click="navTo('/pages/order/order?state=5')" hover-class="common-hover" :hover-stay-time="50">
							<text class="yticon icon-yishouhuo"></text>
							<image src="../../static/refuse.svg" style="width: 22px;height: 22px;margin-bottom: 10px;"></image>
							<view class="tip" v-if="numberList[3]>0">{{numberList[3]}}</view>
							<text>退货/售后</text>
						</view> -->
					</view>
				</view>
			</view>
		</view>

		<view class="cover-container" :style="[
				{
					transform: coverTransform,
					transition: coverTransition
				}
			]">
			<!-- <image class="arc" src="/static/arc.png"></image> -->
			<!-- 余额列表 -->
			<!-- <view class="tj-sction">
				<view class="tj-item" @click="navTo('/pages/user/detail?type=0')">
					<text class="num">{{ memberInfo.balance || 0 }}</text>
					<text>余额</text>
				</view>
				<view class="tj-item">
					<text class="num">{{ memberInfo.memberTotalConsume || 0 }}</text>
					<text>消费总金额</text>
				</view>
				<view class="tj-item">
					<text class="num">{{ memberInfo.teamTotalConsume || 0 }}</text>
					<text>团队消费总金额</text>
				</view>
				<view class="tj-item" @click="navTo('/pages/user/detail?type=1')">
					<text class="num">{{ memberInfo.freeze || 0 }}</text>
					<text>冻结金额</text>
				</view>
			</view> -->
			<!-- <view class="leader-section" v-if="defaultLeader!=''">
				<view class="flexbetween">
					<view @click="openTip" class="fontB ml10" style="font-size: 30upx;margin-left: 24upx;display: flex;height: 30upx;line-height: 30upx;">
						默认团长
						<image style="width: 30upx;height: 30upx;margin-left: 10upx;" src="../../static/wenhao.png" mode=""></image>
					</view>
					<view class=" font10 ml10 " @click="navTo('/pages/leader/toggleLeader?type=1')">
						<text class="fontcolor16">切换团长</text>
						<text class="yticon icon-you ml10 fontcolor16"></text>
					</view>
				</view>
				<view class="default-leader">
					<view class="leader-top">
						<view class="leader-img">
							<image :src="defaultLeader.icon" mode=""></image>
						</view>
						<view class="leader-name">
							{{defaultLeader.storeName}}
						</view>
						<view class="leader-btn" @click="openLocation">
							导航
						</view>
					</view>
					<view class="leader-mid">
						{{defaultLeader.region}}
					</view>
				</view>
			</view> -->
			<!-- 浏览历史 -->
			<!-- <view class="bgcolor10 padding13">
				<view class="flexbetween mtrpx20">
					<view class="flexcenter" @click="navTo('/pages/collectionAndView/collectionAndView?type=1')">
						<view>
							<image src="../../static/collection.svg" style="width: 80rpx;height: 80rpx;"></image>
						</view>
						<view class="ml20">
							<view class="font10 fontB">我的收藏</view>
							<view class="font8">查看收藏</view>
						</view>
					</view>
					<view class="flexcenter mr20" @click="navTo('/pages/collectionAndView/collectionAndView?type=2')">
						<view>
							<image src="../../static/jilu.svg" style="width: 80rpx;height: 80rpx;"></image>
						</view>
						<view class="ml20">
							<view class="font10 fontB">浏览记录</view>
							<view class="font8">我看过的</view>
						</view>
					</view>
				</view>
			</view> -->
			<view class="bgcolor10 padding13 mt10" style="border-radius: 24upx;">
				<view class="sec-header flexstart" style="margin-left: 32upx;">
					<view class="fontB" style="font-size: 30upx;">我的服务</view>
				</view>
				<view class="flexstart" style="width: 100%;">
					<!-- <view class="box_col_25 mtrpx40">
						<view class="textcenter" @click="navTo('/pages/coupon/coupon')">
							<image src="../../static/myCoupon.png" style="width: 60rpx;height: 60rpx;"></image>
							<view class="mt10" style="font-size: 24upx;">优惠券</view>
						</view>
					</view>
					<view class="box_col_25 mtrpx40">
						<view class="textcenter" @click="navTo('/pages/gift/gift')">
							<image src="../../static/giftIcon.png" style="width: 60rpx;height: 60rpx;"></image>
							<view class="mt10" style="font-size: 24upx;">我的礼包</view>
						</view>
					</view> -->
					<!-- <view class="box_col_25 mtrpx40">
						<view class="textcenter" @click="navTo('/pages/collectionAndView/collectionAndView?type=1')">
							<image src="../../static/collection.png" style="width: 60rpx;height: 60rpx;"></image>
							<view class="mt10" style="font-size: 24upx;">我的收藏</view>
						</view>
					</view>
					<view class="box_col_25 mtrpx40">
						<view class="textcenter" @click="navTo('/pages/collectionAndView/collectionAndView?type=2')">
							<image src="../../static/histroy.png" style="width: 60rpx;height: 60rpx;"></image>
							<view class="mt10" style="font-size: 24upx;">浏览记录</view>
						</view>
					</view> -->
					<!-- <view class="box_col_25 mtrpx40" v-if="memberInfo.store!=1">
						<view class="textcenter">
							<image @click="navTo('/pages/leader/applyLeader')" src="../../static/applyLeader.png" style="width: 60rpx;height: 60rpx;"></image>
							<view class="mt10" style="font-size: 24upx;">申请团长</view>
						</view>
					</view> -->
					<!-- <view class="box_col_25 mtrpx40" v-if="memberInfo.store!=undefined&&memberInfo.store!=0">
						<view class="textcenter">
							<image @click="navTo('/pages/leader/leaderOrder?type=0')" src="../../static/dindan.png" style="width: 60rpx;height: 60rpx;"></image>
							<view class="mt10" style="font-size: 24upx;">团长订单</view>
						</view>
					</view> -->
				<!-- 	<view class="box_col_25 mtrpx40" v-if="memberInfo.store!=undefined&&memberInfo.store!=0">
						<view class="textcenter">
							<image @click="scanCode" src="../../static/scancode.png" style="width: 60rpx;height: 60rpx;"></image>
							<view class="mt10" style="font-size: 24upx;">扫码核销</view>
						</view>
					</view> -->
					<!-- <view class="box_col_25 mtrpx40">
						<view class="textcenter" @click="navTo('/pages/live/applyLive')">
							<image src="../../static/applyLive.png" style="width: 60rpx;height: 60rpx;"></image>
							<view class="mt10" style="font-size: 24upx;">申请直播</view>
						</view>
					</view> -->
					<!-- <view class="box_col_25 mtrpx40">
						<view class="textcenter" @click="navTo('/pages/live/liveVerify')">
							<image src="../../static/applyLive.png" style="width: 60rpx;height: 60rpx;"></image>
							<view class="mt10" style="font-size: 24upx;">审核进度</view>
						</view>
					</view> -->
					<!-- <view class="box_col_25 mtrpx40">
						<view class="textcenter" @click="navTo('/pages/live/myLiveList')">
							<image src="../../static/startLive.png" style="width: 60rpx;height: 60rpx;"></image>
							<view class="mt10" style="font-size: 24upx;">开始直播</view>
						</view>
					</view> -->
					<view class="box_col_25 mtrpx40" v-if="!memberInfo.phone">
						<view class="textcenter">
							<image @click="navTo('/pages/public/bindPhone/bindPhone')" src="../../static/bindPhone.png" style="width: 60rpx;height: 60rpx;"></image>
							<view class="mt10" style="font-size: 24upx;">绑定手机</view>
						</view>
					</view>
				<!-- 	<view class="box_col_25 mtrpx40">
						<view class="textcenter">
							<image @click="navTo('/pages/leader/leaderList')" src="../../static/leaderList.png" style="width: 60rpx;height: 60rpx;"></image>
							<view class="mt10" style="font-size: 24upx;">团队列表</view>
						</view>
					</view> -->
					<!-- <view class="box_col_25 mtrpx40">
						<view class="textcenter">
							<image @click="navTo('/pages/user/bankList')" src="../../static/bank.png" style="width: 60rpx;height: 60rpx;"></image>
							<view class="mt10" style="font-size: 24upx;">银行卡管理</view>
						</view>
					</view> -->
					<!-- <view class="box_col_25 mtrpx40">
						<view class="textcenter">
							<image @click="navTo('/pages/user/percentage')" src="../../static/percentage.png" style="width: 60rpx;height: 60rpx;"></image>
							<view class="mt10" style="font-size: 24upx;">我的提成</view>
						</view>
					</view> -->
					<view class="box_col_25 mtrpx40">
						<view class="textcenter">
							<image @click="navTo('/pages/leaveMessage/leaveMessage')" src="../../static/feedback.png" style="width: 60rpx;height: 60rpx;"></image>
							<view class="mt10" style="font-size: 24upx;">问题反馈</view>
						</view>
					</view>
					<!-- <view class="box_col_25 mtrpx40">
						<view class="textcenter">
							<image @click="navTo('/pages/help/help')" src="../../static/help.png" style="width: 60rpx;height: 60rpx;"></image>
							<view class="mt10" style="font-size: 24upx;">帮助中心</view>
						</view>
					</view> -->
					<!-- <view class="box_col_25 mtrpx40">
						<view class="textcenter">
							<image @click="navTo('/pages/service/service')" src="../../static/service.png" style="width: 60rpx;height: 60rpx;"></image>
							<view class="mt10" style="font-size: 24upx;">服务条款</view>
						</view>
					</view> -->
					<view class="box_col_25 mtrpx40">
						<view class="textcenter">
							<image @click="navTo('/pages/user/aboutUs')" src="../../static/aboutUs.png" style="width: 60rpx;height: 60rpx;"></image>
							<view class="mt10" style="font-size: 24upx;">关于我们</view>
						</view>
					</view>
					<!-- <view class="box_col_25 mtrpx40">
						<view class="textcenter">
							<image @click="chooseAddress" src="../../static/aboutUs.png" style="width: 60rpx;height: 60rpx;"></image>
							<view class="mt10" style="font-size: 24upx;">地址选择</view>
						</view>
					</view> -->
				</view>
			</view>

			<!-- <view class="history-section icon"> -->
			<!--<list-cell icon="icon-iconfontweixin" iconColor="#e07472" title="我的钱包" tips="您的会员还有3天过期"></list-cell>-->
			<!-- <list-cell icon="icon-dizhi" iconColor="#5fcda2" title="地址管理" @eventClick="navTo('/pages/address/address')"></list-cell> -->
			<!-- <button :open-type="hasLogin?'share':''" @click="hasLogin?'':'navTo()'" class="shareButton">
					<list-cell src="/static/share.png" title="分享"></list-cell>
				</button> -->
			<!--<list-cell icon="icon-pinglun-copy" iconColor="#ee883b" title="晒单" tips="晒单抢红包"></list-cell>-->
			<!--<list-cell icon="icon-shoucang_xuanzhongzhuangtai" iconColor="#54b4ef" title="我的收藏" @eventClick="navTo('/pages/user/collection')"></list-cell>-->
			<!-- <list-cell icon="icon-tuijian" iconColor="#e07472" title="邀请人" @eventClick="navTo('/pages/user/editUser?type=3')"
				 v-if="!memberInfo.inviter"></list-cell> -->
			<!-- <list-cell v-if="memberInfo.inviter" src="/static/Micro_invitation.png" title="邀请人" :phone='memberInfo.inviter'
				 navigateType="none"></list-cell> -->
			<!-- <list-cell src="/static/about_us.png" title="团队列表" @eventClick="navTo('/pages/list/group?memberId='+memberInfo.memberId)"></list-cell> -->
			<!-- <list-cell src="/static/integral.png" title="余额明细" @eventClick="navTo('/pages/list/bill')"></list-cell> -->
			<!-- <list-cell src="/static/profile.png" title="个人资料" @eventClick="navTo('/pages/set/userinfo')"></list-cell> -->
			<!-- <list-cell src="/static/Bank_card.png" title="银行卡信息" @eventClick="navTo('/pages/user/bankList')"></list-cell> -->
				<!-- <list-cell src="/static/myCoupon.png" title="我的优惠券" @eventClick="navTo('/pages/coupon/coupon')"></list-cell>
				<list-cell src="/static/giftIcon.png" title="我的礼包" @eventClick="navTo('/pages/gift/gift')"></list-cell>
				<list-cell  v-if="memberInfo.store==0" src="/static/applyLeader.png" title="申请店长" @eventClick="toApplyOrder"></list-cell>
				<list-cell src="/static/setLeader.png" title="设置店长" @eventClick="navTo('/pages/leader/toggleLeader')"></list-cell>
				<list-cell v-if="memberInfo.store==1" src="/static/setLeader.png" title="店长订单" @eventClick="toLeaderOrder"></list-cell>
				<list-cell v-if="memberInfo.store==1" src="/static/setLeader.png" title="扫码核销" @eventClick="scanCode"></list-cell> -->
			<!-- </view> -->
			<!-- <view class="history-section icon">
				<list-cell src="/static/collection.png" title="我的收藏" @eventClick="navTo('/pages/collectionAndView/collectionAndView?type=1')"></list-cell>
				<list-cell src="/static/histroy.png" title="浏览记录" @eventClick="navTo('/pages/collectionAndView/collectionAndView?type=2')"></list-cell>
				<list-cell src="/static/aboutUs.png" title="关于我们" @eventClick="navTo('/pages/user/aboutUs')"></list-cell>
			</view> -->
			<!-- <view class="code-section" v-if="memberInfo">
				<view class="" style="font-size: 30upx;color: rgb(51,51,51);font-weight: bold;margin: 32upx 62upx;">
					二维码取货
				</view>
				<view class="code-img">
					<qrcode v-if="ifShow" cid="qrcode1" ref="qrcode" :val="val" :showLoading="false" :size="size" :unit="unit" :icon="icon" :iconSize="iconsize" :lv="lv" :onval="onval" :loadMake="loadMake" :usingComponents="true" @result="qrR" />
				</view>
				<view class="touxiang">
					<image :src="memberInfo.headPicture" mode=""></image>
				</view>
				<view class="code-title" @click="creatQrcode()">向团长出示二维码取货</view>
			</view> -->
		</view>
		<view class="tip-mask" v-if="tipMask" @touchmove.stop.prevent="stopPrevent">
			<view class="tip-section">
				<view class="tip-text">
					默认团长是你下单时默认选择的取货团长，商品送达后，请前往团长自提点取货
				</view>
				<view class="tip-btn" @click="closeTip">
					我知道了
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import listCell from '@/components/mix-list-cell';
	import qrcode from "@/components/tki-qrcode"; // 二维码生成器  
	import {
		mapState
	} from 'vuex';
	let startY = 0,
		moveY = 0,
		pageAtTop = true;
	export default {
		components: {
			listCell,
			qrcode
		},
		data() {
			return {
				coverTransform: 'translateY(0px)',
				coverTransition: '0s',
				moving: false,
				historyList: [], //浏览记录
				height: 0,
				numberList: [0, 0, 0],
				ifShow: false,
				val: '', // 要生成的二维码值
				size: 280, // 二维码大小
				unit: 'upx', // 单位
				icon: '', // 二维码图标
				iconsize: 40, // 二维码图标大小
				lv: 3, // 二维码容错级别 ， 一般不用设置，默认就行
				onval: true, // val值变化时自动重新生成二维码
				loadMake: true, // 组件加载完成后自动生成二维码
				src: '' ,// 二维码生成后的图片地址或base64
				memberInfo:'',
				defaultLeader:'',
				tipMask:false
			};
		},
		onLoad() {

		},
		//分享
		onShareAppMessage() {
			return {
				"title": "丁老表",
				"path": "/pages/index/index?_q=" + this.memberInfo.inviteCode,
				"imageUrl": "http://qn.zuizhezhi.com/1594190557521f313a4af1128d9c4315d4f36424d2a.png"
			};
		},
		async onShow() {
			const {
				windowWidth,
				windowHeight
			} = uni.getSystemInfoSync();
			this.height = windowWidth * 172 / 375
			let token = uni.getStorageSync('token')
			if(token!=''){
				let memberInfo = await this.$api.getMemberInfo();
				this.memberInfo = memberInfo.data;
				// this.$http.defaultLeader().then(res=>{
				// 	if(res.code==200){
				// 		if(!res.data){
				// 		}
				// 		this.defaultLeader = res.data
				// 	}else {
				// 		this.$api.msg(res.message)
				// 	}
				// })
				this.val = "/pages/leader/leaderOrder?type=1&userId="+this.memberInfo.memberId;
				this.ifShow = true;
				this.loadData()
				
			}
		},
		onReady() {},
		// #ifndef MP
		onNavigationBarButtonTap(e) {
			const index = e.index;
			if (index === 0) {
				this.navTo('/pages/set/set');
			} else if (index === 1) {
				// #ifdef APP-PLUS
				const pages = getCurrentPages();
				const page = pages[pages.length - 1];
				const currentWebview = page.$getAppWebview();
				currentWebview.hideTitleNViewButtonRedDot({
					index
				});
				// #endif
				uni.navigateTo({
					url: '/pages/notice/notice'
				});
			}
		},
		// #endif
		computed: {
			...mapState(['hasLogin', 'loginStatus', "flag", "phone",]),
		},

		methods: {
			stopPrevent(){},
			openTip(){
				this.tipMask = true;
			},
			closeTip(){
				this.tipMask = false;
			},
			openLocation(){
				let that = this;
				console.log(that.defaultLeader.lat,that.defaultLeader.lon)
				uni.openLocation({
				    latitude: parseFloat(that.defaultLeader.lat),
				    longitude: parseFloat(that.defaultLeader.lon),
				    success: function () {
				        console.log('success');
				    },
					fail(e) {
						console.log(e)
					}
				});
			},
			chooseAddress(){
				uni.chooseAddress({
					success(e) {
						console.log(e)
					},
					fail(e) {
						console.log(e)
					}
				})
			},
			share() {
				uni.showShareMenu()
			},
			toLeaderOrder(){
				uni.navigateTo({
					url: "/pages/leader/leaderOrder?type=0"
				})
			},
			toApplyOrder(){
				uni.navigateTo({
					url: "/pages/leader/applyLeader"
				})
			},
			login: function() {
				let login = this.$store.state.login;
				if (!login) {
					uni.navigateTo({
						url: "/pages/public/register"
					})
				}
			},
			bindPhone() {
				uni.navigateTo({
					url: "/pages/public/bindPhone/bindPhone?phone=" + this.phone
				})
			},
			wait() {
				this.$api.msg('功能完善中，敬请期待！');
			},
			async loadData() {
				// //获取用户信息
				// let memberData = await this.$http.getMemberInfo();
				// if (memberData.code == 200) {
				// 	this.memberInfo = memberData.data;
				// 	console.log(memberData.data)
				// }
				//获取浏览记录
				// let data = await this.$http.readHistoryList({
				// 	memberId: this.memberInfo.memberId
				// });
				// this.historyList = data.data;
				let res = await this.$http.getOrderNumber();
				if(res.code==200){
					this.numberList = [res.data.waitPay,res.data.waitDelivery,res.data.waitReceive]
				}
			},

			navTo(url) {
				if (!this.memberInfo) {
					url = '/pages/public/register';
				}
				uni.navigateTo({
					url: url
				});
			},
			feedBack(){
				uni.navigateTo({
					url:'../leaveMessage/leaveMessage'
				})
			},
			goInverter() {
				uni.navigateTo({
					url: ''
				})
			},
			onPullDownRefresh() {
				this.historyList = [];
				this.memberInfo = [];
				this.hasLogin && this.loadData();
				let memberInfo = this.$api.getMemberInfo();
				this.memberInfo = memberInfo.data
				uni.stopPullDownRefresh();
			},
			//扫码核销
			scanCode(){
				uni.scanCode({
				    success: function (res) {
				        console.log('条码类型：' + res.scanType);
				        console.log('条码内容：' + res.result);
						uni.navigateTo({
							url: res.result
						})
				    }
				});
			},
			qrR(e){
				console.log(e);
			},
			async recharge(){
				if (!this.memberInfo) {
					url = '/pages/public/register';
				}
				let that = this
				let result = await this.$http.buyVip()
				let data = result.data;
				uni.requestPayment({ 
					appId: data.appid,
					timeStamp: data.timeStamp,
					nonceStr: data.nonceStr,
					package: data.package,
					signType: data.signType,
					paySign: data.paySign,
					success: async function(res) {
						console.log(res)
						that.$api.msg('成功开通')
						let memberInfo = await that.$api.getMemberInfo();
						that.memberInfo = memberInfo.data
					},
					fail: function(err) {
						console.log(err)
					}
				});
			},
		}
	};
</script>
<style lang="scss">
	.shareButton {
		padding: 0;
		margin: 0;
		border-radius: 0;
		background-color: transparent;
		text-align: left;
		height: auto;
	}

	.shareButton::after {
		border: 0rpx;
	}

	%flex-center {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	%section {
		display: flex;
		justify-content: space-around;
		align-content: center;
		background: #fff;
		border-radius: 5upx;
	}

	page {
		background: #f5f5f5;
		height: 100%;
	}

	.user-section {
		margin: 43upx 30upx 20upx;
		position: relative;
		background: transparent
	}

	.bg {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		// filter: blur(1px);
		z-index: 0;
		// height: 200px;
	}

	.user-info-box {
		// height: 150upx;
		display: flex;
		align-items: center;
		position: relative;
		z-index: 2;
		.info-box{
			display: flex;
			flex-direction: column;
		}
		.portrait {
			width: 154upx;
			height: 154upx;
			border: 6upx solid rgba($color: #fff, $alpha: 0.3);
			border-radius: 50%;
		}
		.vip {
			width: 110upx;
			height: 110upx;
			position: absolute;
			top: -60upx;
			left: 25upx;
		}
		.username {
			font-size: 36upx;
			color: white;
			margin-left: 24upx;
		}
		.inviteCode{
			font-size: 36upx;
			color: #000;
			margin-left: 24upx;
			margin-top: 32upx;
		}
		.login {
			font-size: $font-lg + 6upx;
			color: #fff;
			margin-left: 20upx;
		}
		.bindPhone{
			background-color: #1DC7AC;
			border-radius: 20upx;
			padding: 20upx;
			font-size: 28upx;
			position: absolute;
			right: 0;
			top: 35upx;
			color: #fff;
		}
	}

	.vip-card-box {
		display: flex;
		flex-direction: column;
		color: #f7d680;
		height: 100upx;
		background: linear-gradient(left, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8));
		border-radius: 16upx 16upx 0 0;
		overflow: hidden;
		position: relative;
		padding: 20upx 24upx;

		.card-bg {
			position: absolute;
			top: 20upx;
			right: 0;
			width: 380upx;
			height: 260upx;
		}

		.b-btn {
			position: absolute;
			right: 20upx;
			top: 30upx;
			width: 132upx;
			height: 40upx;
			text-align: center;
			line-height: 40upx;
			font-size: 22upx;
			color: #36343c;
			border-radius: 20px;
			background: linear-gradient(left, #f9e6af, #ffd465);
			z-index: 1;
		}

		.tit {
			font-size: $font-base + 2upx;
			color: #f7d680;
			margin-bottom: 28upx;

			.yticon {
				color: #f6e5a3;
				margin-right: 16upx;
			}
		}

		.e-b {
			font-size: $font-sm;
			color: #d8cba9;
			margin-top: 10upx;
		}
	}

	.cover-container {
		background: #f5f5f5;
		padding: 0 30upx;
		position: relative;
		padding-bottom: 20upx;

		.arc {
			position: absolute;
			left: 0;
			top: -34upx;
			width: 100%;
			height: 36upx;
		}
	}

	// .tj-sction {
	// 	padding: 32upx 48upx;
	// 	height: 248upx;
	// 	margin-top: 32upx;
	// 	background-color: #fff;
	// 	border-radius: 24upx;
	// 	.tj-title{
	// 		font-size: 30upx;
	// 		font-weight: bold;
	// 	}
	// 	.tj-content{
	// 		margin: 28upx 0 20upx;
	// 		text-align: center;
	// 		letter-spacing:4upx;
	// 	}
		
	// }
	.tj-sction {
		@extend %section;

		.tj-item {
			@extend %flex-center;
			flex-direction: column;
			height: 140upx;
			font-size: $font-sm;
			color: #75787d;
		}

		.num {
			font-size: $font-lg;
			color: $font-color-dark;
			margin-bottom: 8upx;
		}
	}
	.leader-section{
		padding: 30upx;
		background-color: #fff;
		border-radius: 24upx;
		margin-top: 24upx;
		.default-leader{
			margin-left: 24upx;
			margin-top: 24upx;
			.leader-top{
				display: flex;
				align-items: center;
			}
			.leader-img{
				flex: 1.5;
				image{
					width: 80upx;
					height: 80upx;
					border-radius: 80upx;
				}
			}
			.leader-name{
				flex: 5.5;
				margin-left: 10upx;
				font-size: 28upx;
				font-weight: bold;
			}
			.leader-btn{
				flex: 3;
				width: 150upx;
				height: 60upx;
				border-radius: 60upx;
				font-size: 30upx;
				text-align: center;
				line-height: 60upx;
				color: #fff;
				background-color: #1DC7AC;
			}
			.leader-mid{
				margin-top: 24upx;
				font-size: 30upx;
			}
		}
	}
	
	.order-container {
		background-color: white;
		border-radius: 24upx;
		padding: 28upx 0;
		margin-top: 20upx;

		.tit {
			color: #F2DE5A;
			font-size: 14px;
			line-height: 46rpx;
			padding: 0 0 40rpx 30rpx;
			display: flex;
			justify-content: flex-start;

			.yticon {
				font-size: 46upx;
				margin-right: 20upx;
				color: #F2DE5A;
			}

			.text {
				line-height: 46rpx;
			}
		}
	}

	.order-section {
		@extend %section;
		margin-top: 30rpx;

		.order-item {
			position: relative;
			@extend %flex-center;
			width: 120upx;
			// height: 120upx;
			border-radius: 5upx;
			font-size: $font-sm;
			color: $font-color-dark;

			.tip {
				position: absolute;
				right: 10rpx;
				top: -5rpx;
				background-color: rgb(255,55,0);
				border: 2upx solid #fff;
				border-radius: 50%;
				width: 35rpx;
				height: 35rpx;
				color: white;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}

		.yticon {
			font-size: 48upx;
			margin-bottom: 18upx;
			color: #fa436a;
		}

		.icon-shouhoutuikuan {
			font-size: 44upx;
		}
	}

	.history-section {
		// padding: 30upx 0 0;
		margin-top: 24upx;
		background: #fff;
		border-radius: 10upx;
		// margin-bottom: 100upx;

		.sec-header {
			padding: 0 18upx;
			display: flex;
			align-items: center;
			font-size: $font-base;
			color: $font-color-dark;
			line-height: 40upx;
			margin-left: 30upx;

			.yticon {
				font-size: 44upx;
				color: #5eba8f;
				margin-right: 16upx;
				line-height: 40upx;
			}
		}

		.h-list {
			white-space: nowrap;
			padding: 30upx 30upx 0;

			image {
				display: inline-block;
				width: 160upx;
				height: 160upx;
				margin-right: 20upx;
				border-radius: 10upx;
			}
		}
	}
	.button{
		background-color: white;
		&::after{
			border: none;
		}
		}
	.code-section{
		@extend %section;
		flex-direction: column;
		position: relative;
		padding-bottom: 20upx;
		margin-top: 32upx;
		border-radius: 24upx;
		.code-title{
			color: rgb(51,51,51);
			font-size: $font-base;
			text-align: center;
			margin-top: 30upx;
		}
		.code-img{
			@extend %flex-center;
			margin-top: 30upx;
			image{
				width: 240upx;
				height: 240upx;
			}
		}
		.touxiang {
			position: absolute;
			top: 48%;
			left: 43%;
			width: 100upx;
			height: 100upx;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: #fff;
			border-radius: 10upx;
			image {
				width: 90upx;
				height: 90upx;
				border-radius: 10upx;
			}
		}
	}
	.code-section::before {
	   display: table;
	   content: "";
	}
	.tip-mask{
		height: 100vh;
		width: 100%;
		background-color: rgba($color: #000000, $alpha: 0.4);
		display: flex;
		position: fixed;
		top: 0;
		left: 0;
		justify-content: center;
		align-items: center;
		z-index: 99;
	}
	.tip-section{
		width: 600upx;
		background-color: #fff;
		border-radius: 24upx;
		padding: 40upx;
		.tip-text{
			font-size: 30upx;
		}
		.tip-btn{
			width: 100%;
			height: 80upx;
			background-color: #1DC7AC;
			color: #fff;
			font-size: 28upx;
			text-align: center;
			line-height: 80upx;
			margin-top: 40upx;
			border-radius: 80upx;
		}
	}
</style>
