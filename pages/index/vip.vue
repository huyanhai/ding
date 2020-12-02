<template>
	<view class="index_vip">
		<view class="quanyi_shuoming"></view>
		<view class="quanyi_card"></view>
		<view class="ui-btn">加入丁老表爽辣食界会员</view>
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
.index_vip{
	box-sizing: border-box;
	padding: 30rpx;
	background: #EBEBEB;
	height: 100vh;
	.quanyi_shuoming{
		height: 327rpx;
		background: red;
		border-radius: 20rpx;
		overflow: hidden;
		margin-bottom: 37rpx;
	}
	.quanyi_card{
		height: 446rpx;
		background: red;
		border-radius: 20rpx;
		overflow: hidden;
	}
	.ui-btn{
		position: absolute;
		bottom: 30rpx;
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
