<template>
	<view class="content">
		<text class="success-icon yticon icon-xuanzhong2"></text>
		<text class="tit">支付成功</text>
		<view>
			
		</view>
		<view class="btn-group">
			<!-- <button open-type="share" class="mix-btn">选择要赠送的好友</button> -->
			<navigator :url="'/pages/order/orderInfo?orderId='+orderId" open-type="redirect" class="mix-btn hollow">查看订单</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderId:'',
				orderInfo:{},
				goodsData:[]
			}
		},
		async onLoad(option) {
			let that = this;
			this.orderId = option.orderId
			let options = {
				orderId: this.orderId
			};
			let result = await this.$http.getOrderInfo(options);
				uni.hideLoading();
				if (result.code == 200) {
					if (result.data) {
						console.log(result.data)
						that.orderInfo = result.data;
						that.goodsData = that.orderInfo.orderItem;
					}
				}
			},
		methods: {
			
		}
	}
</script>

<style lang='scss'>
	.content{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.success-icon{
		font-size: 160upx;
		color: #272A30;
		margin-top: 100upx;
	}
	.tit{
		font-size: 38upx;
		color: #303133;
	}
	.btn-group{
		padding-top: 100upx;
	}
	.mix-btn {
		margin-top: 30upx;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 600upx;
		height: 80upx;
		font-size: $font-lg;
		color: #fff;
		background-color: #272A30;
		border-radius: 10upx;
		&.hollow{
			background: #fff;
			color: #272A30;
			border: 1px solid #272A30;
		}
	}
</style>
