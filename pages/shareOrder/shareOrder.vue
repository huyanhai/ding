<template>
	<view>
		<!-- 地址 -->
<!-- 		<view v-if="orderInfo.receiverName" class="address-section">
			<view class="order-content">
				<image src="../../static/location.svg" style="width: 15px;height: 20px;margin: 0 10px;"></image>
				<view class="cen">
					<view class="top">
						<text class="name">{{orderInfo.receiverName}}</text>
						<text class="mobile">{{orderInfo.receiverPhone}}</text>
						<text v-if="orderInfo.orderStatus > 1 && orderInfo.orderStatus != 4" class="logistics" @click="logistics">查看物流</text>
					</view>
					<text class="address">{{orderInfo.receiverProvince}} {{orderInfo.receiverCity}} {{orderInfo.receiverRegion}}
						{{orderInfo.receiverDetailAddress}}</text>
				</view>
			</view>
		</view> -->

		<view v-if="orderInfo" class="orderStatus">
			<!-- <view class="padding1">
				<view class="sn">订单编号 : {{orderInfo.orderSn}}</view>
				<view class="sn mt10">创建时间 : {{orderInfo.createTime}}</view>
				<view class="sn mt10">订单状态 : <text style='color: #EBA542;'>{{orderInfo.orderStatusName}}</text></view>
			</view> -->
			<!-- <text class="status">{{orderInfo.orderStatusName}}</text> -->
		</view>

		<view class="goods-section">

			<!-- <view class="g-header b-b">
				<image class="logo" src="http://duoduo.qibukj.cn/./Upload/Images/20190321/201903211727515.png"></image>
				<text class="name">小巷集市</text>
			</view> -->
			<view class="flexbetween padding1">
				<view class="font8 fontcolor16">
					订单编号 : {{orderInfo.orderSn}}
				</view>
				<view class="font8 fontcolor16">
					创建时间 : {{orderInfo.createTime}}
				</view>
			</view>
			<!-- 商品列表 -->
			<view class="g-item" v-for="(item, index) in goodsData" :key="item.id">
				<image :src="item.productPic"></image>
				<view class="right">
					<text class="title clamp mt10 fontB">{{item.productName}}</text>
					<view class="price-box">
						<view class="flex-between mtrpx10">
							<text class="price fontB font14" style="color: #000;">￥{{item.productPrice}}</text>
							<text class="spec">{{item.sp1?item.sp1:''}} {{item.sp2?item.sp2:''}} {{item.sp3?item.sp3:''}}</text>
						</view>
						<text class="number font14">x {{item.productQuantity}}</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 金额明细 -->
		<view class="yt-list" v-if="orderInfo">

			<!-- 			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">下单时间</text>
				<text class="cell-tip">{{orderInfo.createTime}}</text>
			</view> -->

			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">付款金额</text>
				<text class="cell-tip">￥{{orderInfo.payAmount}}</text>
			</view>

			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">是否赠送订单</text>
				<text class="cell-tip">{{orderInfo.isGift == 1? '是':'否'}}</text>
			</view>

			<!-- <view class="yt-list-cell b-b">
				<text class="cell-tit clamp">优惠金额</text>
				<text class="cell-tip" style="color: #888;">-￥0</text>
			</view>

			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">实付金额</text>
				<text class="cell-tip" style="color: #888;">￥{{orderInfo.payAmount}}</text>
			</view> -->

			<!-- <view class="yt-list-cell b-b">
				<text class="cell-tit clamp">运费</text>
				<text class="cell-tip">包邮</text>
			</view> -->

			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">收货方式</text>
				<text class="cell-tip">{{orderInfo.deliveryType==0 ?'自提':'快递'}}</text>
			</view>

<!-- 			<view class="yt-list-cell b-b" v-if="orderInfo.receiveNickname && orderInfo.isGift==1 && orderInfo.memberId == memberInfo.memberId">
				<text class="cell-tit clamp">接收人昵称</text>
				<text class="cell-tip">{{orderInfo.receiveNickname}}</text>
			</view>
			<view class="yt-list-cell b-b" v-if="orderInfo.receiveIcon && orderInfo.isGift==1 && orderInfo.memberId == memberInfo.memberId">
				<text class="cell-tit clamp">接收人头像</text>
				<image :src="orderInfo.receiveIcon" mode="" style="width: 100rpx;height: 100rpx;"></image>
			</view> -->

			<view class="yt-list-cell b-b" v-if="orderInfo.sendNickname && orderInfo.isGift==1 && orderInfo.memberId != memberInfo.memberId">
				<text class="cell-tit clamp">赠送人昵称</text>
				<text class="cell-tip">{{orderInfo.sendNickname}}</text>
			</view>
			<view class="yt-list-cell b-b" v-if="orderInfo.sendIcon && orderInfo.isGift==1 && orderInfo.memberId != memberInfo.memberId">
				<text class="cell-tit clamp">赠送人头像</text>
				<image :src="orderInfo.sendIcon" mode="" style="width: 100rpx;height: 100rpx;"></image>
			</view>

			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">备注</text>
				<view v-if="orderInfo.note" class="cell-tip">
					<text>{{orderInfo.note}}</text>
				</view>
				<view v-else class="cell-tip">
					<text>暂无</text>
				</view>
			</view>
			
		</view>
		<view class="padding1 mt10 textcenter">
			<view class="submit-btn" @click="addAddress" v-if='!orderInfo.receiverPhone'>
				填写收货信息
			</view>
			<view class="submit-btn get" v-else>
				该订单已被领取
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderInfo: '', //订单信息
				goodsData: '', //订单商品信息\
				orderId: '', //订单id
				sumbitFlag: false, //提交标志，防止重复提交,
				timer: 0,
				leftTime: 0,
				memberInfo: ''
			}
		},
		async onLoad(option) {
			let that = this
			if (!option.orderId) {
				this.$api.msg("参数错误!");
				return;
			}
			this.orderId = option.orderId;
		},
		onShow() {
			this.getOrderInfo();
		},
		methods: {
			async addAddress(){
				let addressList = await this.$http.getUserAddress();
				// this.addressList = addressList.data;
				if(addressList.data.length<1){
					uni.navigateTo({
						url:'completeAddress?orderSn='+this.orderInfo.orderSn
					})
				}else{
					uni.navigateTo({
						url:'addressSelect?orderSn='+this.orderInfo.orderSn
					})
				}
			},
			//获取订单详情
			async getOrderInfo() {
				let memberInfo = await this.$api.getMemberInfo();
				this.memberInfo = memberInfo.data
				let that = this
				uni.showLoading({
					title: '加载中'
				})
				let option = {
					orderId: this.orderId
				};
				let result = await this.$http.getOrderInfo(option);
				uni.hideLoading();
				if (result.code == 200) {
					if (result.data) {
						console.log(result.data)
						that.orderInfo = result.data;
						that.goodsData = that.orderInfo.orderItem;
					}
				}
			},
		}
	}
</script>

<style lang="scss">
	.submit-btn{
			background-color: #272A30;
			color: white;
			border-radius: 10rpx;
			width: 80%;
			margin-left: 10%;
			padding: 10px 20px;
			text-align: center;
			&.get{
				background-color: #b3b3b3;
			}
		}
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
