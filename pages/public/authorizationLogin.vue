<template>
	<view class="container">

		<!-- <view class="left-bottom-sign"></view> -->
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<!-- <view class="right-top-sign"></view> -->
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<!-- <view class="left-top-sign">LOGIN</view> -->
			<!--<image class="logo" src="http://507buy.oss-cn-hangzhou.aliyuncs.com/mall/yusenrong/logo.jpg" /> -->
			<button class="confirm-btn" @getuserinfo="toLogin" open-type="getUserInfo" :disabled="logining">微信授权登录</button>
			<!-- <button class="confirm-btn" @click="toLogin">微信授权登录</button> -->
		</view>
		<!-- <view class="fwtk">
			<checkbox-group class="check" @change="agreedAgreement"><checkbox style="transform: scale(0.5,0.5);"/></checkbox-group>
			<text @click="toAgreement" class="prompt">同意本《购物协议》,请认真阅读此协议</text>
		</view> -->

		<!-- 协议弹窗 -->
		<!-- <view>
			<view class="agreementBox" v-if="isShowAgreement">
				<text class="title">协议</text>
				<view class="content">

				</view>
				<view class="btn-list">
					<button @click="cancel" class="cancel"></button>
					<button @getuserinfo="toLogin" open-type="getUserInfo" class="sure"></button>
				</view>
			</view>
		</view> -->

		<!-- 规格-模态层弹窗 -->
		<!-- <view class="popup spec" :class="popupStatus" @touchmove.stop.prevent="stopPrevent" @click="popupStatusSwitch"> -->
		<!-- 遮罩层 -->
		<!-- 			<view class="mask"></view>
			<view class="layer" @click.stop="stopPrevent">
				<view class="title">小巷集市服务条款</view>
				<scroll-view scroll-y="true" class="agreement">
					<text class="p">您好！\n</text>
					<text class="p">欢迎进入重庆小巷集市科技有限公司此购物程序，请您在选购商品前，仔细阅读此文，同意本文所告知内容后再进行下单购买：\n</text>
					<text>1、您购买的商品</text>
					<text>2、请严格遵守说明说说明事项。</text>
					<text>3、请在服用前严格按照说明书剂量服用。\n</text>
					<text>4、如有不清楚，请致电我司服务电话询问。\n</text>
					<text>此协议解释重庆小巷集市科技有限公司。\n</text>
				</scroll-view>
				<view class="btn-list">
					<button @click="popupStatusSwitch" class="cancel">取消</button>
					<button @click="popupStatusSwitch" @getuserinfo="toLogin" open-type="getUserInfo" class="sure">确认</button>
				</view>
			</view>
		</view> -->

	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';

	export default {
		data() {
			return {
				logining: false,
				isAgreed: false,
				popupStatus: 'none'
			}
		},
		onLoad() {
			console.warn(123)
		},
		computed: {
			...mapState(['hasLogin', 'userInfo', "flag", "phone"])
		},
		methods: {
			//查看协议
			// toAgreement(){
			// 	uni.navigateTo({
			// 		url:"/pages/order/agreement"
			// 	})
			// },
			//同意协议
			// agreedAgreement(e){
			// 	if(e.detail.value.length>0)
			// 		this.isAgreed=true;
			// 	else
			// 		this.isAgreed=false;
			// },
			navBack() {
				uni.navigateBack({});
			},
			async toLogin(res) {
				// if(!this.isAgreed){
				// 	this.$api.msg("请先同意此协议!");
				// 	return;
				// }
				console.log(res)
				this.logining = true;
				this.$api.getLoginCode().then(result => {
					console.log(result)
					this.$api.userLogin({code:result.code,encryptedData:res.detail.encryptedData,iv:res.detail.iv}).then(r => {
						if (r) {
							// if (this.flag != 0) {
							// 	uni.reLaunch({
							// 		url: '/pages/index/index'
							// 	});
							// } else {
							// 	uni.redirectTo({
							// 		url: "/pages/public/bindPhone/bindPhone?phone=" + this.phone
							// 	});
							// }
							this.$api.msg('登录成功！')
							setTimeout(function(){
								uni.navigateBack({});
							},500)
							this.logining = false;
						} else {
							this.$api.msg('登录失败请重试！')
							this.logining = false;
						}
					});
				})
			},
			//弹窗状态
			popupStatusSwitch() {
				let that = this;
				if (this.popupStatus == 'none' || this.popupStatus == 'hide') {
					this.popupStatus = 'show';
				} else if (this.popupStatus == 'show') {
					this.popupStatus = 'hide';
					setTimeout(() => {
						that.popupStatus = 'none';
					}, 250);
				}
			},
			stopPrevent() {

			},
		},

	}
</script>

