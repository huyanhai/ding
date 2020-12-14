<template>
	<view class="index_follow">
		<view class="follow_bg"></view>
		<view class="ui-btn">
			关注丁老表官方公众号
		</view>
	</view>
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
.index_follow{
	box-sizing: border-box;
	padding: 30rpx 30rpx 60rpx 30rpx;
	background: #EBEBEB;
	height: 100vh;
	.follow_bg{
		height: 961rpx;
		background: url("http://qn.dinglaobiao.com/1607433841430.jpg") no-repeat;
		background-size: cover;
		border-radius: 20rpx;
		overflow: hidden;
		margin-bottom: 37rpx;
	}
	.ui-btn{
		position: absolute;
		bottom: 60rpx;
		left: 30rpx;
		right: 30rpx;
		height: 68rpx;
		background: #CD0000;
		border-radius: 68rpx;
		line-height: 68rpx;
		text-align: center;
		font-size: 30rpx;
		color: #FFFFFF;
	}
}
</style>
