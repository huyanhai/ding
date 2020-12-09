<template>
	<view class="user" @click="checkLogin">
		<view v-if="!hasLogin" class="no_login">
		</view>
		<view class="user_top">
			<view class="user_info">
				<image class="img" :src="memberInfo.headPicture"></image>
				<view class="top">
					<view class="name">
						{{memberInfo.nickname || '未登录'}}
						<image class="icon-vip" src="../../static/icon-vip.png" mode="" v-if="cardData.card_number > 0 || memberInfo.vip === 1"></image>
					</view>
					<text class="code">邀请码： {{memberInfo.inviteCode || 'XXXXXX'}}</text>
				</view>
			</view>
			<view class="share" @click="share">
				<image src="../../static/fenxiang.png" mode=""></image>
				<text>分享</text>
			</view>
			<view class="card">
				<text class="num">{{cardData.card_number || 0}}张</text>
				<text class="name">会员卡</text>
			</view>
		</view>
		<view class="tips" @click="goPage('/pages/index/give')" v-if="cardData.card_number > 0 || memberInfo.vip === 1">
			<view class="col-l">爽辣食界鄙视一切吃独食的违辣行为</view>
			<view class="col-r">购卡转赠 ></view>
		</view>
		<view class="tips" @click="goPage('/pages/index/vip')" v-else>
			<view class="col-l">累计消费满88元，即可成为爽辣食界尊贵会员</view>
			<view class="col-r">会员权益 ></view>
		</view>
		<view class="my_order">
			<view class="hd">
				<view class="col-l">我的订单</view>
				<view class="col-r" @click="goPage('/pages/order/order?state=5')">查看全部 ></view>
			</view>
			<view class="bd">
				<view class="item" @click="goPage('/pages/order/order?state=0')">
					<image class="img" src="../../static/icon-dfk.png"></image>
					<text class="text">待付款</text>
				</view>
				<view class="item" @click="goPage('/pages/order/order?state=1')">
					<image class="img" src="../../static/icon-fahuo.png"></image>
					<text class="text">待发货</text>
				</view>
				<view class="item" @click="goPage('/pages/order/order?state=2')">
					<image class="img" src="../../static/icon-shouhuo.png"></image>
					<text class="text">待收货</text>
				</view>
				<view class="item" @click="goPage('/pages/order/order?state=3')">
					<image class="img" src="../../static/icon-yiwancheng.png"></image>
					<text class="text">已完成</text>
				</view>
			</view>
		</view>
		<view class="more_link">
			<view class="item" @click="goPage('/pages/user/myfens')">我的粉丝</view>
			<view class="item" @click="call">联系客服</view>
			<view class="item" @click="goPage('/pages/order/orderRe/selectAddress/selectAddress')">收货地址</view>
		</view>
		<view class="layer-bg" v-if="showLayer"></view>
		<view class="layer" v-if="showLayer">
			<view class="option">
				<button data-name="shareBtn" open-type="share" class="item" v-if="cardData.card_number > 0">
					<image class="img" src="../../static/liebiaoxunhuan.png" mode=""></image>
					<view class="text">转赠会员权益</view>
				</button>
				<view class="item" @click="createCanvasImageEvn">
					<image class="img" src="../../static/shengchenghaibao.png" mode=""></image>
					<view class="text">生成分享海报</view>
				</view>
			</view>
			<view class="btn" @click="showLayer = false">取消</view>
		</view>
		<hchPoster ref="hchPoster" :canvasFlag.sync="canvasFlag" @cancel="canvasCancel" :posterObj.sync="posterData"/>
		<view :hidden="canvasFlag">
			<canvas class="canvas"  canvas-id="myCanvas"></canvas>
		</view>
	</view>
</template>
<script>
	import { mapState } from 'vuex';
	import hchPoster from '@/components/hch-poster/hch-poster.vue';
	export default {
		data(){
			return {
				memberInfo:{},
				numberList:[],
				showLayer:false,
				posterData:{},
				canvasFlag:true,
				cardData:{},
				hasLogin:false
			}
		},
		components:{
			hchPoster
		},
		onShow() {
			this.checkAuth();
		},
		destroyed(){
			this.showLayer = false;
		},
		methods:{
			call(){
				uni.makePhoneCall({
				    phoneNumber: '13594195513' //仅为示例
				})
			},
			share(){
				if(this.cardData.card_number > 0){
					this.showLayer = true
				} else {
					this.createCanvasImageEvn();
				}
				
			},
			onShareAppMessage() {
				let timeCode = (new Date()).valueOf();
				return {
					"title": "爽辣食界欢辣提示",
					"path": `/pages/index/index?_q=${this.memberInfo.inviteCode}&activationCode=${timeCode}`,
					"imageUrl": "http://qn.dinglaobiao.com/1607497318919.jpg"
				};
			},
			goPage(path) {
				uni.navigateTo({
					url:`${path}`
				})
			},
			checkLogin(){
				if(!this.hasLogin){
					uni.navigateTo({
						url: '/pages/public/register'
					})
				}
			},
			async getCard(){
				let { data } = await this.$http.getCardList();
				if(data.length > 0){
					this.cardData = data[0];
				}
			},
			// 生成海报
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
			},
			// 取消海报
			canvasCancel(val){
				this.canvasFlag = val;
				this.showLayer = false;
			},
			async checkAuth(){
				let token = uni.getStorageSync('token')
				if(token){
					this.hasLogin = true;
					let { data } = await this.$api.getMemberInfo();
					if(data){
						this.memberInfo = data;
						this.loadData();
						this.getCard();
					}
					
				}
			},
			async loadData() {
				let res = await this.$http.getOrderNumber();
				if(res.code==200){
					this.numberList = [res.data.waitPay,res.data.waitDelivery,res.data.waitReceive]
				}
			},
		}
	}
