<template>
	<view class="index_vip">
		<view class="follow_bg"></view>
		<view class="ui-btn" @click="goPage">加入丁老表爽辣食界会员</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		methods:{
			goPage(){
				uni.reLaunch({
					url:"/pages/index/index"
				})
			}
		}
	}
</script>

<style lang="scss">
.index_vip{
	box-sizing: border-box;
	padding: 30rpx 30rpx 60rpx 30rpx;
	background: #EBEBEB;
	height: 100vh;
	.follow_bg{
		height: 961rpx;
		background: red;
		border-radius: 20rpx;
		overflow: hidden;
		margin-bottom: 37rpx;
	}
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
