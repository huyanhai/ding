<template>
	<scroll-view scroll-y="true" class="my_fens">
		<view class="item">
			<image class="img"></image>
			<view class="col">
				<text class="name">易冷松</text>
				<text class="time">2020-11-30 12:34:21</text>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
.my_fens{
	height: 100vh;
	background: #EBEBEB;
	box-sizing: border-box;
	padding: 0 28rpx;
	.item{
		background: #FFFFFF;
		display: flex;
		align-items: center;
		height: 80rpx;
		border-radius: 20rpx;
		box-sizing: border-box;
		padding: 0 23rpx;
		margin-top: 15rpx;
		image{
			width: 61rpx;
			height: 61rpx;
			border-radius: 61rpx;
			background: red;
		}
		.col{
			font-size: 20rpx;
			color: #000000;
			display: flex;
			flex-direction: column;
			margin-left: 16rpx;
			.time{
				color: #464646;
			}
		}
	}
}
</style>
