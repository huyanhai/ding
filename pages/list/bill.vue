<template>
	<view class="content">
		<view style="text-align: center;" v-if=isHave>
			<view style="padding-top: 35%;"></view>
			<image src="../../static/emptyCart.png" style="width:200px;height: 200px;margin: auto;"></image>
		</view>
		<view class="list b-b" v-for="(item, index) in billList" :key="index" v-else>
			<view class="wrapper">
				<view class="address-box">
					<text class="address">{{item.title}}</text>
					<text class="money">{{item.type==0?'+':'-'}}{{item.value}}</text>
				</view>
				<view class="u-box">
					<text class="name">{{item.createTime}}</text>
					<!-- <text class="mobile">备注:{{item.note}}</text> -->
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
				billList: [],
				pageNum: 1, //页数
				loadingType: 'loading', //加载更多状态
				isHave: false,
				isShow: false,
			}
		},
		onLoad() {
			this.loadData();
		},
		methods: {
			async loadData() {
				//获取用户信息
				this.loadingType = 'loading';
				let bill = await this.$http.getIncome({
					page: this.pageNum
				});
				if (bill.code == 200) {
					if (bill.data.length != 0) {
						this.billList = this.billList.concat(bill.data)
						if (this.billList.length >= 10) {
							this.isShow = true
						}
						this.loadingType = 'more'
						this.pageNum += 1;
					} else {
						if (this.pageNum == 1) {
							this.isHave = true;
						} else {
							this.isShow = true;
							this.loadingType = 'nomore';
						}
					}
				} else {
					this.$api.msg(bill.mssage)
				}
			},
		},
		onReachBottom() {
			this.loadData();
		},
		onPullDownRefresh() {
			this.isHave=false,
			this.isShow=false,
			this.pageNum=1, //页数
			this.billList=[],
			this.loadData();
			uni.stopPullDownRefresh();
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
			color: $base-color2;
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
