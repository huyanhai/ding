<template>
	<view class="app">
		<view class="price-box">
			<text class="fontB font14">支付金额</text>
			<text class="price fontB">{{orderInfo.payAmount}}</text>
		</view>
		<view class="pay-type-list">
			<view class="type-item b-b" @click="changePayType(1)">
				<image src="/static/wx_pay.png" style="width:70rpx;height: 70rpx;margin-right: 40rpx;"></image>
				<view class="con">
					<text class="tit">微信支付</text>
					<!-- <text>推荐使用微信支付</text> -->
				</view>
				<label class="radio">
					<radio value="" color="#1DC7AC" :checked='payType == 1' />
					</radio>
				</label>
			</view>
			<view class="type-item b-b" style="display:none" @click="changePayType(2)">
				<text class="icon yticon icon-alipay"></text>
				<view class="con">
					<text class="tit">支付宝支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#272A30" :checked='payType == 2' />
					</radio>
				</label>
			</view>
			<view class="type-item b-b" v-if="is" @click="changePayType(3)" style="display:none">
				<image src="/static/pay.png" style="width:70rpx;height: 70rpx;margin-right: 40rpx;"></image>
				<view class="con">
					<text class="tit">线下支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#272A30" :checked='payType == 3' />
					</radio>
				</label>
			</view>
			<!-- 			<view class="type-item b-b" v-if="is" @click="changePayType(4)" style="display: none;">
				<text class="icon yticon icon-erjiye-xianxia"></text>
				<view class="con">
					<text class="tit">余额支付({{memberInfo.balance}})</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='payType == 4' v-show="isDisable" />
					<text v-show="!isDisable">余额不足</text>
				</label>
			</view> -->
		</view>

		<text class="mix-btn" @click="confirm">确认支付</text>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';

	export default {
		data() {
			return {
				payType: 1,
				money: 0,
				orderId: 0,
				isDisable: true,
				is: true,
				sumbitFlag: false, //提交标志，防止重复提交
				orderInfo: '',
			};
		},
		computed: {
			...mapState(['hasLogin', 'userInfo', 'memberInfo']),
		},
		async onLoad(options) {
			this.money = options.money;
			this.orderId = options.orderId;
			// this.orderInfo = options.orderInfo;
			let memberData = await this.$api.getMemberInfo();
			let orderInfo = await this.$http.getOrderInfo({
				orderId: options.orderId
			})
			console.log('orderInfo',options)
			this.orderInfo = orderInfo.data;
			if (options.money == 0) {
				this.is = false;
				return;
			}
			if (memberData.data.balance < options.money) {
				this.isDisable = false;
			}
		},
		async onShow() {
			let order = await this.$http.getOrderInfo({
				orderId: this.orderId
			})
			console.log(order)
			// if (order.data.orderStatus != 0) {
			// 	uni.redirectTo({
			// 		url: '../order/order?state=1'
			// 	})
			// }
		},
		onBackPress(res) {
			console.log('onBackPress',res)
			setTimeout(function() {
				uni.switchTab({
					url: '/pages/index/index'
				})
			}, 50)
		},

		methods: {
			//选择支付方式
			changePayType(type) {
				if (type == 4) {
					if (this.memberInfo.balance < this.money) {
						return;
					} else {
						this.payType = type;
					}
				} else {
					this.payType = type;
				}
			},
			async payAsBalance() {
				if (!this.sumbitFlag) {
					this.sumbitFlag = true;
					uni.showLoading({
						title: '加载中'
					});
					let result = await this.$http.payAsBalance({
						orderId: this.orderId
					})
					if (result.code == 200) {
						uni.navigateTo({
							url: '/pages/money/paySuccess?orderId=' + this.orderId
						})
					} else {
						this.$api.msg(result.message)
					}
					uni.hideLoading();
				}
			},
			//确认支付
			async confirm() {
				let that = this;
				console.log(this.payType)
				// if (!this.is) {
				// 	this.payAsBalance();
				// 	return;
				// }
				if (this.payType == 1&&!this.sumbitFlag) {
					this.sumbitFlag = true;
					uni.showLoading({
						title: '加载中'
					});
					let result = await this.$http.wxPrePay({
						orderId: this.orderId,
						tradeType: 0
					});
					uni.hideLoading();
					if(result.code==200){
						let data = result.data;
						uni.requestPayment({ 
							appId: data.appid,
							timeStamp: data.timeStamp,
							nonceStr: data.nonceStr,
							package: data.package,
							signType: data.signType,
							paySign: data.paySign,
							success: function(res) {
								console.log(res)
								uni.requestSubscribeMessage({
									  tmplIds: ['X68n_RAN-AVLW7nzPlwI-rQH23v48AA3UMKHSfGQ4LM','ZUsJoymy0XOYJWvD7QLnyUDM3u9dj9vmqhdHf9jK8Q8'],
									  success (res) { 
										  uni.redirectTo({
											url: '/pages/money/paySuccess?orderId=' + that.orderId
										  })
									  },
									  fail(res) {
										  uni.redirectTo({
											url: '/pages/money/paySuccess?orderId=' + that.orderId
										  })
									  }
								})
								// uni.redirectTo({
								// 	url: '/pages/money/paySuccess?orderId=' + that.orderId
								// })
							},
							fail: function(err) {
								console.log(err)
								that.sumbitFlag = false;
							}
						});
					}else{
						this.$api.msg(result.message)
						this.sumbitFlag = false;
					}
				}
				// if (this.payType == 3) { //线下支付
				// 	uni.redirectTo({
				// 		url: '/pages/money/makePay?orderId=' + this.orderId
				// 	})
				// } else if (this.payType == 1) {
				// 	let result = await this.$http.wxPrePay({
				// 		orderId: this.orderId,
				// 		tradeType: 0
				// 	});
				// 	let data = result.data;
				// 	uni.requestPayment({ 
				// 		appId: data.appid,
				// 		timeStamp: data.timeStamp,
				// 		nonceStr: data.nonceStr,
				// 		package: data.package,
				// 		signType: data.signType,
				// 		paySign: data.paySign,
				// 		success: function(res) {
				// 			console.log(res)
				// 			uni.redirectTo({
				// 				url: '/pages/money/paySuccess?orderId=' + that.orderId
				// 			})
				// 		},
				// 		fail: function(err) {
				// 			console.log(err)
				// 		}
				// 	});
				// } else {
				// 	uni.navigateTo({
				// 		url: '/pages/money/paySuccess'
				// 	})
				// }
			},
		}
	}
