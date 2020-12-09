<template>
	<view class="product_item">
		<image class="ui-img" :src="item.pic" mode="" @click="goPage(item)" mode="widthFix"></image>
		<view class="info">
			<view class="name">{{item.name}}</view>
			<view class="hyj_item">
				¥{{item.vipPrice}}元
				<view class="hyj">会员价</view>
			</view>
			<view class="zongjia"> ¥{{item.price}}元</view>
			<view class="more" v-if="more === 'more'">爽辣食界  欢辣新品</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			item:{
				type:Object
			},
			more:{
				type:String
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
	.ui-img{
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
			font-size: 18rpx;
			color: #000000;
			margin: 5rpx 0;
			.hyj{
				width: 75rpx;
				height: 23rpx;
				border-radius: 23rpx;
				background: #292929;
				color: #FFFFFF;
				font-size: 14rpx;
				text-align: center;
				margin-left: 10rpx;
				line-height: 23rpx;
			}
		}
		.zongjia{
			font-size: 24rpx;
			color: #C60000;
		}
		.more{
			height: 42rpx;
			border-radius: 10rpx;
			background: #292929;
			color: #FFFFFF;
			font-size: 30rpx;
			text-align: center;
			line-height: 42rpx;
			margin-top: 20rpx;
			margin-bottom: 10rpx;
		}
	}
}
</style>
