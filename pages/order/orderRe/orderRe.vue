<template>
	<view>
		<!-- 商品列表 -->
		<view class="goods-section">
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
		<view class="flexaround padding1 mt10">
			<view class="action-btn recom" @click="Rerequest(0)">
				仅退款
			</view>
			<!-- <view class="action-btn" @click="Rerequest(1)">
				换货
			</view> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderId: '',
				orderInfo: {},
				goodsData:[],
				productId: undefined
			}
		},
		async onLoad(option) {
			let that = this
			if (!option.orderId) {
				this.$api.msg("参数错误!");
				uni.navigateBack({});
				return;
			}
			console.log(option)
			this.orderId = option.orderId;
			if(option.productId){
				this.productId = option.productId;
			}else{
				
			}
			this.getOrderInfo()
		},
		methods: {
			//获取订单详情
			async getOrderInfo() {
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
						that.orderInfo = result.data;
						if(that.productId){
							for(let item of result.data.orderItem){
								if(item.productId==that.productId){
									that.goodsData.push(item)
								}
							}
						}else{
							that.goodsData = that.orderInfo.orderItem;
						}
						
					}
				}
			},
			Rerequest(e){
				console.log(e,this.productId)
				if(this.productId){
					uni.navigateTo({
						url:'ReRequest?orderId='+this.orderId + '&productId=' + this.productId + '&type='+e
					})
				}else{
					uni.navigateTo({
						url:'orderRe/ReRequest?orderId='+this.orderId + '&type='+e
					})
				}

			}
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding-bottom: 100upx;
	}
	.action-btn {
		display: block;
		width: 250upx;
		height: 60upx;
		margin-right: 24upx;
		line-height: 60upx;
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
			background-color: #fff;
			color: #272A30;
			&:after {
				border-color: $border-color;
			}
		}
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
</style>
