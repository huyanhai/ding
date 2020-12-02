<template>
	<view>
		<view class="detail-section" v-for="item in content">
			<view class="detail-change">
				{{item.value}}
			</view>
			<view class="detail-right">
				<view class="detail-remark">{{item.title}}</view>
				<view class="change-date">{{item.createTime}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				content:null,
				type:0
			};
		},
		onLoad(option) {
			this.type = option.type
			this.loadDetail()
		},
		methods:{
			async loadDetail(){
				let res;
				if(this.type==0){
					res = await this.$http.getTradeList({pageNum:1,pageSize:90})
				}else{
					res = await this.$http.getFreezeTradeList({pageNum:1,pageSize:90})
				}
				if(res.code==200){
					this.content = res.data
				}else{
					this.$api.msg(res.message)
				}
				
			}
		}
	}
</script>

<style lang="scss">
	page{
		background: #f5f5f5;
	}
	.detail-section{
		display: flex;
		justify-content: space-around;
		height: 120upx;
		background-color: #fff;
		margin: 20upx 20upx 10upx;
		border-radius: 20upx;
		font-size: 35upx;
		.detail-change {
			width: 30%;
			line-height: 120upx;
			text-align: center;
			font-weight: 600;
			border-right: 3upx dashed #A7D159;
		}
		.detail-right{
			width: 70%;
			text-align: center;
			line-height: 60upx;
			.change-date{
				font-size: 25upx;
				color: #a5a5a5;
			}
		}
	}
</style>
