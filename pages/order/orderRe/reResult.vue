<template>
	<view>
		<view class="padding10 " style="background-color: #272A30;">
			<view class="font14" style="color: #EBA542;" v-if='returnInfo.status<2'>{{returnInfo.statusName}}...</view>
			<view class="font14" style="color: #EBA542;" v-else>{{returnInfo.statusName}}</view>
			<!-- <view class="font12 fontcolor4 mt10 " >还剩{{time}}</view> -->
		</view>

		<view class="goods-section">

			<!-- <view class="g-header b-b">
				<image class="logo" src="http://duoduo.qibukj.cn/./Upload/Images/20190321/201903211727515.png"></image>
				<text class="name">小巷集市</text>
			</view> -->
			
			<!-- 商品列表 -->
			<view class="g-item">
				<image :src="returnInfo.productPic"></image>
				<view class="right">
					<text class="title clamp mt10 fontB">{{returnInfo.productName}}</text>
					<view class="price-box">
						<view class="flex-between mtrpx10">
							<text class="price fontB font14" style="color: #000;">￥{{returnInfo.productRealPrice}}</text>
							<!-- <text class="spec">{{item.sp1?item.sp1:''}} {{item.sp2?item.sp2:''}} {{item.sp3?item.sp3:''}}</text> -->
						</view>
						<text class="number font14">x {{returnInfo.productCount}}</text>
					</view>
				</view>
			</view>
			<view class="flexend padding1 mt10">
				<view class="mr20">
					共：<text style="color: #EBA542;">￥{{returnInfo.returnAmount}}元</text>
				</view>
			</view>
		</view>
			
		<!-- 金额明细 -->
		<view class="yt-list">

			<!-- 			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">下单时间</text>
				<text class="cell-tip">{{orderInfo.createTime}}</text>
			</view> -->

			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">退款金额</text>
				<text class="cell-tip">￥{{returnInfo.returnAmount}}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">退款原因</text>
				<text class="cell-tip">{{returnInfo.reason}}</text>
			</view>
		</view>


		<view class="footer">
			<view class="price-content-right flexcenter" style="top: 10px;" v-if='returnInfo.status<2'>
				<!-- <button class="action-btn" @click="refuse" v-if='orderInfo.memberId == memberInfo.memberId'>申请退款</button> -->
				<view class="action-btn" @click.stop="cancleRefuseTip" style="color:#272A30;background-color: white;">撤销申请</view>
				<button class="action-btn" @click="modify" v-if='returnInfo.status<2'>修改申请</button>
			</view>
			<view class="price-content-right flexcenter" style="top: 10px;" v-if="returnInfo.status==2&&returnInfo.type==0">
				<view class="action-btn" @click.stop="reOrder" style="color:#fff;background-color: #000;">再次购买</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				returnInfo:{},
				sumbitFlag: false, //提交标志，防止重复提交,
				timer: 0,
				leftTime: 0,
				memberInfo: '',
				total:0,
				returnId:0
			}
		},
		async onLoad(option) {
			let that = this
			if (!option.returnId) {
				this.$api.msg("参数错误!");
				uni.navigateBack({});
				return;
			}
			this.returnId = option.returnId;
		},
		onShow() {
			this.getOrderInfo();
		},
		
		methods: {
			async reOrder(){
				let sp1 = '';
				let sp2 = '';
				let sp3 = '';
				let orderItem;
				let result = await this.$http.getOrderInfo({orderId:this.returnInfo.orderId});
				if (result.code == 200) {
					orderItem = result.data.orderItem;
				} else {
					this.$api.msg('异常!');
				}
				console.log(orderItem)
				let skuData = {};
				if(orderItem[0].sp1!=undefined){
					sp1 = orderItem[0].sp1
					skuData['sp1'] = sp1;
				}
				if(orderItem[0].sp2!=undefined){
					sp2 = orderItem[0].sp2
					skuData['sp2'] = sp2;
				}
				if(orderItem[0].sp3!=undefined){
					sp3 = orderItem[0].sp3
					skuData['sp3'] = sp3;
				}
				skuData['productId'] = this.returnInfo.productId;
				let skuGoodInfo;
				let res = await this.$http.getProductSke(skuData);
				if (res.code == 200) {
					skuGoodInfo = res.data;
					console.log(skuGoodInfo);
				} else {
					this.$api.msg('异常!');
				}
				let goodInfo = [{
					id: this.returnInfo.productId,
					productName: this.returnInfo.productName,
					// specSelected: this.specSelected,
					quantity: this.returnInfo.productCount,
					price: this.returnInfo.productPrice,
					checked:true,
					sp1: sp1,
				}];
				uni.navigateTo({
					url: `/pages/order/createOrder?type=1&isGiving=0&data=${JSON.stringify({
						goodsData: goodInfo,
						skuId:skuGoodInfo.id,
						quantity:this.returnInfo.productCount,
					})}`
				})
			},
			modify(){
				uni.navigateTo({
					url:'./ReRequestUpdate?returnId='+ this.returnId
				})
			},
			cancleRefuseTip() { //退款
			let that = this;
				uni.showModal({
					title: '提示',
					content: '是否确定取消申请？',
					success: function(res) {
						if (res.confirm) {
							that.cancleRefuse()
						}
					}
				});
			},
			async cancleRefuse(){
				let data = {
					orderReturnApplyId:this.returnId
				}
				let result = this.$http.cancelRefundExchange(data)
				if (result.code == 200) {
					this.getOrderInfo()
				}else{
					this.$api.msg(result.message)
				}
			},
			//获取订单详情
			async getOrderInfo() {
				let result = await this.$http.getMemberOrderReturnDetailInfo(this.returnId);
				uni.hideLoading();
				if (result.code == 200) {
					if (result.data) {
						this.returnInfo = result.data
					}
				}
				
			},
			//取消订单
			async cancelOrder() {
				let that = this;
				uni.showModal({
					title: '提示',
					content: '是否确定取消订单',
					success: function(res) {
						if (res.confirm) {
							that.cancle()
						}
					}
				});
			},
			async cancle() {
				let options = {
					orderId: this.orderInfo.orderId
				};
				uni.showLoading({
					title: '请稍后'
				})
				let result = await this.$http.cancelOrder(options);
				uni.hideLoading();
				if (result.code == 200) {
					this.$api.msg(result.message);
					this.getOrderInfo();
				} else {
					this.$api.msg(result.message);
				}
			},
			//查看物流
			logistics() {
				uni.navigateTo({
					url: `/pages/order/order-logistics?orderId=${this.orderInfo.orderId}`
				})
			},
			setTimes(data) {
				var s;
				var hours = parseInt((data % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
				var minutes = parseInt((data % (1000 * 60 * 60)) / (1000 * 60));
				var seconds = (data % (1000 * 60)) / 1000;
				s = (hours < 10 ? ('0' + hours) : hours) + '时' + (minutes < 10 ? ('0' + minutes) : minutes) + '分' + (seconds < 10 ?
					('0' + seconds) : seconds) + '秒';
				return s;
				// return hours + '时' + minutes + '分' + seconds + '秒'
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding-bottom: 100upx;
	}

	.address-section {
		padding: 30upx 0;
		background: #fff;
		position: relative;

		.order-content {
			display: flex;
			align-items: center;
		}

		.icon-shouhuodizhi {
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 90upx;
			color: #888;
			font-size: 44upx;
		}

		.cen {
			display: flex;
			flex-direction: column;
			flex: 1;
			font-size: 28upx;
			color: $font-color-dark;
		}

		.name {
			font-size: 34upx;
			margin-right: 24upx;
		}

		.address {
			margin-top: 16upx;
			margin-right: 20upx;
			color: #000;
		}

		.selectAddress {
			color: $font-color-light;
		}

		.icon-you {
			font-size: 32upx;
			color: $font-color-light;
			margin-right: 30upx;
		}

		.a-bg {
			position: absolute;
			left: 0;
			bottom: 0;
			display: block;
			width: 100%;
			height: 5upx;
		}
	}

	.orderStatus {
		background: #fff;
		padding: 15upx 24upx 15upx 24upx;

		view {
			.sn {
				font-size: 30upx;
				color: #999;
			}

			.copy {
				padding: 5upx 20upx 5upx 20upx;
				color: $base-color;
				background: #fff9f9;
				font-size: 30upx;
				margin-left: 10upx;
				border: 1px solid #f7bcc8;
			}
		}

		.status {
			font-size: 30upx;
			color: $base-color;
		}

	}

	.address-section {
		padding: 30upx 0;
		background: #fff;
		position: relative;
		margin-top: 16upx;

		.order-content {
			display: flex;
			align-items: center;
		}

		.icon-shouhuodizhi {
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 90upx;
			color: #888;
			font-size: 44upx;
		}

		.cen {
			display: flex;
			flex-direction: column;
			flex: 1;
			font-size: 28upx;
			color: $font-color-dark;
		}

		.name {
			font-size: 34upx;
			margin-right: 24upx;
		}

		.address {
			margin-top: 16upx;
			margin-right: 20upx;
			flex-wrap: wrap;
			color: $font-color-dark;
			font-weight: bolder;
		}

		.icon-you {
			font-size: 32upx;
			color: $font-color-light;
			margin-right: 30upx;
		}

		.a-bg {
			position: absolute;
			left: 0;
			bottom: 0;
			display: block;
			width: 100%;
			height: 5upx;
		}
	}

	.logistics {
		padding: 5upx 20upx 5upx 20upx;
		color: #fff;
		background: #272A30;
		float: right;
		font-size: 30upx;
		margin-left: 10upx;
		border-radius: 10upx;
		margin-right: 30upx;
		border: 1px solid #272A30;
	}

	.goods-section {
		margin-top: 16upx;
		background: #fff;
		padding: 20px 0;

		.g-header {
			display: flex;
			align-items: center;
			height: 84upx;
			padding: 0 30upx;
			position: relative;
		}

		.logo {
			display: block;
			width: 50upx;
			height: 50upx;
			border-radius: 100px;
		}

		.name {
			font-size: 30upx;
			color: $font-color-base;
			margin-left: 24upx;
		}

		.g-item {
			display: flex;
			margin: 20upx 50upx;

			image {
				flex-shrink: 0;
				display: block;
				width: 140upx;
				height: 140upx;
				border-radius: 10upx;
				border: 1px solid #ccc;
			}

			.right {
				flex: 1;
				padding-left: 24upx;
				overflow: hidden;
			}

			.title {
				font-size: 30upx;
				color: $font-color-dark;
			}

			.spec {
				font-size: 26upx;
				color: $font-color-light;
				margin-left: 30px;
			}

			.price-box {
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 32upx;
				color: #000000;
				padding-top: 10upx;

				.price {
					margin-bottom: 4upx;
				}

				.number {
					font-size: 32upx;
					color: #000000;
					margin-top: 10rpx;
				}
			}

			.step-box {
				position: relative;
			}
		}
	}

	.yt-list {
		margin-top: 16upx;
		background: #fff;
	}

	.yt-list-cell {
		display: flex;
		align-items: center;
		padding: 10upx 30upx 10upx 40upx;
		line-height: 70upx;
		position: relative;

		&.cell-hover {
			background: #fafafa;
		}

		&.b-b:after {
			left: 30upx;
		}

		.cell-icon {
			height: 32upx;
			width: 32upx;
			font-size: 22upx;
			color: #fff;
			text-align: center;
			line-height: 32upx;
			background: #f85e52;
			border-radius: 4upx;
			margin-right: 12upx;

			&.hb {
				background: #ffaa0e;
			}

			&.lpk {
				background: #3ab54a;
			}

		}

		.cell-more {
			align-self: center;
			font-size: 24upx;
			color: $font-color-light;
			margin-left: 8upx;
			margin-right: -10upx;
		}

		.cell-tit {
			flex: 1;
			font-size: 26upx;
			color: $font-color-dark;
			margin-right: 10upx;
			font-weight: bolder;
		}

		.cell-tip {
			font-size: 26upx;
			color: $font-color-dark;
			font-weight: bolder;

			&.disabled {
				color: $font-color-light;
			}

			&.active {
				color: $base-color;
			}

			&.red {
				color: $base-color;
			}
		}

		&.desc-cell {
			.cell-tit {
				max-width: 90upx;
			}
		}

		.desc {
			flex: 1;
			font-size: $font-base;
			color: $font-color-dark;
		}
	}

	/* 支付列表 */
	.pay-list {
		padding-left: 40upx;
		margin-top: 16upx;
		background: #fff;

		.pay-item {
			display: flex;
			align-items: center;
			padding-right: 20upx;
			line-height: 1;
			height: 110upx;
			position: relative;
		}

		.icon-weixinzhifu {
			width: 80upx;
			font-size: 40upx;
			color: #6BCC03;
		}

		.icon-alipay {
			width: 80upx;
			font-size: 40upx;
			color: #06B4FD;
		}

		.icon-xuanzhong2 {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 60upx;
			height: 60upx;
			font-size: 40upx;
			color: $base-color;
		}

		.tit {
			font-size: 32upx;
			color: $font-color-dark;
			flex: 1;
		}
	}

	.footer {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 995;
		display: flex;
		align-items: center;
		width: 100%;
		height: 120upx;
		justify-content: flex-end;
		font-size: 30upx;
		background-color: #fff;
		z-index: 998;
		color: $font-color-base;
		// box-shadow: 0 -1px 5px rgba(0, 0, 0, .1);

		.price-content-left {
			padding-left: 30upx;
		}

		.price-content-right {
			position: absolute;
			right: 30upx;
		}

		.price-tip {
			color: $font-base;
			margin-left: 8upx;
			font-weight: bolder;
		}

		.price {
			font-size: 38upx;
			color: $font-base;
			font-weight: bolder;
		}

		.pay {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 220upx;
			height: 70%;
			color: white;
			font-size: 32upx;
			background-color: black;
			border: 1px solid #000;
			margin-right: 30rpx;
			border-radius: 5px;
		}
	}

	/* 优惠券面板 */
	.mask {
		display: flex;
		align-items: flex-end;
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0, 0, 0, 0);
		z-index: 9995;
		transition: .3s;

		.mask-content {
			width: 100%;
			min-height: 30vh;
			max-height: 70vh;
			background: #f3f3f3;
			transform: translateY(100%);
			transition: .3s;
			overflow-y: scroll;
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
		display: flex;
		flex-direction: column;
		margin: 20upx 24upx;
		background: #fff;

		.con {
			display: flex;
			align-items: center;
			position: relative;
			height: 120upx;
			padding: 0 30upx;

			&:after {
				position: absolute;
				left: 0;
				bottom: 0;
				content: '';
				width: 100%;
				height: 0;
				border-bottom: 1px dashed #f3f3f3;
				transform: scaleY(50%);
			}
		}

		.left {
			display: flex;
			flex-direction: column;
			justify-content: center;
			flex: 1;
			overflow: hidden;
			height: 100upx;
		}

		.title {
			font-size: 32upx;
			color: $font-color-dark;
			margin-bottom: 10upx;
		}

		.time {
			font-size: 24upx;
			color: $font-color-light;
		}

		.right {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: 26upx;
			color: $font-color-base;
			height: 100upx;
		}

		.price {
			font-size: 44upx;
			color: $base-color;

			&:before {
				content: '￥';
				font-size: 34upx;
			}
		}

		.tips {
			font-size: 24upx;
			color: $font-color-light;
			line-height: 60upx;
			padding-left: 30upx;
		}

		.circle {
			position: absolute;
			left: -6upx;
			bottom: -10upx;
			z-index: 10;
			width: 20upx;
			height: 20upx;
			background: #f3f3f3;
			border-radius: 100px;

			&.r {
				left: auto;
				right: -6upx;
			}
		}
	}

	.action-btn {
		display: block;
		width: 200upx;
		height: 80upx;
		margin-right: 24upx;
		line-height: 80upx;
		font-size: $font-sm + 2upx;
		color: #fff;
		background: $border-color;
		border-radius: 5px;
		z-index: 9999;
		border: 1px solid $border-color;
		text-align: center;
		font-weight: bolder;

		&.afterSales {
			margin-top: 25rpx;
			height: 60rpx;
			line-height: 60rpx;
			background-color: white;
			color: black;
			width: 170rpx;
			margin-right: 0px;

		}

		&:after {
			border-radius: 5px;
		}

		&.recom {
			color: #fff;

			&:after {
				border-color: $border-color;
			}
		}
	}
</style>
