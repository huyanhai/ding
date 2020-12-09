<template>
	<scroll-view scroll-y="true" class="my_fens">
		<view class="item" v-if="fansData.length > 0" v-for="(item,index) in fansData" :key="index">
			<image class="img" :src="item.icon"></image>
			<view class="col">
				<text class="name">{{item.nickname}}</text>
				<text class="time">{{item.createTime}}</text>
			</view>
		</view>
		<view class="null" v-else>
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
			utc2beijing(parme) {
				if(!parme) return;
				var date = new Date(parme)
				  var y = date.getFullYear()
				  var m = date.getMonth() + 1
				  m = m < 10 ? ('0' + m) : m
				  var d = date.getDate()
				  d = d < 10 ? ('0' + d) : d
				  const time = y + '-' + m + '-' + d
				  return time
			},
			async getFans(){
				let {data} = await this.$http.getMyGroup({
					pageNum: this.pageNum,
					pageSize:this.pageSize
				});
				let _this = this;
				if(data){
					this.fansData = data;
					for(let item of this.fansData){
						console.log(item)
						item.createTime = _this.utc2beijing(item.createTime)
					}
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
		height: 135rpx;
		border-radius: 20rpx;
		box-sizing: border-box;
		padding: 0 23rpx;
		margin-top: 30rpx;
		image{
			width: 106rpx;
			height: 106rpx;
			border-radius: 106rpx;
			background: #dedede;
		}
		.col{
			font-size: 20rpx;
			color: #000000;
			display: flex;
			flex-direction: column;
			margin-left: 36rpx;
			.name{
				font-size: 30rpx;
				color: #000000;
			}
			.time{
				color: #464646;
				font-size: 24rpx;
			}
		}
	}
}
</style>