</script>
<style lang="scss">
	.user{
		box-sizing: border-box;
		padding: 30rpx;
		background: #EBEBEB;
		min-height: 100vh;
		.no_login{
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			z-index: 100;
		}
		.user_top{
			height: 232rpx;
			background: #FFFFFF;
			display: flex;
			align-items: center;
			border-radius: 20rpx;
			box-sizing: border-box;
			padding: 0 27rpx;
			position: relative;
			.user_info{
				display: flex;
				align-items: center;
				.img{
					width: 86rpx;
					height: 86rpx;
					background: #000000;
					border-radius: 86rpx;
					&.active{
						border: 2rpx solid #CD0000;
					}
				}
				.top{
					font-size: 30rpx;
					color: #000000;
					display: flex;
					flex-direction: column;
					margin-left: 22rpx;
					display: flex;
					justify-content: flex-start;
					.name{
						display: flex;
						align-items: center;
						justify-content: flex-start;
					}
					.code{
						color: #545355;
						font-size: 20rpx;
					}
					.icon-vip{
						width: 54rpx;
						height: 54rpx;
						margin-left: 20rpx;
					}
				}
			}
			.share{
				position: absolute;
				right: 16rpx;
				top: 16rpx;
				font-size: 24rpx;
				color: #4B4B4B;
				display: flex;
				flex-direction: column;
				text-align: center;
				image{
					width: 54rpx;
					height: 54rpx;
				}
			}
			.card{
				position: absolute;
				right: 16rpx;
				bottom: 16rpx;
				font-size: 30rpx;
				color: #000000;
				display: flex;
				flex-direction: column;
				justify-content: end;
				align-items: flex-end;
				.num{
					font-size: 24rpx;
					
				}
			}
		}
		.tips{
			height: 80rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			background: #CD0000;
			border-radius: 17rpx;
			font-size: 22rpx;
			color: #FFFFFF;
			margin: 30rpx 0;
			box-sizing: border-box;
			padding: 0 16rpx;
			.col-r{
				font-size: 20rpx;
			}
		}
		.my_order{
			background: #FFFFFF;
			border-radius: 20rpx;
			box-sizing: border-box;
			padding: 0 24rpx;
			.hd{
				height: 80rpx;
				border-bottom: 2rpx solid #E0E0DE;
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 22rpx;
				color: #000000;
				.col-r{
					font-size: 20rpx;
					color: #929292;
					height: 100%;
					line-height: 80rpx;
				}
			}
			.bd{
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 130rpx;
				.item{
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					font-size: 24rpx;
					color: #000000;
					image{
						width: 54rpx;
						height: 54rpx;
					}
				}
			}
		}
		.more_link{
			.item{
				height: 80rpx;
				box-sizing: border-box;
				padding: 0 24rpx;
				background: #FFFFFF;
				font-size: 24rpx;
				color: #000000;
				line-height: 80rpx;
				border-radius: 20rpx;
				margin-top: 30rpx;
				position: relative;
				display: flex;
				align-items: center;
				justify-content: space-between;
				&::after{
					display: block;
					width: 24rpx;
					height: 24rpx;
					content: "";
					background: url(../../static/into.png) no-repeat;
					background-size:auto 24rpx;
				}
			}
		}
		.layer-bg{
			position: fixed;
			bottom: 0rpx;
			width: 100%;
			background: rgba($color: #000000, $alpha: 0.5);
			z-index: 1;
			left: 0;
			height: 100%;
		}
		.layer{
			position: fixed;
			bottom: 0rpx;
			width: 100%;
			background: #F5F5F5;
			border-top-left-radius: 20rpx;
			border-top-right-radius: 20rpx;
			height: 360rpx;
			left: 0;
			z-index: 10;
			.option{
				height: 260rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				
				.item{
					font-size: 20rpx;
					color: #5A5A5A;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					margin: 0 40rpx;
					background: none;
					height: initial;
					.text{
						font-size: 24rpx;
						height: 30rpx;
						line-height: 30rpx;
					}
					&::after{
						display: none;
					}
					image{
						margin-bottom: 20rpx;
						width: 54rpx;
						height: 54rpx;
					}
				}
			}
			.btn{
				background: #FFFFFF;
				height: 100rpx;
				text-align: center;
				line-height: 100rpx;
				font-size: 24rpx;
				color: #000000;
				display: block;
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
	}
</style>
