<template>
	<view class="content">
		<text class="success-icon yticon icon-xuanzhong2"></text>
		<text class="tit mt10">礼物领取成功</text>
		
		<view class="btn-group">
			<!-- <navigator :url="'/pages/order/orderInfo?orderId='+orderId" open-type="redirect" class="mix-btn">查看订单</navigator> -->
			<navigator url="/pages/index/index" open-type="reLaunch" class="mix-btn hollow">返回首页</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderId:''
			}
		},
		onLoad(option) {
			this.orderId=option.orderId
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
			background: #272A30;
			color: white;
			/* border: 1px solid #272A30; */
		}
	}
</style>
