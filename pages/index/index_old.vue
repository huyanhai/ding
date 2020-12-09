<template>
	<view>
			<!-- <scroll-view scroll-y="true" style="z-index: -1;height:100vh" @scrolltolower="loadProductData"> -->
					<view style="width: 100%;border-radius: 0 0 8% 8%;" :style="'height:'+(420)+'rpx;background-color:'+titleNViewBackground">
						<image :style="'margin-top: '+(height+40)+'rpx'" style="width: 116upx;height: 82upx;margin-left: 24upx;" src="../../static/title.png" mode=""></image>
						<view class="user-section" :style="'top: '+(height+100)+'rpx'">
							<!-- <view class="portrait">
								<image src="/static/location.png" mode="" @click="getLocation"></image>
							</view> -->
							<!-- <view class="user-info" @click="toggleLeaderMask">
								<view class="nickname ui-nowrap">
									{{defaultLeader.storeName||'请选择店铺'}}
								</view>
								<view class="icon">
									<image :style="showLeader==true?'animation:turndown 0.2s ease-in 1;transform:rotate(-90deg)':'animation:turnup 0.2s ease-in 1;transform:rotate(0deg)'" src="../../static/page_turning_left.png" mode=""></image>
								</view>
							</view> -->
							<view class="search" @click="goSerch">
								<image style="width: 15px;height: 15px;position: absolute;left:10%;top: 25%;" src='../../static/search.png'></image>
								<view class="serchInput">搜索商品</view>
							</view>
							<view class="nearby" @click="shareEvn()">
								<image src="/static/share.png" mode=""></image>
								分享
							</view>
						</view>
						<!-- 头部轮播 -->
						<view class="carousel-section" v-if="bannerList.length>0">
							<!-- #ifdef H5 -->
							<!-- 标题栏和状态栏占位符 -->
							<view class="titleNview-placing"></view>
							<!-- 背景色区域 -->
							<!-- <view class="titleNview-background" :style="{backgroundColor:titleNViewBackground,height:(350+76)+'upx'}"></view> -->
							<!-- #endif-->
							<!-- #ifdef MP -->
							<!-- 背景色区域 -->
							<!-- <view class="titleNview-background" :style="{backgroundColor:titleNViewBackground}"></view> -->
							<!-- #endif-->
							<!-- #ifdef APP-PLUS -->
							<!-- 背景色区域 -->
							<!-- <view class="titleNview-background" :style="{backgroundColor:titleNViewBackground,height:(350+statusBarHeight)+'upx'}"></view> -->
							<!-- #endif-->
							<swiper class="carousel" circular @change="swiperChange" autoplay="true" interval="3000">
								<swiper-item  v-for="(item, index) in bannerList" :key="index" class="carousel-item" >
									<image :src="item.pic" @click="toAdvertising(item,index)"/>
								</swiper-item>
							</swiper>
							<!-- 自定义swiper指示器 -->
							<view class="swiper-dots" >
								<text class="num">{{ swiperCurrent + 1 }}</text>
								<text class="sign">/</text>
								<text class="num">{{ swiperLength }}</text>
							</view>
						</view>
					</view>
					<!-- <view style="width: 100%;border-radius: 0 0 100% 100%;" :style="'height:'+(height+60)+'rpx;background-color:'+titleNViewBackground">
						
					</view> -->
					<view class="cate-section" style="margin-top: 180upx;">
						<view class="cate-item" v-for="(item,index) in cateList" @click="navToCategory(item)">
							<image :src="item.icon"></image>
							<text>{{item.name}}</text>
						</view>
					</view>
					<!-- 秒杀楼层 -->
					<view class="seckill-section m-t" v-if="spikeList.length>0">
						<view style="border-radius: 20upx;">
							<view class="s-header">
								<view class="start">
									<image style="width: 85upx;height: 74upx;" src="../../static/text.png" mode=""></image>
								</view>
								<!-- <view class="line">
									
								</view> -->
								<view class="mid">
									<!-- <text class="tip">剩余</text>
									<text class="timer">{{ endTimeString || '00:00:00'}}</text> -->
									<view class="mid-item" v-for="(item,index) in spikeList" @click="changeFlash(index)">
										<image v-if="currentSkillIndex==index" style="width: 120upx;height: 116upx;z-index: 2;" src="../../static/skill-jiaohu.png" mode=""></image>
										<view style="position: absolute;top: 0;width:120upx;height: 98upx;display: flex;justify-content: center;text-align:center;flex-direction: column;z-index: 2;">
											<view class="" style="font-size: 36upx;font-weight: bold;">
												{{item.startTime.split(':')[0]+':'+item.startTime.split(':')[1]}}
											</view>
											<view class="" style="font-size: 24upx;margin-top: 6upx;">
												{{item.type==0?'已过期':(item.type==1?'疯抢中':'未开抢')}}
											</view>
										</view>
									</view>
								</view>
								<view class="end">
									<!-- <text class="text" @click="navTo('../skillProduct/skillProduct')">
										更多
									</text> -->
									<!-- <view class="icon">
										<text class="icon-text">></text>
									</view> -->
									
								</view>
							</view>
							<!-- <scroll-view scroll-x="true" style="display: flex;width: 100%;">
								<view class="s-box">
									<view class="floor-item" v-if="spikeList[currentSkillIndex].productList.length>0" v-for="item in spikeList[currentSkillIndex].productList" @click="navToDetailPage(item)">
										<image :src="item.pic" mode="aspectFill"></image>
										<view class="none-tip" v-if="item.flashPromotionCount<=0">
											抢光了
										</view>
										<view class="title ui-nowrap">
											{{ item.name }} {{item.attr||''}}
										</view>
										<view class="price-box">
											<view class="price">
												￥{{ item.flashPromotionPrice||0 }}
											</view>
											<view class="dis-price">
												￥{{ item.price||0 }}
											</view>
										</view>
										<view class="bottom">
											<view class="btn" :class="spikeList[currentSkillIndex].type==0?'btn-gray':(spikeList[currentSkillIndex].type==1?(item.flashPromotionCount>0?'btn-normal':'btn-gray'):'btn-gray')">
												{{spikeList[currentSkillIndex].type==0?'已过期':(spikeList[currentSkillIndex].type==1?(item.flashPromotionCount>0?'马上抢':'抢光了'):'未开抢')}}
											</view>
										</view>
									</view>
								</view>
							</scroll-view> -->
							<view class="s-box">
								<swiper v-if="spikeList[currentSkillIndex].productList.length>0" :current='skillSwiperCurrent' @change="skillSwiperChange" :autoplay="true" interval="3000" circular style="width: 100%;height: 100%;">
									<swiper-item class="skill-item" v-for="item in spikeList[currentSkillIndex].productList" @click="navToDetailPage(item)">
										<view class="skill-img">
											<image :src="item.pic" mode="aspectFill"></image>
											<view class="none-tip" v-if="item.flashPromotionCount<=0">
												抢光了
											</view>
										</view>
										<view class="skill-content">
											<view class="s-name">
												{{ item.name }} {{item.attr||''}}
											</view>
											<view class="s-number">
												 <view class="">
												 </view>
												 <view style="font-size: 24upx;">
												 	剩余<text>{{item.flashPromotionCount}}</text>份
												 </view>
											</view>
											<view class="dis-price">
												原价：{{ item.price||0 }}/份
											</view>
											<view class="s-bottom">
												<view class="price">￥<text style="font-size: 32upx;color: rgb(223,46,38);">{{ item.flashPromotionPrice||0 }}</text></view>
												<view class="btn" :class="spikeList[currentSkillIndex].type==0?'btn-gray':(spikeList[currentSkillIndex].type==1?(item.flashPromotionCount>0?'btn-normal':'btn-gray'):'btn-gray')">
													{{spikeList[currentSkillIndex].type==0?'已过期':(spikeList[currentSkillIndex].type==1?(item.flashPromotionCount>0?'马上抢':'抢光了'):'未开抢')}}
												</view>
											</view>
										</view>
									</swiper-item>
								</swiper>
								<view v-else style="width: 100%;height: 100%;">
									<image style="width: 100%;height: 100%;" src="../../static/skillwithout.jpg" mode=""></image>
								</view>
								<view v-if="spikeList[currentSkillIndex].productList.length>0" class="skill-swiper-dots">
									<text class="num">{{ skillSwiperCurrent + 1 }}</text>
									<text class="sign">/</text>
									<text class="num">{{ skillSwiperLength }}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="" v-if="newProductList.length">
						<view class="f-header">
							<view class="tit-box">
								<text class="tit">新品推荐</text>
								<view class="box">
									New
								</view>
							</view>
							<!-- <text style="font-size: 28upx;color: #999;">更多>></text> -->
						</view>
						<view>
							<view>
								<wfalls3 ref='newProductList' :list='newProductList' @eventAdd="add"></wfalls3>
							</view>
						</view>
					</view>
					<view class="" v-if="hotProductList.length">
						<view class="f-header">
							<view class="tit-box">
								<text class="tit">爆款推荐</text>
								<view class="box">
									Optimization
								</view>
							</view>
							<!-- <text style="font-size: 28upx;color: #999;">更多>></text> -->
						</view>
						<view>
							<view>
								<wfalls3 ref='hotProductList' :list='hotProductList' @eventAdd="add"></wfalls3>
							</view>
						</view>
					</view>
					<view class="Recommends" v-if="allProductList.length">
						<view class="flexcenter">
							<view class="flexcenter aligncenter" style="height: 50rpx;">
								<view class="dot bgcolor19"></view>
								<view class="dot bgcolor20"></view>
								<view class="dot bgcolor21"></view>
							</view>
							<view class="flexcenter aligncenter marginlr10 mb20">
								<view class="font12 fontB">所有商品</view>
								<view class="font12 fontB ml10" style="color: #B0472A;">all product</view>
							</view>
							<view class="flexcenter aligncenter" style="height: 50rpx;">
								<view class="dot bgcolor21"></view>
								<view class="dot bgcolor20"></view>
								<view class="dot bgcolor19"></view>
							</view>
						</view>
						<view>
							<view v-if="allProductList.length" class="list-containers">
								<wfalls3 ref='allProduct' :list='allProductList' @eventAdd="add"></wfalls3>
							</view>
						</view>
					</view>
					<uni-load-more :status="loadingType"></uni-load-more>
			<!-- </scroll-view> -->
			<view class="content" v-if="tabCurrentIndex==1">
				<drag image="/static/cart.svg" navIndex='/pages/cart/cart' :number='number'></drag>
			</view>
			<view v-if="scrollTopState" class="scroll-top" :class="scrollTopState==='first'?'':(scrollTopState===true?'scroll-top-show':'scroll-top-hide')" @click="goToTop">
				返回顶部
			</view>
			<view class="order-info" :class="orderInfoState==1?'':(orderInfoState==2?'order-info-show':'order-info-hide')">
				<view class="order-info-img">
					<image :src="memberInfo.headPicture" mode=""></image>
				</view>
				<view class="order-info-title ui-nowrap">
					最新订单来自{{memberInfo.nickname}}
				</view>
				<view class="order-info-time">
					，26秒前
				</view>
			</view>
			<view>
				<view class="mask show" v-if='couponList.length>0&&couponShow'>
					<view class="mask-content" style="position: relative;">
						<!-- 优惠券页面，仿mt -->
						<!-- <view class="textcenter font12 fontcolor4 mbt10">点击领取优惠券</view> -->
						<scroll-view scroll-y="true" style="height: 530upx;margin-top: 340upx;">
							<!-- 优惠券页面，仿mt -->
							<view class="coupon-item" v-for="(item,index) in couponList" :key="index">
								<view style="display: flex;background: #fff;border-radius: 12upx;">
									<view class="con">
										<view class="top">
											<view class="title">
												<text class="tag">{{item.useType==0?'全场通用':(item.useType==0?'指定分类':'指定商品')}}</text>
												<text style="margin-left: 15upx;">{{item.name}}</text>
											</view>
											<text class="time">{{/\d{4}-\d{1,2}-\d{1,2}/g.exec(item.startTime)+'~'+/\d{4}-\d{1,2}-\d{1,2}/g.exec(item.endTime)}}</text>
										</view>
										<view class="bottom">
											<text class="tips">详细信息</text>
											<image style="width: 40upx;height: 40upx;" :src="item.showDetail==true?'../../static/up.png':'../../static/down.png'" mode="" @click="showDetail(item)"></image>
										</view>
										
										<view class="circle t"></view>
										<view class="circle r"></view>
									</view>
									<view class="right enable">
										<text class="price">{{item.amount}}</text>
										<text style="color: #fff;">满{{item.minPoint}}元可用</text>
										<view class="getBtn" @click="getCoupon(item)">
											立即领取
										</view>
									</view>
								</view>
								<view class="detail" v-if="item.showDetail==true">
									{{item.coupon.note||'暂无'}}
								</view>
							</view>
						</scroll-view>
						<view style="position: absolute;bottom: -10upx;z-index: 11;">
							<image src="../../static/bottom.png"  style="width: 582upx;height: 115upx;" @click="closeCoupon"></image>
						</view>
					</view>
					<view style="margin-top: 20upx;">
						<image src="../../static/close2.png"  style="width: 60upx;height: 60upx;" @click="closeCoupon"></image>
					</view>
				</view>
			</view>
			<view class="gift-mask" v-if="giftShow">
				<view class="gift-content" :style="giftBackImg[giftState]">
					<image class="gift-close-btn" @click="closeGift" style="width: 60upx;height: 60upx;" src="../../static/close.png" mode=""></image>
					<view class="gift-desc" v-if="giftState==0">
						神秘大礼来袭~
					</view>
					<view class="gift-success" v-if="giftState == 1">
						<view class="success-title">
							获得一个免费礼包
						</view>
						<view class="success-desc">
							礼包可以兑换超值商品
						</view>
						<view class="success-btn" @click="navToGift">
							查看礼包
						</view>
					</view>
					<view class="gift-fail" v-if="giftState == 2">
						<view class="portrait">
							<image :src="'../../static/missing-face.png'||giftPortrait" mode=""></image>
						</view>
						<view class="nickname">
							{{giftNickname}}发的礼包
						</view>
						<view class="fail-text">
							该礼包已被领取~
						</view>
					</view>
					<view class="gift-title" v-if="giftState==0">
						好友赠送了一个礼包给你，快拆开看看吧！
					</view>
					<view class="gift-btn" @click="receiveGift" v-if="giftState==0">
						
					</view>
				</view>
			</view>
			<view class="firstTips padding1" v-if='next' @touchmove.stop="touchmoveStop">
				<view class="flexend" style="margin-top: 50%;"> 
					<view class="fontcolor4 font12" >
						向上滑动浏览全部商品
					</view>
					<view>
						<image src="../../static/rightSlide.svg" style="width: 100rpx;height: 50rpx;"></image>
					</view>
				</view>
				<view class="textcenter" style="position: absolute;bottom: 250rpx;left: 50%;width: 400rpx;margin-left: -200rpx;">
					<view class="fontcolor4 font12" >
						向上滑动浏览本周推荐商品
					</view>
					<view>
						<image src="../../static/bottomSlide.svg" style="width: 50rpx;height: 100rpx;"></image>
					</view>
				</view>
				<view class="textcenter fontcolor4 font30 mbt20" style="position: absolute;bottom: 150rpx;left: 50%;width: 300rpx;margin-left: -150rpx;"  @click="closeTip">×</view>
			</view>
			<!-- <share ref="share" :contentHeight="580" :shareList="shareList"></share> -->
			<!-- <view v-if="showLeader" @click="toggleLeaderMask" @touchmove.stop.prevent="touchmoveStop" class="leader-mask"
				:style="{backgroundColor: backgroundColor}"
			>
				<view 
					class="leader-mask-contents"
					:class="showLeader?'open':'hide'"
				>
					<view class="selectPos">
						<view class="title">
							当前位置
						</view>
						<view class="info" @click.stop="getLocation()">
							<view class="left">
								{{addressName}}
							</view>
							<view class="right">
								修改<text class="cell-more yticon icon-you"></text>
							</view>
						</view>
					</view>
					<scroll-view class="leader-list" scroll-y>
						<view v-if="leaderList.length>0" class="leader-item" :class="defaultLeader.id==item.id?'active':''" v-for="(item,index) in leaderList" @click.stop.prevent="touchmoveStop" @click="setDefaultLeader(item)">
							<view class="leader-image">
								<image :src="item.icon" mode=""></image>
							</view>
							<view class="leader-info">
								<view class="top">
									<view class="leader-name ui-nowrap">
										{{item.storeName}}
									</view>
									<view class="leader-dis">
										距您{{item.distance}}KM
									</view>
								</view>
								<view class="position">
									{{item.region}}
								</view>
							</view>
						</view>
						<view v-if="leaderList.length<=0"  style="height:140upx;text-align: center;font-size: 32upx;color: #999;line-height: 140upx;">
							{{leaderMessage}}
						</view>
					</scroll-view>
				</view>
			</view> -->
			<!-- 分享弹窗-->
			<view class="share-pro" >
				<view class="share-pro-mask" v-if="deliveryFlag" @tap="closeShareEvn"></view>
				<view class="share-pro-dialog" :class="deliveryFlag?'open':'close'" >
					<view class="close-btn" @tap="closeShareEvn">
						<span class="font_family">&#xe6e6;</span>
					</view>
					<view class="share-pro-title">分享</view>
					<view class="share-pro-body">
						<view class="share-item">
							<button open-type="share">
								<view class="font_family share-icon">&#xe6fa;</view>
								<view >分享给好友</view>
							</button>
						</view>
						<view class="share-item" @tap="createCanvasImageEvn">
							<view class="font_family share-icon">&#xe6f9;</view>
							<view >生成分享图片</view>
						</view>
					</view>
				</view>
			</view>
			<hchPoster ref="hchPoster" :canvasFlag.sync="canvasFlag" @cancel="canvasCancel" :posterObj.sync="posterData"/>
			<view :hidden="canvasFlag"><!-- 海报 要放外面放组件里面 会找不到 canvas-->
				<canvas class="canvas"  canvas-id="myCanvas" ></canvas><!-- 海报 -->
			</view>
				<darke-cartsBall ref="cartsBall"
				    :ballImage="'url('+require('@/static/repay.png')+')'" 
				    :duration="ballTimer" 
				    :endPos="endPos"
				    :is3dSheet="true"
				    zIndex="9999"
				    ballColor="red"
				>
				</darke-cartsBall>
			</view>
		</view>
	</view>
