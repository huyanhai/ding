<template>
	<view class="product_item">
		<image class="ui-img" :src="item.pic" mode="widthFix" @click="goPage(item)"></image>
		<view class="info">
			<view class="name">{{item.name}}</view>
			<view class="hyj_item">
				¥{{item.vipPrice}}元
				<view class="hyj">会员价</view>
			</view>
			<view class="zongjia"> ¥{{item.price}}元</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			item:{
				type:Object
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			goPage(item){
				uni.navigateTo({
					url: `/pages/product/product?id=${item.id}&attr=${item.attr}`
				});
			}
		}
	}
</script>

<style lang="scss">
.product_item{
	border-radius: 20rpx;
	background: #FFFFFF;
	overflow: hidden;
	min-height: 370rpx;
	.ui-img{
		height: 300rpx;
		width: 100%;
		border-radius: 20rpx;
	}
	.info{
		padding: 11rpx;
		.name{
			color: #000000;
			font-size: 24rpx;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.hyj_item{
			display: flex;
			align-items: center;
			font-size: 24rpx;
			color: #000000;
			margin: 5rpx 0;
			.hyj{
				width: 75rpx;
				height: 23rpx;
				border-radius: 23rpx;
				background: #292929;
				color: #FFFFFF;
				font-size: 20rpx;
				text-align: center;
				margin-left: 10rpx;
				line-height: 23rpx;
			}
		}
		.zongjia{
			font-size: 30rpx;
			color: #C60000;
		}
	}
}
</style>