<style lang='scss'>
	page {
		background: #fff;
	}

	.container {
		padding-top: 115px;
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #fff;
	}

	/* 	.fwtk{
		height: 80upx;
		width: 100%;
		text-align: center;
		padding: 10upx;

		.prompt{
			font-size: 25upx;
			color: #fa436a;
			text-decoration: underline #fa436a;
		}

		.check{
			display: inline-block;
		}

	} */

	.wrapper {
		position: relative;
		z-index: 90;
		background: #fff;
		padding-bottom: 40upx;
	}

	.back-btn {
		position: absolute;
		left: 40upx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40upx;
		font-size: 40upx;
		color: $font-color-dark;
	}

	.left-top-sign {
		font-size: 120upx;
		color: $page-color-base;
		position: relative;
		left: -16upx;
	}

	.right-top-sign {
		position: absolute;
		top: 80upx;
		right: -30upx;
		z-index: 95;

		&:before,
		&:after {
			display: block;
			content: "";
			width: 400upx;
			height: 80upx;
			background: #272A30;
		}

		&:before {
			transform: rotate(50deg);
			border-radius: 0 50px 0 0;
		}

		&:after {
			position: absolute;
			right: -198upx;
			top: 0;
			transform: rotate(-50deg);
			border-radius: 50px 0 0 0;
			/* background: pink; */
		}
	}

	.logo {
		height: 150upx;
		width: 150upx;
		border-radius: 50%;
		margin: 0 300upx 100upx 300upx;
	}

	.left-bottom-sign {
		position: absolute;
		left: -270upx;
		bottom: -320upx;
		border: 100upx solid #272A30;
		border-radius: 50%;
		padding: 180upx;
	}

	.welcome {
		position: relative;
		left: 50upx;
		top: -90upx;
		font-size: 46upx;
		color: #555;
		text-shadow: 1px 0px 1px rgba(0, 0, 0, .3);
	}

	.input-content {
		padding: 0 60upx;
	}

	.input-item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding: 0 30upx;
		background: $page-color-light;
		height: 120upx;
		border-radius: 4px;
		margin-bottom: 50upx;

		&:last-child {
			margin-bottom: 0;
		}

		.tit {
			height: 50upx;
			line-height: 56upx;
			font-size: $font-sm+2upx;
			color: $font-color-base;
		}

		input {
			height: 60upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			width: 100%;
		}
	}

	.confirm-btn {
		width: 630upx;
		height: 80upx;
		line-height: 76upx;
		border-radius: 5px;
		margin-top: 50%;
		background: $font-color;
		color: #fff;
		font-size: $font-lg;

		&:after {
			border-radius: 5px;
		}
	}

	.forget-section {
		font-size: $font-sm+2upx;
		color: $font-color-spec;
		text-align: center;
		margin-top: 40upx;
	}

	.register-section {
		position: absolute;
		left: 0;
		bottom: 50upx;
		width: 100%;
		font-size: $font-sm+2upx;
		color: $font-color-base;
		text-align: center;

		text {
			color: $font-color-spec;
			margin-left: 10upx;
		}
	}

	/*  弹出层 */
	.popup {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 99;

		&.show {
			display: block;

			.mask {
				animation: showPopup 0.2s linear both;
			}

			.layer {
				animation: showLayer 0.2s linear both;
			}
		}

		&.hide {
			.mask {
				animation: hidePopup 0.2s linear both;
			}

			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}

		&.none {
			display: none;
		}

		.mask {
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.4);
		}

		.layer {
			position: fixed;
			z-index: 99;
			left: 10%;
			top: 20%;
			width: 80%;
			min-height: 30vh;
			height: auto;
			border-radius: 10upx;
			background-color: #fff;
			padding: 0 15upx;

			.title {
				height: 80upx;
				width: 100%;
				line-height: 80upx;
				text-align: center;
				font-size: 30upx;
			}

			.agreement {
				height: 700upx;
				width: 100%;
				font-size: 30rpx;
			}

			.btn-list {
				height: 120upx;
				padding: 50upx 20upx 10upx 20upx;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-around;

				button {
					width: 30%;
					margin: 0;
					height: 60upx;
					line-height: 60upx;
					font-size: 32upx;
					background-color: #fa436a;
					color: #fff;
					border-radius: 30upx;
				}
			}

		}

		@keyframes showPopup {
			0% {
				opacity: 0;
			}

			100% {
				opacity: 1;
			}
		}

		@keyframes hidePopup {
			0% {
				opacity: 1;
			}

			100% {
				opacity: 0;
			}
		}

		@keyframes showLayer {
			0% {
				transform: translateX(-120%);
			}

			100% {
				transform: translateX(0%);
			}
		}

		@keyframes hideLayer {
			0% {
				transform: translateX(0);
			}

			100% {
				transform: translateX(-120%);
			}
		}
	}
</style>