</template>

<script>
	import wfalls3 from 'components/wfalls-flow/wfalls-flow7'
	import drag from 'components/drag-ball/drag-ball.vue'
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import amap from '../../common/amap-wx.js';
	import darkeCartsBall from '@/components/darke-cartsBall/darke-cartsBall.vue'
	import hchPoster from '@/components/hch-poster/hch-poster.vue';
	import {
		mapState,
		mapMutations,
	} from 'vuex';

	export default {
		components: {
			wfalls3,
			drag,
			uniLoadMore,
			darkeCartsBall,
			hchPoster
		},
		data() {
			return {
				next:false,
				maskState: 1,
				firstLogin:false,
				tabCurrentIndex: 0, //当前页面下标(初始为 0 )
				height: null, //获取的状态栏高度
				titleNViewBackground: '',
				background:[],
				statusBarHeight: '',
				swiperCurrent: 0,
				swiperLength: 0,
				skillSwiperCurrent:0,
				skillSwiperLength:4,
				bannerList: [],
				spikeList: [], //秒杀
				currentSkillIndex:0,
				goodsList: [],
				brandList: [], //品牌
				hotProductList: [], //热门推荐
				homeFlashPromotion: [], //限时秒杀
				cateList:[],
				tablist:[],
				tabProduct:[],
				defaultLeader:'',
				newProductList: [], //新品推荐
				allProductList: [], //猜你喜欢
				windowHeight: 0,
				imgHeight:0,
				number:0,
				windowBottom:0,
				containerHeight:0,
				start: [0, 0],
				moveY: 9999,
				moveX: 9999,
				isFirst: true,
				old: [0, 0],
				couponList:[],
				couponShow:false,
				token:'',
				memberInfo:'',
				transform: 'translateY(50vh)',
				timer: 0,
				backgroundColor: 'rgba(0,0,0,0)',
				showLeader: false,
				config: {},
				leaderId:null,
				posterShow: false,
				loadingType:'more',
				pageNum:1,
				leaderList:[],
				leaderMessage:'',
				amapPlugin: null,  
				key: 'd52befc87beb8ce929d2eaa887e488ad',
				addressName: '',
				curLocation:'',
				endTimeString:'00:00:00',
				giftShow: false,
				giftState: 0,
				giftBackImg:[
					'background-image: url("http://bbcfqn.zuizhezhi.com/FhPxYZlf6fDjQ1_i_U9cAbxAAqdu");',
					'background-image: url("http://bbcfqn.zuizhezhi.com/FmI6aunUQr_dfGggQrOHuTXxF9qp")',
					'background-image: url("http://bbcfqn.zuizhezhi.com/Fi018awWf9YGEBKuoiUObSxcRjpQ")'
				],
				giftId:'',
				giftPortrait:'',
				giftNickname:'',
				endPos:{x:0,y:0},
				ballTimer:800,
				deliveryFlag: false,
				canvasFlag: true,
				canvasFlags:false,
				posterData:{},
				advbackground:['rgb(232,186,124)','rgb(255,162,48)','rgb(248,207,67)','rgb(162,205,63)'],
				scrollTopState:'first',
				orderInfoState:1,
				orderInfoTimer:''
			};
		},
		computed: {
			...mapState(['hasLogin', 'loginStatus', "flag", "phone",]),
		},
		watch: {
		},
		async onPullDownRefresh(){
			this.loadProductData('reLoad')
			this.loadData()
			this.token = uni.getStorageSync("token")
			if(this.token!=''){
				let memberInfo = await this.$api.getMemberInfo();
				this.memberInfo = memberInfo.data;
				if (this.giftId) {
					this.giftState = 0;
					this.giftShow = true;
				}
				// this.$http.defaultLeader().then(res=>{
				// 	if(res.code==200){
				// 		if(!res.data){
				// 		}
				// 		this.defaultLeader = res.data
				// 	}else {
				// 		this.$api.msg(res.message)
				// 	}
				// })
				let result = await this.$http.getCartList();
				if (result.code == 200) {
					let number = 0
					let list = result.data
					for(let item of list){
						number+=item.quantity
					}
					this.number = number
					if(this.number>0){
						uni.setTabBarBadge({
							index:2,
							text:this.number.toString(),
						})
					}
				} else {
					this.$api.msg(result.message)
				}
			}
		},
		onReachBottom(){
			console.log('上拉刷新');
			this.loadProductData();
		},
		async onLoad(option) {
			this.checkUpdate();
			if (option['scene']) {
				this.$store.commit("setShareMember", option['scene']);
			}
			if (option['_q']) {
				this.$store.commit("setShareMember", option['_q']);
			}
			if (option['giftId']) {
				this.giftState = 0;
				this.giftId=option['giftId'];
				this.giftPortrait = option['portrait'];
				this.giftNickname = option['nickname'];
			}
			let that = this
			this.loadProductData('reLoad')
			uni.login({
				async success(res) {
					if (res.code) {
						let result = await that.$http.login({code:res.code});
						if(result.code==200){
							uni.setStorageSync('token', result.data.token);
							uni.setStorageSync('tokenHead', result.data.tokenHead);
							that.token=uni.getStorageSync('token')
							let memberInfo = await that.$api.getMemberInfo();
							that.memberInfo = memberInfo.data;
							// if(that.memberInfo.store!=0){
							// 	uni.showModal({
							// 		title:"未绑定银行卡",
							// 		content:"团长需要绑定银行卡才能获得提成哦，去绑定~",
							// 		success(res){
							// 			res.confirm && uni.navigateTo({
							// 				url:"/pages/user/bankList"
							// 			})
							// 		}
							// 	})
							// }
							// that.getCouponList();
							// that.$http.defaultLeader().then(res=>{
							// 	if(res.code==200){
							// 		if(!res.data){
							// 		}
							// 		that.defaultLeader = res.data
							// 	}else {
							// 		that.$api.msg(res.message)
							// 	}
							// })
							let res = await that.$http.getCartList();
							if (res.code == 200) {
								let number = 0
								let list = res.data
								for(let item of list){
									number+=item.quantity
								}
								that.number = number
								if(that.number>0){
									uni.setTabBarBadge({
										index:2,
										text:that.number.toString(),
									})
								}
							} else {
								that.$api.msg(res.message)
							}
							if (option['giftId']) {
								that.giftShow = true;
							}
						}else {
							console.log('登录失败！' + res.errMsg)
						}
					} 
				}
			})
			const height = uni.upx2px(this.contentHeight) + 'px';
			this.config = {
				height: height,
				transform: `translateY(${height})`,
				backgroundColor: 'rgba(0,0,0,.4)',
			}
			this.transform = this.config.transform;
		},
		async onShow() {
			var _this = this;
			// 获取手机状态栏高度
			uni.getSystemInfo({
				success: function(data) {
					// 将其赋值给this
					_this.height = data.statusBarHeight;
					_this.windowHeight = data.windowHeight
					_this.imgHeight = data.windowWidth * 1320/990
					_this.containerHeight = data.windowWidth * 1320/990 - 10
					_this.windowBottom = data.windowBottom
					_this.statusBarHeight = data.statusBarHeight+50;
					_this.endPos = {x:data.windowWidth*0.6,y:data.windowHeight}
				},
				fail:function(res){
					console.log(res)
				}
			})
			this.loadData()
			this.token = uni.getStorageSync("token")
			if(this.token!=''){
				let memberInfo = await this.$api.getMemberInfo();
				this.memberInfo = memberInfo.data;
				if (this.giftId) {
					this.giftState = 0;
					this.giftShow = true;
				}
				// this.$http.defaultLeader().then(res=>{
				// 	if(res.code==200){
				// 		if(!res.data){
				// 		}
				// 		this.defaultLeader = res.data
				// 	}else {
				// 		this.$api.msg(res.message)
				// 	}
				// })
				let result = await this.$http.getCartList();
				if (result.code == 200) {
					let number = 0
					let list = result.data
					for(let item of list){
						number+=item.quantity
					}
					this.number = number
					if(this.number>0){
						uni.setTabBarBadge({
							index:2,
							text:this.number.toString(),
						})
					}
				} else {
					this.$api.msg(result.message)
				}
			}
			// setTimeout(()=>{
			// 	this.orderInfoState = 3;
			// 	setTimeout(()=>{
			// 		this.orderInfoState = 1;
			// 	},2000)
			// },3000)
			// this.orderInfoTimer=setInterval(()=>{
			// 	this.orderInfoState = 2;
			// 	setTimeout(()=>{
			// 		this.orderInfoState = 3;
			// 		setTimeout(()=>{
			// 			this.orderInfoState = 1;
			// 		},2000)
			// 	},3000)
			// },6000)
		},
		onHide() {
			// clearInterval(this.orderInfoTimer)
		},
		//监听页面滚动
		onPageScroll(res){
			if(res.scrollTop>=200&&this.scrollTopState!=true){
				this.scrollTopState=true;
			}else if(res.scrollTop<=50&&this.scrollTopState==true){
				this.scrollTopState=false;
			}
		},
		methods: {
			goToTop(){
				if(this.scrollTopState==true){
					uni.pageScrollTo({
					    scrollTop: 0,
					    duration: 300
					});
				}
			},
			async add(data){
				let options = {
					skuId:data.skuId,
					quantity:1
				}
				let result = await this.$http.cartAdd(options);
				if (result.code == 200) {
					this.ballTimer = (this.endPos.y/data.top)*200
					this.$refs.cartsBall.drop({
					    x: data.left, y:data.top
					})
					let res = await this.$http.getCartList();
					if (res.code == 200) {
						let number = 0
						let list = res.data
						for(let item of list){
							number+=item.quantity
						}
						this.number = number
						if(this.number>0){
							uni.setTabBarBadge({
								index:2,
								text:this.number.toString(),
							})
						}
					} else {
						this.$api.msg(res.message)
					}
				} else {
					this.$api.msg(result.message);
				}
			},
			async getCouponList(){
				let list = await this.$http.couponCanreceive()
				let couponList = list.data;
				couponList.forEach(item=>{
					item.showDetail = false;
				})
				this.couponList = couponList
				if(this.couponList.length>0){
					this.couponShow = true
				}else{
					this.couponShow = false;
				}
			},
			async getCoupon(item){
				uni.showLoading({
					title:'领券中'
				})
				let res = await this.$http.couponAdd(item.id)
				uni.hideLoading()
				if(res.code==200){
					this.$api.msg('领券成功,快去使用吧');
					// this.getCouponList()
				}else{
					this.$api.msg(res.message)
				}
			},
			closeCoupon(){
				this.couponShow = false;
			},
			showDetail(item){
				item.showDetail = !item.showDetail
			},
			async receiveGift(){
				uni.showLoading({
					title: "领取中"
				})
				uni.hideLoading()
				let result = await this.$http.getGift({giftId:this.giftId})
				if(result.code==200){
					this.giftId = '';
					this.giftState = 1;
				}else{
					this.giftState = 2;
					this.giftId = '';
					// this.$api.msg(result.message)
				}
			},
			navToGift(){
				this.giftShow = false;
				uni.navigateTo({
					url:'/pages/gift/gift'
				})
			},
			closeGift(){
				this.giftId = '';
				this.giftShow = false;
			},
			formatDuring(mss) {
			    var hours = parseInt(mss/ (1000 * 60 * 60));
			    var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
			    var seconds = parseInt((mss % (1000 * 60)) / 1000);
				if(hours<10){
					hours = '0'+hours
				}
				if(minutes<10){
					minutes = '0'+minutes
				}
				if(seconds<10){
					seconds = '0'+seconds
				}
			    return  hours + ":" + minutes + ":" + seconds;
			},
			getLocation(){
				let that = this
				uni.chooseLocation({
				    success: function (res) {
				        console.log('位置名称：' + res.name);
				        console.log('详细地址：' + res.address);
				        console.log('纬度：' + res.latitude);
				        console.log('经度：' + res.longitude);
						that.addressName = res.name;
						that.curLocation = res;
						that.leaderMessage = ''
						that.$http.queryLeaderList({lat:res.latitude,lon:res.longitude,pageSize:10,pageNum:1}).then(data=>{
							that.leaderList = data.data.sotres
							if(that.leaderList.length<=0){
								that.leaderMessage = '你的附近没有团长。。。'
							}
							that.leaderList.forEach(e=>{
								e.distance = parseFloat(e.distance)/1000
							})
						})
				    },
					fail(e) {
						if(e.errMsg=='chooseLocation:fail auth deny'){
							wx.showModal({
							  title: '提示',
							  content: '您没有授权使用位置信息，将无法使用地图功能',
							  cancelText:'不授权',
							  cancelColor:'#999',
							  confirmText:'授权',
							  confirmColor:'#f94218',
							  success(res) {
								if (res.confirm) {
								  wx.openSetting({
									  success(res) {
										console.log(res.authSetting)
									  }
									})                                
								} else if (res.cancel) {
								  console.log('用户点击取消')
								}
							  }
							})
						}
					}
				});
			},
			// async setDefaultLeader(item){
			// 	let res = await this.$http.setDefaultLeader(item.id);
			// 	this.$api.msg(res.msg)
			// 	if(res.code==200){
			// 		this.$http.defaultLeader(this.memberInfo.userId).then(res=>{
			// 			if(res.code==200){
			// 				if(!res.data){
			// 				}
			// 				this.defaultLeader = res.data
			// 				setTimeout(()=>{
			// 					this.toggleLeaderMask()
			// 				},500)
			// 			}else {
			// 				this.$api.msg(res.message)
			// 			}
			// 		})
			// 	}
			// },
			loadNearLeader(){
				let that = this;
				uni.showLoading({
					title: '获取信息中'  
				});
				if(that.curLocation!=''){
					that.addressName = that.curLocation.name;
					that.leaderMessage = ''
					that.$http.queryLeaderList({lat:that.curLocation.latitude,lon:that.curLocation.longitude,pageSize:10,pageNum:1}).then(res=>{
						uni.hideLoading(); 
						if(res.code==200){
							that.leaderList = res.data.sotres
							if(that.leaderList.length<=0){
								that.leaderMessage = '你的附近没有团长。。。'
							}
							that.leaderList.forEach(e=>{
								e.distance = parseFloat(e.distance)/1000
							})
						}else{
							this.$api.msg(res.message)
						}
					})  
				}else{
					this.amapPlugin = new amap.AMapWX({
						key: this.key  
					});
					this.amapPlugin.getRegeo({  
						success: (data) => {   
							that.addressName = data[0].name;
							that.$http.queryLeaderList({lat:data[0].latitude,lon:data[0].longitude,pageSize:10,pageNum:1}).then(res=>{
								that.leaderList = res.data.sotres
								that.leaderList.forEach(e=>{
									e.distance = parseFloat(e.distance)/1000
								})
							})  
							uni.hideLoading();  
						},
						fail: (data)=>{
							console.log(data)
							if(data.errMsg=='getLocation:fail auth deny'){
								wx.showModal({
								  title: '提示',
								  content: '您没有授权使用位置信息，将无法使用地图功能',
								  cancelText:'不授权',
								  cancelColor:'#999',
								  confirmText:'授权',
								  confirmColor:'#f94218',
								  success(res) {
									if (res.confirm) {
									  wx.openSetting({
										  success(res) {
											console.log(res.authSetting)
										  }
										})                                
									} else if (res.cancel) {
									  console.log('用户点击取消')
									}
								  }
								})
							}
							uni.hideLoading(); 
						}
					});
				}
				
			},
			navToDetailPage(item){
				console.log(item)
				uni.navigateTo({
					url:`/pages/product/product?id=${item.id}`
				})
			},
			navToCategory(item){
				uni.setStorageSync('cateid',item.id)
				uni.switchTab({
					url:'../category/category'
				})
			},
			async loadProductData(source){
				if (this.loadingType === 'loading') {
					//防止重复加载
					return;
				}
				if (source === 'reLoad') {
					//tab切换只有第一次需要加载数据
					this.pageNum = 1
				}
				this.loadingType = 'loading';
				setTimeout(async () => {	
					let result = undefined
					let params = {
						"sortType":0,
						"pageSize": 10,
						"pageNum": this.pageNum,
					};
					// console.log('params',params)
					result = await this.$http.getProductList(params);
					if (result.code != 200) {
						return false;
					}
					let allProductList = result.data;
					// if(this.token!=''&&this.memberInfo){
					// 	let favorite = await this.$http.memberCollectionListProduct({id:this.memberInfo.memberId})
					// 	for (let item of allProductList){
					// 		item.favorite = false;
					// 		for (let i of favorite.data){
					// 			if(i.productId == item.id){
					// 				item.favorite = true
					// 			}
					// 		}
					// 	}
					// }
					if (this.pageNum === 1) { //下拉刷新
						this.allProductList = allProductList;
						uni.stopPullDownRefresh();
					} else { //加载更多
						allProductList.forEach(item => {
							this.allProductList.push(item);
						})
					}
					setTimeout(()=>{
						 this.$refs.allProduct && this.$refs.allProduct.init();
					},100)
					this.pageNum = this.pageNum + 1;
					if (result.data.length > 0) {
						//判断是否还有数据， 有改为 more， 没有改为noMore 
						this.loadingType = 'more';
					} else {
						this.loadingType = 'noMore';
					}
				}, 600);
			},
			toggleLeaderMask(){
				//防止高频点击
				if(this.timer == 1){
					return;
				}
				this.timer = 1;
				setTimeout(()=>{
					this.timer = 0;
				}, 500)
				
				if(this.showLeader){
					this.transform = this.config.transform;
					this.backgroundColor = 'rgba(0,0,0,0)';
					setTimeout(()=>{
						this.showLeader = false;
					},300)
					return;
				}
				
				this.showLeader = true;
				if(!this.memberInfo){
					uni.navigateTo({
						url:'/pages/public/register'
					})
					return;
				}
				this.loadNearLeader()
				//等待mask重绘完成执行
				setTimeout(()=>{
					this.backgroundColor = this.config.backgroundColor;
					this.transform = 'translateY(0px)';
				}, 10)
			},
			touchmoveStop(){
				console.log('阻止滚动')
			},
			closeTip(){
				this.next = false
			},
			/**
			 * 请求静态数据只是为了代码不那么乱
			 * 分次请求未作整合
			 */
			...mapMutations(['setFlag']),
			//swiper 切换
			changeTab(e) {
				this.pageNum = 1;
				this.tabCurrentIndex = e.target.current;
				this.loadData('tabChange');
			},
			goSerch() {
				//防止高频点击
				if(this.timer == 1){
					return;
				}
				this.timer = 1;
				setTimeout(()=>{
					this.timer = 0;
				}, 500)
				uni.navigateTo({
					url: '../serch/serch'
				})
			},
			getValue(url) {
				//首先获取地址
				var url = url || window.location.href;
				//获取传值
				var arr = url.split("?");
				//判断是否有传值
				if (arr.length == 1) {
					return null;
				}
				//获取get传值的个数
				var value_arr = arr[1].split("&");
				//循环生成返回的对象
				var obj = {};
				for (var i = 0; i < value_arr.length; i++) {
					var key_val = value_arr[i].split("=");
					obj[key_val[0]] = key_val[1];
				}
				return obj;
			},
			async loadData() {
				let headerList = await this.$http.header();
				console.log('headerList',headerList)
				//初始化Banner
				let bannerList = headerList.data.advertiseList;
				this.bannerList = bannerList;
				
				this.titleNViewBackground = this.advbackground[0];
				this.swiperLength = bannerList.length;
				this.cateList = headerList.data.categories;
				//热门推荐
				let hotProductList = headerList.data.hotProductList;
				//新品推荐
				let newProductList = headerList.data.newProductList;
				//猜你喜欢
				this.hotProductList = hotProductList
				this.newProductList = newProductList;
				//初始化商品
				let goodsList = await this.$api.json('goodsList');
				this.goodsList = goodsList || [];
				this.loadFlash()
			},
			changeFlash(index){
				this.currentSkillIndex = index;
				this.skillSwiperLength = this.spikeList[index].productList.length
				this.skillSwiperCurrent = 0;
			},
			async loadFlash(){
				let spikeList = await this.$http.getFlashList();
				this.spikeList = spikeList.data || [];
				try{
					this.skillSwiperLength = this.spikeList[0].productList.length;
				}catch(e){
					//TODO handle the exception
				}
				this.spikeList.forEach((item,index)=>{
					if(item.type==1){
						this.currentSkillIndex = index;
						this.skillSwiperLength = this.spikeList[index].productList.length
					}
				})
				
			},
			async loadCateData(id){
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'))
				let res = await this.$http.queryCateSecondByOne(id)
				let tlist = res.data
				let res2 = await this.$http.getCartList(userInfo.userId)
				let cartlist = res2.data;
				tlist.forEach(t=>{
					cartlist.forEach(c=>{
						console.log(t,c)
						if(t.goodsId==c.goodsId){
							t.cartId = c.id;
							t.number = c.number;
						}
					})
				})
				this.tabProduct = tlist;
			},
			// //轮播图切换修改背景色
			swiperChange(e) {
				const index = e.detail.current;
				this.swiperCurrent = index;
				let source = e.detail.source;
				if(source === 'autoplay' || source === 'touch') {
				    //根据官方 source 来进行判断swiper的change事件是通过什么来触发的，autoplay是自动轮播。touch是用户手动滑动。其他的就是未知问题。抖动问题主要由于未知问题引起的，所以做了限制，只有在自动轮播和用户主动触发才去改变current值，达到规避了抖动bug
				    // this.titleNViewBackground = this.bannerList[index].background;
				    this.titleNViewBackground = this.advbackground[index]
				    // this.titleNViewBackground = 'rgb(203, 87, 60)';
				}
			},
			skillSwiperChange(e) {
				const index = e.detail.current;
				let source = e.detail.source;
				if(source === 'autoplay' || source === 'touch') { 
				    //根据官方 source 来进行判断swiper的change事件是通过什么来触发的，autoplay是自动轮播。touch是用户手动滑动。其他的就是未知问题。抖动问题主要由于未知问题引起的，所以做了限制，只有在自动轮播和用户主动触发才去改变current值，达到规避了抖动bug
				    this.skillSwiperCurrent = index;
				}
			},
			//跳转到广告页
			toAdvertising(item,index) {
				// if(index==0){
				// 	uni.navigateTo({
				// 		url:"../product/product?id=172"
				// 	})
				// 	return;
				// }
				// if(!item.detailDesc){
				// 	return;
				// }
				// this.$store.commit("setTemp", item);
				// uni.navigateTo({
				// 	url: '/pages/advertising/advertising'
				// });
			},
			navTo(url){
				uni.navigateTo({
					url:url
				})
			},
			//分享
			onShareAppMessage() {
				return {
					"title": "丁老表",
					"path": "/pages/index/index?_q=" + this.memberInfo.inviteCode,
					"imageUrl": "http://qn.dinglaobiao.com/1605868973280.png"
				};
			},
			checkUpdate(){
				const updateManager = uni.getUpdateManager();
				
				updateManager.onCheckForUpdate(function (res) {
				  // 请求完新版本信息的回调
				  // console.log(res.hasUpdate);
				});
				
				updateManager.onUpdateReady(function (res) {
				  uni.showModal({
				    title: '更新提示',
				    content: '新版本已经准备好，是否重启应用？',
				    success(res) {
				      if (res.confirm) {
				        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
				        updateManager.applyUpdate();
				      }
				    }
				  });
				
				});
				updateManager.onUpdateFailed(function (res) {
				  // 新的版本下载失败
				});
			},
			async createCanvasImageEvn(){
				wx.showLoading({
				  title: "海报生成中..."
				})
				try{
					let code = await this.codeImg();
					Object.assign(this.posterData,
					{
						url:'../../static/hbg.jpg',//商品主图
						icon:'https://img0.zuipin.cn/mp_zuipin/poster/hch-hyj.png',//醉品价图标
						title:'',//标题
						discountPrice:'',//折后价格
						orignPrice:"",//原价
						code:code,//小程序码
						closeUrl: "https://img0.zuipin.cn/mp_zuipin/poster/close_btn.png" //关闭按钮
					})
				}catch(e){
					console.log('e',e)
				}
				
				this.$forceUpdate();//强制渲染数据
				setTimeout(()=>{
					this.canvasFlag=false;//显示canvas海报
					this.$refs.hchPoster.createCanvasImage('index',this);//调用子组件的方法
					this.deliveryFlag = false;//关闭分享弹窗
				},500)
				
				// 这个是固定写死的小程序码 end
				// 以下是根据后端接口动态生成小程序码
				// let code="https://img0.zuipin.cn/mp_zuipin/poster/hch-code.png";
				// this.codeImg().then((res)=>{
				// 	code = res;
				// 	Object.assign(this.posterData,
				// 	{
				// 		url:'https://img0.zuipin.cn/mp_zuipin/poster/hch-pro.jpg',//商品主图
				// 		icon:'https://img0.zuipin.cn/mp_zuipin/poster/hch-hyj.png',//醉品价图标
				// 		title:"诗酒茶系列 武夷大红袍 2018年 花香型中火 一级 体验装 16g",//标题
				// 		discountPrice:"250.00",//折后价格
				// 		orignPrice:"300.00",//原价
				// 		code:code,//小程序码
				// 	})
				// 	this.$forceUpdate();//强制渲染数据
				// 	setTimeout(()=>{
				// 		this.canvasFlag=false;//显示canvas海报
				// 		this.deliveryFlag = false;//关闭分享弹窗
				// 		this.$refs.hchPoster.createCanvasImage();//调用子组件的方法
				// 	},500)
				// })
				// 以下是根据后端接口动态生成小程序码 end
			},
			
			// 获取海报的小程序码
			async codeImg(){
				return new Promise(async (resolve,reject)=>{
					let option = {
						scene:this.memberInfo.inviteCode,
						page:'pages/index/index'
					}
					let res = await this.$http.getCode(option);
					if(res && res.code==200){
						const fsm = wx.getFileSystemManager();
						const FILE_BASE_NAME = 'tmp_img_src';
						let filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}.jpg`;//图片临时地址
						fsm.writeFile({
							filePath,
							data: res.data,
							encoding: 'base64',
							success() {
								resolve(filePath)
							},
							fail() {
								this.canvasFlag=true;
								uni.showToast({title:'海报生成失败',duration:2000,icon:'none'});
							},
						});
					}else{
						this.canvasFlag=true;
						uni.showToast({title:'海报生成失败',duration:2000,icon:'none'});
					}
				})
				// return new Promise((resolve,reject)=>{
				// 	wx.request({
				// 		method: 'get',
				// 		url:'http://javaXXXXX',//自己java接口
				// 		header: { 'Content-Type': 'application/x-www-form-urlencoded'},
				// 		data: {
				// 			scene:`sku=${this.sku}`,//自己的参数
				// 			page:"pages/product/detail",//想要生成小程序码的页面地址
				// 			width:"128px",//小程序码大小
				// 		},
				// 		success: res => {
				// 		  if(res.data.code==0){
				// 			if (res.data.code==0) {
				// 				const fsm = wx.getFileSystemManager();
				// 				const FILE_BASE_NAME = 'tmp_img_src';
				// 				let filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}.jpg`;//图片临时地址
				// 				fsm.writeFile({
				// 					filePath,
				// 					data: res.data.data,
				// 					encoding: 'binary',
				// 					success() {
				// 						resolve(filePath)
				// 					},
				// 					fail() {
				// 						this.canvasFlag=true;
				// 						uni.showToast({title:'海报生成失败',duration:2000,icon:'none'});
				// 					},
				// 				});
				// 			} else {
				// 				uni.showToast({title: res.data.message, icon: 'none',duration: 2000,icon:'none'})
				// 			}
				// 		  }else{
				// 			this.canvasFlag=true;
				// 			uni.showToast({title:'海报生成失败',duration:2000,icon:'none'});
				// 		  }
				// 		},
				// 		fail:res=>{
				// 		  this.canvasFlag=true;
				// 		  uni.showToast({title:'海报生成失败',duration:2000,icon:'none'});
				// 		}
				//   })
				// })
			},
			// 分享弹窗
			shareEvn() {
				this.deliveryFlag = true;
			},
			// 关闭分享弹窗
			closeShareEvn() {
				this.deliveryFlag = false;
			},
			// 取消海报
			canvasCancel(val){
				this.canvasFlag=val;
			}
		},
	};
</script>

<style lang="scss">
	.list-containers{
		background: #EFD1C6;
	}
	.content {
		display: flex;
	}

	/* #ifdef MP */
	.mp-search-box {
		position: absolute;
		left: 0;
		top: 30upx;
		z-index: 9999;
		width: 100%;
		padding: 0 80upx;

		.ser-input {
			flex: 1;
			height: 56upx;
			line-height: 56upx;
			text-align: center;
			font-size: 28upx;
			color: $font-color-base;
			border-radius: 20px;
			background: rgba(255, 255, 255, 0.6);
		}
	}

	page {
		background-color: #fff;
		.cate-section {
			position: relative;
		}
	}

	/* #endif */
	/* 分类 */
	.cate-title{
		display: flex;
		justify-content: space-around;
		margin: 30upx auto;
		padding: 0 28upx;
		.tip1{
			flex:2.5;
			font-size: 30upx;
			font-weight: bold;
		}
		.tip2{
			flex:7.5;
			font-size: $font-sm;
			line-height: 40upx;
			color: #757575;
		}
	}
	.cate-section {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		margin: 0 24upx;
		padding: 0upx 5upx;
		margin-top: 24upx;
		background: #fff;
		border-radius: 24upx;
		.cate-item {
			display: flex;
			flex-direction: column;
			width: 20%;
			margin: 24upx 0upx;
			align-items: center;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
		}
	
		/* 原图标颜色太深,不想改图了,所以加了透明度 */
		image {
			width: 96upx;
			height: 96upx;
			margin-bottom: 10upx;
		}
	}
	.all-product {
		margin: 30rpx;
		border-left: 7px solid #1DC7AC;
		padding: 5rpx 20rpx;

		.title {}
	}
	%flex-center {
		display: flex;
		justify-content: space-around;
		align-items: center;
	}
	body {
		background-color: #f5f5f5;
		padding: 0;
		margin: 0;
	}

	.m-t {
		margin-top: 16upx;
	}
	/* 头部 用户栏 */
	.user-section{
		@extend %flex-center;
		// background: #fff;
		padding: 0 28upx;
		height: 120upx;
		width: 100%;
		.portrait{
			flex: 1;
			@extend %flex-center;
			align-items: flex-start;
			flex-direction: column;
			image {
				width: 34upx;
				height: 44upx;
				// border-radius: 100%;
			}
		}
		.user-info {
			flex: 3;
			height: 70upx;
			// background-color: $base-color2;
			// border-radius: 70upx;
			@extend %flex-center;
			flex-direction: row;
			align-items: center;
			.nickname{
				flex: 8;
				font-size: 26upx;
				color: #fff;
				height: 70upx;
				line-height: 70upx;
				overflow: hidden;
			}
			.icon{
				flex: 3;
				display: flex;
				align-items: center;
				margin-left: 8upx;
				image{
					width: 40upx;
					height: 40upx;
				}
				@keyframes turndown{
				  0%{-webkit-transform:rotate(0deg);}
				  25%{-webkit-transform:rotate(-20deg);}
				  50%{-webkit-transform:rotate(-40deg);}
				  75%{-webkit-transform:rotate(-60deg);}
				  100%{-webkit-transform:rotate(-90deg);}
				}
				@keyframes turnup{
				  0%{-webkit-transform:rotate(-90deg);}
				  25%{-webkit-transform:rotate(-60deg);}
				  50%{-webkit-transform:rotate(-40deg);}
				  75%{-webkit-transform:rotate(-20deg);}
				  100%{-webkit-transform:rotate(0deg);}
				}
			}
		}
		.search{
			flex: 6.5;
			position: relative;
			margin-left: 30upx;
		}
		.share,.nearby{
			flex: 1.5;
			font-size: 20upx;
			height: 90upx;
			@extend %flex-center;
			flex-direction: column;
			align-items: flex-end;
			padding: 0;
			line-height: 0;
			background-color: transparent;
			color: #fff;
			image {
				width: 40upx;
				height: 40upx;
			}
		}
		.share::after{
			border: none;
		}
	}
	/* 头部 轮播图 */
	.carousel-section {
		width: 100%;
		position: relative;
		margin-top: 20upx;
		.titleNview-placing {
			height: var(--status-bar-height);
			padding-top: 44px;
			box-sizing: content-box;
		}

		.titleNview-background {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 300upx;
			transition: 0.4s;
		}
	}

	.carousel {
		width: 100%;
		height: 300upx;
		// background-color: #f5f5f5;
		.carousel-item {
			width: 100%;
			height: 100%;
			padding: 0 24upx;
			overflow: hidden;
		}

		image {
			width: 100%;
			height: 100%;
			border-radius: 24rpx;
		}
	}

	.swiper-dots {
		display: flex;
		position: absolute;
		left: 60upx;
		bottom: 15upx;
		width: 72upx;
		height: 36upx;
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAYAAADDhn8LAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTk4MzlBNjE0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTk4MzlBNjA0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Q0E3RUNERkE0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Q0E3RUNERkI0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4Gh5BPAAACTUlEQVR42uzcQW7jQAwFUdN306l1uWwNww5kqdsmm6/2MwtVCp8CosQtP9vg/2+/gY+DRAMBgqnjIp2PaCxCLLldpPARRIiFj1yBbMV+cHZh9PURRLQNhY8kgWyL/WDtwujjI8hoE8rKLqb5CDJaRMJHokC6yKgSCR9JAukmokIknCQJpLOIrJFwMsBJELFcKHwM9BFkLBMKFxNcBCHlQ+FhoocgpVwwnv0Xn30QBJGMC0QcaBVJiAMiec/dcwKuL4j1QMsVCXFAJE4s4NQA3K/8Y6DzO4g40P7UcmIBJxbEesCKWBDg8wWxHrAiFgT4fEGsB/CwIhYE+AeBAAdPLOcV8HRmWRDAiQVcO7GcV8CLM8uCAE4sQCDAlHcQ7x+ABQEEAggEEAggEEAggEAAgQACASAQQCCAQACBAAIBBAIIBBAIIBBAIABe4e9iAe/xd7EAJxYgEGDeO4j3EODp/cOCAE4sYMyJ5cwCHs4rCwI4sYBxJ5YzC84rCwKcXxArAuthQYDzC2JF0H49LAhwYUGsCFqvx5EF2T07dMaJBetx4cRyaqFtHJ8EIhK0i8OJBQxcECuCVutxJhCRoE0cZwMRyRcFefa/ffZBVPogePihhyCnbBhcfMFFEFM+DD4m+ghSlgmDkwlOgpAl4+BkkJMgZdk4+EgaSCcpVX7bmY9kgXQQU+1TgE0c+QJZUUz1b2T4SBbIKmJW+3iMj2SBVBWz+leVfCQLpIqYbp8b85EskIxyfIOfK5Sf+wiCRJEsllQ+oqEkQfBxmD8BBgA5hVjXyrBNUQAAAABJRU5ErkJggg==);
		background-size: 100% 100%;
		.num {
			width: 36upx;
			height: 36upx;
			border-radius: 50px;
			font-size: 24upx;
			color: #fff;
			text-align: center;
			line-height: 36upx;
		}

		.sign {
			position: absolute;
			top: 0;
			left: 50%;
			line-height: 36upx;
			font-size: 12upx;
			color: #fff;
			transform: translateX(-50%);
		}
		text {
			position: static;
		}
	}
	.skill-swiper-dots {
		display: flex;
		position: absolute;
		right: 30upx;
		top: 50upx;
		width: 72upx;
		height: 36upx;
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAYAAADDhn8LAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTk4MzlBNjE0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTk4MzlBNjA0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Q0E3RUNERkE0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Q0E3RUNERkI0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4Gh5BPAAACTUlEQVR42uzcQW7jQAwFUdN306l1uWwNww5kqdsmm6/2MwtVCp8CosQtP9vg/2+/gY+DRAMBgqnjIp2PaCxCLLldpPARRIiFj1yBbMV+cHZh9PURRLQNhY8kgWyL/WDtwujjI8hoE8rKLqb5CDJaRMJHokC6yKgSCR9JAukmokIknCQJpLOIrJFwMsBJELFcKHwM9BFkLBMKFxNcBCHlQ+FhoocgpVwwnv0Xn30QBJGMC0QcaBVJiAMiec/dcwKuL4j1QMsVCXFAJE4s4NQA3K/8Y6DzO4g40P7UcmIBJxbEesCKWBDg8wWxHrAiFgT4fEGsB/CwIhYE+AeBAAdPLOcV8HRmWRDAiQVcO7GcV8CLM8uCAE4sQCDAlHcQ7x+ABQEEAggEEAggEEAggEAAgQACASAQQCCAQACBAAIBBAIIBBAIIBBAIABe4e9iAe/xd7EAJxYgEGDeO4j3EODp/cOCAE4sYMyJ5cwCHs4rCwI4sYBxJ5YzC84rCwKcXxArAuthQYDzC2JF0H49LAhwYUGsCFqvx5EF2T07dMaJBetx4cRyaqFtHJ8EIhK0i8OJBQxcECuCVutxJhCRoE0cZwMRyRcFefa/ffZBVPogePihhyCnbBhcfMFFEFM+DD4m+ghSlgmDkwlOgpAl4+BkkJMgZdk4+EgaSCcpVX7bmY9kgXQQU+1TgE0c+QJZUUz1b2T4SBbIKmJW+3iMj2SBVBWz+leVfCQLpIqYbp8b85EskIxyfIOfK5Sf+wiCRJEsllQ+oqEkQfBxmD8BBgA5hVjXyrBNUQAAAABJRU5ErkJggg==);
		background-size: 100% 100%;

		.num {
			width: 36upx;
			height: 36upx;
			border-radius: 50px;
			font-size: 24upx;
			color: #fff;
			text-align: center;
			line-height: 36upx;
		}

		.sign {
			position: absolute;
			top: 0;
			left: 50%;
			line-height: 36upx;
			font-size: 12upx;
			color: #fff;
			transform: translateX(-50%);
		}
		text {
			position: static;
		}
	}

	.ad-1 {
		width: 100%;
		height: 210upx;
		padding: 10upx 0;
		background: #fff;

		image {
			width: 100%;
			height: 100%;
		}
	}

	/* 秒杀专区 */
	.seckill-section {
		margin: 24upx;
		background-color: #fff;
		border-radius: 20upx;
		.s-header {
			display: flex;
			align-items: center;
			height: 98upx;
			line-height: 1;
			border-radius: 20upx 20upx 0 0;
			background: linear-gradient(to bottom, #ff8410 0%,#ffb86e 100%);
			color: #fff;
			.s-img {
				width: 140upx;
				height: 30upx;
			}

			.tip {
				display: inline-block;
				font-size: 24upx;
				color: #ff8410;
				background-color: #fff;
				height: 40upx;
				border-radius: 40upx;
				padding: 0 20upx;
				line-height: 40upx;
			}

			.timer {
				padding: 0 20upx 0 30upx;
				font-size: 24upx;
				position: relative;
				left: -20upx;
				display: inline-block;
				height: 40upx;
				text-align: center;
				line-height: 40upx;
				margin-right: 14upx;
				font-size: $font-sm + 2upx;
				color: #fff;
				border-radius: 0 40upx 40upx 0;
				border: 1upx solid #fff;
			}

			.start{
				flex: 1.4;
				font-size: 35upx;
				text-align: center;
			}
			.mid{
				height: 116upx;
				flex: 5.5;
				display: flex;
				.mid-item{
					margin-top: 6upx;
					width: 120upx;
					position: relative;
				}
			}
			.end{
				flex: 1.2;
				font-size: 28upx;
				color: #fff;
				.text{
					padding: 0 10upx;
					display: inline-block;
					height: 40upx;
					line-height: 40upx;
					border-radius: 10upx;
					background-color: #fff;
					color: #ff8410;
				}
			}
		}
		.s-box{
			width: 702upx;
			height: 230upx;
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			position: relative;
			// padding: 30upx 0 30upx 20upx;
			margin-top: 28upx;
			padding: 0 10upx 36upx;
			background-color: #fff;
			border-radius: 0 0 24upx 24upx;
			.skill-item{
				padding: 0 24upx;
				width: 100%;
				height: 100%;
				display: flex;
				
				.skill-img{
					width: 180upx;
					height: 180upx;
					position: relative;
					image{
						width: 100%;
						height: 100%;
						border-radius: 6upx;
					}
					.none-tip{
						position: absolute;
						width: 100upx;
						height: 100upx;
						border-radius: 100%;
						top: 40upx;
						left: 40upx;
						color: #fff;
						text-align: center;
						line-height: 100upx;
						font-size: 28upx;
						background-color: rgba($color: #000000, $alpha: 0.5);
					}
				}
				.skill-content{
					flex:6;
					margin-left: 24upx;
					.s-name{
						margin-top: 8upx;
						font-size: 24upx;
						color: rgb(51,51,51);
					}
					.s-number{
						height: 24upx;
						margin-top: 10upx;
						display: flex;
						align-items: center;
					}
					.dis-price {
						// margin-left: 10upx;
						margin-top: 14upx;
						color: rgb(170,170,170);
						font-size: 24upx;
						// text-decoration: line-through;
						overflow: hidden;
					}
					.s-bottom{
						margin-top: 14upx;
						display: flex;
						justify-content: space-between;
						.price{
							font-size: 24upx;
							color: rgb(223,46,38);
						}
						.btn{
							width: 118upx;
							height: 48upx;
							font-size: 24upx;
							text-align: center;
							line-height: 48upx;
							
							color: #fff;
							border-radius: 6upx;
						}
						.btn-normal{
							background-color: rgb(223,46,38);
						}
						.btn-gray{
							background-color: #999;
						}
					}
				}
			}
		}
		.floor-list {
			white-space: nowrap;
		}

		.scoll-wrapper {
			display: flex;
			align-items: flex-start;
		}

		.floor-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 180upx;
			margin-right: 20upx;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
			position: relative;
			// line-height: 1.8;
			image {
				width: 160upx;
				height: 160upx;
				border-radius: 20upx;
			}
			.none-tip{
				position: absolute;
				width: 100upx;
				height: 100upx;
				border-radius: 100%;
				top: 30upx;
				left: 30upx;
				color: #fff;
				text-align: center;
				line-height: 100upx;
				font-size: 28upx;
				background-color: rgba($color: #000000, $alpha: 0.5);
			}
			.title{
				font-size: 28upx;
				text-align: center;
				height: 60upx;
				line-height: 60upx;
			}
			.price-box{
				display: flex;
				.price {
					height: 60upx;
					line-height: 60upx;
					color: #ff4461;
					font-size: 35upx;
					text-align: center;
					overflow: hidden;
				}
				.dis-price {
					margin-left: 10upx;
					height: 60upx;
					line-height: 60upx;
					color: #999;
					font-size: 25upx;
					text-decoration: line-through;
					overflow: hidden;
				}
			}
			
			.bottom{
				width: 100%;
				display: flex;
				justify-content: cneter;
				align-items: center;
				height: 80upx;
				.btn{
					margin-left: 10%;
					font-size: 26upx;
					width: 80%;
					height: 60upx;
					border-radius: 60upx;
					color: #fff;
					text-align: center;
					line-height: 60upx;
					// display: flex;
					// align-items: center;
					// justify-content: center;
				}
				.btn-normal{
					background-color: #1dc7ac;
				}
				.btn-gray{
					background-color: #999;
				}
			}
		}
	}

	.f-header {
		display: flex;
		align-items: center;
		height: 100upx;
		padding: 6upx 30upx 8upx;
		// background: #fff;

		image {
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			margin-right: 20upx;
		}

		.tit-box {
			flex: 1;
			display: flex;
			flex-direction: row;
			// justify-content: center;
			align-items: center;
		}
		.box{
			font-size: 28upx;
			margin-left: 20upx;
			padding: 5upx 10upx;
			border: 1upx solid #FF2626;
			color: #FF2626;
			border-radius: 10upx;
			font-style: italic
		}
		.tit {
			font-weight: 800;
			font-size: 45upx;
			color: #font-color-dark;
			line-height: 1.3;
		}

		.tit2 {
			font-size: $font-sm;
			color: $font-color-light;
		}

		.icon-you {
			font-size: $font-lg + 2upx;
			color: $font-color-light;
		}
	}

	/* 团购楼层 */
	.group-section {
		background: #fff;

		.g-swiper {
			height: 650upx;
			padding-bottom: 30upx;
		}

		.g-swiper-item {
			width: 100%;
			padding: 0 30upx;
			display: flex;
		}

		image {
			width: 100%;
			height: 460upx;
			border-radius: 4px;
		}

		.g-item {
			display: flex;
			flex-direction: column;
			overflow: hidden;
		}

		.left {
			flex: 1.2;
			margin-right: 24upx;

			.t-box {
				padding-top: 20upx;
			}
		}

		.right {
			flex: 0.8;
			flex-direction: column-reverse;

			.t-box {
				padding-bottom: 20upx;
			}
		}

		.t-box {
			height: 160upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			line-height: 1.6;
		}

		.price {
			color: $uni-color-primary;
		}

		.m-price {
			font-size: $font-sm + 2upx;
			text-decoration: line-through;
			color: $font-color-light;
			margin-left: 8upx;
		}

		.pro-box {
			display: flex;
			align-items: center;
			margin-top: 10upx;
			font-size: $font-sm;
			color: $font-base;
			padding-right: 10upx;
		}

		.progress-box {
			flex: 1;
			border-radius: 10px;
			overflow: hidden;
			margin-right: 8upx;
		}
	}

	/* 分类推荐楼层 */
	.hot-floor {
		width: 100%;
		overflow: hidden;
		margin-bottom: 20upx;

		.floor-img-box {
			width: 100%;
			height: 320upx;
			position: relative;

			&:after {
				content: '';
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				background: linear-gradient(rgba(255, 255, 255, 0.06) 30%, #f8f8f8);
			}
		}

		.floor-img {
			width: 100%;
			height: 100%;
		}

		.floor-list {
			white-space: nowrap;
			padding: 20upx;
			padding-right: 50upx;
			border-radius: 6upx;
			margin-top: -140upx;
			margin-left: 30upx;
			background: #fff;
			box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
			position: relative;
			z-index: 1;
		}

		.scoll-wrapper {
			display: flex;
			align-items: flex-start;
		}

		// .floor-item {
		// 	width: 180upx;
		// 	margin-right: 20upx;
		// 	font-size: $font-sm + 2upx;
		// 	color: $font-color-dark;
		// 	line-height: 1.8;

		// 	image {
		// 		width: 180upx;
		// 		height: 180upx;
		// 		border-radius: 6upx;
		// 	}

		// 	.price {
		// 		color: $uni-color-primary;
		// 	}
		// }

		.more {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			flex-shrink: 0;
			width: 180upx;
			height: 180upx;
			border-radius: 6upx;
			background: #f3f3f3;
			font-size: $font-base;
			color: $font-color-light;

			text:first-child {
				margin-bottom: 4upx;
			}
		}
	}

	/* 猜你喜欢 */
	.guess-section {
		display: flex;
		flex-wrap: wrap;
		background: #fff;

		.guess-item {
			display: flex;
			flex-direction: column;
			width: 48%;
			padding-bottom: 40upx;

			&:nth-child(2n + 1) {
				margin-right: 4%;
			}
		}

		.image-wrapper {
			width: 100%;
			height: 330upx;
			border-radius: 3px;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}

		.title {
			font-size: $font-lg;
			color: $font-color-dark;
			line-height: 80upx;
		}

		.price {
			font-size: $font-lg;
			color: $uni-color-primary;
			line-height: 1;
		}
	}

	.serchInput {
		padding: 10rpx 20rpx 10rpx 80rpx;
		background-color: rgba($color: #fff, $alpha: 0.4);
		border-radius: 15px;
		border: none;
		width: 100%;
		margin-left: 2%;
		height: 30px;
		line-height: 20px;
		font-size: 12px;
		color: #fff;
	}

	.status_bar {
		width: 100%;
		background: white;
		position:fixed;
		left: 0;
		top:0
	}

	/* 调整状态栏标题的位置 */
	// text {
	// 	position: absolute;
	// 	margin: auto;
	// 	bottom: 10px;
	// 	left: 0;
	// 	right: 0;
	// 	text-align: center;
	// }



	.list-scroll-content {
		height: 100%;
	}
	.Recommends{
		// background-color: #EFD1C6;
		z-index: 2;
		margin-top: 20upx;
		// padding: 0rpx 0rpx 10rpx;
		border-top-left-radius: 24rpx;
		border-top-right-radius: 24rpx;
	}
	.dot{
		width: 12rpx;
		height: 12rpx;
		border-radius: 50%;
		margin: 0 6rpx;
	}
	
	/* 优惠券面板 */
	.mask {
		// margin-top: 20%;
		position: fixed;
		left:0;
		top: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		width: 100%;
		background: rgba(0, 0, 0, 0);
		z-index: 9995;
		height: 100vh;
		.mask-content {
			width: 582upx;
			height: 939upx;
			background: rgba($color: #000000, $alpha: 0);
			transform: translateY(100%);
			// overflow-y: scroll;
			background-image: url('http://bbcfqn.zuizhezhi.com/FgxMjbYDuMHjiFstiNNeHV_znDQj');
			background-repeat:no-repeat;
			background-size:100% 100%;
		}
	
		&.none {
			display: none;
		}
	
		&.show {
			background: rgba(0, 0, 0, .4);
			
			.mask-content {
				transform: translateY(0);
			}
		}
	}
	
	/* 优惠券列表 */
	.coupon-item {
		margin: 20upx 24upx;
		.con {
			border-radius: 12upx;
			flex: 7;
			display: flex;
			// align-items: center;
			flex-direction: column;
			position: relative;
			height: 150upx;
			padding: 0 30upx;
	
			&:after {
				position: absolute;
				left: 0;
				bottom: 0;
				content: '';
				width: 100%;
				height: 0;
				border-right: 1px dashed #f3f3f3;
				transform: scaleY(50%);
			}
		}
	
		.top {
			display: flex;
			flex-direction: column;
			justify-content: center;
			flex: 1;
			overflow: hidden;
			height: 100upx;
		}
		.bottom{
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 60upx;
		}
		.title {
			font-size: 28upx;
			color: $font-color-dark;
			margin-bottom: 10upx;
			display: flex;
			align-items: center;
		}
		.tag{
			padding: 0 15upx;
			height: 28upx;
			line-height: 28upx;
			border-radius: 28upx;
			background-color: #EBA542;
			color: #fff;
			font-size: 22upx;
		}
		.time {
			font-size: 22upx;
			color: $font-color-light;
		}
	
		.right {
			border-radius: 0 12upx 12upx 0;
			flex: 3.5;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: 22upx;
			height: 150upx;
			background-color: #EBA542;
			.getBtn{
				width: 120upx;
				height: 40upx;
				color: #EBA542;
				background-color: #fff;
				line-height: 40upx;
				text-align: center;
				border-radius: 40upx;
				margin-top: 10upx;
			}
		}
		.enable{
			background-color: #EBA542;
		}
		.dis-enable{
			background-color: #C0C4CC;
		}
		.price {
			font-size: 32upx;
			color: #fff;
			&:before {
				content: '￥';
				font-size: 24upx;
			}
		}
		.tips {
			font-size: 22upx;
			color: $font-color-light;
			// line-height: 60upx;
		}
		.detail{
			margin-top: 5upx;
			background: #fff;
			padding: 30upx;
			z-index: 11;
			border-radius: 12upx;
			font-size: 24upx;
		}
		.circle {
			position: absolute;
			left: auto;
			right: -8upx;
			bottom: -10upx;
			z-index: 10;
			width: 20upx;
			height: 20upx;
			background: rgb(255,13,57);
			border-radius: 100px;
	
			&.r {
				
			}
			&.t {
				bottom: 140upx;
			}
		}
	}
	.firstTips{
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100vh;
		background-color: rgba($color: #000000, $alpha: 0.6);
		z-index: 888;
	}
	.leader-mask{
		position:fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		display:flex;
		width: 100%;
		height: 100vh;
		margin-top: 250upx;
		justify-content: center;
		align-items: flex-start;
		z-index: 998;
		transition: .3s;
		.open{
			animation: showLeader 0.3s ease-out both;
		}
		.hide{
			animation: hideLeader 0.3s ease-out both;
		}
		.leader-mask-contents{
			width: 100%;
			transition: .3s;
			background: #fff;
			&.has-bottom{
				padding-bottom: 90upx;
			}
			.view-content{
				height: 100%;
			}
			.selectPos {
				margin: 20upx;
				font-size: 35upx;
				height: 100upx;
				.title {
					color: #b9b9b9;
				}
				.info {
					display: flex;
					height: 50upx;
					.left {
						flex: 8;
						color: #000;
						font-size: 40upx;
						overflow: hidden;
					}
					.right {
						flex: 2;
						height: 50upx;
						text-align: right;
					}
				}
			}
			.leader-list {
				// overflow-y: scroll;
				max-height: 600upx;
				.leader-item {
					background: #fff;
					border-radius: 20upx;
					margin: 20upx;
					display: flex;
					height: 140upx;
					.leader-image {
						flex: 3;
						display: flex;
						justify-content: center;
						align-items: center;
						image {
							width: 110upx;
							height: 110upx;
							border-radius: 100%;
						}
					}
					.leader-info {
						flex: 8;
						display: flex;
						flex-direction: column;
						justify-content: center;
						.top {
							display: flex;
							height: 70upx;
							line-height: 70upx;
							justify-content: space-between;
							.leader-name {
								flex: 4;
								font-size: 32upx;
								font-weight: 600;
								overflow: hidden;
							}
							.leader-dis {
								flex: 3;
								color: #A7D159;
								font-size: $font-base;
								text-align: right;
								margin-right: 20upx;
							}
							.leader-btn {
								flex: 3;
								view {
									width: 140upx;
									height: 70upx;
									font-size: $font-base;
									flex: 3;
									color: #fff;
									background-color: #A7D159;
									border-radius: 20upx;
									text-align: center;
								}
							}
						}
						.position {
							color: #B9B9B9;
							font-size: $font-base;
						}
					}
				}
				.active{
					border: 1upx solid #EBA542;
				}
			}
		}
		@keyframes showLeader {
			0% {
				transform: translateY(-60%);
			}
		
			100% {
				transform: translateY(0%);
			}
		}
		
		@keyframes hideLeader {
			0% {
				transform: translateY(0%);
			}
		
			100% {
				transform: translateY(-60%);
			}
		}
	}
	.gift-mask{
		position:fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		display:flex;
		flex-direction: column;
		width: 100%;
		height: 100vh;
		justify-content: center;
		align-items: center;
		z-index: 998;
		background-color: rgba($color: #000000, $alpha: 0.5);
		.gift-content{
			width: 576upx;
			height: 775upx;
			background-repeat:no-repeat;
			background-size:100% 100%;
			.gift-close-btn{
				margin-top: 20upx;
				margin-left: 500upx;
			}
			.gift-title{
				margin-top: 40upx;
				width: 300upx;
				margin-left: 140upx;
				color: #fff;
				font-size: 20upx;
			}
			.gift-desc{
				margin-top: 240upx;
				width: 400upx;
				margin-left: 110upx;
				color: #ffff7f;
				font-size: 55upx;
				text-shadow:1px 1px 2px #000;
				letter-spacing:5upx;
			}
			.gift-success{
				margin-top: 340upx;
				height: 40%;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-items: center;
				.success-title{
					font-size: 50upx;
					font-weight: bold;
					color: #f83144;
				}
				.success-desc{
					font-size: 28upx;
					color: #999999;
				}
				.success-btn{
					width: 300upx;
					height: 80upx;
					line-height: 80upx;
					text-align: center;
					border-radius: 80upx;
					background-color: #f83144;
					color: #fff;
					box-shadow: 0 12upx 16upx 0 rgba(248, 49, 68, 0.1), 0 12upx 16upx 0 rgba(248, 49, 68, 0.1);
				}
			}
			.gift-fail{
				margin-top: 200upx;
				width:350upx;
				margin-left: 120upx;
				display: flex;
				flex-direction:column;
				justify-content: center;
				align-items: center;
				.portrait{
					width: 80upx;
					height: 80upx;
					image{
						width: 100%;
						height: 100%;
						border-radius: 8upx;
					}
				}
				.nickname{
					margin-top: 20upx;
					font-size: $font-lg;
					color: #fff;
				}
				.fail-text{
					margin-top: 40upx;
					color: #ffff7f;
					font-size: 40upx;
					text-shadow:1px 1px 2px #000;
					letter-spacing:5upx;
				}
			}
			.gift-btn{
				width: 180upx;
				height: 180upx;
				margin-top: 20upx;
				margin-left: 205upx;
				border-radius: 100%;
			}
		}
	}
	/*每个页面公共css 放app.vue页面的 */
	 @font-face {
		font-family: 'font_family';  /* project id 1065286 */
		src: url('//at.alicdn.com/t/font_1065286_3bsye5aijur.eot');
		src: url('//at.alicdn.com/t/font_1065286_3bsye5aijur.eot?#iefix') format('embedded-opentype'),
		url('//at.alicdn.com/t/font_1065286_3bsye5aijur.woff2') format('woff2'),
		url('//at.alicdn.com/t/font_1065286_3bsye5aijur.woff') format('woff'),
		url('//at.alicdn.com/t/font_1065286_3bsye5aijur.ttf') format('truetype'),
		url('//at.alicdn.com/t/font_1065286_3bsye5aijur.svg#font_family') format('svg');
	  }
	  .font_family{
		font-family:"font_family" !important;
		font-size:16px;font-style:normal;
		-webkit-font-smoothing: antialiased;
		-webkit-text-stroke-width: 0.2px;
		-moz-osx-font-smoothing: grayscale;
	  }
	  /* 按钮去掉边框 */
	  button::after {
		border: none;
	  }
	  button{
		margin-left: 0;
		margin-right: 0;
		padding-left: 0;
		padding-right: 0;
		line-height: 1;
		color: #1c1c1c;
		font-size: 28rpx;
		background: none;
	  }
	  .button-hover {
		color:#1c1c1c;
		background:none;
	  }
	  /*每个页面公共css */
	.content {
		text-align: center;
		height: 100%;
	}
	.share-btn{
		padding: 30upx 60upx;background-color:$uni-btn-color;color: $uni-text-color-inverse;
	}
	.share-pro{
	    display: flex;
	    align-items: center;
	    justify-content: flex-end;
	    flex-direction: column;
	    z-index: 5;
	    line-height: 1;
	    box-sizing: border-box;
	    .share-pro-mask{
	        width: 100%;
	        height: 100%;
	        position: fixed;
	        top: 0;
	        right: 0;
	        bottom: 0;
	        left: 0;
	        background: rgba(0, 0, 0, 0.5);
			z-index: 3;
	    }
	    .share-pro-dialog {
	        width: 750rpx;
	        height: 310rpx;
	        overflow: hidden;
	        background-color: #fff;
	        border-radius: 24rpx 24rpx 0px 0px;
	        position: relative;
	        box-sizing: border-box;
	        position: fixed;
	        bottom: 0;
			z-index: 3;
	        .close-btn {
	            padding: 20rpx 15rpx;
	            position: absolute;
	            top: 0rpx;
	            right: 29rpx;
	        }
	        .share-pro-title {
	            font-size: 28rpx;
	            color: #1c1c1c;
	            padding: 28rpx 41rpx;
	            background-color: #f7f7f7;
	        }
	
	        .share-pro-body{
	            display: flex;
	            flex-direction: row;
	            justify-content:space-around;
	            font-size: 28rpx;
	            color: #1c1c1c;
	            .share-item{
	                display: flex;
	                flex-direction:column;
	                justify-content: center;
	                justify-content:space-around;
					button{
						height: 100%;
					}
	                .share-icon{
	                    text-align:center;
	                    font-size: 70rpx;
	                    margin-top: 39rpx;
	                    margin-bottom: 16rpx;
	                    color: #42ae3c;
	                }
	                &:nth-child(2){
	                    .share-icon{
	                        color: #ff5f33;
	                    }
	                }
	            }
	        }
	    }
	
	    /* 显示或关闭内容时动画 */
	
	    .open {
	        transition: all 0.3s ease-out;
			transform: translateY(0);
	    }
	
	    .close {
	        transition: all 0.3s ease-out;
			transform: translateY(310rpx);
	    }
	
	}
	 .canvas{
	    position: fixed !important;
	    top: 0 !important;
	    left: 0 !important;
	    display: block !important;
	    width: 100% !important;
	    height: 100% !important;
	    z-index: 10;
	}
	button::after{
		border: none;
	}
	.scroll-top{
		width: 120upx;
		height: 120upx;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 100%;
		background-color: rgba($color: #000000, $alpha: 0.6);
		position: fixed;
		bottom: 60upx;
		right: 10upx;
		font-size: 30upx;
		color: #fff;
		padding: 0 26upx;
		opacity: 0;
		text-align: center;
	}
	.scroll-top-show {animation:showScrollTop 0.3s linear both;}
	@keyframes showScrollTop {0% {opacity:0;}100% {opacity:1;}}
	.scroll-top-hide {animation:hideScrollTop 0.3s linear both;}
	@keyframes hideScrollTop {0% {opacity:1;}100% {opacity:0;}}
	.order-info{
		border-radius: 80upx;
		height: 80upx;
		line-height: 80upx;
		display: flex;
		align-items: center;
		color: #fff;
		position: fixed;
		top: 300upx;
		left: 10upx;
		opacity: 0;
		font-size: 28upx;
		background-color: rgba($color: #000000, $alpha: 0.5);
		padding-right: 20upx;
		transform: translateY(0upx);
		z-index: 3;
		.order-info-img{
			height: 85upx;
			width: 85upx;
			border-radius: 85upx;
			background-color: #fff;
			display: flex;
			justify-content: center;
			align-items: center;
			image{
				width: 80upx;
				height: 80upx;
				border-radius: 80upx;
			}
		}
		.order-info-title{
			max-width: 370upx;
			height: 80upx;
			margin-left: 20upx;
		}
		.order-info-time{
			
		}
	}
	.order-info-show{
		// animation:showScrollTop 0.3s linear both;
		transition: all 0.5s ease-out;
		transform: translateY(-80upx);
		opacity: 1;
	}
	.order-info-hide{
		// animation:showScrollTop 0.3s linear both;
		transition: all 0.5s ease-out;
		transform: translateY(-160upx);
		opacity: 0;
	}
	@keyframes orderShow {
		0% {opacity:0;top:200upx;}
		90% {opacity:1;top:150upx;}
		100% {opacity:0;top:150upx;}
	}
</style>
