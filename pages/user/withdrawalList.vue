<template>
	<view class="content">
		<!-- <scroll-view scroll-y="true" class="withdrawalBox" @scrolltolower="loadMore()">
			<view v-for="(item,index) in withdrawalList" :key="index"  class="withdrawal">
				<view class="top">
					<text class="bankCardNum">{{item.bankCardNum}}</text>
					<text class="value">{{item.value}}</text>
				</view>
				<view class="bottom">
					<text class="time">{{item.createTime}}</text>
					<text class="status">{{item.paymentStatusName}}</text>
				</view>
			</view>
			<uni-load-more :status="loadingType"></uni-load-more>
		</scroll-view> -->
		<view style="text-align: center;" v-if='isHave'>
			<view style="padding-top: 50%;"></view>
			<text>暂无数据</text>
		</view>
		<view class="list b-b" @click="toDetail(item)" v-for="(item, index) in withdrawalList" :key="index" v-else>
			<view class="wrapper">
				<view class="address-box">
					<text class="address" v-if="item.withdrawType == 1">{{item.wechatAccount}}</text>
					<text class="address" v-if="item.withdrawType == 2">{{item.bankCardNum}}</text>
					<text class="money">{{item.value}}</text>
				</view>
				<view class="u-box">
					<text class="name">{{item.createTime}}</text>
					<text class="mobile">{{item.paymentStatusName}}</text>
				</view>
			</view>
		</view>
		<uni-load-more :status="loadingType" v-if="isShow"></uni-load-more>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				withdrawalList:[],
				pageSize:10,
				pageNum:1,
				loadingType:"more",
				isShow:false,
				isHave:false
			}
		},
		onLoad(){
			this.getData();
		},
		onReachBottom() {
			if(this.loadingType=="nomore"|| this.loadingType=="loading")
				return;
			this.pageNum=this.pageNum+1;
			this.getData();
		},
		methods: {
			async getData() {
				let option={
					pageSize:this.pageSize,
					pageNum:this.pageNum
				};
				let result = await this.$http.getWithdrawApply(option);
				if(result.code==200){
					let data=result.data;
					if(data.length!=this.pageSize)
						this.loadingType="nomore";
					else
						this.loadingType="more";
						
					if(this.pageNum==1 && data.length==0)
						this.isHave=true;
					else{
						this.withdrawalList=this.withdrawalList.concat(result.data);
						this.isShow=true;
					}
				}else
					this.$api.msg(result.message);
					console.log(this.isShow);
			},
			//跳转到详情
			toDetail(data){
				uni.navigateTo({
					url:`/pages/user/withdrawalDetail?data=${JSON.stringify(data)}`
				})
			}
			
		}
	}
</script>

<style lang='scss'>
	page {
		padding-bottom: 120upx;
	}
	
	.content {
		position: relative;
	}
	
	.list {
		display: flex;
		align-items: center;
		padding: 20upx 30upx;
		;
		background: #fff;
		position: relative;
	}
	
	.wrapper {
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	
	.address-box {
		display: flex;
		justify-content: space-between;
		margin: 0 5upx;
	
		.tag {
			font-size: 24upx;
			color: $base-color;
			margin-right: 10upx;
			background: #fffafb;
			border: 1px solid #ffb4c7;
			border-radius: 4upx;
			padding: 4upx 10upx;
			line-height: 1;
		}
	
		.address {
			font-size: 30upx;
			color: $font-color-dark;
	
		}
	
		.money {
			font-size: 40upx;
			font-weight: 700
		}
	}
	
	.u-box {
		margin: 0 5upx;
		display: flex;
		justify-content: space-between;
		font-size: 28upx;
		color: $font-color-light;
		margin-top: 16upx;
	
		.name {
			margin-right: 30upx;
		}
	}
	
	.icon-bianji {
		display: flex;
		align-items: center;
		height: 80upx;
		font-size: 40upx;
		color: $font-color-light;
		padding-left: 30upx;
	}
	
	.add-btn {
		position: fixed;
		left: 30upx;
		right: 30upx;
		bottom: 16upx;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 100upx;
		font-size: 32upx;
		color: #fff;
		background-color: $base-color2;
		border-radius: 100upx;
		/* box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4); */
	}
</style>
