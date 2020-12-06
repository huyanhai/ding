<template>
	<scroll-view scroll-y="true" class="my_fens">
		<view class="item" v-if="fansData.length > 0" v-for="(item,index) in fansData" :key="index">
			<image class="img" :src="item.icon"></image>
			<view class="col">
				<text class="name">{{item.nickname}}</text>
				<text class="time">{{item.createTime}}</text>
			</view>
		</view>
		<view class="null">
			暂无粉丝
		</view>
	</scroll-view>
</template>

<script>
	export default {
		data() {
			return {
				pageNum:1,
				pageSize:10,
				fansData:[]
			};
		},
		onShow(){
			this.getFans();
		},
		methods:{
			async getFans(){
				let {data} = await this.$http.getMyGroup({
					pageNum: this.pageNum,
					pageSize:this.pageSize
				});
				if(data){
					this.fansData = data;
				}
			}
		}
	}
</script>

<style lang="scss">
.my_fens{
	height: 100vh;
	background: #EBEBEB;
	box-sizing: border-box;
	padding: 0 28rpx;
	.null{
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 30rpx;
		color: #000000;
	}
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