</script>

<style lang='scss'>
	.radio:after {
		background-color: #38cc75;
	}

	.app {
		width: 100%;
	}

	.price-box {
		background-color: #fff;
		height: 265upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 28upx;
		color: #909399;

		.price {
			font-size: 50upx;
			color: #303133;
			margin-top: 12upx;

			&:before {
				content: '￥';
				font-size: 40upx;
			}
		}
	}

	.pay-type-list {
		margin-top: 20upx;
		background-color: #fff;
		padding-left: 60upx;

		.type-item {
			height: 120upx;
			padding: 20upx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-right: 60upx;
			font-size: 30upx;
			position: relative;
		}

		.icon {
			width: 100upx;
			font-size: 52upx;
		}

		.icon-erjiye-yucunkuan {
			color: #fe8e2e;
		}

		.icon-erjiye-xianxia {
			color: #fe8e2e;
		}

		.icon-weixinzhifu {
			color: #36cb59;
		}

		.icon-alipay {
			color: #01aaef;
		}

		.tit {
			font-size: $font-lg;
			color: $font-color-dark;
			margin-bottom: 4upx;
		}

		.con {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-sm;
			color: $font-color-light;
		}
	}

	.mix-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 630upx;
		height: 90upx;
		margin: 80upx auto 30upx;
		font-size: $font-lg;
		color: #fff;
		background-color: #CD0000;
		border-radius: 10upx;
	}
</style>
